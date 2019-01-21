const userController = require('../controllers/userController');

module.exports = (app) => {
    app.route('/api/user/administration')
        .get(userController.listAdministration);
        
    app.route('/api/user/EPGE')
        .get(userController.listEPGE);

    app.route('/api/user/:id([a-fA-F0-9]{24})')
        .get(userController.findById);

    app.route('/api/user')
        .get(userController.list)
        .put(userController.create)
        .delete(userController.delete)
        .post(userController.update);

}