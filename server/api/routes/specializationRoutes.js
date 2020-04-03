const specializationController = require('../controllers/specializationController');
const auth = require('../controllers/authController');
const { handleRequest } = require('../../helpers/Request');

module.exports = (app) => {
    app.route('/api/specialization/:id([a-zA-Z0-9]{24})')
        .get(
            handleRequest(specializationController.findById)
        );

    app.route('/api/specialization')
        .get(
            handleRequest(specializationController.list)
        )
        .put(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(specializationController.create)
        )
        .delete(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(specializationController.delete)
        )
        .post
        (auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(specializationController.update)
        );

    app.route('/api/specialization/referent')
        .post(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(specializationController.addReferent)
        )
        .delete(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(specializationController.removeReferent)
        );
}