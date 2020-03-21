'use strict';

const mongoose = require('mongoose');
const Partner = mongoose.model('Partner');
const { emitter } = require('../../eventsCommon');

const config = require('../../config');

const mailer = require('nodemailer');

const smtpTransporter = mailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: false,
    auth: {
        user: config.mail.user,
        pass: config.mail.pass
    }
});

emitter.on("partnerCreated", data => {
    const connectUrl = config.client.protocol + "://" + config.client.host + ":" + config.client.port + "/login/partner/" + data.key;
    const mailContent = `Bienvenue sur la plateforme de dépôts de projets ESILV,

La création de votre compte a bien été prise en compte et vous pouvez dorénavant déposer un projet sur la plateforme.

Ce lien vous permettra de vous connecter à la plateforme : ${connectUrl}
En vous connectant à la plateforme, vous pourrez déposer de nouveaux projets ou regarder l'état des projets déjà déposés.

Si vous rencontrez un problème à la plateforme, vous pouvez nous contacter à l'adresse projetesilv@devinci.fr

Cordialement,
L'équipe gestion de projets ESILV

_________________________________________________________________________________________________________________________

Welcome on ESILV's project deposit platform,

Your account has been successfuly created and you can now submit a project on the platform.

This link will allow you to connect on the platform : ${connectUrl}
By connecting to the platform, you can submit new projects or check if the one you have already submitted have been approuved

If you encounter a problem, you can contact us at projetesilv@devinci.fr

Sincerely yours,
ESILV's projects management team`;

    sendMail({
        recipient: data.partner.email,
        subject: "Création de votre compte | Account creation",
        content: mailContent
    }).catch(console.error);
});

emitter.on("projectSubmitted", data => {
    const mailContent = `
Bonjour,

Votre projet a bien été déposé sur la plateforme. Vous pouvez a tout moment vous connecter sur la plateforme pour suivre l'état de votre projet.

Cordialement,
L'équipe gestion de projets ESILV

_________________________________________________________________________________________________________________________

Hello,

Your project has been successfuly submitted on the platform. You can check the status of your project at anytime by connecting to the platform.

Sincerely yours,
ESILV's projects management team`;

    sendMail({
        recipient: data.partner.email,
        subject: `Soumission du projet réussie | Project successfuly submitted`,
        content: mailContent
    }).catch(console.error);
});

emitter.on("projectValidated", data => {
    Partner.findById(data.partnerId, (err, partner) => {
        if (err) console.error(err);
        else {
            const mailContent = `
Bonjour,

Nous avons le plaisir de vous informer que votre projet a été retenu et sera donc proposé aux étudiants.

Cordialement,
L'équipe gestion de projets ESILV

_________________________________________________________________________________________________________________________

Hello,

We are pleased to tell you that your project has been accepted and will therefore be proposed to students.

Sincerely yours,
ESILV's projects management team`;

            sendMail({
                recipient: partner.email,
                subject: `Projet accepté | Project accepted`,
                content: mailContent
            }).catch(console.error);
        }
    });
});

emitter.on("projectRejeted", partnerId => {
    Partner.findById(partnerId, (err, partner) => {
        if (err) console.error(err);
        else {
            const mailContent = `
Bonjour,

Malheureusement, votre projet n'a pas été retenu.

Cordialement,
L'équipe gestion de projets ESILV

_________________________________________________________________________________________________________________________

Hello,

Sadly, your project hasn't been retained.

Sincerely yours,
ESILV's projects management team`;

            sendMail({
                recipient: partner.email,
                subject: `Projet non accepté | Project not accepted`,
                content: mailContent
            }).catch(console.error);
        }
    });
});

emitter.on("resetLink", data => {
    const connectUrl = config.client.protocol + "://" + config.client.host + ":" + config.client.port + "/login/partner/" + data.key;
    const mailContent = `
Bonjour,

Voici le nouveau lien vous permettant de vous connecter à la plateforme de dépôt de projet de l'ESILV : ${connectUrl}

Cordialement,
L'équipe gestion de projets ESILV

_________________________________________________________________________________________________________________________

Hello,

This is the new link to log in to the project's submission platform of ESILV : ${connectUrl}

Sincerely yours,
ESILV's projects management team`;

    sendMail({
        recipient: data.partner.email,
        subject: "Nouveau lien de connexion | New log in link",
        content: mailContent
    });
});
/*
exports.retrieveEdit = (req, res) => {
    if (req.body.email != undefined && req.body.email != '') {
        Partner.findOne({ 'email': req.body.email }, (err, partner) => {
            if (err)
                res.send(err);
            else if (partner) {
                const recipient = req.body.email;
                const subject = "URL d'édition des projets soumis sur DeVinci Plateforme."
                const link = `${config.client.protocol}://${config.client.hostname + (config.client.port != 80 && config.client.port != 443 ? ':' + config.client.port : '')}/Edit/${partner.key}`
                const content = `
                Bonjour ${partner.first_name} ${partner.last_name} (${partner.company}), \n
                Pour modifier votre projet, veuillez contacter l'administration à l'adresse mail suivante : berengere.branchet@devinci.fr \n
                L'équipe DVP
                `
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
};*/

const sendMail = data => {
    return new Promise((resolve, reject) => {
        if (data.recipient && data.subject && data.content) {
            let mail = {
                from: config.mail.from,
                to: data.recipient,
                subject: data.subject,
                text: data.content // html content possible. ;)
            }
            smtpTransporter.sendMail(mail, (err, res) => {
                smtpTransporter.close();
                if (err)
                    reject(err);
                else
                    resolve('MailSent');
            });
        } else {
            reject(new Error("MissingParameters"));
        }
    });
}

exports.sendMail = sendMail;