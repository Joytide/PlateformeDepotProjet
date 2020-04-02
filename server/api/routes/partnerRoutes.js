const partner = require('../controllers/partnerController');
const auth = require('../controllers/authController');
const { handleRequest } = require('../../helpers/Request');


module.exports = app => {
	app.route('/api/partner/reset')
		.post(handleRequest(partner.resetPassword));

	app.route('/api/partner/me')
		.get(
			auth.passport.authenticate('jwt'),
			handleRequest(partner.myself)
		)

	app.route('/api/partner/:id([a-fA-F0-9]{24})')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("Administration"),
			handleRequest(partner.findById)
		)
		.put(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("EPGE"),
			handleRequest(partner.updatePartner)
		);

	app.route('/api/partner/:key([a-zA-Z0-9]{16})')
		.get(handleRequest(partner.findByKey));

	app.route('/api/partner/:email')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("Administration"),
			handleRequest(partner.findByMail)
		);

	app.route('/api/partner')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("Administration"),
			handleRequest(partner.getAll)
		)
		.post(
			handleRequest(partner.createPartner)
		)
		.put(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("EPGE"),
			handleRequest(partner.updatePartner)
		);
};