const yearController = require('../controllers/yearController');
const auth = require('../controllers/authController');

module.exports = (app) => {
    app.route('/api/year/:_id([a-zA-Z0-9]{24})')
        // Everybody can get a year by it's ID
        .get(yearController.findById);

    app.route('/api/year')
        // Everybody can get the complete list of years
        .get(yearController.list)
        // Only administrators can create a year
        .put(auth.passport.authenticate('jwt'), auth.areAuthorized("Administrator"), yearController.create)
        // Only administrators can delete a year
        .delete(auth.passport.authenticate('jwt'), auth.areAuthorized("Administrator"), yearController.delete)
        // Only administrators can update a year
        .post(auth.passport.authenticate('jwt'), auth.areAuthorized("Administrator"), yearController.update);
}