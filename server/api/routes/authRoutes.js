'use strict';

const auth = require('../controllers/authController');

module.exports = function (app) {
    app.post('/api/login/partner/', auth.logPartner);
    
    app.post('/api/login/', auth.passport.authenticate('login'), (req, res) => {
        res.send(req.user);
    });
};
