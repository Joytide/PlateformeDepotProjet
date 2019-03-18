'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const email_validator = require('email-validator');

const Person = mongoose.model('Person');
const Student = mongoose.model('Student');
const Partner = mongoose.model('Partner');
const Administration = mongoose.model('Administration');

const partnerController = require('./partnerController');
const bcryptConf = require('../../config.json').bcrypt;

exports.list = (req, res) => {
    Person.find({})
        .exec((err, persons) => {
            Partner.find({}, (err, partners) => {
                if (err) res.send(err);
                else res.json(persons.concat(partners));
            })
        });
}

exports.listAdministration = (req, res) => {
    Administration.find({})
        .exec((err, admins) => {
            if (err) res.send(err);
            else res.json(admins);
        });
}

exports.listEPGE = (req, res) => {
    Administration.find({ EPGE: true })
        .exec((err, epge) => {
            if (err) res.send(err);
            else res.json(epge);
        });
}

exports.create = (req, res, next) => {
    let data = req.body;

    if (data.firstName && data.lastName && data.email && data.type) {
        if (data.type === "partner") {
            if (data.company) {
                data.last_name = data.lastName;
                data.first_name = data.firstName;
                partnerController
                    .createPartner(data)
                    .then(valid => res.send(valid))
                    .catch(next);
            } else {
                let error = new Error(`Missing a parameter. Expected parameters : 
                (string) firstName, 
                (string) lastName, 
                (string) email, 
                ("student"|"partner"|"EPGE"|"administration") type
                (string) company (for partners only)`
                );
                error.status = 400;
                next(error);
            }
        } else {
            Person.findOne({ email: data.email }, (err, person) => {
                if (err) next(err);
                else {
                    if (person) {
                        let error = new Error("Email already used by a partner");
                        error.name = "EmailUsed";
                        error.status = 400;
                        next(error);
                    } else {
                        if (data.type === "EPGE" || data.type === "administration") {
                            if (data.password && data.password.length === 64) {
                                let administration = new Administration();
                                administration.last_name = data.lastName;
                                administration.first_name = data.firstName;
                                administration.email = data.email;
                                administration.EPGE = data.type === "EPGE";
                                administration.admin = data.type | false;

                                bcrypt.hash(data.password, bcryptConf.saltRounds, (err, hash) => {
                                    if (err) next(err);
                                    else {
                                        administration.password = hash;

                                        administration.save((err, ad) => {
                                            if (err) next(err);
                                            else res.json(ad);
                                        });
                                    }
                                });
                            } else {
                                let error = new Error(`Invalid password parameter :
                                (string) password. Must be hashed in sha256`
                                );
                                error.status = 400;
                                next(error);
                            }
                        } else {
                            let student = new Student();
                            student.first_name = data.firstName;
                            student.last_name = data.lastName;
                            student.email = data.email;

                            student.save((err, stu) => {
                                if (err) next(err);
                                else res.json(stu);
                            });
                        }
                    }
                }
            });
        }
    } else {
        let error = new Error(`Missing a parameter. Expected parameters : 
        (string) firstName, 
        (string) lastName, 
        (string) email, 
        ("student"|"partner"|"EPGE"|"administration") type
        (string) company (for partners only)
        (string) password (for admin|EPGE only). Must be hashed in sha256`
        );
        error.status = 400;
        error.name = "MissingParameter";
        next(error);
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

exports.update = (req, res, next) => {
    const data = req.body;

    if (data._id) {
        let update = {};

        if (data.admin !== undefined) update.admin = data.admin;
        if (data.EPGE !== undefined) update.EPGE = data.EPGE;
        if (data.firstName !== undefined) update.first_name = data.firstName;
        if (data.lastName !== undefined) update.last_name = data.lastName;
        if (data.company !== undefined && data.__t === "Partner") update.company = data.company;

        if (Object.keys(update).length > 0) {
            function updateUser(err, user) {
                if (err && err.name === "CastError") {
                    err.status = 400;
                    err.message = "_id parameter must be an ObjectId";
                    next(err);
                }
                else if (err) next(err);
                else if (user) {
                    user.set(update);
                    user.save((err, updatedUser) => {
                        if (err) next(err);
                        else res.json(updatedUser);
                    });
                }
                else {
                    let error = new Error("Can't find any user with that ObjectId");
                    error.status = 400;
                    error.name = "UserNotFound"
                    next(error);
                }
            }

            if (data.__t === "Partner") {
                Partner.findOne({ _id: data._id }, updateUser);
            } else {
                Person.findOne({ _id: data._id }, updateUser);
            }
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

exports.findById = (req, res) => {
    let data = req.params;
    if (data.id) {
        Person.findById(data.id, (err, person) => {
            if (err) res.send(err);
            else if (person) res.json(person);
            else {
                Partner.findById(data.id, (err, partner) => {
                    if (err) res.send(err);
                    else if (partner) res.json(partner);
                    else res.send(new Error("UserNotFound"));
                });
            }
        });
    } else {
        res.status(400).send(new Error(`Missing a parameter. Expected parameters : (ObjectId) _id`));
    }
}

exports.isAdmin = (req, res) => {
    req.user;

    res.json({
        _id: req.user._id,
        admin: req.user.admin
    });
}

exports.changePassword = (req, res, next) => {
    const data = req.body;

    if (data.userID === req.user._id || req.user.admin) {
        Person.findById(data.userID, (err, person) => {
            if (err)
                next(err);
            else {
                console.log(data);
                if (req.user.admin && data.newPassword && data.newPassword.length === 64)
                    bcrypt.hash(data.newPassword, bcryptConf.saltRounds, (err, hash) => {
                        person.password = hash;
                        person.save(err => {
                            if (err) next(err);
                            else res.json({ name: "PasswordChanged", message: "Password has been successfuly changed" });
                        });
                    });
                else if(data.oldPassword && data.oldPassword.length === 64 && data.newPassword && data.newPassword.length === 64)
                    bcrypt.compare(data.oldPassword, person.password, function (err, valid) {
                        if (err) next(err);
                        else if (valid) {
                            bcrypt.hash(data.newPassword, bcryptConf.saltRounds, (err, hash) => {
                                person.password = hash;
                                person.save(err => {
                                    if (err) next(err);
                                    else res.json({ name: "PasswordChanged", message: "Password has been successfuly changed" });
                                });
                            });
                        }
                        else
                            next(new Error('InvalidCredentials'));
                    });
                else 
                    next(new Error('InvalidCredentials'));
            }
        });
    }
}

exports.myself = (req,res) => {
    req.user.password = undefined;
    res.json(req.user);
}