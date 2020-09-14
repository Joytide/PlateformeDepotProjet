'use strict';

const multer = require('multer');
var path = require('path');
var mongoose = require('mongoose');
const { Parser } = require('json2csv');
const fs = require('fs');
const { exec } = require('child_process');
const mailController = require('./mailController');

const Project = mongoose.model('Project');
const Partner = mongoose.model('Partner');
const User = mongoose.model('Person');
const File = mongoose.model('File');
const Specialization = mongoose.model('Specialization');
const Year = mongoose.model('Year');

const { isValidType, areValidTypes, ProjectNotFoundError, FileNotFoundError, ForbiddenError, InvalidParameterError, MissingKeywordsError } = require('../../helpers/Errors');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './.uploads')
	},
	filename: function (req, file, cb) {
		let owner = "";
		let projectID = "";

		if (req.user.__t === "Partner")
			owner = req.user._id
		else if (!req.body.partnerID && !req.body.projectID)
			cb(new Error("MissingParameter"));
		else {
			owner = req.body.partnerID;
			projectID = req.body.projectID;
		}

		if (owner !== "") {
			File.create({
				owner: owner,
				originalName: file.originalname
			},
				(err, fileSaved) => {
					if (err) cb(err);
					if (projectID) {
						Project
							.updateOne(
								{ _id: projectID },
								{
									$push: { files: fileSaved._id }
								})
							.exec();
					}
					File.updateOne({ _id: fileSaved._id }, { path: path.join(process.cwd(), ".uploads", fileSaved._id + path.extname(file.originalname)) }).exec();
					req.fileDocument = fileSaved;
					cb(null, fileSaved._id + path.extname(file.originalname))
				});
		}
	}
});

exports.upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" && file.mimetype !== "application/pdf")
			cb(null, false);
		else
			cb(null, true);
	}
});

exports.uploadDone = (req, res, next) => {
	res.send({ _id: req.fileDocument._id, originalName: req.fileDocument.originalName });
}

/**
 * Delete a file. A partner can delete a file only if it has not been associated to a project
 * @param {ObjectId} id Id of the file to delete
 */
exports.deleteFile = ({ id, user }) =>
	new Promise((resolve, reject) => {
		isValidType(id, "id", "ObjectId")
			.then(() => {
				if (user.__t === "Partner")
					return File
						.aggregate([
							{
								"$match": {
									"_id": mongoose.Types.ObjectId(id)
								}
							},
							{
								"$lookup": {
									"localField": "_id",
									"foreignField": "files",
									"as": "project",
									"from": "projects"
								}
							}
						])
						.exec()
				else
					return File
						.findOne({ _id: id })
						.lean()
						.exec()
			}
			)
			.then(file => {
				if (file instanceof Array)
					file = file[0]
				if (file) {
					if (user.__t === "Partner" && file.project.length > 0)
						throw new ForbiddenError();
					else {
						let filePath = path.join(process.cwd(), ".uploads", file._id + path.extname(file.originalName));

						let deleteFileDb = File
							.deleteOne({ _id: id })
							.exec();
						let updateProject = Project
							.updateOne({ files: id }, { $pull: { files: id } })
							.exec();
						let deleteFile = fs.promises
							.unlink(filePath);

						return Promise.all([deleteFileDb, updateProject, deleteFile])
					}
				}
				else
					throw new FileNotFoundError();
			})
			.then(() => resolve({ ok: 1 }))
			.catch(reject);
	});


/**
 * List all existing projects
 * Params avaibles on get route : pending, rejected, validated, mine
 */
