'use strict';

const project = require('../controllers/projectController');
const auth = require('../controllers/authController');

module.exports = function (app) {
	app.route('/api/project/file')
		.post(auth.passport.authenticate('jwt'), auth.areAuthorized(["Partner", "EPGE"]), project.upload.single("file"), project.uploadDone)
		.delete(auth.passport.authenticate('jwt'), auth.areAuthorized(["Partner", "EPGE"]), project.deleteFile);

	app.route('/api/project/keyword')
		.post(auth.passport.authenticate('jwt'), auth.areAuthorized(["Administration"]), project.addKeyword)
		.delete(auth.passport.authenticate('jwt'), auth.areAuthorized(["Administration"]), project.removeKeyword);

	app.route('/api/project/stats')
		.get(project.getStats);

	app.route('/api/project/file/:id([a-fA-F0-9]{24})')
		.get(project.download_file);

	app.route('/api/project/validation')
		.post(auth.passport.authenticate('jwt'), project.projectValidation)
		.put(auth.passport.authenticate('jwt'), project.addSpecialization);

	app.route('/api/projects')
		.get(auth.passport.authenticate('jwt'), project.listProjects)
		.put(auth.passport.authenticate('jwt'), auth.areAuthorized("Partner"), project.createProject)
		.post(auth.passport.authenticate('jwt'), auth.areAuthorized(["Administration"]), project.update_a_project);

	app.route('/api/project/:projectId([a-fA-F0-9]{24})/files')
		.get((req, res, next) => {
			project
				.findByIdSelectFiles(req.params.projectId)
				.then(projectFiles => res.json(projectFiles))
				.catch(err => next(err));
		});

	app.route('/api/project/:projectId([a-fA-F0-9]{24})/specializations')
		.get((req, res, next) => {
			project
				.findByIdSelectSpecializations(req.params.projectId)
				.then(projectSpecializations => res.json(projectSpecializations))
				.catch(err => next(err));
		});

	app.route('/api/project/:projectId([a-fA-F0-9]{24})')
		.get(project.findById)
		.post(auth.passport.authenticate('jwt'), auth.areAuthorized(["Administration"]), project.update_a_project)
		.delete(project.delete_a_project);

	app.route('/api/project/like')
		.put(project.like)
		.delete(project.unlike);

	app.route('/api/project/csv')
		.get(project.getCSV({ status: "validated" }));

	app.route('/api/project/csv/full')
		.get(project.getCSV({}));

	app.route('/api/project/student')
		.get(project.studentFolder);
	/*app.route('/api/edit/:editKey')
	  .get(project.find_by_edit_key);*/

	app.route('/api/project/:title')
		.get(project.filter_by_name);

	app.route('/api/project/download/:filename')
		.get(project.download_file);
};
// Créer un fichier statique regarder sur la doc express

