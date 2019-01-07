'use strict';

var mongoose = require('mongoose');
var Specialization = mongoose.model('Specialization');

exports.list = function (req, res) {
    Specialization.find({}, function (err, specializations) {
        if (err)
            res.send(err);
        else
            res.json(specializations);
    });
};

exports.create = function (req, res) {
    let data = req.body;
    console.log(data);
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
    }else {
        res.status(400).send(new Error("Missing a parameter. Expected parameters : (ObjectID) _id"));
    }
}

exports.filter_by_major = function (req, res) {
    Specialization.distinct("major_name", function (err, task) {
        if (err)
            res.send(err);
        else
            res.json(task);
    });
};

/*exports.filter_by_year = function (req, res) {
    Specialization.distinct("study_year", function (err, task) {
        if (err)
        res.send(err);
        res.json(task);
    });
};*/