exports.listProjects = ({ user, ...data }) =>
	new Promise((resolve, reject) => {
		let findProject = (status, specializations) => {
			let query = {};
			query.status = status;
			if (specializations)
				query["specializations.specialization"] = { "$in": specializations };

			return Project
				.find(query)
				.populate('partner')
				.populate('specializations.specialization')
				.populate('study_year')
				.lean()
				.exec();
		};
		let status = [];

		if (data.pending === "true") status.push("pending");
		if (data.rejected === "true") status.push("rejected");
		if (data.validated === "true") status.push("validated");
		if (data.mine === "true") {
			Specialization
				.find({ referent: user._id })
				.lean()
				.then(specializations => findProject(status, specializations.map(spe => spe._id)))
				.then(projects => resolve(projects))
				.catch(reject);

		}
		else
			findProject(status)
				.then(projects => resolve(projects))
				.catch(reject);
	});

/**
 * List all existing projects
 */
exports.listAllProjects = () =>
	new Promise((resolve, reject) => {
		Project
			.find()
			.populate({
				path: 'partner',
				select: "company"
			})
			.populate({
				path: 'specializations.specialization',
				select: "abbreviation referent"
			})
			.populate({
				path: 'study_year',
				select: "abbreviation"
			})
			.select('title number status confidential submissionDate specializations.status')
			.lean()
			.exec()
			.then(resolve)
			.catch(reject);
	});

/**
 * Create a new project
 * @param {string} title Title of the new project
 * @param {string} description Description of the new project
 * @param {Array} majors_concerned Array containing list of specializations' objectid
 * @param {Array} study_year Array containing list of years' objectid
 * @param {number} maxNumber Max number of teams allowed to work on the project
 * @param {Array} [files] Optional - Array of files' id attached to project
 * @param {string} [skills] Optional - Skills requiered for the project
 * @param {string} [infos] Optional - Complementary informations on the project 
 */
exports.createProject = ({ user, ...data }) =>
	new Promise((resolve, reject) => {
		areValidTypes(
			[data.title, data.description, data.majors_concerned, data.study_year, data.maxNumber, data.confidential],
			["title", "description", "majors_concerned", "study_year", "maxNumber", "confidential"],
			["string", "string", "Array", "Array", "number", "boolean"]
		)
			.then(() =>
				Project
					.estimatedDocumentCount({})
					.exec()
			)
			.then(count => {
				let newProject = new Project({
					title: data.title,
					specializations: data.majors_concerned.map(spe => ({ specialization: spe })),
					study_year: data.study_year,
					description: data.description,
					partner: user._id,
					confidential: data.confidential,
					maxTeams: parseInt(data.maxNumber, 10),
					suggestedKeywords: data.keywords,
					submissionDate: Date.now()
				});

				if (data.files) newProject.files = data.files;
				if (data.skills) newProject.skills = data.skills;
				if (data.infos) newProject.infos = data.infos;

				newProject.number = (count + 1).toString().padStart(3, '0');
				return newProject.save();
			})
			.then(project => {
				let promises = [];
				if (project.files)
					promises.push(
						File
							.updateMany(
								{ _id: project.files },
								{ projectID: project._id }
							)
							.exec())
				promises.push(
					Partner
						.updateOne({ _id: user._id }, { $push: { projects: project._id } })
						.exec()
				);

				return Promise.all(promises)
					.then(() => {
						mailController.projectSubmitted(user);
						resolve();
					})
					.catch(reject);
			})
			.catch(reject);
	});

/**
 * Find a project by id. Partners can onyl retrive their own projects
 * @param {ObjectId} id Id of the project to search for
 */
exports.findById = ({ id, user }) =>
	new Promise((resolve, reject) => {
		isValidType(id, "id", "ObjectId")
			.then(() =>
				Project.findById(id)
					.populate('partner')
					.populate('specializations.specialization')
					.populate('study_year')
					.populate('lastUpdate.by')
					.populate({
						path: 'files',
						select: 'originalName'
					})
					.lean()
					.exec()
			)
			.then(project => {
				if (user.__t == "Partner" && project.partner._id.toString() != user._id.toString())
					reject(new ForbiddenError());
				else
					resolve(project)
			})
			.catch(reject);
	});

/**
 * Find a project by id and only returns files part populated
 * @param {ObjectId} id Id of the project to search for
 */
