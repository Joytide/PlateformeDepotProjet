const mongoose = require('mongoose');
const crypto = require('crypto');
const sha256 = require('js-sha256')
const jwt = require('jsonwebtoken');
const { isValidType, areValidTypes, PartnerNotFoundError, ExistingEmailError } = require('../../helpers/Errors');
const mailController = require('./mailController');

const Partner = mongoose.model('Partner');
const config = require('../../config');

/**
 * List all partners
 */
exports.getAll = () =>
	Partner.find()
		.populate('projects')
		.lean()
		.exec();

exports.myself = ({ user }) =>
	Partner
		.findOne({ _id: user._id })
		.populate({
			path: "projects",
			populate: { path: "specializations.specialization study_year files" }
		})
		.lean()
		.exec();

/**
 * Create a new partner
 * @param {Object} partner Partner's informations
 * @param {string} partner.first_name Partner's first name
 * @param {string} partner.last_name Partner's last name
 * @param {string} partner.email Partner's email
 * @param {string} partner.company Partner's company name
 * @param {string} partner.kind Partner's kind (enterprise, association, school, other...)
 * @param {boolean} [partner.alreadyPartner=false] Optional - Default false If the partner has already deposited projects another year
 * @param {string} [partner.phone] Optional - Partner's phone number
 * @param {string} [partner.address] Optional - Partner's address
 */
exports.createPartner = ({ ...data }) =>
	new Promise((resolve, reject) => {
		areValidTypes(
			[data.first_name, data.last_name, data.email, data.company, data.kind],
			["first_name", "last_name", "email", "company", "kind"],
			["string", "string", "string", "string", "string"]
		)
			.then(() =>
				Partner
					.findOne({ email: data.email })
					.exec()
			)
			.then(partner => {
				if (partner) {
					throw new ExistingEmailError();
				} else {
					let newPartner = new Partner({
						first_name: data.first_name,
						last_name: data.last_name,
						email: data.email,
						alreadyPartner: data.alreadyPartner | false,
						kind: data.kind,
						company: data.company
					});

					if (data.address) newPartner.address = data.address;
					if (data.phone) newPartner.phone = data.phone;

					generatePassword(16)
						.then(keyData => {
							newPartner.key = keyData.hash;
							mailController.partnerCreated(newPartner, keyData.key);

							return newPartner.save();
						})
						.then(dataSaved => {
							let userToken = jwt.sign(
								{ id: dataSaved._id },
								config.jwt.secret,
								{
									expiresIn: 60 * 60 * 24
								}
							);


							resolve({ partner: dataSaved, token: userToken });
						})
						.catch(reject);
				}
			})
			.catch(reject);
	});

/**
 * Find a partner from email
 * @param {Object} partner
 * @param {string} partner.email Partner's email
 */
exports.findByMail = ({ email }) =>
	new Promise((resolve, reject) => {
		isValidType(email, "email", "string")
			.then(() =>
				Partner
					.findOne({ email })
					.populate('projects')
					.lean()
					.exec()
			)
			.then(partner => {
				if (!partner)
					throw (new PartnerNotFound());
				else
					resolve(partner);
			})
			.catch(reject);
	});

/**
 * Find a partner given an id
 * @param {Object} partner
 * @param {ObjectId} partner.id Partner's id
 */
exports.findById = ({ id }) =>
	new Promise((resolve, reject) => {
		isValidType(id, "id", "ObjectId")
			.then(() =>
				Partner
					.findOne({ _id: id })
					.populate('projects')
					.lean()
					.exec()
			)
			.then(partner => {
				if (!partner)
					throw new PartnerNotFound()
				else
					resolve(partner);
			})
			.catch(reject);
	});

/**
 * Find a partner given his key
 * @param {Object} partner
 * @param {string} partner.key Partner's key
 */
exports.findByKey = ({ key }) =>
	new Promise((resolve, reject) => {
		isValidType(key, "key", "string")
			.then(() =>
				Partner
					.findOne({ key })
					.populate('projects')
					.lean()
					.exec()
			)
			.then(partner => {
				if (!partner)
					throw (new PartnerNotFound());
				else
					resolve(partner);
			})
			.catch(reject);
	});

/**
 * Update partner's informations
 * @param {Object} partner
 * @param {ObjectId} partner.id Partner's id
 * @param {string} partner.company [Optional] New company value
 * @param {string} partner.first_name [Optional] New first_name value
 * @param {string} partner.last_name [Optional] New last_name value
 * @param {string} partner.phone [Optional] New phone value
 * @param {string} partner.address [Optional] New address value
 * @param {string} partner.kind [Optional] New kind value
 * @param {boolean} partner.alreadyPartner [Optional] New alreadyPartner value
 */
exports.updatePartner = ({ id, ...data }) =>
	new Promise((resolve, reject) => {
		isValidType(id, "id", "ObjectId")
			.then(() => {
				let updateData = {};
				let keysList = ["company", "first_name", "last_name", "phone", "address", "kind", "alreadyPartner"]

				keysList.forEach(key => {
					if (data[key])
						updateData[key] = data[key];
				});

				console.log(updateData);

				return Partner
					.updateOne({ _id: id }, updateData)
					.exec();
			})
			.then(res => resolve(res))
			.catch(reject);
	});

/**
 * Reset partner password
 * @param {Object} partner
 * @param {string} partner.email Partner's email
 */
exports.resetPassword = ({ email }) =>
	new Promise((resolve, reject) => {
		let partner;
		isValidType(email, "email", "string")
			.then(() =>
				Partner
					.findOne({ email })
					.exec()
			)
			.then(result => {
				if (result) {
					partner = result;
					return generatePassword(16);
				}
				else
					throw new PartnerNotFoundError();
			})
			.then(pass => {
				partner.key = pass.hash;
				mailController.resetLink(partner, pass.key);
				return partner.save();
			})
			.then(dataSaved => {
				resolve(dataSaved);
			})
			.catch(reject);
	});

/**
 * Generate a password
 * @param {number} size password length
 */
generatePassword = size =>
	new Promise((resolve, reject) => {
		crypto.randomBytes(size / 2, function (err, buffer) {
			if (err) reject(err);
			const key = buffer.toString('hex');
			const keyHash = sha256(key);

			// Prevent key collision
			Partner.countDocuments({ key: keyHash }, (err, count) => {
				if (err) reject(err);
				if (count == 0) resolve({ key: key, hash: keyHash });
				else reject(new Error("KeyCollision"));
			});
		});
	});
