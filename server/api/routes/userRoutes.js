const userController = require('../controllers/userController');

module.exports = (app) => {
    app.route('/api/user')
        .get(userController.list)
        .put(userController.create)
        .delete(userController.delete);
}