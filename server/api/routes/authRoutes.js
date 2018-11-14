'use strict';

const auth = require('../controllers/authController');

module.exports = function (app) {
    app.use(auth.passport.initialize());
    app.use(auth.passport.session());

    app.post('/api/login', auth.passport.authenticate('local'), (req,res) => {
        res.send(req.user);
    });
};
