'use strict';
module.exports = function (app) {
  var major = require('../controllers/majorController');

  // todoList Routes
  app.route('/api/majors')
    .get(major.list_all_majors)
    .post(major.create_a_major);

  app.route('/api/majors/major/:major')
    .get(major.filter_by_major);

  /*app.route('/api/majors/:studyYear')
    .get(major.filter_by_year);*/


};