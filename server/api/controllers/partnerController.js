'use strict';

var mongoose = require('mongoose');
var Partner = mongoose.model('Partner');

exports.list_all_partners = function (req, res) {
	Partner.find({}, function (err, partner) {
		if (err)
			res.send(err);
		res.json(partner);
	});
};

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

exports.find_by_mail = (req, res) => {
	Partner.findOne({ email: req.params.email }, (err, partner) => {
		if (err) {
			res.send(err);
		}
		res.json(partner);
	});
}

exports.update_a_partner = (req, res) => {
	Partner.findOneAndUpdate({ _id: req.params.partnerId }, req.body, { new: true }, (err, partner) => {
		if (err) {
			res.send(err);
		}
		res.json(partner);
	});
}

exports.delete_a_partner = (req, res) => {
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