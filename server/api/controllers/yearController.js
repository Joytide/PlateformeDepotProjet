'use strict';

var mongoose = require('mongoose');
var Year = mongoose.model('Year');

exports.list = function (req, res, next) {
    Year.find({})
        .sort({ abbreviation: 1 })
        .exec((err, years) => {
            if (err)
                next(err);
            else
                res.json(years);
        });
};

exports.create = function (req, res, next) {
    let data = req.body;

    if (data.nameEn && data.nameFr && data.abbreviation) {
        let year = new Year();
        year.name.en = data.nameEn;
        year.name.fr = data.nameFr;
        year.abbreviation = data.abbreviation

        year.save((err, ye) => {
            if (err) next(err);
            else res.json(ye);
        });
    } else {
        let error = new Error("Missing a parameter. Expected parameters : (string) nameFr or (string) nameEn or (string) abbreviation");
        error.name = "MissingParameter"
        error.status = 400;
        next(error);
    }
};

exports.delete = (req, res, next) => {
    let data = req.body;

    if (data._id) {
        Year.findByIdAndDelete(data._id, (err, data) => {
            if (err && err.name === "CastError") {
                err.status = 400;
                err.message = "_id parameter must be an ObjectId";
                next(err);
            }
            else if (err)
                next(err);
            else
                res.json(data || {});
        });
    } else {
        let error = new Error("Missing a parameter. Expected parameters : (ObjectID) _id");
        error.name = "MissingId"
        error.status = 400;
        next(error);
    }
}

exports.findById = (req, res, next) => {
    let data = req.params;

    if (data._id) {
        Year.findById(data._id)
            .exec((err, year) => {
                if (err) next(err);
                else if (year) res.json(year);
                else res.json({});
            });
    } else {
        let error = new Error("Missing a parameter. Expected parameters : (ObjectID) _id");
        error.name = "MissingId"
        error.status = 400;
        next(error);
    }
}

exports.update = (req, res, next) => {
    const data = req.body;

    if (data._id) {
        let update = {};

        if (data.nameFr != undefined) update['name.fr'] = data.nameFr;
        if (data.nameEn != undefined) update['name.en'] = data.nameEn;
        if (data.abbreviation != undefined) update['abbreviation'] = data.abbreviation;

        if (Object.keys(update).length > 0) {
            Year.findOne({ _id: data._id }, (err, year) => {
                if (err && err.name === "CastError") {
                    err.status = 400;
                    err.message = "_id parameter must be an ObjectId";
                    next(err);
                }
                else if (err)
                    next(err);
                else if (year) {
                    year.set(update);

                    year.save((err) => {
                        if (err) next(err);
                        else res.json(year);
                    });
                } else {
                    let error = new Error("Can't find any year with that ObjectId");
                    error.status = 400;
                    error.name = "YearNotFound"
                    next(error);
                }
            });
        } else {
            let error = new Error("Missing a parameter. Expected parameters : (string) nameFr or (string) nameEn or (string) abbreviation");
            error.name = "MissingParameter"
            error.status = 400;
            next(error);
        }
    } else {
        let error = new Error("Missing a parameter. Expected parameters : (ObjectID) _id");
        error.name = "MissingId"
        error.status = 400;
        next(error);
    }
}