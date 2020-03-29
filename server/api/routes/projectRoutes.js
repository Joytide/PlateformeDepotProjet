'use strict';

const project = require('../controllers/projectController');
const auth = require('../controllers/authController');

const { MissingParameterError } = require('../../helpers/Errors');

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
			project.deleteFile
		);

	app.route('/api/project/file/:id([a-fA-F0-9]{24})')
		.get(project.download_file);

	app.route('/api/project/keyword')
		.post(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration"]),
			project.addKeyword
		)
		.delete(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration"]),
			project.removeKeyword
		);

	app.route('/api/project/stats')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			project.getStats
		);

	app.route('/api/project/validation')
		.post(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			project.projectValidation
		)
		.put(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			project.addSpecialization
		);

	app.route('/api/projects')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			project.listProjects
		)
		.put(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized("Partner"),
			project.createProject
		)
		.post(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			project.update_a_project
		);

	app.route('/api/project/:projectId([a-fA-F0-9]{24})/files')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			(req, res, next) => {
				project
					.findByIdSelectFiles(req.params.projectId)
					.then(projectFiles => res.json(projectFiles))
					.catch(err => next(err));
			});

	app.route('/api/project/:projectId([a-fA-F0-9]{24})/specializations')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			(req, res, next) => {
				project
					.findByIdSelectSpecializations(req.params.projectId)
					.then(projectSpecializations => res.json(projectSpecializations))
					.catch(err => next(err));
			});

	app.route('/api/project/:projectId([a-fA-F0-9]{24})')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE", "Partner"]),
			project.findById
		)
		.post(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			project.update_a_project
		)
		.delete(project.delete_a_project);

	app.route('/api/project/like')
		.put(project.like)
		.delete(project.unlike);

	app.route('/api/project/csv')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			project.getCSV({ status: "validated" })
		);

	app.route('/api/project/csv/full')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			project.getCSV({})
		);

	app.route('/api/project/student')
		.get(
			auth.passport.authenticate('jwt'),
			auth.areAuthorized(["Administration", "EPGE"]),
			project.studentFolder
		);
/*
	app.route('/api/project/:title')
		.get(project.filter_by_name);*/

		// Fusionner cet fonctionnalité dans /api/project/file GET
	app.route('/api/project/download/:filename')
		.get(project.download_file);
};
// Créer un fichier statique regarder sur la doc express

