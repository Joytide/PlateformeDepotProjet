const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Comment Class
const CommentSchema = new Schema({
	id_project: {
		type: String
	},
	author: {
		type: PersonSchema,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	responses: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}
	] // CommentSchema
});
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;