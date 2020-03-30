const partner = require('../controllers/partnerController');
const auth = require('../controllers/authController');
const { handleRequest } = require('../../helpers/Request');


module.exports = app => {
	app.route('/api/partner/reset')
		.post(handleRequest(partner.resetPassword));

	app.route('/api/partner/:id([a-fA-F0-9]{24})')
		.get(handleRequest(partner.findById))
		.put(handleRequest(partner.updatePartner));

	app.route('/api/partner/:key([a-zA-Z0-9]{16})')
		.get(handleRequest(partner.findByKey));

	app.route('/api/partner/:email')
		.get(handleRequest(partner.findByMail));

	app.route('/api/partner')
		.get(handleRequest(partner.getAll))
		.post(handleRequest(partner.createPartner));
};