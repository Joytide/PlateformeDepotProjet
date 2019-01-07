const specializationController = require('../controllers/specializationController');

module.exports = (app) => {
    app.route('/api/specialization')
        .get(specializationController.list)
        .put(specializationController.create)
        .delete(specializationController.delete);
}