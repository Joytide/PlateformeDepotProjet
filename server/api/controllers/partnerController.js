'use strict';

const mongoose = require('mongoose');
const Partner = mongoose.model('Partner');
const Project = mongoose.model('Project');

exports.listPartners = function (req, res) {
	Partner.find({}, function (err, partner) {
		if (err)
			res.send(err);
		res.json(partner);
	});
};

exports.listProject = (req, res) => {
	if (req.body.id) {
		Project.find({ partner: req.body.id })
			.populate('comments')
			.exec((err, projects) => {
				if (err) res.send(err);
				else res.json(projects);
			});
	} else {
		res.send(new Error('Missing id parameter'));
	}
}

exports.addProject = (partnerId, projectId) => {
	return new Promise((resolve, reject) => {
		Partner.findByIdAndUpdate(partnerId, { $push: { projects: projectId } }, { new: true }, (err, partner) => {
			if (err) reject(err);
			else resolve(partner);
		});
	});
}

// Return a promise when creating a Partner
exports.createPartner = function (data) {
	return new Promise((resolve, reject) => {
		let newPartner = new Partner({
			"first_name": data.first_name,
			"last_name": data.last_name,
			"email": data.email,
			"company": data.company
		});

		newPartner.key = generatePassword(16);

		if (newPartner.first_name && newPartner.last_name && newPartner.email && newPartner.company) {
			newPartner.save(err => {
				if (err) reject(err);
				resolve(newPartner);
			});
		} else {
			reject(new Error("Invalid parameters : missing one of these aruguments : first name, last name, email or company"));
		}
	});
};

exports.findByMail = (req, res) => {
	if (req.params.email) {
		Partner.findOne({ email: req.params.email }, (err, partner) => {
			if (err) {
				res.send(err);
			}
			res.json(partner);
		});
	} else {
		res.send(new Error("Missing email argument"));
	}
}

exports.updatePartner = (req, res) => {
	Partner.findOneAndUpdate({ _id: req.params.partnerId }, req.body, { new: true }, (err, partner) => {
		if (err) {
			res.send(err);
		}
		res.json(partner);
	});
}

exports.deletePartner = (req, res) => {
	Partner.findByIdAndRemove(req.params.partnerId, function (err, note) {
		if (err) {
			console.log(err);
			if (err.kind === 'ObjectId') {
				return res.status(404).send({ message: "Partner not found with id " + req.params.partnerId });
			}
			return res.status(500).send({ message: "Could not delete Partner with id " + req.params.partnerId });
		}

		if (!note) {
			return res.status(404).send({ message: "Partner not found with id " + req.params.partnerId });
		}

		res.send({ message: "Partner deleted successfully!" })
	});
}

function generatePassword(size) {
	let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	let pass = "";
	for (let i = 0; i < size; i++) {
		pass += characters[randomInt(characters.length)];
	}
	return pass;
}

function randomInt(max) {
	return Math.floor(Math.random() * max - 1);
}