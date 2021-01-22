'use strict';

const mongoose = require('mongoose');
const { isValidType, areValidTypes, KeywordNotFoundError, ExistingEmailError } = require('../../helpers/Errors');

const PRM = mongoose.model('PRM');
const Keyword = mongoose.model('Keyword');

/**
 * List all existings PRM
 * @returns Array of prms
 */
exports.list = () =>
    new Promise((resolve, reject) => {
        PRM
            .find()
            .limit(200)
            .sort('last_name')
            .lean()
            .exec()
            .then(resolve)
            .catch(reject);
    });

/**
 * Create new partners
 * @param {Object} param Object
 * @param {Array} param.prms Array of PRMs to create
 * @param {string} param.prms[].first_name PRM's first name
 * @param {string} param.prms[].last_name PRM's last name
 * @param {string} param.prms[].email PRM's email
 * @param {string} param.prms[].projectNumber Numer of project the PRM can manage
 * @param {string} param.prms[].status Status of the PRM in the school
 * @param {string} param.prms[].infos Additionnal informations on the PRM
 * @param {string} param.prms[].characteristics Characteristics of the PRM
 */
exports.create = ({ prms }) =>
    new Promise((resolve, reject) => {
        isValidType(prms, 'prms', 'Array')
            .then(() => {
                let prmEmails = prms.map(p => p.email);

                return PRM
                    .find({ email: prmEmails })
                    .select("email")
                    .lean()
                    .exec()
            })
            .then(prmsExisting => {
                if (prmsExisting.length > 0) {
                    throw new ExistingEmailError(prmsExisting.map(p => p.email));
                } else {
                    let prmList = [];

                    for (let i = 0; i < prms.length; i++) {
                        let prm = {
                            first_name: prms[i].first_name,
                            last_name: prms[i].last_name,
                            email: prms[i].email,
                            projectNumber: prms[i].projectNumber,
                            status: prms[i].status,
                            infos: prms[i].infos,
                            characteristics: prms[i].characteristics
                        }

                        prmList.push(prm);
                    }

                    return PRM.insertMany(prmList)
                }
            })
            .then(resolve)
            .catch(reject);
    });

/**
 * Update PRM informations
 */
exports.update = ({ id, ...data }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() => {
                let update = {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    characteristics: data.characteristics,
                    infos: data.infos,
                    status: data.status,
                    projectNumber: data.projectNumber
                };

                return PRM.updateOne({ _id: id }, update).exec();
            })
            .then(resolve)
            .catch(reject);
    });

/**
 * Delete a PRM
 */
exports.delete = ({ id }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() => PRM.deleteOne({ _id: id }).exec())
            .then(resolve)
            .catch(reject)
    });

/**
 * Add a keyword to a PRM
 */
exports.addKeyword = ({ prmId, keywordId }) =>
    new Promise((resolve, reject) => {
        areValidTypes(
            [prmId, keywordId],
            ["prmId", "keyordId"],
            ["ObjectId", "ObjectId"]
        )
            .then(() =>
                Keyword
                    .find({ _id: keywordId })
                    .lean()
                    .exec()
            )
            .then(keyword => {
                if (keyword) {
                    return PRM
                        .update({ _id: prmId }, { $addToSet: { keywords: keywordId } })
                } else {
                    throw new KeywordNotFoundError();
                }
            })
            .then(resolve)
            .catch(reject);
    });

/**
 * Remove a keywork from a PRM
 */
exports.removeKeyword = ({ prmId, keywordId }) =>
    new Promise((resolve, reject) => {
        areValidTypes(
            [prmId, keywordId],
            ["prmId", "keyordId"],
            ["ObjectId", "ObjectId"]
        )
            .then(() =>
                Keyword
                    .find({ _id: keywordId })
                    .lean()
                    .exec()
            )
            .then(keyword => {
                if (keyword) {
                    return PRM
                        .update({ _id: prmId }, { $pull: { keywords: keywordId } })
                } else {
                    throw new KeywordNotFoundError();
                }
            })
            .then(resolve)
            .catch(reject);
    });