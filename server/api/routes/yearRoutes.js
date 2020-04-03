const yearController = require('../controllers/yearController');
const auth = require('../controllers/authController');
const { handleRequest } = require('../../helpers/Request');

module.exports = (app) => {
    app.route('/api/year/:id([a-zA-Z0-9]{24})')
        .get(handleRequest(yearController.findById));

    app.route('/api/year')
        .get(handleRequest(yearController.list))
        .post(handleRequest(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            yearController.create)
        )
        .delete(handleRequest(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            yearController.delete)
        )
        .put(handleRequest(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            yearController.update)
        );
}