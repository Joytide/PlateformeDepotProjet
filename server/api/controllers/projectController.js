'use strict';

var app = require('express')();
const multer = require('multer');
var path = require('path');
var mongoose = require('mongoose');
const { emitter } = require('../../eventsCommon');

const Project = mongoose.model('Project');
const Partner = mongoose.model('Partner');
const User = mongoose.model('Person');
const File = mongoose.model('File');
const Specialization = mongoose.model('Specialization');

const mailer = require('nodemailer');
const config = require('../../config');

const partnerController = require('./partnerController');

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
						Project.updateOne({ _id: projectID }, { $push: { files: fileSaved._id } }, err => {

						});
					}
					req.fileDocument = fileSaved;
					cb(null, req.user._id + '_' + fileSaved._id + path.extname(file.originalname))
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
	req.fileDocument.path = req.file.path;
	req.fileDocument.save(err => {
		res.send({ _id: req.fileDocument._id, originalName: req.fileDocument.originalName });
	});
}

exports.deleteFile = (req, res, next) => {
	const data = req.body;
	if (data.fileID) {
		File.deleteOne({ _id: data.fileID }, (err, raw) => {
			if (err) next(err)
			else {
				Project.updateOne({ files: data.fileID }, { $pull: { files: data.fileID } }, err => {
					if (err) next(err);
					else
						res.json(raw);
				});
			}
		});
	} else {
		next(new Error('MissingParameter'));
	}
}

exports.listProjects = function (req, res, next) {
	let findProject = (status, specializations) => {
		let query = {};
		query.status = status;
		if (specializations)
			query["specializations.specialization"] = { "$in": specializations };

		Project
			.find(query)
			.populate('partner')
			.populate('specializations.specialization')
			.populate('study_year')
			.exec(function (err, projects) {
				if (err)
					next(err);
				else
					res.json(projects);
			});
	};

	let data = req.query;

	let status = [];

	if (data.pending === "true") status.push("pending");
	if (data.rejected === "true") status.push("rejected");
	if (data.validated === "true") status.push("validated");
	if (data.mine === "true") {
		Specialization.find({ referent: req.user._id }, (err, specializations) => {
			if (err) next(err);
			else
				findProject(status, specializations.map(spe => spe._id));
		});
	}
	else
		findProject(status);
};

exports.createProject = (req, res, next) => {
	const data = req.body;

	if (data.title && data.description
		&& data.majors_concerned && data.majors_concerned.length > 0
		&& data.study_year && data.study_year.length > 0) {

		let newProject = new Project({
			title: data.title,
			specializations: data.majors_concerned.map(spe => ({ specialization: spe })),
			study_year: data.study_year,
			description: data.description,
			partner: req.user._id
		});

		if (data.keywords) newProject.keywords = data.keywords;
		if (data.files) newProject.files = data.files;
		if (data.skills) newProject.skills = data.skills;
		if (data.infos) newProject.infos = data.infos;

		Project.estimatedDocumentCount({}, (err, count) => {
			if (err) next(err);
			else {
				newProject.number = (count + 1).toString().padStart(3, '0');
				newProject.save(function (err, project) {
					if (err) next(err);
					else {
						if (project.files)
							File.updateMany({ _id: project.files }, { projectID: project._id }, (err, raw) => {
								if (err) next(err);
								if (raw.ok) res.json(project);
								else next(raw);
							});
						else
							res.json(project);

						partnerController.addProject(req.user._id, project._id);
					}
				});
			}
		});
	} else {
		next(new Error("MissingParameters"));
	}
};

exports.findById = (req, res) => {
	Project.findById(req.params.projectId)
		.populate('partner')
		.populate('specializations.specialization')
		.populate('study_year')
		.populate({
			path: 'files',
			select: 'originalName'
		})
		.exec((err, project) => {
			if (err) {
				res.send(err);
			}
			res.json(project);
		});
}

exports.find_by_edit_key = (req, res) => {
	Project.findOne({ edit_key: req.params.editKey }, (err, project) => {
		if (err) {
			res.send(err);
		}
		res.json(project);
	});
}

exports.filter_by_name = (req, res) => {
	Project.find({ title: { '$regex': '.*' + req.params.name + '.*' } }, (err, projects) => {
		// Search all the projects which have the substring "req.params.name" in their titles
		if (err) {
			res.send(err);
		}
		res.json(projects);
	});
}


