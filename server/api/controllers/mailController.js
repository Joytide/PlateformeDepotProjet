'use strict';

const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Partner = mongoose.model('Partner');

const config = require('../../config');

const mailer = require('nodemailer');
const smtpTransporter = mailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'no.reply.projets.pulv@gmail.com',
        pass: 'vidududu'
    }
});

exports.sendMails = (request, response) => {
    const recipient = request.body.recipient;
    const subject = request.body.subject;
    const content = request.body.content;
    let mail = {
        from: 'no.reply.projets.pulv@gmail.com',
        to: recipient,
        subject: subject,
        text: content // html content possible. ;)
    }
    smtpTransporter.sendMail(mail, (err, res) => {
        if (err) {
            smtpTransporter.close();
            response.send(err);
        } else {
            smtpTransporter.close();
            response.send('Mail sent');
        }
    });
};

exports.retrieveEdit = (req, res) => {
    if (req.body.email != undefined) {
        Partner.findOne({ 'email': req.body.email }, (err, partner) => {
            if (err)
                res.send(err);
            else if(partner) {
                const recipient = req.body.email;
                const subject = "URL d'édition des projets soumis sur DeVinci Plateforme."
                const link = `${config.client.protocol}://${config.client.hostname + (config.client.port != 80 && config.client.port != 443 ? ':' + config.client.port : '')}/Edit/${partner.key}`
                const content = `Bonjour ${partner.first_name} ${partner.last_name}, \nVoici le lien permettant d'éditer le(s) projet(s) que vous avez soumis: \n${link}`
                const mail = {
                    from: 'no.reply.projets.pulv@gmail.com',
                    to: recipient,
                    subject: subject,
                    text: content // html content possible. ;)
                }

                res.send(mail);
                /*smtpTransporter.sendMail(mail, (err, res) => {
                    if (err) {
                        smtpTransporter.close();
                        console.log(err);
                        response.send(err);
                    } else {
                        smtpTransporter.close();
                        response.send('Mail sent');
                    }
                });*/
            } else {
                res.send(new Error('Not found'));
            }
        });
    } else {
        res.send(new Error('Missing email parameter'));
    }
};
