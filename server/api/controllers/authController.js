'use strict';

const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Person = mongoose.model('Person');
const Partner = mongoose.model('Partner');

const config = require('../../config.json');
const { UserNotFoundError } = require('../../helpers/Errors');

// Strategy pour log l'utilisateur avec son nom d'utilisateur & mot de passe.
// Si les identifiants sont bon. Alors on lui renvoie son token jwt pour
// s'authentifier sur les requêtes à l'API
passport.use('login', new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
},
    (username, password, done) => {
        Person
            .findOne({ email: username })
            .select("_id password")
            .lean()
            .exec((err, user) => {
                if (err) return done(err);
                else {
                    if (!user) {
                        return done(null, false, { message: "Incorrect username or password" });
                    } else {
                        bcrypt.compare(password, user.password, function (err, valid) {
                            if (err) return done(err);

                            if (valid) {
                                let userToken = jwt.sign(
                                    { id: user._id },
                                    config.jwt.secret,
                                    {
                                        expiresIn: 60 * 60 * 24
                                    }
                                );
                                return done(null, { token: userToken });
                            }
                            return done(null, false, { message: "Incorrect username or password" });
                        });
                    }
                }
            });
    }
));


// Strategy pour identifier l'utilisateur sur les éléments de l'API
passport.use('jwt', new JWTstrategy({
    //secret we used to sign our JWT
    secretOrKey: config.jwt.secret,
    //we expect the user to send the token as a query paramater with the name 'token'
    jwtFromRequest: req => {
        return req.headers.authorization;
    }
}, (token, done) => {
    let findPerson = Person.findOne({ _id: token.id }).lean().exec();
    let findPartner = Partner.findOne({ _id: token.id }).lean().exec();

    //Pass the user details to the next middleware
    Promise
        .all([findPerson, findPartner])
        .then(([person, partner]) => {
            if (person)
                done(null, person);
            else if (partner)
                done(null, partner);
            else
                done(new UserNotFoundError());
        })
        .catch(err => done(err));
}));

exports.logPartner = (req, res) => {
    if (req.body.key) {
        Partner.findOne({ key: req.body.key }, (err, partner) => {
            if (err) res.send(err);
            if (!partner)
                res.status(401).send({ type: "NotExisting" });
            else {
                let userToken = jwt.sign(
                    { id: partner._id },
                    config.jwt.secret,
                    {
                        expiresIn: 60 * 60 * 24
                    }
                );

                res.json({ token: userToken });
            }
        });
    } else {
        res.status(400).send({ message: "Missing key parameter", type: "MissingParameter" });
    }
}

exports.areAuthorized = authorized => (req, res, next) => {
    if (!req.user) {
        next(new Error('Unauthorized access'));
    } else {
        if (req.user.admin)
            next();
        else if (authorized.constructor === Array && authorized.indexOf(req.user.__t) != -1)
            next();
        else if (authorized.constructor === String && authorized === req.user.__t)
            next();
        else if (authorized.indexOf("EPGE") !== -1 && req.user.EPGE)
            next();
        else {
            let error = new Error('Unautorized access');
            error.status = 401;
            error.name = "Unauthorized";
            next(error);
        }

    }

}


passport.serializeUser(function (token, done) {
    done(null, token);
});

passport.deserializeUser(function (id, done) {
    User.findById({ _id: id }, function (err, user) {
        done(err, user);
    });
});

exports.passport = passport;