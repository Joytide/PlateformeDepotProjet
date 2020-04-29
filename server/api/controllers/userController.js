'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Person = mongoose.model('Person');
const Student = mongoose.model('Student');
const Partner = mongoose.model('Partner');
const Administration = mongoose.model('Administration');

const partnerController = require('./partnerController');
const bcryptConf = require('../../config.json').bcrypt;

const {
    isValidType,
    areValidTypes,
    BCryptError,
    ExistingEmailError,
    ForbiddenError,
    InvalidCredentialsError,
    InvalidPasswordError,
    InvalidTypeError,
    UserNotFoundError } = require('../../helpers/Errors');

/**
 * List all users of the platform
 */
exports.list = () =>
    new Promise((resolve, reject) => {
        let personFind = Person.find({}).lean().exec();
        let partnerFind = Partner.find({}).lean().exec();

        Promise
            .all([personFind, partnerFind])
            .then(([persons, partners]) => {
                resolve(persons.concat(partners));
            })
            .catch(reject);
    });

/**
 * List administration's user
 * @param {Object} [filters] Optional - Filters to apply for the search
 * @param {boolean} [filters.EPGE] Optional - Show only EGPE members
 */
exports.listAdministration = (filters = {}) => () =>
    new Promise((resolve, reject) => {
        Administration
            .find(filters)
            .lean()
            .exec()
            .then(admins => resolve(admins))
            .catch(reject);
    });

/**
 * Create a new user
 * @param {string} first_name User's first name
 * @param {string} last_name User's last name
 * @param {string} email User's email
 * @param {string} type User's type. Accepted values : partner, administration, EPGE
 * @param {string} company If the user is a partner. Company name
 * @param {string} [phone] Optional - If the user is a partner. Phone number
 * @param {string} [address] Optional - If the user is a partner. Address
 * @param {string} password If the user is administration's or EGPE's member : password hashed in SHA256
 * @param {string} [admin] If the user is administration's or EGPE's member : is (s)he an admin ?
 */
exports.create = ({ ...data }) =>
    new Promise((resolve, reject) => {
        if (data.type === "partner") {
            partnerController
                .createPartner(data)
                .then(partner => resolve(partner))
                .catch(reject);
        }
        else if (data.type === "EPGE" || data.type === "administration") {
            areValidTypes(
                [data.first_name, data.last_name, data.email, data.type],
                ["first_name", "last_name", "email", "type"],
                ["string", "string", "string", "string"]
            )
                .then(() =>
                    Person
                        .findOne({ email: data.email })
                        .exec()
                )
                .then(person => {
                    if (person)
                        throw new ExistingEmailError()
                    else {
                        if (data.password && data.password.length === 64)
                            return bcrypt.hash(data.password, bcryptConf.saltRounds);
                        else
                            throw new InvalidPasswordError();
                    }
                })
                .then(passwordHash => {
                    let administration = new Administration();

                    administration.last_name = data.last_name;
                    administration.first_name = data.first_name;
                    administration.email = data.email;
                    administration.EPGE = data.type === "EPGE";
                    administration.admin = data.admin | false;
                    administration.password = passwordHash;

                    return administration.save();
                })
                .then(administration => resolve(administration))
                .catch(reject);
        }
        else
            reject(new InvalidTypeError());
    });

/**
 * Delete a user
 * @param {Object} user
 * @param {ObjectId} user.id User's id
 */
/*exports.delete = ({ id }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() =>
                Person
                    .deleteOne({ _id: id })
                    .exec()
            )
            .then(resolve)
            .catch(reject);
    });*/


/**
* Update an administration's user
* @param {Object} user
* @param {string} user.first_name User's first name
* @param {string} user.last_name User's last name
* @param {string} user.email User's email
* @param {string} [user.admin] If the user is administration's or EGPE's member : is (s)he an admin ?
*/
exports.update = ({ id, ...data }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() => {
                let update = {};

                if (data.admin !== undefined) update.admin = data.admin;
                if (data.EPGE !== undefined) update.EPGE = data.EPGE;
                if (data.first_name !== undefined) update.first_name = data.first_name;
                if (data.last_name !== undefined) update.last_name = data.last_name;
                console.log(data,update,id)
                return Administration
                    .updateOne({ _id: id }, update)
                    .exec()
            })
            .then(writeOps => resolve(writeOps))
            .catch(reject);
    });

/**
 * Find an user given his id
 * @param {ObjectId} id User's id
 */
exports.findById = ({ id }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() => {
                let findAdministration = Administration.findOne({ _id: id }).exec();
                let findPartner = Partner
                    .findOne({ _id: id })
                    .populate({
                        path: "projects",
                        populate: { path: "specializations.specialization study_year files" }
                    })
                    .lean()
                    .exec();

                return Promise.all([findAdministration, findPartner]);
            })
            .then(([administration, partner]) => {
                if (administration)
                    resolve(administration)
                else if (partner)
                    resolve(partner);
                else
                    throw new UserNotFoundError();
            })
            .then(user => resolve(user))
            .catch(reject);
    });

/**
 * Check if a logged user is an admin
 */
exports.isAdmin = ({ user }) =>
    new Promise((resolve, reject) => {
        resolve({
            _id: user._id,
            admin: user.admin
        });
    });

/**
 * Change a user's password
 * @param {Object} user Provided by auth
 * @param {Object} id Id of the to change password
 * @param {string} oldPassword Old password of the user in SHA256
 * @param {string} newPassword New password of the user in SHA256
 */
exports.changePassword = ({ user, id, oldPassword, newPassword }) =>
    new Promise((resolve, reject) => {
        areValidTypes(
            [id, oldPassword, newPassword],
            ["id", "oldPassword", "newPassword"],
            ["ObjectId", "string", "string"]
        )
            .then(() => {
                if ((id == user._id) || user.admin)
                    return Administration
                        .findOne({ _id: id })
                        .exec()
                else
                    throw new ForbiddenError();
            })
            .then(async administration => {
                // If there is (the old password specified or the user is an admin) and the new password is specified
                if (((oldPassword && oldPassword.length === 64) || user.admin) && newPassword && newPassword.length === 64) {
                    let valid = false;

                    if (user.admin)
                        valid = true;
                    else {
                        try {
                            valid = await bcrypt.compare(oldPassword, administration.password);
                        } catch (e) {
                            throw new BCryptError(e);
                        }
                    }

                    if (valid) {
                        let hash;

                        try {
                            hash = await bcrypt.hash(newPassword, bcryptConf.saltRounds);
                        } catch (e) {
                            throw new BCryptError(e);
                        }

                        administration.password = hash;
                        return administration.save();
                    } else
                        throw new InvalidCredentialsError();
                }
                else
                    throw new InvalidCredentialsError();
            })
            .then(administration => resolve(administration))
            .catch(reject);
    });

/**
 * Returns data of a logged user
 */
exports.myself = ({ user }) =>
    new Promise((resolve, reject) => {
        resolve({
            ...user,
            password: undefined,
            key: undefined
        });
    });