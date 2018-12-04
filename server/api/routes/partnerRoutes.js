'use strict';

const partner = require('../controllers/partnerController');

module.exports = function (app) {
  app.route('/api/partners')
    .get(partner.list_all_partners);

  app.route('/api/partners/:partnerId')
    .put(partner.update_a_partner)
    .delete(partner.delete_a_partner);

  app.route('/api/partners/:email')
    .get(partner.find_by_mail);
};
