const { ExistingNameError, MongoError, isValidType, areValidTypes } = require('../../helpers/Errors');
const mongoose = require('mongoose');
const Keyword = mongoose.model('Keyword');

/**
 * Creates a new keyword
 * @param {Object} keyword
 * @param {string} keyword.name Keyword's display name
 */
exports.create = ({ name }) =>
    new Promise((resolve, reject) => {
        isValidType(name, "name", "string")
            .then(() => countKeywords(name))
            .then(count => {
                if (count > 0)
                    throw new ExistingNameError();
                else {
                    let keyword = new Keyword();
                    keyword.displayName = name;
                    keyword.lcName = name.toLowerCase();

                    return keyword.save();
                }
            })
            .then(resolve)
            .catch(reject);
    });

/**
 * Returns all existing keywords
 */
exports.getAll = () =>
    Keyword
        .find({})
        .lean()
        .exec();

/**
 * Update a keyword name
 * @param {Object} keyword
 * @param {ObjectId} keyword.id Keyword's object id
 * @param {string} keyword.name Keyword's new name
 */
exports.update = ({ id, name }) =>
    new Promise((resolve, reject) => {
        areValidTypes([id, name], ["id", "name"], ["ObjectId", "string"])
            // Ensure that the new name isn't already used
            .then(() => countKeywords(name))
            .then(count => {
                if (count > 0)
                    throw new ExistingNameError();
                else
                    return Keyword
                        .updateOne(
                            { _id: id },
                            {
                                displayName: name,
                                lcName: name.toLowerCase()
                            }
                        ).exec();
            })
            .then(resolve)
            .catch(reject);
    });

/**
 * Delete a keyword
 * @param {Object} keyword
 * @param {ObjectId} keyword.id Keyword's id to delete
 */
exports.delete = ({ id }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() => Keyword.deleteOne({ _id: id }))
            .then(resolve)
            .catch(reject);
    });

/**
 * Count how many keywords are already using a given name
 * @param {string} name Keyword name
 */
const countKeywords = name =>
    new Promise((resolve, reject) => {
        Keyword.countDocuments({ lcName: name.toLowerCase() }, (err, count) => {
            if (err)
                reject(new MongoError(err));
            else
                resolve(count);
        });
    });
