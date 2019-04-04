'use strict';

const project = require('../controllers/projectController');
const auth = require('../controllers/authController');

module.exports = function (app) {
	app.route('/api/project/file')
		.post(auth.passport.authenticate('jwt'), project.upload.single("file"), project.uploadDone);

	app.route('/api/project/file/:id([a-fA-F0-9]{24})')
		.get(project.download_file)

	app.route('/api/projects')
		.get(project.listProjects)
		.put(auth.passport.authenticate('jwt'), auth.areAuthorized("Partner"), project.createProject)
		.post(project.update_a_project);

	app.route('/api/export')
		.get(project.exports_all_projects);

	app.route('/api/project/:projectId([a-fA-F0-9]{24})')
		.get(project.findById)
		.post(project.update_a_project)
		.delete(project.delete_a_project);

	app.route('/api/project/like')
		.put(project.like)
		.delete(project.unlike);

	/*app.route('/api/edit/:editKey')
	  .get(project.find_by_edit_key);*/

	app.route('/api/export/:projectId')
		.get(project.export_a_project);

	app.route('/api/project/:title')
		.get(project.filter_by_name);

	app.route('/api/project/download/:filename')
		.get(project.download_file);
};
// Créer un fichier statique regarder sur la doc express

