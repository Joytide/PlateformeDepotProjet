const mongoose = require('mongoose');
const Keyword = mongoose.model('Keyword');
const Project = mongoose.model('Project');
const { isValidType, areValidTypes, KeywordNotFoundError, ExistingNameError, MongoError } = require('../../helpers/Errors');


/**
 * Creates a new keyword
 * @param {Object} keyword
 * @param {string} keyword.name.en Keyword's display name in english
 * * @param {string} keyword.name.fr Keyword's display name in french
 */
exports.create = ({ ...data }) =>
new Promise((resolve, reject) => {
    areValidTypes(
        [data.nameEn, data.nameFr],
        ["nameEn", "nameFr"],
        ["string", "string"]
    )
        .then(() => {
            let keyword = new Keyword();
            keyword.name.en = data.nameEn;
            keyword.name.fr = data.nameFr;

            return keyword.save();
        })
        .then(savedKeyword => resolve(savedKeyword))
        .catch(reject);
});

/**
 * Creates a new keyword
 * @param {Array} keywords Array of keyword containing their name in french and english
 */
 exports.createMany = ({ keywords  }) =>
 new Promise((resolve, reject) => {
    console.log("aa",keywords)
    isValidType(keywords, 'keywords', 'Array')
    .then(() => {
        let kwlist = [];

        for (let i = 0; i < keywords.length; i++) {
            let keyword = new Keyword();
            keyword.name.fr = keywords[i].nameFr,
            keyword.name.en = keywords[i].nameEn,

            kwlist.push(keyword);
        }
        return Keyword.insertMany(kwlist)
    })
    .then(resolve)
    .catch(reject);
    
});

/**
 * Returns the list of existing keyword(s)
 */
 exports.list = () =>
 new Promise((resolve, reject) => {
     Keyword
         .find({})
         .sort({ abbreviation: 1 })
         .lean()
         .exec()
         .then(keywords => {
             if (keywords)
                 resolve(keywords);
             else
                 resolve([]);
         })
         .catch(reject);
 });

/**
* Update a keyword 
* @param {ObjectId} id Id of the keyword to delete
* @param {string} [nameFr] Optional - New french name
* @param {string} [nameEn] Optional - New english name
*/
exports.update = ({ id, ...data }) =>
new Promise((resolve, reject) => {
    isValidType(id, "id", "ObjectId")
        .then(() => {
            let update = {};

            if (data.nameFr != undefined) update['name.fr'] = data.nameFr;
            if (data.nameEn != undefined) update['name.en'] = data.nameEn;

            return Keyword
                .updateOne({ _id: id }, update)
                .exec()

        })
        .then(resolve)
        .catch(reject);
});

/**
 * Delete a keyword
 * @param {Object} keyword
 * @param {string} id Id of the keyword to delete
 */
exports.delete = ({ id }) =>
new Promise((resolve, reject) => {
    isValidType(id, "id", "ObjectId")
        .then(() => {
            let deleteKeyword = Keyword
                .deleteOne({ _id: id })
                .exec();
            let updateProjects = Project
                .updateMany({ selected_keywords: id }, { $pull: { selected_keywords: id } })
                .exec()

            return Promise.all([deleteKeyword, updateProjects]);
        })
        .then(() => resolve({ ok: 1 }))
        .catch(reject);
});



/**
 * Find a keyword given his id
 * @param {ObjectId} id Id of the keyword to delete
 */
exports.findById = ({ id }) =>
new Promise((resolve, reject) => {
    isValidType(id, "id", "ObjectId")
        .then(() =>
            Keyword.findById({ _id: id })
                .lean()
                .exec()
        )
        .then(keyword => {
            if (keyword)
                resolve(keyword);
            else
                throw new KeywordNotFoundError();
        })
        .catch(reject);
});

