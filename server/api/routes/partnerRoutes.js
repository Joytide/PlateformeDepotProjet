'use strict';

const partner = require('../controllers/partnerController');

module.exports = function (app) {
	app.route('/api/partner')
		.get(partner.listPartners);


	app.route('/api/partner/:id([a-fA-F0-9]{24})')
		.get(partner.findById)
		.post(partner.updatePartner)
		.delete(partner.deletePartner);

	app.route('/api/partner/:key([a-zA-Z0-9]{16})')
		.get(partner.findByKey);
		
	//Keep that route in last
	app.route('/api/partner/:email')
		.get(partner.findByMail);
};
