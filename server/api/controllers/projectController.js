'use strict';

var mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Partner = mongoose.model('Partner');
const PDFDocument = require('pdfkit');

const mailer = require('nodemailer');

const smtpTransporter = mailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'no.reply.projets.pulv@gmail.com',
    pass: 'vidududu'
  }
});


exports.list_all_projects = function (req, res) {
  Project.find({})
    .populate({ path: 'comments', populate: { path: 'responses' } })
    .exec(function (err, task) {
      if (err)
        res.send(err);
      console.log(task)
      res.json(task);
    });
};

exports.create_a_project = function (req, res) {
  let name;
  let editKey = generatePassword(15);

  let mail = {
    from: 'no.reply.projets.pulv@gmail.com',
    subject: 'Soumission d\'un projet',
    to: req.body.email
  };
  let json = req.body;
  json.edit_key = editKey;
  Partner.findOne({ email: req.body.email }, (err, partner) => {
    if (err) {
      res.send(err);
    }
    if (partner != null) {
      json.partner = partner;
      json.status = 'pending';
      var new_project = new Project(json);

      new_project.save(function (err, project) {
        if (err)
          res.send(err);
        else {
          name = partner.first_name;
          mail.text = `Bonjour ${name}, \n
          Votre demande de soumission a bien été enregistrée. \n 
          Voici votre lien pour l'éditer. \n
          http://localhost:3000/Edit/${editKey}`
          smtpTransporter.sendMail(mail, (err, result) => {
            if (err) {
              smtpTransporter.close();
              console.log(err);
              res.send(err);
            } else {
              res.send('Mail ok!');
              smtpTransporter.close();
            }
          });
        }
      });
    } else {
      let new_partner = new Partner({
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "company": req.body.company
      });

      new_partner.save((err, partner) => {
        if (err) {
          res.send(err);
        }
        else {
          json.partner = new_partner;
          json.status = 'pending';
          var new_project = new Project(json);
          new_project.save(function (err, project) {
            if (err)
              res.send(err);
            else {
              name = new_partner.first_name;
              mail.text = `Bonjour ${name}, \n
              Votre demande de soumission a bien été enregistrée. \n 
              Voici votre lien pour l'éditer. \n
              http://localhost:3000/Edit/${editKey}`
              smtpTransporter.sendMail(mail, (err, result) => {
                if (err) {
                  smtpTransporter.close();
                  console.log(err);
                  res.send(err);
                } else {
                  smtpTransporter.close();
                  res.send('Mail ok!');
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.read_a_project = (req, res) => {
  Project.findById(req.params.projectId)
    .populate('comments')
    .exec((err, project) => {
      if (err) {
        res.send(err);
      }
      res.json(project);
    });
}

exports.find_by_edit_key = (req, res) => {
  Project.findOne({ edit_key: req.params.editKey }, (err, project) => {
    if (err) {
      res.send(err);
    }
    res.json(project);
  });
}

exports.filter_by_name = (req,res) => {
  Project.find({"title": {'$regex' : '.*' + req.params.name + '.*'}}, (err, projects) => {
    // Search all the projects which have the substring "req.params.name" in their titles
    if (err) {
      res.send(err);
    }
    res.json(projects);
  });
}

exports.update_a_project = (req, res) => {
  Project.update({ _id: req.params.projectId }, req.body, { new: true }, (err, project) => {
    if (err) {
      res.send(err);
    }
    res.json(project);
  });
}

exports.delete_a_project = (req, res) => {
  Project.findByIdAndRemove(req.params.projectId, function (err, note) {
    if (err) {
      console.log(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).send({ message: "Project not found with id " + req.params.noteId });
      }
      return res.status(500).send({ message: "Could not delete project with id " + req.params.noteId });
    }

    if (!note) {
      return res.status(404).send({ message: "Project not found with id " + req.params.noteId });
    }

    res.send({ message: "Project deleted successfully!" });
  });
}

exports.export_a_project = (req, res) => {
  let doc = new PDFDocument;
  Project.findById(req.params.projectId)
    .exec((err, project) => {
      if (err) {
        res.send(err);
      }
      doc.pipe(res);
      doc.fontSize(15).text(project.title, 50, 50);
      doc.fontSize(11).text(`proposé par: ${project.partner.first_name} ${project.partner.last_name} - ${project.partner.company}`);
      doc.fontSize(11).text(`pour les étudiants: ${project.study_year.toString()}`);
      doc.fontSize(10).text(project.description, 50, 100);
      doc.end();
    });
}

exports.exports_all_projects = (req, res) => {
  let doc = new PDFDocument;
  Project.find({})
    .exec((err, projects) => {
      if (err) {
        res.send(err);
      }
      doc.pipe(res);
      projects.forEach((project, index) => {
        doc.fontSize(20).text(`Projet n°${index}`);
        doc.fontSize(15).text(project.title);
        doc.fontSize(11).text(`proposé par: ${project.partner.first_name} ${project.partner.last_name} - ${project.partner.company}`);
        doc.fontSize(11).text(`pour les étudiants: ${project.study_year.toString()}`);
        doc.fontSize(10).text(project.description);
        doc.addPage();
      });
      doc.end();
    });
}

exports.destroy = (req, res) => {
  Project.remove({}, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send('ok!');
    }
  });
}

function generatePassword(size) {
  let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let pass = "";
  for (let i = 0; i < size; i++) {
    pass += characters[randomInt(characters.length)];
  }
  return pass;
}

function randomInt(max) {
  return Math.floor(Math.random() * max - 1);
}