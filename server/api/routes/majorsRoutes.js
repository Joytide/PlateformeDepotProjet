'use strict';

const major = require('../controllers/majorController');

module.exports = function (app) {
  app.route('/api/majors')
    .get(major.list_all_majors)
    .post(major.create_a_major);

  app.route('/api/majors/major/:major')
    .get(major.filter_by_major);
};