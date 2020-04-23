'use strict';

const mongoose = require('mongoose');
const Partner = mongoose.model('Partner');

const config = require('../../config');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: config.mail.host,
	port: config.mail.port,
	secure: false,
	auth: {
		user: config.mail.user,
		pass: config.mail.pass
	}
});

/**
 * Send a mail to a partner with his connect URL
 * @param {Object} partner Partner's data containing his email
 * @param {string} key Key to connect 
 */
exports.partnerCreated = (partner, key) => {
	const connectUrl = config.client.protocol + "://" + config.client.host + ":" + config.client.port + "/login/partner/" + key;
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
	console.log("Sending partner link " + connectUrl)
	transporter.sendMail({
		from: config.mail.from,
		to: partner.email,
		subject: "Création de votre compte | Account creation",
		text: mailContent
	})
		.then(infos => console.log(infos))
		.catch(e => console.error(e));
};

/**
 * Inform partner that his project has been correctly submitted
 * @param {Object} partner Partner datas
 */
exports.projectSubmitted = partner => {
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

	transporter.sendMail({
		from: config.mail.from,
		to: partner.email,
		subject: "Soumission du projet réussie | Project successfuly submitted",
		text: mailContent
	})
		.then(infos => console.log(infos))
		.catch(e => console.error(e));
};

/**
 * Inform partner that his project has been accepted
 * @param {ObjectId} partnerId
 */
exports.projectValidated =  partnerId => {
	Partner.findById(partnerId, (err, partner) => {
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


			transporter.sendMail({
				from: config.mail.from,
				to: partner.email,
				subject: "Projet accepté | Project accepted",
				text: mailContent
			})
				.then(infos => console.log(infos))
				.catch(e => console.error(e));
		}
	});
};

/**
 * Inform partner that his project has been accepted
 * @param {ObjectId} partnerId
 */
exports.projectRefused = partnerId => {
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

			transporter.sendMail({
				from: config.mail.from,
				to: partner.email,
				subject: "Projet non accepté | Project not accepted",
				text: mailContent
			})
				.then(infos => console.log(infos))
				.catch(e => console.error(e));
		}
	});
};

/**
 * Send a new connection link to partner
 * @param {Object} partner Partner data containing email
 * @param {string} key New connection key
 */
exports.resetLink = (partner, key) => {
	const connectUrl = config.client.protocol + "://" + config.client.host + ":" + config.client.port + "/login/partner/" + key;
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

	transporter.sendMail({
		from: config.mail.from,
		to: partner.email,
		subject: "Nouveau lien de connexion | New log in link",
		text: mailContent
	})
		.then(infos => console.log(infos))
		.catch(e => console.error(e));
};

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