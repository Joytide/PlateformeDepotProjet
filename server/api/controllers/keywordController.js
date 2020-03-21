const mongoose = require('mongoose');
const Keyword = mongoose.model('Keyword');

exports.create = displayName =>
    new Promise((resolve, reject) => {
        if (displayName != "" && typeof (displayName) == "string")
            countKeywords(displayName)
                .then(count => {
                    if (count > 0)
                        reject(new Error("NameUsed"));
                    else {
                        console.log("displayName: ", displayName)
                        let keyword = new Keyword();
                        keyword.displayName = displayName;
                        keyword.lcName = displayName.toLowerCase();

                        keyword.save((err, sKeyword) => {
                            if (err) reject(err);
                            else resolve(sKeyword);
                        });
                    }
                })
                .catch(reject);
        else
            reject(new Error("InvalidParameters"))
    });

exports.getAll = () =>
    new Promise((resolve, reject) => {
        Keyword.find({}, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });

exports.update = (objectID, newName) =>
    new Promise((resolve, reject) => {
        if (newName != "" && typeof (newName) == "string")
            // Ensure that the new name isn't already used
            countKeywords(newName)
                .then(count => {
                    if (count > 0)
                        reject(new Error({ ok: 0, error: "Name already used", code: "NameUsed" }));
                    else {
                        Keyword.updateOne(
                            {
                                _id: objectID
                            },
                            {
                                displayName: newName,
                                lcName: newName.toLowerCase()
                            },
                            (err, ops) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(ops);
                            }
                        );
                    }
                })
                .catch(reject);
        else
            reject(new Error({ ok: 0, error: "Invalid type or empty string", code: "InvalidInput" }));
    });

exports.delete = id =>
    new Promise((resolve, reject) => {
        Keyword.deleteOne({ _id: id }, err => {
            if (err) reject(err);
            else resolve();
        });
    });

let countKeywords = name =>
    new Promise((resolve, reject) => {
        Keyword.countDocuments({ lcName: name.toLowerCase() }, (err, count) => {
            if (err)
                reject(err);
            else
                resolve(count);
        });
    });
