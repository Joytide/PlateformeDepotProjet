'use strict';

const mail = require('../controllers/mailController');

module.exports = (app) => {
    // Impossible de laisser ça comme ça. Sinon tout le monde peut envoyer n'importe quoi depuis le compte mail
    /*app.route('/api/mail')
        .post(mail.sendMails);*/

    /*app.route('/api/mail/recover')
        .post(mail.retrieveEdit);*/
};