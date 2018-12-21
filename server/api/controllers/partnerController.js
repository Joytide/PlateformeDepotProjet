'use strict';

const mongoose = require('mongoose');
const Partner = mongoose.model('Partner');
const Project = mongoose.model('Project');

exports.listAllPartners = function (req, res) {
	console.log(req.user);
	if (req.user.__t == "EPGE") {
		Partner.find()
			.populate('projects')
			.exec((err, partner) => {
				if (err)
					res.send(err);
				res.json(partner);
			});
	} else if (req.user.__t == "Partner") {
		Partner.findById(req.user._id).populate('projects').exec((err,partner) => {
			if(err) res.send(err);
			else res.json(partner);
		})
	}
};

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
	return new Promise(async (resolve, reject) => {
		let newPartner = new Partner({
			"first_name": data.first_name,
			"last_name": data.last_name,
			"email": data.email,
			"company": data.company
		});

		newPartner.key = await generatePassword(16);
		console.log(newPartner.key);

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

function generatePassword(size) {
	return new Promise((resolve, reject) => {
		let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
		let key = "";
		for (let i = 0; i < size; i++) {
			let rnd = randomInt(characters.length);
			if (characters[rnd] != undefined)
				key += characters[randomInt(characters.length)];
			else
				i--;
		}
	
		// Prevent key collision
		Partner.count({key:key}, (err, count) => {
			if(err) reject(err);
			if(count == 0) resolve(key);
			else resolve(generatePassword(size));
		});
	});	
}

function randomInt(max) {
	return Math.floor(Math.random() * max - 1);
}