exports.findByIdSelectFiles = ({ id }) =>
	new Promise((resolve, reject) => {
		isValidType(id, "id", "ObjectId")
			.then(() => Project
				.findOne({ _id: id }, 'files')
				.populate({
					path: 'files',
					select: 'originalName'
				})
				.lean()
				.exec()
			)
			.then(project => resolve(project))
			.catch(reject);
	});

/**
 * Find a project by id and only returns specializations part populated
 * @param {ObjectId} id Id of the project to search for
 */
exports.findByIdSelectSpecializations = ({ id }) =>
	new Promise((resolve, reject) => {
		isValidType(id, "id", "ObjectId")
			.then(() =>
				Project
					.findById(id, 'specializations')
					.populate('specializations.specialization')
					.lean()
					.exec()
			)
			.then(project => resolve(project))
			.catch(reject);
	});

/**
 * Update a project
 * @param {ObjectId} id Id of the project to update
 */
exports.update = ({ user, id, ...data }) =>
	new Promise((resolve, reject) => {
		isValidType(id, "id", "ObjectId")
			.then(() =>
				Project
					.findById(id)
					.exec()
			)
			.then(project => {
				let update = {};

				if (data.title) update.title = data.title;
				if (data.infos) update.infos = data.infos;
				if (data.maxTeams) update.maxTeams = data.maxTeams;
				if (data.skills) update.skills = data.skills;
				if (data.description) update.description = data.description;
				if (data.confidential !== undefined) update.confidential = data.confidential;
				if (data.study_year) update.study_year = data.study_year;
				if (data.suggestedKeywords) update.suggestedKeywords = data.suggestedKeywords;

				update.lastUpdate = {
					at: Date.now(),
					by: user._id
				}

				project.set(update);
				return project.save();
			})
			.then(project => resolve(project))
			.catch(reject);
	});

/**
 * Get a file given his id
 * @param {ObjectId} id Id of the file to download
 */
exports.download_file = ({ id, user }) =>
	new Promise((resolve, reject) => {
		isValidType(id, "id", "ObjectId")
			.then(() =>
				File.findById(id)
					.lean()
					.exec()
			)
			.then(file => {
				if (file) {
					if (user.__t === "Partner" && file.owner.toString() != user._id)
						throw new ForbiddenError();

					let data = {
						path: file.path,
						filename: file.originalName.replace('/', ' ')
					}
					console.log(data);
					resolve(data)
				}
				else
					throw new FileNotFoundError();
			})
			.catch(reject);
	});

/**
 * Validate/reject a specilization for a project. If all specializations concerned by the project are validated/rejected then the project gets validated/rejected
 * @param {ObjectId} projectId Id of the project
 * @param {ObjectId} specializationId Id of the specialization to set to validated/pending/rejected
 * @param {string} status The new status of the specialization in the project. Accepted values : accepted, pending, rejected
 */
exports.projectValidation = ({ ...data }) =>
	new Promise((resolve, reject) => {
		areValidTypes(
			[data.projectId, data.specializationId, data.status],
			["projectId", "specializationId", "status"],
			["ObjectId", "ObjectId", "string"]
		)
			.then(() => {
				if (["validated", "pending", "rejected"].indexOf(data.status) != -1) {
					return Project.findOne(
						{
							_id: data.projectId,
							"specializations.specialization": data.specializationId,
							status: "pending"
						})
						.exec();
				} else
					throw new InvalidParameterError("status", "string (values accepted : validated, pending, rejected)");
			})
			.then(project => {
				if (project) {
					let rejected = true;
					let count = 0;
					for (let i = 0; i < project.specializations.length; i++) {
						if (project.specializations[i].specialization == data.specializationId)
							project.specializations[i].status = data.status;

						if (project.specializations[i].status != "pending") {
							count++;
							if (project.specializations[i].status == "validated")
								rejected = false;
						}
					}

					if (count == project.specializations.length) {
						if (rejected)
							project.status = "rejected";
						else
							if (project.keywords.length < 2)
								throw new MissingKeywordsError();
							else
								project.status = "validated";
					}

					return project.save();
				}
				else
					throw new ProjectNotFoundError();
			})
			.then(project => {
				if (project.status === "validated")
					mailController.projectValidated(project.partner);
				else if (project.status === "rejected")
					mailController.projectRefused(project.partner);
				resolve(project)
			})
			.catch(reject);
	});

