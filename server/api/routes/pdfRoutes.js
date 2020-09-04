const pdfController = require('../controllers/pdfController');
const auth = require('../controllers/authController');

module.exports = (app) => {
    app.route('/api/pdf/')
        .post(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            pdfController.regeneratePDF
        );

    app.route('/api/pdf/regenerateAll')
        .get(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            pdfController.regenerateAllPDF
        );

    app.route('/api/pdf/all')
        .get(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
            pdfController.generateAllProjectsPDF
        );
};