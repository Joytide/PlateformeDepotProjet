const mongoose = require('mongoose');
const crypto = require('crypto');
const sha256 = require('js-sha256')
const jwt = require('jsonwebtoken');
const { isValidType, areValidTypes, ExistingEmailError } = require('../../helpers/Errors');
const mailController = require('./mailController');

const Contact = mongoose.model('Contact');
const config = require('../../config');

/**
 * List all contacts
 */
exports.getAll = () =>
    Contact.find()
        .limit(200)
		.lean()
		.exec();

/**
 * Create a new contact
 * @param {Object} contact Contact's informations
 * @param {string} contact.first_name Contact's first name
 * @param {string} contact.last_name Contact's last name
 * @param {string} contact.email Contact's email
 * @param {string} contact.company Contact's company name
 * @param {string} contact.kind Contact's kind (enterprise, association, school, other...)
 * @param {string} [contact.phone] Optional - Contact's phone number
 */
exports.createContact = ({ ...data }) =>
	new Promise((resolve, reject) => {
		areValidTypes(
			[data.first_name, data.last_name, data.email, data.company, data.kind],
			["first_name", "last_name", "email", "company", "kind"],
			["string", "string", "string", "string", "string"]
		)
			.then(() =>
				Contact
					.findOne({ email: data.email })
					.exec()
			)
			.then(contact => {
				if (contact) {
					throw new ExistingEmailError();
				} else {
                    Contact.find()
                    .lean()
                    .exec();
                    
					let newContact = new Contact({
						first_name: data.first_name,
						last_name: data.last_name,
						email: data.email,
						kind: data.kind,
						company: data.company
					});

					if (data.phone) newContact.phone = data.phone;
                    return newContact.save();
				}
			})
            .then(resolve)
			.catch(reject);
	});