/**
 * Associate a specialization to a project
 * @param {ObjectId} projectId Id of the project where the specialization must be added
 * @param {ObjectId} specializationId Id of the specialization to add to the project 
 */
exports.addSpecialization = ({ projectId, specializationId }) =>
	new Promise((resolve, reject) => {
		areValidTypes(
			[projectId, specializationId],
			["projectId", "specializationId"],
			["ObjectId", "ObjectId"]
		)
			.then(() =>
				Project
					.updateOne(
						{ _id: projectId, "specializations.specialization": { "$ne": specializationId }, status: "pending" },
						{ $push: { specializations: { specialization: specializationId } } }
					)
					.exec()
			)
			.then(writeOps => resolve(writeOps))
			.catch(reject);
	});

/**
 * Add a keyword associated to a project
 * @param {ObjectId} keywordId Id of the keyword to add to the project
 * @param {ObjectId} projectId Id of the project from which the keyword should be added
 */
exports.addKeyword = ({ keywordId, projectId }) =>
	new Promise((resolve, reject) => {
		areValidTypes(
			[projectId, keywordId],
			["projectId", "keywordId"],
			["ObjectId", "ObjectId"]
		)
			.then(() =>
				Project
					.updateOne({ _id: projectId }, { $addToSet: { keywords: keywordId } })
					.exec()
			)
			.then(writeOps => resolve(writeOps))
			.catch(reject);
	});

/**
 * Remove a keyword associated to a project
 * @param {ObjectId} keywordId Id of the keyword to remove from the project
 * @param {ObjectId} projectId Id of the project from which the keyword should be removed
 */
exports.removeKeyword = ({ keywordId, projectId }) =>
	new Promise((resolve, reject) => {
		areValidTypes(
			[projectId, keywordId],
			["projectId", "keywordId"],
			["ObjectId", "ObjectId"]
		)
			.then(() =>
				Project
					.updateOne(
						{ _id: projectId, keywords: keywordId },
						{ $pull: { keywords: keywordId } }
					)
					.exec()

			)
			.then(writeOps => resolve(writeOps))
			.catch(reject);
	});

/**
 * Exports all projects informations into a csv
 */
