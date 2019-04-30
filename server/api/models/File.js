'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Comment Class
const FileSchema = new Schema({
	projectID: {
		type: Schema.Types.ObjectId,
		ref: 'Project'
    },
    owner: {        
		type: Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    path: {
        type: String
    },
	date: {
		type: Schema.Types.Date,
		default: Date.now(),
		required: true
	}
});
const File = mongoose.model('File', FileSchema);

module.exports = File;