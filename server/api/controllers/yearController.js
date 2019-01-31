'use strict';

var mongoose = require('mongoose');
var Year = mongoose.model('Year');

exports.list = function (req, res) {
    Year.find({})
        .exec((err, years) => {
            if (err)
                res.send(err);
            else
                res.json(years);
        });
};

exports.create = function (req, res) {
    let data = req.body;

    if (data.nameEn && data.nameFr) {
        let year = new Year();
        year.name.en = data.nameEn;
        year.name.fr = data.nameFr;

        year.save((err, ye) => {
            if (err) res.send(err);
            else res.json(ye);
        });
    } else {
        res.status(400).send(new Error("Missing a parameter. Expected parameters : (string) nameEn, (string) nameFr"));
    }
};

exports.delete = (req, res) => {
    let data = req.body;

    if (data._id) {
        Year.findByIdAndRemove(data._id, (err, data) => {
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
        Year.findById(data._id)
            .exec((err, year) => {
                if (err) res.send(err);
                else res.json(year);
            });
    } else {
        res.status(400).send(new Error("Missing a parameter. Expected parameters : (ObjectID) _id"));
    }
}

exports.update = (req, res) => {
    const data = req.body;

    if (data._id) {
        let update = {};

        if (data.nameFr != undefined) update['name.fr'] = data.nameFr;
        if (data.nameEn != undefined) update['name.en'] = data.nameEn;

        if (Object.keys(update).length > 0) {
            Year.findByIdAndUpdate(data._id, { "$set": update }, { new: true }, (err, year) => {
                if (err) res.send(err);
                else res.json(year);
            });
        } else {
            res.status(400).send(new Error("Missing a parameter. Expected parameters : (String) nameFr or (String) nameEn"));
        }
    } else {
        res.status(400).send(new Error("Missing a parameter. Expected parameters : (ObjectID) _id"));
    }
}