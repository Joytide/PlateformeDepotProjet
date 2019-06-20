'use strict';

const partner = require('../controllers/partnerController');
const auth = require('../controllers/authController');


module.exports = function (app) {
	app.route('/api/partner/reset')
		.post(partner.resetPassword)

	app.route('/api/partner/:id([a-fA-F0-9]{24})')
		.get(partner.findById)
		.post(partner.updatePartner)
		.delete(partner.deletePartner);

	app.route('/api/partner/:key([a-zA-Z0-9]{16})')
		.get(partner.findByKey);

	//Keep that route in last
	app.route('/api/partner/:email')
		.get(partner.findByMail);

	app.route('/api/partner')
		// Staff access only
		.get(auth.passport.authenticate('jwt'), partner.listAllPartners)
		.put(partner.createPartner)
		.post(auth.passport.authenticate('jwt'), auth.areAuthorized(["Partner"]), (req, res) => {
			res.send(req.user);
		});
};
