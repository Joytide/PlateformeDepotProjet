'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Comment Class
const CommentSchema = new Schema({
	id_project: {
		type: Schema.Types.ObjectId,
        ref: 'Project',
		required: true
	},
	author: {
        type: Schema.Types.ObjectId,
        ref: 'Person',
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