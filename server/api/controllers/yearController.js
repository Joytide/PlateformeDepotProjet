const mongoose = require('mongoose');
const Year = mongoose.model('Year');
const Project = mongoose.model('Project');
const { isValidType, areValidTypes, YearNotFoundError } = require('../../helpers/Errors');

/**
 * Returns the list of existing year(s)
 */
exports.list = () =>
    new Promise((resolve, reject) => {
        Year
            .find({})
            .sort({ abbreviation: 1 })
            .lean()
            .exec()
            .then(years => {
                if (years)
                    resolve(years);
                else
                    resolve([]);
            })
            .catch(reject);
    });

/**
 * Create a new year
 * @param {string} nameEn English name for the new year
 * @param {string} nameFr French name for the new year
 * @param {string} abbreviation Abbreviation for the new year
 */
exports.create = ({ ...data }) =>
    new Promise((resolve, reject) => {
        areValidTypes(
            [data.nameEn, data.nameFr, data.abbreviation],
            ["nameEn", "nameFr", "abbreviation"],
            ["string", "string", "string"]
        )
            .then(() => {
                let year = new Year();
                year.name.en = data.nameEn;
                year.name.fr = data.nameFr;
                year.abbreviation = data.abbreviation

                return year.save();
            })
            .then(savedYear => resolve(savedYear))
            .catch(reject);
    });

/**
 * Delete a year
 * @param {string} id Id of the year to delete
 */
exports.delete = ({ id }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() => {
                let deleteYear = Year
                    .deleteOne({ _id: id })
                    .exec();
                let updateProjects = Project
                    .updateMany({ study_year: id }, { $pull: { study_year: id } })
                    .exec()

                return Promise.all([deleteYear, updateProjects]);
            })
            .then(() => resolve({ ok: 1 }))
            .catch(reject);
    });

/**
 * Find a year given his id
 * @param {ObjectId} id Id of the year to delete
 */
exports.findById = ({ id }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() =>
                Year.findById({ _id: id })
                    .lean()
                    .exec()
            )
            .then(year => {
                if (year)
                    resolve(year);
                else
                    throw new YearNotFoundError();
            })
            .catch(reject);
    });

/**
 * Update a year 
 * @param {ObjectId} id Id of the year to delete
 * @param {string} [nameFr] Optional - New french name
 * @param {string} [nameEn] Optional - New english name
 * @param {string} [abbreviation] Optional - New abbreviation
 */
exports.update = ({ id, ...data }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() => {
                let update = {};

                if (data.nameFr != undefined) update['name.fr'] = data.nameFr;
                if (data.nameEn != undefined) update['name.en'] = data.nameEn;
                if (data.abbreviation != undefined) update['abbreviation'] = data.abbreviation;

                return Year
                    .updateOne({ _id: id }, update)
                    .exec()

            })
            .then(resolve)
            .catch(reject);
    });