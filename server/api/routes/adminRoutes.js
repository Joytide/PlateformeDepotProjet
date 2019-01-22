'use strict';

// NON UTILISE POUR LE MOMENT. LE CONTROLLER N'EST PAS CHARGÉ DANS APP.JS

const admin = require('../controllers/adminController');

module.exports = function (app) {
    console.log("Loading admin routes");
    /*app.route('/api/admin')
        .get(admin.list_all_admins)
        .post(admin.create_an_admin);

    app.route('/api/admin/:adminId')
        .put(admin.update_an_admin);*/

    /*app.route('/api/login')
        .post(admin.handle_login);*/

    /*app.route('/api/admin/user')
        .get(admin.listUsers);*/
};
