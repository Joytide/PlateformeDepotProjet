const specializationController = require('../controllers/specializationController');

module.exports = (app) => {
    app.route('/api/specializations')
        .get(specializationController.listAll)
}