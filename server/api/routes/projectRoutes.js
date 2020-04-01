'use strict';

const project = require('../controllers/projectController');
const auth = require('../controllers/authController');

const { MissingParameterError } = require('../../helpers/Errors');
const { handleRequest } = require('../../helpers/Request');

module.exports = function (app) {
	app.route('/api/project/file')
		.post(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Partner", "EPGE"]),
			project.upload.single("file"),
			project.uploadDone
		)
		.delete(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Partner", "EPGE"]),
			handleRequest(project.deleteFile)
		);

	app.route('/api/project/file/:id([a-fA-F0-9]{24})')
		.get(
			handleRequest(project.download_file)
		);

	app.route('/api/project/keyword')
		.post(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration"]),
			handleRequest(project.addKeyword)
		)
		.delete(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration"]),
			handleRequest(project.removeKeyword)
		);

	app.route('/api/project/stats')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.getStats)
		);

	app.route('/api/project/validation')
		.post(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.projectValidation)
		)
		.put(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.addSpecialization)
		);

	app.route('/api/project')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.listProjects)
		)
		.post(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("Partner"),
			handleRequest(project.createProject)
		)
		.put(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.update)
		);

	app.route('/api/project/:id([a-fA-F0-9]{24})/files')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.findByIdSelectFiles)
		);

	app.route('/api/project/:id([a-fA-F0-9]{24})/specializations')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.findByIdSelectSpecializations)
		);

	app.route('/api/project/:id([a-fA-F0-9]{24})')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE", "Partner"]),
			handleRequest(project.findById)
		)
		.put(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.update)
		)

	app.route('/api/project/csv')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.getCSV({ status: "validated" }))
		);

	app.route('/api/project/csv/full')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.getCSV())
		);

	app.route('/api/project/student')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.studentFolder)
		);
};

