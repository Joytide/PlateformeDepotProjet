'use strict';

const comment = require('../controllers/commentController');
const auth = require('../controllers/authController');


module.exports = function (app) {
    app.route('/api/comment/:id')
        .get(comment.findProjectComment);

    app.route('/api/comment')
        .post(comment.createComment);
};
