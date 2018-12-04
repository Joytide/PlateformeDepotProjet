'use strict';

const partner = require('../controllers/partnerController');

module.exports = function (app) {
  app.route('/api/partners')
    .get(partner.listPartners);

  app.route('/api/partners/:partnerId([a-fA-F0-9]{24})')
    .post(partner.updatePartner)
    .delete(partner.deletePartner);

  app.route('/api/partners/:email')
    .get(partner.findByMail);
};
