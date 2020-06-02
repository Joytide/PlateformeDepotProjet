'use strict';

const project = require('../controllers/projectController');
const auth = require('../controllers/authController');

const { MissingParameterError } = require('../../helpers/Errors');
const { handleRequest, handleDownloadRequest } = require('../../helpers/Request');

module.exports = function (app) {
	app.route('/api/project/file')
		.post(
			auth.passport.authenticate('jwt'),
			// W.I.P Referent only
			auth.areAuthorized(["Partner", "Administration", "EPGE"]),
			project.upload.single("file"),
			project.uploadDone
		)
		.delete(
			auth.passport.authenticate('jwt'),
			// W.I.P Referent only
			auth.areAuthorized(["Partner", "Administration", "EPGE"]),
			handleRequest(project.deleteFile)
		);

	app.route('/api/project/file/:id([a-fA-F0-9]{24})')
		.get(
			auth.passport.authenticate('jwt'),
			// Partner download own files only
			auth.areAuthorized(["Partner", "Administration", "EPGE"]),
			handleDownloadRequest(project.download_file)
		);

	app.route('/api/project/keyword')
		.post(
			auth.passport.authenticate('jwt'),
			// W.I.P Referent only
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.addKeyword)
		)
		.delete(
			auth.passport.authenticate('jwt'),
			// W.I.P Referent only
			auth.areAuthorized(["Administration", "EPGE"]),
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
			// W.I.P Referent only
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.projectValidation)
		)
		.put(
			auth.passport.authenticate('jwt'),
			// W.I.P Referent can only add his own specialization
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
			// W.I.P Referent only
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.update)
		);

	app.route('/api/project/all')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(['Administration']),
			handleRequest(project.listAllProjects)
		)

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
			// W.I.P Referent only
			auth.areAuthorized(["Administration", "EPGE"]),
			handleRequest(project.update)
		)

	app.route('/api/project/csv')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("EPGE"),
			handleDownloadRequest(project.getCSV({ status: "validated" }))
		);

	app.route('/api/project/csv/full')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("EPGE"),
			handleDownloadRequest(project.getCSV())
		);

	app.route('/api/project/student')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("EPGE"),
			handleDownloadRequest(project.studentFolder)
		);
};

