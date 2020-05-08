'use strict';

const team = require('../controllers/teamController');
const auth = require('../controllers/authController');

const { handleRequest } = require('../../helpers/Request');

module.exports = function (app) {
	app.route('/api/team')
		.post(
			handleRequest(team.create)
		)
		.get(
			handleRequest(team.list)
		)

	app.route('/api/team/prm')
		.post(
			handleRequest(team.setPRM)
		)

	app.route('/api/team/correspondence')
		.get(
			handleRequest(team.correspondance)
		)
};

