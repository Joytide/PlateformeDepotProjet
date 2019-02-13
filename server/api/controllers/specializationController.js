'use strict';

const mongoose = require('mongoose');
const Specialization = mongoose.model('Specialization');
const Administration = mongoose.model('Administration');

exports.list = function (req, res, next) {
    Specialization.find({})
        .populate({ path: 'referent', select: "first_name last_name _id" })
        .exec((err, specializations) => {
            if (err)
                next(err);
            else
                res.json(specializations || []);
        });
};

exports.create = function (req, res, next) {
    let data = req.body;

    if (data.nameEn && data.nameFr && data.abbreviation) {
        let specialization = new Specialization();
        specialization.name.en = data.nameEn;
        specialization.name.fr = data.nameFr;
        specialization.abbreviation = data.abbreviation;

        specialization.save((err, spe) => {
            if (err) next(err);
            else res.json(spe);
        });
    } else {
        let error = new Error("Missing a parameter. Expected parameters : (string) nameEn, (string) nameFr, (string) abbreviation");
        error.status = 400;
        error.name = "MissingParameter"
        next(error);
    }
};

exports.delete = (req, res, next) => {
    let data = req.body;

    if (data._id) {
        Specialization.findByIdAndDelete(data._id, (err, data) => {
            if (err && err.name === "CastError") {
                err.status = 400;
                err.message = "_id parameter must be an ObjectId";
                next(err);
            }
            else if (err) next(err);
            else res.send(data || {});
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
        Specialization.findOne({ _id: data._id })
            .populate({ path: 'referent', select: "first_name last_name _id" })
            .exec((err, spe) => {
                if (err) next(err);
                else res.json(spe || {});
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

        if (data.abbreviation != undefined) update['abbreviation'] = data.abbreviation;
        if (data.nameFr != undefined) update['name.fr'] = data.nameFr;
        if (data.nameEn != undefined) update['name.en'] = data.nameEn;

        if (Object.keys(update).length > 0) {
            Specialization.findOne({ _id: data._id }, (err, spe) => {
                if (err && err.name === "CastError") {
                    err.status = 400;
                    err.message = "_id parameter must be an ObjectId";
                    next(err);
                }
                else if (err) next(err);
                else if (spe) {
                    spe.set(update);
                    spe.save((err, updatedSpe) => {
                        if (err) next(err);
                        else res.json(updatedSpe);
                    });
                }
                else {
                    let error = new Error("Can't find any spe with that ObjectId");
                    error.status = 400;
                    error.name = "SpecializationNotFound"
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

exports.addReferent = (req, res, next) => {
    let data = req.body;

    if (data._id && data.referent) {
        Administration.findOne({ _id: data.referent, EPGE: true }, (err, epge) => {
            if (err && err.name === "CastError") {
                err.status = 400;
                err.message = "referent parameter must be an ObjectId";
                next(err);
            }
            else if (err) next(err);
            else if (epge) {
                Specialization.findOne({ _id: data._id, referent: { $ne: epge._id } }, (err, spe) => {
                    if (err && err.name === "CastError") {
                        err.status = 400;
                        err.message = "referent parameter must be an ObjectId";
                        next(err);
                    }
                    else if (err) next(err);
                    else if (spe) {
                        spe.referent.push(epge._id);
                        spe
                            .save()
                            .then(savedSpe => res.json(savedSpe))
                            .catch(next);
                    }
                    else {
                        let error = new Error("Can't find any specialization with that ObjectId");
                        error.status = 400;
                        error.name = "SpecializationNotFound"
                        next(error);
                    }
                });
            }
            else {
                let error = new Error("Can't find any EGPE member with that ObjectId");
                error.status = 400;
                error.name = "UserNotFound"
                next(error);
            }
        });

    } else {
        let error = new Error("Missing a parameter. Expected parameters : (ObjectID) _id, (ObjectID) referent");
        error.name = "MissingParameter"
        error.status = 400;
        next(error);
    }
}

exports.removeReferent = (req, res, next) => {
    let data = req.body;

    if (data._id && data.referent) {
        Specialization.findOneAndUpdate({ _id: data._id, referent: data.referent }, { $pull: { referent: data.referent } }, { new: true }, (err, spe) => {
            if (err) res.send(err);
            else res.json(spe);
        })
    } else {
        let error = new Error("Missing a parameter. Expected parameters : (ObjectID) _id, (ObjectID) referent");
        error.name = "MissingParameter"
        error.status = 400;
        next(error);
    }
}