exports.getCSV = (find = {}) => () =>
	new Promise((resolve, reject) => {
		let findProject = Project
			.find(find)
			.populate("partner specializations.specialization study_year keywords")
			.lean()
			.exec();
		let findYear = Year.find({}).lean().exec();
		let findSpecializations = Specialization.find({}).lean().exec();

		Promise.all([findProject, findYear, findSpecializations])
			.then(([projects, years, specializations]) => {
				let yearsFields = [], specializationsFields = [];

				for (let i = 0; i < years.length; i++) {
					yearsFields.push({
						label: years[i].abbreviation,
						value: row => row.study_year.filter(y => y.abbreviation === years[i].abbreviation).length > 0 ? "X" : ""
					});
				}

				for (let i = 0; i < specializations.length; i++) {
					specializationsFields.push({
						label: specializations[i].abbreviation,
						value: row => row.specializations.filter(s => s.status === "validated" && s.specialization.abbreviation === specializations[i].abbreviation).length > 0 ? "X" : ""
					});
				}

				const fields = [
					{
						label: "N° projet",
						value: "number"
					},
					{
						label: "Statut",
						value: "status"
					},
					{
						label: "Timestamp",
						value: "sub_date"
					},
					{
						label: "Vous êtes",
						value: "partner.kind"
					},
					{
						label: "Nom",
						value: "partner.last_name"
					},
					{
						label: "Prénom",
						value: "partner.first_name"
					},
					{
						label: "Email",
						value: "partner.email"
					},
					{
						label: "Téléphone",
						value: "partner.phone"
					},
					{
						label: "Entreprise",
						value: "partner.company"
					},
					{
						label: "Déjà partenaire",
						value: "partner.alreadyPartner"
					},
					...yearsFields,
					...specializationsFields,
					{
						label: "Titre du projet",
						value: "title"
					},
					{
						label: "Description",
						value: "description"
					},
					{
						label: "Compétences développées",
						value: "skills"
					},
					{
						label: "Mots clefs",
						value: row => row.keywords.map(k => k.displayName).join(", ")
					},
					{
						label: "Plusieurs groupes ?",
						value: row => row.maxTeams > 1 ? "Oui" : "Non"
					},
					{
						label: "Nombre de groupes",
						value: row => row.maxTeams > 1 ? row.maxTeams : ""
					},
					{
						label: "Informations supplémentaires",
						value: "infos"
					}
				];

				const json2csvParser = new Parser({ fields });
				const csv = json2csvParser.parse(projects);

				const date = Date.now();

				fs.writeFile(date + ".csv", csv, err => {
					if (err)
						throw err;
					else
						resolve({ path: process.cwd() + "/" + date + ".csv", filename: "Projets.csv" });
				})
			})
			.catch(reject);
	});

/**
 * Generates the folder which will be distributed to students
 */
exports.studentFolder = () =>
	new Promise((resolve, reject) => {
		let date = Date.now();
		let baseDirectory = process.cwd() + "/exports/" + date;

		let findYears = Year.find({}).lean().exec();
		let findSpecializations = Specialization.find({}).lean().exec();
		let findProjects = Project
			.find({ status: "validated" })
			.populate("files pdf specializations.specialization study_year")
			.lean()
			.exec();

		Promise
			.all([findYears, findSpecializations, findProjects])
			.then(([years, specializations, projects]) => {
				if (projects) {
					fs.mkdirSync(baseDirectory, { recursive: true });

					// create a new folder for the exports. Sub folders for each years and specializations are then created
					for (let i = 0; i < years.length; i++) {
						for (let j = 0; j < specializations.length; j++) {
							fs.mkdirSync(baseDirectory + "/" + years[i].abbreviation + "/" + specializations[j].abbreviation, { recursive: true });
						}
					}

					projects.forEach(project => {
						project.study_year.forEach(year => {
							project.specializations
								.filter(spe => spe.status === "validated")
								.forEach(spe => {
									let fileName = project.number + " - " + project.title.replace('/', ' ');
									if (project.files.length > 0) {
										fs.mkdirSync(baseDirectory + "/" + year.abbreviation + "/" + spe.specialization.abbreviation + "/" + fileName)
										fs.copyFileSync(
											project.pdf.path,
											baseDirectory + "/" + year.abbreviation + "/" + spe.specialization.abbreviation + "/" + fileName + "/" + fileName + ".pdf"
										);

										project.files.forEach(file => {
											fs.copyFileSync(
												file.path,
												baseDirectory + "/" + year.abbreviation + "/" + spe.specialization.abbreviation + "/" + fileName + "/" + file.originalName)
										});
									} else {
										fs.copyFileSync(
											project.pdf.path,
											baseDirectory + "/" + year.abbreviation + "/" + spe.specialization.abbreviation + "/" + fileName + ".pdf"
										);
									}
								});
						});
					});

					exec("cd exports && zip -9 -r " + date + ".zip " + date, err => {
						if (err)
							throw err;
						else {
							resolve({path: baseDirectory + ".zip", filename: "ProjectsPI2.zip"});
						}
					});
				} else
					throw new ProjectNotFoundError("No validated project found");
			})
			.catch(reject);
	});

