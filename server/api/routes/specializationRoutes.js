const specializationController = require('../controllers/specializationController');

module.exports = (app) => {
    app.route('/api/specialization/:_id([a-zA-Z0-9]{24})')
        .get(specializationController.findById);

    app.route('/api/specialization')
        .get(specializationController.list)
        .put(specializationController.create)
        .delete(specializationController.delete)
        .post(specializationController.update);

    app.route('/api/specialization/referent')
        .put(specializationController.addReferent)
        .delete(specializationController.removeReferent);
}