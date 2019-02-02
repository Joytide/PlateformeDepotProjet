const yearController = require('../controllers/yearController');

module.exports = (app) => {
    app.route('/api/year/:_id([a-zA-Z0-9]{24})')
        .get(yearController.findById);

    app.route('/api/year')
        .get(yearController.list)
        .put(yearController.create)
        .delete(yearController.delete)
        .post(yearController.update);
}