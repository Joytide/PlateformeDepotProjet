'use strict';

const comment = require('../controllers/commentController');
const auth = require('../controllers/authController');
const { handleRequest } = require('../../helpers/Request');


module.exports = function (app) {
    app.route('/api/comment/:id')
        .get(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("Administration"),
            handleRequest(comment.findProjectComment)
        );

    app.route('/api/comment')
        .post(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("Administration"),
            handleRequest(comment.createComment)
        );
};
