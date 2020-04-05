'use strict';

const auth = require('../controllers/authController');
const { handleRequest } = require('../../helpers/Request');

module.exports = function (app) {
    /**
     * Return token partner depending on his key
     */
    app.route('/api/login/partner/')
        .post(handleRequest(auth.logPartner));

    /**
     * Connect user using email + password
     */
    app.route('/api/login/')
        .post(auth.passport.authenticate('login'),
            (req, res) => {
                res.send(req.user);
            });
};
