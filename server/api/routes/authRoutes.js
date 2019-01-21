'use strict';

const auth = require('../controllers/authController');

module.exports = function (app) {
    app.post('/api/login/leoid', auth.passport.authenticate('login'), (req,res) => {
        console.log(req.params);
        res.send(req.user);
    });

    app.post('/api/login/partner/', auth.logPartner);

    app.post('/api/partner', auth.passport.authenticate('jwt'), auth.areAuthorized(["Partner"]), (req,res) => {
        console.log(req.headers)
        res.send(req.user);
    });
};
