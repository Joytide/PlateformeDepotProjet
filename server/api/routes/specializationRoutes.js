const specializationController = require('../controllers/specializationController');
const auth = require('../controllers/authController');

module.exports = (app) => {
    app.route('/api/specialization/:_id([a-zA-Z0-9]{24})')
        .get(specializationController.findById);

    app.route('/api/specialization')
        .get(specializationController.list)
        .put(auth.passport.authenticate('jwt'), auth.areAuthorized("Administrator"), specializationController.create)
        .delete(auth.passport.authenticate('jwt'), auth.areAuthorized("Administrator"), specializationController.delete)
        .post(auth.passport.authenticate('jwt'), auth.areAuthorized("Administrator"), specializationController.update);

    app.route('/api/specialization/referent')
        .put(auth.passport.authenticate('jwt'), auth.areAuthorized("Administrator"), specializationController.addReferent)
        .delete(auth.passport.authenticate('jwt'), auth.areAuthorized("Administrator"), specializationController.removeReferent);
}