exports.update_a_project = (req, res) => {
	const id = req.params.projectId || req.body._id;
	const data = req.body;

	if (id) {
		Project.findById(id)
			.exec((err, project) => {
				if (err) res.send(err);
				else {
					let update = {};
					if (data.title) update.title = data.title;
					if (data.description) update.description = data.description;
					if (data.majors_concerned) update.specializations = data.majors_concerned.map(spe => ({ specialization: spe }));
					if (data.study_year) update.study_year = data.study_year;
					if (data.keywords) update.keywords = data.keywords;
					if (data.status) update.status = data.status;
					update.edit_date = Date.now();

					project.set(update);
					project.save((err, updated_project) => {
						if (err) res.send(err);
						else {
							updated_project
								.populate('partner specializations.specialization study_year', (err, populated) => {
									if (err) res.send(err);
									else res.json(populated);
								})
						}
					});
				}
			});
	} else {
		res.status(400).send(new Error("Missing a parameter. Expected parameters : (ObjectID) _id"));
	}
}

exports.delete_a_project = (req, res) => {
	Project.findByIdAndRemove(req.params.projectId, function (err, note) {
		if (err) {
			if (err.kind === 'ObjectId') {
				return res.status(404).send({ message: "Project not found with id " + req.params.noteId });
			}
			return res.status(500).send({ message: "Could not delete project with id " + req.params.noteId });
		}

		if (!note) {
			return res.status(404).send({ message: "Project not found with id " + req.params.noteId });
		}

		res.send({ message: "Project deleted successfully!" });
	});
}

exports.like = (req, res) => {
	let data = req.body;

	if (data.user && data.project) {
		User.findById(data.user, (err, user) => {
			if (err) res.send(err);
			else {
				if (user.__t === "Student") {
					Project.findOneAndUpdate(
						{ _id: data.project, likes: { $ne: data.user } },
						{ $push: { likes: data.user } },
						{ new: true },
						(err, updated) => {
							if (err) res.send(err);
							else res.json(updated);
						});
				} else {
					res.status(400).send(new Error("ObjectID) user must refer to a student"));
				}
			}
		});
	} else {
		res.status(400).send(new Error("Missing a parameter. Expected parameters : (ObjectID) user, (ObjectID) project"));
	}
}

exports.unlike = (req, res) => {
	let data = req.body;

	if (data.user && data.project) {
		Project.findOneAndUpdate(
			{ _id: data.project, likes: data.user },
			{ $pull: { likes: data.user } },
			{ new: true },
			(err, updated) => {
				if (err) res.send(err);
				else res.json(updated);
			});
	} else {
		res.status(400).send(new Error("Missing a parameter. Expected parameters : (ObjectID) user, (ObjectID) project"));
	}
}

exports.download_file = (req, res, next) => {
	const fileID = req.params.id;

	File.findById(fileID, (err, file) => {
		if (err)
			next(err);
		if (file)
			res.download(file.path, file.originalName)
		else
			next(new Error('FileNotFound'));
	});
}

exports.projectValidation = (req, res, next) => {
	const data = req.body;

	if (data.projectId && data.speId && ["validated", "pending", "rejected"].indexOf(data.status) != -1) {
		Project.findOne(
			{ _id: data.projectId, "specializations.specialization": data.speId, status: "pending" },
			(err, project) => {
				if (err)
					next(err);
				else if (project) {
					let rejected = true;
					let count = 0;
					for (let i = 0; i < project.specializations.length; i++) {
						if (project.specializations[i].specialization == data.speId)
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
							project.status = "validated";
					}

					project.save((err, savedProject) => {
						if (err)
							next(err)
						else {
							if (project.status === "validated")
								emitter.emit("projectValidated", project.partner);
							else if (project.status === "rejected")
								emitter.emit("projectRejeted", project.parnter);
							res.json(savedProject)
						}
					});
				} else {
					res.json();
				}
			})
	} else {
		next(new Error("MissingParameter"));
	}
}

exports.addSpecialization = (req, res, next) => {
	const data = req.body;

	if (data.projectId && data.speId) {
		Project.findOne({ _id: data.projectId, "specializations.specialization": { "$ne": data.speId }, status: "pending" }, (err, project) => {
			if (err)
				next(err);
			else if (project) {
				project.specializations.push({ specialization: data.speId });
				project.save((err, savedDocument) => {
					if (err) next(err);
					else res.json(savedDocument);
				})
			} else {
				res.json();
			}
		})
	} else {
		next(new Error("MissingParameter"));
	}
}