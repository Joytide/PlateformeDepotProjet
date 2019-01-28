'use strict';

var mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Partner = mongoose.model('Partner');
const User = mongoose.model('User');
const PDFDocument = require('pdfkit');

const mailer = require('nodemailer');

const smtpTransporter = mailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'no.reply.projets.pulv@gmail.com',
		pass: 'vidududu'
	}
});

const partnerController = require('./partnerController');


exports.listProjects = function (req, res) {
	Project.find({})
		.populate({ path: 'comments', populate: { path: 'responses' } })
		.populate('partner')
		.populate('majors_concerned')
		.exec(function (err, projects) {
			if (err)
				res.send(err);
			res.json(projects);
		});
};

exports.createProject = (req, res) => {
	let name;

	let mail = {
		from: 'no.reply.projets.pulv@gmail.com',
		subject: 'Soumission d\'un projet',
		to: req.body.email
	};

	let json = req.body;

	Partner.findOne({ email: req.body.email }, async (err, partner) => {
		if (err)
			res.send(err);

		if (partner == null) {
			partner = await partnerController.createPartner(req.body);
		}

		json.partner = partner._id;
		json.status = 'pending';
		var new_project = new Project(json);

		Project.count({}, (err, count) => {
			if (err) res.send(err);
			new_project.number = (count + 1).toString().padStart(3, '0');

			new_project.save(function (err, project) {
				if (err)
					res.send(err);
				else {
					partnerController.addProject(partner._id, project._id)
						.then((partner) => {
							name = partner.first_name;
							mail.text = `Bonjour ${name}, \n
					  Votre demande de soumission a bien été enregistrée. \n 
					  Voici votre lien pour l'éditer. \n
					  http://localhost:3000/Edit/${editKey}`
							smtpTransporter.sendMail(mail, (err, result) => {
								if (err) {
									smtpTransporter.close();
									console.log(err);
									res.send(err);
								} else {
									res.send('Mail ok!');
									smtpTransporter.close();
								}
							});
						})
						.catch(err => {
							res.send(err);
						});
				}
			});
		});
	});
};

exports.findById = (req, res) => {
	console.log(req.params.projectId);
	Project.findById(req.params.projectId)
		.populate('comments')
		.populate('partner')
		.populate('majors_concerned')
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
	Project.update({ _id: req.params.projectId }, req.body, { new: true }, (err, project) => {
		if (err) {
			res.send(err);
		}
		res.json(project);
	});
}

exports.delete_a_project = (req, res) => {
	Project.findByIdAndRemove(req.params.projectId, function (err, note) {
		if (err) {
			console.log(err);
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

exports.export_a_project = (req, res) => {
	let doc = new PDFDocument;
	Project.findById(req.params.projectId)
		.exec((err, project) => {
			if (err) {
				res.send(err);
			}
			doc.pipe(res);
			doc.fontSize(15).text(project.title, 50, 50);
			doc.fontSize(11).text(`proposé par: ${project.partner.first_name} ${project.partner.last_name} - ${project.partner.company}`);
			doc.fontSize(11).text(`pour les étudiants: ${project.study_year.toString()}`);
			doc.fontSize(10).text(project.description, 50, 100);
			doc.end();
		});
}

exports.exports_all_projects = (req, res) => {
	let doc = new PDFDocument;
	Project.find({})
		.exec((err, projects) => {
			if (err) {
				res.send(err);
			}
			doc.pipe(res);
			projects.forEach((project, index) => {
				doc.fontSize(20).text(`Projet n°${index}`);
				doc.fontSize(15).text(project.title);
				doc.fontSize(11).text(`proposé par: ${project.partner.first_name} ${project.partner.last_name} - ${project.partner.company}`);
				doc.fontSize(11).text(`pour les étudiants: ${project.study_year.toString()}`);
				doc.fontSize(10).text(project.description);
				doc.addPage();
			});
			doc.end();
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