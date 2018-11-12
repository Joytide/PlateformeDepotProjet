'use strict';

var mongoose = require('mongoose');
var Specialization = mongoose.model('Specialization');

exports.list_all_majors = function (req, res) {
    Specialization.find({}, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.create_a_major = function (req, res) {
    var new_major = new Specialization(req.body);
    console.log(new_major);
    new_major.save(function (err, major) {
        if (err)
            res.send(err);
        res.json(major);
    });
};

exports.filter_by_major = function (req, res) {
    Specialization.distinct("major_name", function (err, task) {
        if (err)
            res.send(err);
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



