'use strict';

const auth = require('../controllers/authController');

module.exports = function (app) {
    app.use(auth.passport.initialize());
    app.use(auth.passport.session());

    app.post('/api/login', auth.passport.authenticate('login'), (req,res) => {
        console.log(req.params);
        res.send(req.user);
    });

    app.post('/api/test', auth.passport.authenticate('jwt'), (req,res,next) => {
        req.test = "tzervezrvzerv";
        next('error');
    }, (req,res) => {
        console.log(req.test);
        res.send(req.user);
    });

    app.post('/api/partner', auth.passport.authenticate('jwt'), auth.areAuthorized(["Partner"]), (req,res) => {
        res.send(req.user);
    });
};
