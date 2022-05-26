const contactController = require('../controllers/contactController');
const auth = require('../controllers/authController');
const { handleRequest, handleDownloadRequest } = require('../../helpers/Request');


module.exports = app => {
	app.route('/api/contact')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("Administration"),
			handleRequest(contactController.getAll)
		)
		.post(
			handleRequest(contactController.createContact)
		)
    app.route('/api/contact/csv')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("EPGE"),
			handleDownloadRequest(contactController.getCSVContacts({ status: "validated" }))
		);
};