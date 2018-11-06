const comments = require('../controllers/commentController');

module.exports = function (app) {
    app.route('/api/projects/:projectId/comments')
        .post(comments.ask_a_question)
    
    app.route('/api/projects/comment/:commentId/responses')
        .get(comments.get_responses)
        .post(comments.give_a_response)

    app.route('/api/comments/:commentId')
    .get(comments.comments)
}