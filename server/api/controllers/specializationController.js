'use strict';

const mongoose = require('mongoose');
const Specialization = mongoose.model('Specialization');
const Project = mongoose.model('Project');
const Administration = mongoose.model('Administration');

const { isValidType, areValidTypes, ReferentAlreadyRegisteredError, SpecializationNotFoundError, UserNotFoundError } = require('../../helpers/Errors');

/**
 * List all existing specializations
 */
exports.list = () =>
    new Promise((resolve, reject) => {
        Specialization.find({})
            .populate({ path: 'referent', select: "first_name last_name _id" })
            .lean()
            .exec()
            .then(specializations => resolve(specializations || []))
            .catch(reject);
    });

/**
 * Create a new specialization
 * @param {string} nameEn English name of the specialization
 * @param {string} nameFr French name of the specialization
 * @param {string} descriptionEn English description of the specialization
 * @param {string} descriptionFr French description of the specialization
 * @param {string} abbreviation Abbreviation of the specialization
 */
exports.create = ({ ...data }) =>
    new Promise((resolve, reject) => {
        areValidTypes(
            [data.nameEn, data.nameFr, data.descriptionEn, data.descriptionFr, data.abbreviation],
            ["nameEn", "nameFr", "descriptionEn", "descriptionFr", "abbreviation"],
            ["string", "string", "string", "string", "string"]
        )
            .then(() => {
                let specialization = new Specialization();
                specialization.name.en = data.nameEn;
                specialization.name.fr = data.nameFr;
                specialization.description.en = data.descriptionEn;
                specialization.description.fr = data.descriptionFr;
                specialization.abbreviation = data.abbreviation;

                return specialization.save();
            })
            .then(specialization => resolve(specialization))
            .catch(reject);
    });

/**
 * Delete a specialization
 * @param {ObjectId} id Id of the specialization to delete
 */
exports.delete = ({ id }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() => {
                let deleteSpe = Specialization
                    .deleteOne({ _id: id })
                    .exec();
                let updateProjects = Project
                    .updateMany({ "specializations.specialization": id }, { $pull: { specializations: { specialization: id } } })
                    .exec();

                return Promise.all([deleteSpe, updateProjects]);
            })
            .then(() => resolve({ ok: 1 }))
            .catch(reject);
    });


/**
 * Find a specialization by id
 * @param {ObjectId} id Id of the specialization to find
 */
exports.findById = ({ id }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() =>
                Specialization
                    .findOne({ _id: id })
                    .populate({ path: 'referent', select: "first_name last_name _id email" })
                    .lean()
                    .exec()
            )
            .then(specialization => resolve(specialization))
            .catch(reject);
    });

/**
 * Update a specialization
 * @param {ObjectId} id
 * @param {string} [nameEn] Optional - English name of the specialization
 * @param {string} [nameFr] Optional - French name of the specialization
 * @param {string} [descriptionEn] Optional - English description of the specialization
 * @param {string} [descriptionFr] Optional - French description of the specialization
 * @param {string} [abbreviation] Optional - Abbreviation of the specialization
 */
exports.update = ({ id, ...data }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() => {
                let update = {};

                if (data.abbreviation != undefined) update['abbreviation'] = data.abbreviation;
                if (data.nameFr != undefined) update['name.fr'] = data.nameFr;
                if (data.nameEn != undefined) update['name.en'] = data.nameEn;
                if (data.descriptionFr != undefined) update['description.fr'] = data.descriptionFr;
                if (data.descriptionEn != undefined) update['description.en'] = data.descriptionEn;

                Specialization
                    .updateOne({ _id: id }, update)
                    .exec();
            })
            .then(resolve)
            .catch(reject)
    });

/**
 * Add a referent to a specialization
 * @param {ObjectId} specializationId Id of the specialization
 * @param {ObjectId} referentId Id of the referent
 */
exports.addReferent = ({ specializationId, referentId }) =>
    new Promise((resolve, reject) => {
        areValidTypes(
            [specializationId, referentId],
            ["specializationId", "referentId"],
            ["ObjectId", "ObjectId"]
        )
            .then(() => {
                let findSpecialization = Specialization.findOne({ _id: specializationId }).exec();
                let administrationExists = Administration.estimatedDocumentCount({ _id: referentId });

                return Promise.all([findSpecialization, administrationExists]);
            })
            .then(([specialization, administrationCount]) => {
                if (specialization && administrationCount > 0) {
                    if (specialization.referent.indexOf(referentId) === -1) {
                        specialization.referent.push(referentId);
                        return specialization.save();
                    }
                    else
                        throw new ReferentAlreadyRegisteredError();
                } else if (!specialization)
                    throw new SpecializationNotFoundError();
                else
                    throw new UserNotFoundError();
            })
            .then(specialization => resolve(specialization))
            .catch(reject);
    });

/**
 * Remove a referent from a specialization
 * @param {ObjectId} specializationId Id of the specialization
 * @param {ObjectId} referentId Id of the referent
 */
exports.removeReferent = ({ specializationId, referentId }) =>
    new Promise((resolve, reject) => {
        areValidTypes(
            [specializationId, referentId],
            ["specializationId", "referentId"],
            ["ObjectId", "ObjectId"]
        )
            .then(() =>
                Specialization
                    .updateOne(
                        { _id: specializationId, referent: referentId },
                        { "$pull": { referent: referentId } }
                    )
                    .exec()
            )
            .then(resolve)
            .catch(reject);
    });