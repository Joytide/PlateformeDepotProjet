const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Comment = mongoose.model('Comment');
const Administration = mongoose.model('Administration');
const { isValidType, areValidTypes, ProjectNotFoundError, UserNotFoundError } = require('../../helpers/Errors');

exports.findProjectComment = ({ id }) =>
    new Promise((resolve, reject) => {
        isValidType(id, "id", "ObjectId")
            .then(() =>
                Comment
                    .find({ projectId: id })
                    .populate({
                        path: 'author',
                        select: "first_name last_name"
                    })
                    .sort('date')
                    .lean()
                    .exec()
            )
            .then(comments => resolve({ comments }))
            .catch(reject);
    });

exports.createComment = ({ id, content, author }) =>
    new Promise((resolve, reject) => {
        areValidTypes([id, content, author],
            ["id", "content", "author"],
            ["ObjectId", "string", "ObjectId"]
        )
            .then(() => {
                let projectCount = Project.estimatedDocumentCount({ _id: id }).exec();
                let authorCount = Administration.estimatedDocumentCount({ _id: author }).exec();

                return Promise.all([projectCount, authorCount])
            })
            .then(([projectCount, authorCount]) => {
                if (projectCount == 0)
                    throw new ProjectNotFoundError();
                if (authorCount == 0)
                    throw new UserNotFoundError();

                let comment = new Comment();
                comment.content = content;
                comment.author = author;
                comment.projectId = id;

                return comment.save();
            })
            .then(resolve)
            .catch(reject);
    });