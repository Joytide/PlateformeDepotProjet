'use strict';

const pdfController = require('../controllers/pdfController');

module.exports = (app) => {
    app.route('/api/pdf/')
        .post(pdfController.regeneratePDF);
        
    app.route('/api/pdf/all')
        .get(pdfController.generateAllProjectsPDf);
};