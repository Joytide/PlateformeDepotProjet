'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Comment Class
const CommentSchema = new Schema({
	projectID: {
		type: Schema.Types.ObjectId,
        ref: 'Project',
		required: true
	},
	author: {
        type: Schema.Types.ObjectId,
        ref: 'Administration',
		required: true
	},
	content: {
		type: String,
		required: true
	}
});
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;