/**
 * Get stats for all projects
 */
exports.getStats = () =>
	new Promise((resolve, reject) => {
		Promise.all([Stats.count(), Stats.general(), Stats.byYear(), Stats.bySpe(), Stats.byYearSubSpe()])
			.then(values =>
				resolve({
					count: values[0],
					general: values[1],
					byYear: values[2],
					bySpe: values[3],
					byYearSubSpe: values[4]
				})
			)
			.catch(reject);
	});

const Stats = {
	count: () => Project.countDocuments(),

	// Gets number of project validated, pending, rejected
	general: () => Project
		.aggregate([
			{
				"$group":
				{
					"_id": "$status",
					"total":
					{
						"$sum": 1
					},

				},
			},
			{
				"$addFields": {
					"status": "$_id"
				}
			}
		]),

	// Gets number of project validated, pending, rejected grouped by year
	byYear: () => Project
		.aggregate([
			{
				"$unwind": "$study_year"
			},
			{
				"$group":
				{
					"_id":
					{
						"study_year": "$study_year",
						"status": "$status"
					},
					"count":
					{
						"$sum": 1
					}
				}
			},
			{
				"$group":
				{
					"_id":
					{
						"study_year": "$_id.study_year"
					},
					"stats": {
						"$addToSet": {
							"status": "$_id.status",
							"total": {
								"$sum": "$count"
							}
						}
					}
				}
			},
			{
				"$lookup":
				{
					"from": "years",
					"localField": "_id.study_year",
					"foreignField": "_id",
					"as": "_id.study_year"
				}
			},
			{
				"$unwind": "$_id.study_year"
			}
		]),

	// Gets number of project validated, pending, rejected grouped by spe
	bySpe: () => Project.aggregate(
		[
			{
				"$unwind": "$specializations"
			},
			{
				"$group":
				{
					"_id":
					{
						"specialization": "$specializations.specialization",
						"status": "$specializations.status"
					},
					"count":
					{
						"$sum": 1
					}
				}
			},
			{
				"$group":
				{
					"_id":
					{
						"specialization": "$_id.specialization"
					},
					"stats": {
						"$addToSet": {
							"status": "$_id.status",
							"total": {
								"$sum": "$count"
							}
						}
					}
				}
			},
			{
				"$lookup":
				{
					"from": "specializations",
					"localField": "_id.specialization",
					"foreignField": "_id",
					"as": "_id.specialization"
				}
			},
			{
				"$unwind": "$_id.specialization"
			}
		]),

	// Gets number of project validated, pending, rejected grouped by years and with details by spe
	byYearSubSpe: () => Project.aggregate(
		[
			{ "$unwind": "$study_year" },
			{ "$unwind": "$specializations" },
			{
				"$group":
				{
					"_id":
					{
						"study_year": "$study_year",
						"specialization": "$specializations.specialization",
						"status": "$specializations.status"
					},
					"total":
					{
						"$sum": 1
					}
				}
			},
			{
				"$lookup":
				{
					"from": "specializations",
					"localField": "_id.specialization",
					"foreignField": "_id",
					"as": "_id.specialization"
				}
			},
			{
				"$unwind": "$_id.specialization"
			},
			{
				"$group":
				{
					"_id":
					{
						"study_year": "$_id.study_year",
						"specialization": "$_id.specialization"
					},
					"stats": {
						"$addToSet": {
							"status": "$_id.status",
							"total": "$total"
						}
					},
					"total": { "$sum": "$total" }
				}
			},
			{
				"$group":
				{
					"_id": "$_id.study_year",
					"specializations": {
						"$addToSet":
						{
							"specialization": "$_id.specialization",
							"stats": "$stats",
							"total": "$total"

						}
					}
				}
			},
			{
				"$lookup":
				{
					"from": "years",
					"localField": "_id",
					"foreignField": "_id",
					"as": "year"
				}
			},
			{
				"$unwind": "$year"
			}
		]
	)
};