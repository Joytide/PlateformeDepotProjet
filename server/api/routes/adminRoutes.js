'use strict';

module.exports = function (app) {
    var admin = require('../controllers/adminController');

    // todoList Routes
    app.route('/api/admin')
        .get(admin.list_all_admins)
        .post(admin.create_an_admin);

    app.route('/api/admin/:adminId')
        .put(admin.update_an_admin);

    app.route('/api/login')
        .post(admin.handle_login);
};
