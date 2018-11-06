'use strict';
module.exports = function (app) {
  var partner = require('../controllers/partnerController');

  // todoList Routes
  app.route('/api/partners')
    .get(partner.list_all_partners)
    .post(partner.create_a_partner);

  app.route('/api/partners/:partnerId')
    .put(partner.update_a_partner)
    .delete(partner.delete_a_partner);

  app.route('/api/partners/:email')
    .get(partner.find_by_mail);
};
