const specializationController = require('../controllers/specializationController');

module.exports = (app) => {
    app.route('/api/specialization/:_id')
        .get(specializationController.findById);

    app.route('/api/specialization')
        .get(specializationController.list)
        .put(specializationController.create)
        .delete(specializationController.delete)
        .post(specializationController.update);
}