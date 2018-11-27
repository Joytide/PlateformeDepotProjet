'use strict';

const project = require('../controllers/projectController');

module.exports = function (app) {
  app.route('/api/projects')
    .get(project.list_all_projects)
    .post(project.create_a_project)
    .delete(project.destroy);

  app.route('/api/export')
    .get(project.exports_all_projects);

  app.route('/api/projects/:projectId')
    .get(project.read_a_project)
    .put(project.update_a_project)
    .delete(project.delete_a_project);

  app.route('/api/edit/:editKey')
    .get(project.find_by_edit_key);

  app.route('/api/export/:projectId')
    .get(project.export_a_project);

  app.route('/api/projects/:title')
    .get(project.find_by_name);


  // app.route('/tasks/:taskId')
  //   .get(todoList.read_a_task)
  //   .put(todoList.update_a_task)
  //   .delete(todoList.delete_a_task);
};
