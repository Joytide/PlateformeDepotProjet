'use strict';

const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const Person = mongoose.model('Person');

passport.use('login', new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
},
    (username, password, done) => {
        Person.findOne({ username: username, password: password }, (err, user) => {
            if (err) return done(err);
            if (!user) {
                return done(null, false, { message: "Incorrect username or password" });
            } else {
                return done(null, user);
            }
        });
    }
));

passport.use('jwt', new JWTstrategy({
    //secret we used to sign our JWT
    secretOrKey: 'top_secret',
    //we expect the user to send the token as a query paramater with the name 'token'
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('token')
}, async (token, done) => {
    try {
        //Pass the user details to the next middleware
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));

passport.serializeUser(function (user, done) {
    console.log(user);
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    console.log(id);
    User.findById({ _id: id }, function (err, user) {
        done(err, user);
    });
});

exports.login = (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, passportUser, info) => {
        if (err) {
            return next(err);
        }

        if (passportUser) {
            const user = passportUser;

            return res.json({ user: user });
        }

        return status(400).info;
    })(req, res, next);
}

exports.passport = passport;