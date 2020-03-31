const specializationController = require('../controllers/specializationController');
const auth = require('../controllers/authController');
const { handleRequest } = require('../../helpers/Request');

module.exports = (app) => {
    app.route('/api/specialization/:_id([a-zA-Z0-9]{24})')
        .get(handleRequest(specializationController.findById));

    app.route('/api/specialization')
        .get(handleRequest(specializationController.list))
        .put(auth.passport.authenticate('jwt'), auth.areAuthorized("Administrator"), handleRequest(specializationController.create))
        .delete(auth.passport.authenticate('jwt'), auth.areAuthorized("Administrator"), handleRequest(specializationController.delete))
        .post(auth.passport.authenticate('jwt'), auth.areAuthorized("Administrator"), handleRequest(specializationController.update));

    app.route('/api/specialization/referent')
        .put(auth.passport.authenticate('jwt'), auth.areAuthorized("Administrator"), handleRequest(specializationController.addReferent))
        .delete(auth.passport.authenticate('jwt'), auth.areAuthorized("Administrator"), handleRequest(specializationController.removeReferent));
}