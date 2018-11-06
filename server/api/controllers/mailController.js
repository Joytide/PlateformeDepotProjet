'use strict';

const mongoose = require('mongoose');
const Project = mongoose.model('Project');

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

exports.retrieveEdit = (request, response) => {
    Project.find({ 'partner.email': request.body.email }, (err, projects) => {
        if (err) {
            response.send(err);
        }
        const urls = projects.map((project) => `http://localhost:3000/Edit/${project.edit_key} \n`);
        const recipient = request.body.email;
        const subject = "URL d'édition des projets soumis sur DeVinci Plateforme."
        let content = `Bonjour ${projects[0].partner.first_name}, \nVoici les liens permettant d'éditer le(s) projet(s) que vous avez soumis: \n`
        urls.forEach((url) => { content += url });
        let mail = {
            from: 'no.reply.projets.pulv@gmail.com',
            to: recipient,
            subject: subject,
            text: content // html content possible. ;)
        }
        smtpTransporter.sendMail(mail, (err, res) => {
            if (err) {
                smtpTransporter.close();
                console.log(err);
                response.send('err');
            } else {
                smtpTransporter.close();
                response.send('Mail sent');
            }
        });
    });
};
