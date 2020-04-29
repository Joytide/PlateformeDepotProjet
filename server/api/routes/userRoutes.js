const userController = require('../controllers/userController');
const auth = require('../controllers/authController');
const { handleRequest } = require('../../helpers/Request');

module.exports = (app) => {
    app.route('/api/user/administration')
        .get(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(userController.listAdministration())
        );

    app.route('/api/user/EPGE')
        .get(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            handleRequest(userController.listAdministration({ EPGE: true }))
        );

    app.route('/api/user/:id([a-fA-F0-9]{24})')
        .get(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized(["Administration", "EPGE"]),
            handleRequest(userController.findById)
        );

    app.route('/api/user')
        .get(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("Administration"),
            handleRequest(userController.list)
        )
        .post(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("Administrator"),
            handleRequest(userController.create)
        )
        .put(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("Administrator"),
            handleRequest(userController.update)
        );

    app.route('/api/user/me')
        .get(
            auth.passport.authenticate('jwt'),
            handleRequest(userController.myself)
        );

    app.route('/api/user/isAdmin')
        .get(
            auth.passport.authenticate('jwt'),
            handleRequest(userController.isAdmin)
        );

    app.route('/api/user/password')
        .put(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("Administration"),
            handleRequest(userController.changePassword)
        );
}