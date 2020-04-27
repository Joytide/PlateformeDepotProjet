'use strict';

const prm = require('../controllers/prmController');
const auth = require('../controllers/authController');

const { handleRequest } = require('../../helpers/Request');

module.exports = function (app) {
	app.route('/api/prm')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("Administrator"),
			handleRequest(prm.list)
		)
		.post(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("Administrator"),
			handleRequest(prm.create)
		)
		.put(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("Administrator"),
			handleRequest(prm.update)
		);

	app.route('/api/prm/keyword')
		.post(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("Administrator"),
			handleRequest(prm.addKeyword)
		)
		.delete(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("Administrator"),
			handleRequest(prm.removeKeyword)
		);

};

