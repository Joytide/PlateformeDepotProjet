'use strict';

const mongoose = require('mongoose');
const Person = mongoose.model('Person');
const Student = mongoose.model('Student');
const Partner = mongoose.model('Partner');
const Administration = mongoose.model('Administration');

const partnerController = require('./partnerController');

exports.list = (req, res) => {
    Person.find({})
        .exec((err, persons) => {
            if (err) res.send(err);
            else res.json(persons);
        });
}

exports.create = (req, res) => {
    let data = req.body;
    console.log(data);
    if (data.firstName && data.lastName && data.email && data.type) {
        if (data.type === "partner") {
            if (data.company) {
                data.last_name = data.lastName;
                data.first_name = data.firstName;
                partnerController.createPartner(data).then(
                    valid => res.send(valid),
                    err => res.send(err)
                );
            } else {
                res.status(400).send(new Error(`Missing a parameter. Expected parameters : 
                    (string) firstName, 
                    (string) lastName, 
                    (string) email, 
                    ("student"|"partner"|"EPGE"|"administration") type
                    (string) company (for partners only)`
                ));
            }
        } else if (data.type === "EPGE" || data.type === "administration") {
            let administration = new Administration();
            administration.last_name = data.lastName;
            administration.first_name = data.firstName;
            administration.email = data.email;
            administration.EPGE = data.type === "EPGE";
            administration.admin = data.type | false;

            administration.save((err, ad) => {
                if (err) res.send(err);
                else res.json(ad);
            });
        } else {
            let student = new Student();
            student.first_name = data.firstName;
            student.last_name = data.lastName;
            student.email = data.email;

            student.save((err, stu) => {
                if (err) res.send(err);
                else res.json(stu);
            });
        }
    } else {
        res.status(400).send(new Error(`Missing a parameter. Expected parameters : 
            (string) firstName, 
            (string) lastName, 
            (string) email, 
            ("student"|"partner"|"EPGE"|"administration") type
            (string) company (for partners only)`
        ));
    }
}

exports.delete = (req, res) => {
    let data = req.body;
    if (data._id) {
        Person.findByIdAndRemove(data._id, (err, data) => {
            if (err) res.send(err);
            else res.json(data);
        })
    } else {
        res.status(400).send(new Error(`Missing a parameter. Expected parameters : (ObjectId) _id`));
    }
}

exports.update = (req, res) => {
    let data = req.body;
    if (data._id && (data.admin != undefined || data.EPGE != undefined)) {
        let update = {};
        if (data.admin != undefined) update.admin = data.admin;
        if (data.EPGE != undefined) update.EPGE = data.EPGE;

        Administration.findByIdAndUpdate(data._id, update, { new: true }, (err, updated) => {
            if (err) res.send(err);
            else res.json(updated)
        });
    } else {
        res.status(400).send(new Error(`Missing a parameter. Expected parameters : (ObjectId) _id, (Boolean) admin`));
    }
}

exports.findById = (req, res) => {
    let data = req.params;
    if (data.id) {
        Person.findById(data.id, (err, person) => {
            if (err) res.send(err);
            else res.json(person);
        });
    } else {
        res.status(400).send(new Error(`Missing a parameter. Expected parameters : (ObjectId) _id`));
    }
}