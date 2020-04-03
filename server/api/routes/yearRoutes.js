const yearController = require('../controllers/yearController');
const auth = require('../controllers/authController');
const { handleRequest } = require('../../helpers/Request');

module.exports = (app) => {
    app.route('/api/year/:id([a-zA-Z0-9]{24})')
        .get(handleRequest(yearController.findById));

    app.route('/api/year')
        .get(
            handleRequest(yearController.list)
        )
        .post(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(yearController.create)
        )
        .delete(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(yearController.delete)
        )
        .put(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(yearController.update)
        );
}