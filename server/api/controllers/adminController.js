'use strict';

// NON UTILISE POUR LE MOMENT. LE CONTROLLER N'EST PAS CHARGÉ DANS APP.JS

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var Admin = mongoose.model('Administration');
const Person = mongoose.model('Person');
const Specialization = mongoose.model('Specialization');

exports.listUsers = (req, res) => {
    Person.find({}, (err, persons) => {
        if(err) res.send(err);
        else res.json(persons);
    });
}




/* Il est possible que l'on se passe totalement de ce controller car on passera par l'adfs pour gérer les accès */

exports.list_all_admins = function (req, res) {
    Admin.find({}, function (err, admin) {
        if (err)
            res.send(err);
        res.json(admin);
    });
};

exports.create_an_admin = function (req, res) {
    var new_admin = new Admin(req.body);
    new_admin.save(function (err, admin) {
        if (err)
            res.send(err);
        res.json(admin);
    });
};

exports.update_an_admin = (req, res) => {
    Admin.findOneAndUpdate({ _id: req.params.adminId }, req.body, { new: true }, (err, admin) => {
        if (err) {
            res.send(err);
        }
        res.json(admin);
    });
}

function generateToken(user) {
    //1. Dont use password and other sensitive fields
    //2. Use fields that are useful in other parts of the     
    //app/collections/models
    var u = {
        first_name: user.first_name,
        email: user.email,
        _id: user._id.toString(),
    };

    return jwt.sign(u, 'secret', {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
    });
}


exports.handle_login = function (req, res) {
    Admin.findOne({ email: req.body.email }).exec(function (err, user) {
        if (err) throw err;

        if (!user) {
            return res.status(404).json({
                error: true,
                message: 'Username or Password is Wrong'
            });
        }

        // bcrypt.compare(req.body.password, user.password,
        //     function (err, valid) {
        //         if (!valid) {
        //             return res.status(404).json({
        //                 error: true,
        //                 message: "Username or Password is Wrong"
        //             });
        //         }


        //         var token = generateToken(user);

        //         res.json({
        //             user: user,
        //             token: token
        //         });
        //     });

        if (req.body.password !== user.password) {
            return res.status(404).json({
                error: true,
                message: 'Username or password is wrong',
            });
        }

        let token = generateToken(user);
        res.json({
            user: user,
            token: token
        });
    });
};