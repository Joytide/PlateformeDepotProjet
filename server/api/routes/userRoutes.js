const userController = require('../controllers/userController');
const auth = require('../controllers/authController');
const { handleRequest } = require('../../helpers/Request');

module.exports = (app) => {
    app.route('/api/user/administration')
        .get(handleRequest(userController.listAdministration()));

    app.route('/api/user/EPGE')
        .get(handleRequest(userController.listAdministration({ EPGE: true })));

    app.route('/api/user/:id([a-fA-F0-9]{24})')
        .get(handleRequest(userController.findById));

    app.route('/api/user')
        .get(handleRequest(userController.list))
        .post(handleRequest(userController.create))
        //.delete(handleRequest(userController.delete))
        .put(handleRequest(userController.update));

    app.route('/api/user/me')
        .get(handleRequest(userController.myself));

    app.route('/api/user/isAdmin')
        .get(handleRequest(userController.isAdmin));

    app.route('/api/user/password')
        .post(handleRequest(userController.changePassword));
}