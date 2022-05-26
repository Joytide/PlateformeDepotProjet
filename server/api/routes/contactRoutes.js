const contact = require('../controllers/contactController');
const auth = require('../controllers/authController');
const { handleRequest } = require('../../helpers/Request');


module.exports = app => {
	app.route('/api/contact')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("Administration"),
			handleRequest(contact.getAll)
		)
		.post(
			handleRequest(contact.createContact)
		)
};