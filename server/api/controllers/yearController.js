const mongoose = require('mongoose');
const Year = mongoose.model('Year');
const { isValidType, areValidTypes, YearNotFoundError } = require('../../helpers/Errors');

/**
 * Returns the list of existing year(s)
 */
exports.list = () =>
    new Promise((resolve, reject) => {
        Year.find({})
            .sort({ abbreviation: 1 })
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
 * @param {Object} year 
 * @param {string} year.nameEn English name for the new year
 * @param {string} year.nameFr French name for the new year
 * @param {string} year.abbreviation Abbreviation for the new year
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

                return year.save((err, ye) => {
                    if (err) next(err);
                    else res.json(ye);
                });
            })
            .then(savedYear => resolve(savedYear))
            .catch(reject);
    });

/**
 * Delete a year
 * @param {Object} year 
 * @param {string} year.id Id of the year to delete
 */
exports.delete = ({ ...id }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() =>
                Year
                    .deleteOne({ id })
                    .exec()
            )
            .then(resolve)
            .catch(reject);
    });

/**
 * Delete a year
 * @param {Object} year 
 * @param {string} year.id Id of the year to delete
 */
exports.findById = ({ ...id }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() =>
                Year.findById(data._id)
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
 * @param {Object} year 
 * @param {string} year.id Id of the year to delete
 * @param {string} [year.nameFr] Optional - New french name
 * @param {string} [year.nameEn] Optional - New english name
 * @param {string} [year.abbreviation] Optional - New abbreviation
 */
exports.update = ({ id, ...data }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() => {
                Year
                    .findOne({ _id: id })
                    .exec()
            })
            .then(year => {
                if (!year) {
                    throw new YearNotFoundError();
                } else {
                    let update = {};

                    if (data.nameFr != undefined) update['name.fr'] = year.nameFr;
                    if (data.nameEn != undefined) update['name.en'] = year.nameEn;
                    if (data.abbreviation != undefined) update['abbreviation'] = year.abbreviation;

                    return year.save();
                }
            })
            .then(year => resolve(year))
            .catch(reject);
    });