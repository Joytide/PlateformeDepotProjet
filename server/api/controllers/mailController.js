'use strict';

const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Partner = mongoose.model('Partner');

const config = require('../../config');

const mailer = require('nodemailer');


const smtpTransporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mail.email,
        pass: config.mail.emailPass
    }
});

exports.sendMails = (request, response) => {
    const recipient = request.body.recipient;
    const subject = request.body.subject;
    const content = request.body.content;
    let mail = {
        from: config.mail.email,
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
    //console.log("req.body.email : " + req.body.email);
    //console.log("config.api.email : " + config.api.email);
    //console.log("config.api.emailPass : " + config.api.emailPass);

    if (req.body.email != undefined && req.body.email != '') {
        Partner.findOne({ 'email': req.body.email }, (err, partner) => {
            if (err)
                res.send(err);
            else if (partner) {
                const recipient = req.body.email;
                const subject = "URL d'édition des projets soumis sur DeVinci Plateforme."
                const link = `${config.client.protocol}://${config.client.hostname + (config.client.port != 80 && config.client.port != 443 ? ':' + config.client.port : '')}/Edit/${partner.key}`
                const content = `Bonjour ${partner.first_name} ${partner.last_name}, \nVoici le lien permettant d'éditer le(s) projet(s) que vous avez soumis: \n${link}`
                const mail = {
                    from: config.mail.email,
                    to: recipient,
                    subject: subject,
                    text: content // html content possible. ;)
                }

                res.send(mail);
                smtpTransporter.sendMail(mail, (err, res) => {
                    if (err) {
                        smtpTransporter.close();
                        console.log(err);
                        response.send(err);
                    } else {
                        smtpTransporter.close();
                        response.send('Mail sent');
                    }
                });
            } else {
                res.send(new Error('Not found'));
            }
        });
    } else {
        res.send(new Error('Missing email parameter'));
    }
};

exports.sendMail = data => {
    return new Promise((resolve, reject) => {
        if (data.recipient && data.subject && data.content) {
            let mail = {
                from: config.mail.email,
                to: data.recipient,
                subject: data.subject,
                text: data.content // html content possible. ;)
            }
            smtpTransporter.sendMail(mail, (err, res) => {
                smtpTransporter.close();
                if (err)
                    reject(err);
                else
                    resolve('Mail sent');
            });
        } else {
            reject(new Error("MissingParameters"));
        }
    });
}