'use strict';

var mongoose = require('mongoose');
var Specialization = mongoose.model('Specialization');

exports.list = function (req, res) {
    Specialization.find({})
        .populate('referent')
        .exec((err, specializations) => {
            if (err)
                res.send(err);
            else
                res.json(specializations);
        });
};

exports.create = function (req, res) {
    let data = req.body;

    if (data.nameEn && data.nameFr && data.abbreviation) {
        let specialization = new Specialization();
        specialization.name.en = data.nameEn;
        specialization.name.fr = data.nameFr;
        specialization.abbreviation = data.abbreviation;

        specialization.save((err, spe) => {
            if (err) res.send(err);
            else res.json(spe);
        });
    } else {
        res.status(400).send(new Error("Missing a parameter. Expected parameters : (string) nameEn, (string) nameFr, (string) abbreviation"));
    }
};

exports.delete = (req, res) => {
    let data = req.body;
    if (data._id) {
        Specialization.findByIdAndRemove(data._id, (err, data) => {
            if (err) res.send(err);
            else res.send(data);
        });
    } else {
        res.status(400).send(new Error("Missing a parameter. Expected parameters : (ObjectID) _id"));
    }
}

exports.findById = (req, res) => {
    let data = req.params;
    if (data._id) {
        Specialization.findById(data._id)
            .populate('referent')
            .exec((err, spe) => {
                if (err) res.send(err);
                else res.json(spe);
            });
    } else {
        res.status(400).send(new Error("Missing a parameter. Expected parameters : (ObjectID) _id"));
    }
}

exports.update = (req, res) => {
    const data = req.body;

    if (data._id) {
        let update = {};

        if (data.abbreviation) update['abbreviation'] = data.abbreviation;
        if (data.name && data.name.fr) update['name.fr'] = data.name.fr;
        if (data.name && data.name.en) update['name.en'] = data.name.en;

        Specialization.findById(data._id, (err, spe) => {
            if(err) res.send(err);
            else {
                spe.set(update);
                spe.save((err, updatedSpe) => {
                    if(err) res.send(err);
                    else res.json(updatedSpe);
                })
            }
        });
    } else {
        res.status(400).send(new Error("Missing a parameter. Expected parameters : (ObjectID) _id"));
    }
}

exports.addReferent = (req, res) => {
    let data = req.body;

    if (data._id && data.referent) {
        Specialization.findOneAndUpdate({ _id: data._id, referent: { $ne: data.referent } }, { $push: { referent: data.referent } }, { new: true }, (err, spe) => {
            if (err) res.send(err);
            else res.json(spe);
        })
    } else {
        res.status(400).send(new Error("Missing a parameter. Expected parameters : (ObjectID) _id, (ObjectID) referent"));
    }
}

exports.removeReferent = (req, res) => {
    let data = req.body;

    if (data._id && data.referent) {
        Specialization.findOneAndUpdate({ _id: data._id, referent: data.referent }, { $pull: { referent: data.referent } }, { new: true }, (err, spe) => {
            if (err) res.send(err);
            else res.json(spe);
        })
    } else {
        res.status(400).send(new Error("Missing a parameter. Expected parameters : (ObjectID) _id, (ObjectID) referent"));
    }
}