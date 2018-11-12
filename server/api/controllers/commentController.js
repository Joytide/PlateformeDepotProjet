'use strict';

var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
const Project = mongoose.model('Project');
const Partner = mongoose.model('Partner');

exports.list_all_comments = function (req, res) {
  const projectId = req.params.projectID;
  Partner.find({ 'id_project': projectId })
    .populate('responses')
    .exec(function (err, partner) {
      if (err)
        res.send(err);
      res.json(partner);
    });
};

exports.comments = function (req, res) {
  console.log("passed");
  Comment.find({ _id: req.params.commentId }, (err, comments) => {
    if (err) res.send(err)
    else { res.send(comments) }
  });
}

exports.get_responses = (req, res) => {
  Comment.findById(req.params.commentId, (err, comment) => {
    if (err) res.send(err);
    else {
      var answers = { answers: [] };
      comment.responses.forEach(response => {
        answers.answers.push(response);
      });
      res.send(JSON.stringify(answers));
    }
  });
}

exports.give_a_response = (req, res) => {
  console.log(req.body.content);
  console.log(req.params.commentId);
  Partner.findById(req.body.userId)
    .then((result) => {
      var user = result
      let new_comment = new Comment({
        "_id": new mongoose.Types.ObjectId(),
        "author": user,
        "content": req.body.content,
        "id_project": req.body.id_project
      });

      new_comment.save((err, comment) => {
        if (err) {
          res.send(err);
          console.log(err);
        } else {
          console.log(req.params.commentId);

          Comment.findById(req.params.commentId)
            .populate('responses')
            .exec((err, comment) => {
              console.log("test :" + comment)
            });

          Comment.findOneAndUpdate({ _id: req.params.commentId }, { $push: { responses: new_comment._id } }, (err, comment) => {
            console.log("New comment :" + comment);
            res.send(comment)
          });
        }
      });
    });
}


exports.ask_a_question = (req, res) => {
  var id_project = req.params.projectId;
  var content = req.body.content;
  console.log("PROJECT ID" + id_project);
  console.log(content);
  console.log(req.body.userId);

  Partner.findById(req.body.userId)
    .then((result) => {
      console.log(result)
      var user = result
      let new_comment = new Comment({
        "_id": new mongoose.Types.ObjectId(),
        "id_project": id_project,
        "author": user,
        "content": content,
      });

      new_comment.save((err, comment) => {
        if (err) {
          res.send(err);
          console.log(err);
        }
        else {
          Project.update({ _id: id_project }, { $push: { comments: new_comment._id } }, { new: true })
            .exec((err, project) => {
              res.send(project);
            });
        }
      });
    });
}