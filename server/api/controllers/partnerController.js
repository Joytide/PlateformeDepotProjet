'use strict';

const mongoose = require('mongoose');
const Partner = mongoose.model('Partner');
const Project = mongoose.model('Project');
const crypto = require('crypto');
const sha256 = require('js-sha256')
const jwt = require('jsonwebtoken');

const config = require('../../config');

const mailController = require('./mailController');

exports.listAllPartners = function (req, res) {
	if (req.user.__t == "EPGE") {
		Partner.find()
			.populate('projects')
			.exec((err, partner) => {
				if (err)
					res.send(err);
				res.json(partner);
			});
	} else if (req.user.__t == "Partner") {
		Partner.findById(req.user._id)
			.populate({
				path: 'projects',
				populate: {
					path: "majors_concerned study_year"
				}
			})
			.exec((err, partner) => {
				console.log(partner.projects);
				if (err) res.send(err);
				else res.json(partner);
			});
	}
};

exports.addProject = (partnerId, projectId) => {
	return new Promise((resolve, reject) => {
		Partner.findByIdAndUpdate(partnerId, { $push: { projects: projectId } }, { new: true }, (err, partner) => {
			if (err) reject(err);
			else {
				const mail = {
					recipient: partner.email,
					subject: `Soumission du projet sur la plateforme Devinci Project`,
					content: `
Bonjour ${partner.first_name} ${partner.last_name} (${partner.company}), \n
Votre demande de soumission de projet a bien été enregistrée. \n 
Cordialement,
L'équipe DVP
\n\n\n\n
Hello ${partner.first_name} ${partner.last_name} (${partner.company}), \n
Your project submission request has been registered.\n
`
				}

				mailController.sendMail(mail)
					.then(res => {
						if (res === "MailSent")
							resolve();
					})
					.catch(reject);
			}
		});
	});
}

// Return a promise when creating a Partner
exports.createPartner = (req, res, next) => {
	const data = req.body;

	if (data.first_name && data.last_name && data.email && data.company) {
		Partner.findOne({ email: data.email }, async (err, partner) => {
			if (err) next(err);
			else {
				if (partner) {
					let error = new Error("Email already used by a partner");
					error.name = "EmailUsed";
					next(error);
				} else {
					let newPartner = new Partner({
						"first_name": data.first_name,
						"last_name": data.last_name,
						"email": data.email,
						"company": data.company
					});

					generatePassword(16)
						.then(keyData => {
							newPartner.key = keyData.hash;

							newPartner.save(err => {
								if (err) next(err);
								else {
									let userToken = jwt.sign(
										{ id: newPartner._id },
										config.jwt.secret,
										{
											expiresIn: 60 * 60 * 24
										}
									);

									res.json({ partner: newPartner, token: userToken });

									mailController.sendMail({
										recipient: newPartner.email,
										subject: "Creation de votre compte sur la plateforme Devinci Project",
										content: `Bonjour,
										Nous avons le plaisir de vous annoncer que votre compte à bien été créé sur la plateforme Devinci-project.
										Vous pouvez dès à présent vous connecter en cliquant sur le lien suivant : http://localhost:3000/login/partner/${keyData.key}`
									});
								}
							});
						})
						.catch(err => {
							next(new Error("Oops ! Something went wrong while creating your account. Please retry"));
						});
				}
			}
		});
	} else {
		next(new Error("Invalid parameters. Missing one of these aruguments : first_name, last_name, email or company"));
	}
};

exports.findByMail = (req, res) => {
	if (req.params.email) {
		Partner.findOne({ email: req.params.email })
			.populate('projects')
			.exec((err, partner) => {
				if (err)
					res.send(err);
				if (!partner)
					res.json({});
				else
					res.json(partner);
			});
	} else {
		res.send(new Error("Missing email argument"));
	}
}

exports.findById = (req, res) => {
	Partner.findOne({ _id: req.params.id })
		.populate('projects')
		.exec((err, partner) => {
			if (err)
				res.send(err);
			if (!partner)
				res.json({});
			else
				res.json(partner);
		});
}

exports.findByKey = (req, res) => {
	console.log("here");
	console.log(req.params.key)
	Partner.findOne({ key: req.params.key })
		.populate('projects')
		.exec((err, partner) => {
			if (err)
				res.send(err);
			if (!partner)
				res.json({});
			else
				res.json(partner);
		})
}

exports.updatePartner = (req, res) => {
	Partner.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, partner) => {
		if (err) {
			res.send(err);
		}
		res.json(partner);
	});
}

exports.deletePartner = (req, res) => {
	Partner.findByIdAndRemove(req.params.id, function (err, note) {
		if (err) {
			console.log(err);
			if (err.kind === 'ObjectId') {
				return res.status(404).send({ message: "Partner not found with id " + req.params.id });
			}
			return res.status(500).send({ message: "Could not delete Partner with id " + req.params.id });
		}

		if (!note) {
			return res.status(404).send({ message: "Partner not found with id " + req.params.id });
		}

		res.send({ message: "Partner deleted successfully!" })
	});
}

exports.resetPassword = (req, res, next) => {
	const data = req.body;

	if (data.email) {
		Partner.findOne({ email: data.email }, (err, partner) => {
			generatePassword(16)
				.then(pass => {
					partner.key = pass.hash;

					partner.save(err => {
						if (err) next(err);
						else {
							res.json(partner);

							mailController.sendMail({
								recipient: partner.email,
								subject: "Lien de connexion sur la plateforme Devinci Project",
								content: `Bonjour,
								Voici le lien permettant de vous connecter à la plateforme Devinci Project : http://localhost:3000/login/partner/${pass.key}`
							});
						}
					});
				})
				.catch(next);
		});
	} else {
		next(new Error('MissingParameter'));
	}
}

function generatePassword(size) {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(size / 2, function (err, buffer) {
			if (err) reject(err);
			const key = buffer.toString('hex');
			const keyHash = sha256(key);

			// Prevent key collision
			Partner.count({ key: keyHash }, (err, count) => {
				if (err) reject(err);
				if (count == 0) resolve({ key: key, hash: keyHash });
				else reject(new Error("KeyCollision"));
			});
		});
	});
}