const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Comment = mongoose.model('Comment');

const partnerController = require('./partnerController');
const bcryptConf = require('../../config.json').bcrypt;

exports.findProjectComment = (req, res, next) => {
    const data = req.params;

    Project.findById(data.id, (err, project) => {
        if (err)
            next(err);
        else if (project) {
            Comment
                .find({ _id: project.comments })
                .populate('author')
                .exec((err, comments) => {
                    if (err) next(err);
                    else res.send(comments);
                });
        } else {
            next(new Error("Project not found"));
        }
    });
}

// Changer le comportement de la fonction. Verifier que le project id correspond à un projet existant
// Puis créer le comment puis mettre à jour le projet
exports.createComment = (req, res, next) => {
    const data = req.body;

    if (data.id && data.author && data.content) {
        let comment = new Comment();
        comment.author = req.user._id;
        comment.content = data.content;
        comment.projectID = data.id;

        comment.save((err, savedComment) => {
            if (err) next(err);
            else {
                Project.update({ _id: savedComment.projectID }, { $push: { comments: savedComment._id } }, (err, project) => {
                    if (err) next(err);
                    else res.send(savedComment);
                });
            }
        });
    }
    else {
        next(new Error("MissingParameter"));
    }
}