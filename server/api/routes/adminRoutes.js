'use strict';

const admin = require('../controllers/adminController');

module.exports = function (app) {
    app.route('/api/admin')
        .get(admin.list_all_admins)
        .post(admin.create_an_admin);

    app.route('/api/admin/:adminId')
        .put(admin.update_an_admin);

    /*app.route('/api/login')
        .post(admin.handle_login);*/
};
