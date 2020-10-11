'use strict';

const team = require('../controllers/teamController');
const auth = require('../controllers/authController');

const { handleRequest, handleDownloadRequest } = require('../../helpers/Request');

module.exports = function (app) {
	app.route('/api/team')
		.post(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
			handleRequest(team.create)
		)
		.get(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
			handleRequest(team.list)
		)

	app.route('/api/team/prm')
		.post(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
			handleRequest(team.setPRM)
		)

	app.route('/api/team/correspondence')
		.get(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
			handleRequest(team.correspondance)
		)

	app.route('/api/team/csv')
		.get(
            auth.passport.authenticate('jwt'),
            auth.areAuthorized("EPGE"),
			handleDownloadRequest(team.exportCSV)
		)
};

