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
        .post(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(specializationController.create)
        )
        .put(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(specializationController.update)
        )
        .delete(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(specializationController.delete)
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