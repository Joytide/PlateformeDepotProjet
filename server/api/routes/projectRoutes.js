'use strict';

const project = require('../controllers/projectController');

module.exports = function (app) {
  app.route('/api/projects')
    .get(project.listProjects)
    .get(project.filter_by_name)
    .post(project.createProject)
    .delete(project.destroy);

  app.route('/api/export')
    .get(project.exports_all_projects);

  app.route('/api/project/:projectId([a-fA-F0-9]{24})')
    .get(project.findById)
    .put(project.update_a_project)
    .delete(project.delete_a_project);

  /*app.route('/api/edit/:editKey')
    .get(project.find_by_edit_key);*/

  app.route('/api/export/:projectId')
    .get(project.export_a_project);

  app.route('/api/projects/:title')
    .get(project.filter_by_name);


};

