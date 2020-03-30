const yearController = require('../controllers/yearController');
const auth = require('../controllers/authController');
const {handleRequest} = require('../../helpers/Request');

module.exports = (app) => {
    app.route('/api/year/:_id([a-zA-Z0-9]{24})')
        // Everybody can get a year by it's ID
        .get(handleRequest(yearController.findById));

    app.route('/api/year')
        // Everybody can get the complete list of years
        .get(handleRequest(yearController.list))
        // Only administrators can create a year
        .put(handleRequest(yearController.create))
        // Only administrators can delete a year
        .delete(handleRequest(yearController.delete))
        // Only administrators can update a year
        .post(handleRequest(yearController.update));
}