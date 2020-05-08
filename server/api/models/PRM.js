'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Person Class
const PRMSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    infos: {
        type: String,
        required: false
    },
    characteristics: {
        type: String,
        required: false
    },
    projectNumber: {
        type: Number,
        required: false,
        default: 0
    },
    keywords: [{
        type: Schema.Types.ObjectId,
        ref: 'Keyword'
    }],
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }]
});
const PRM = mongoose.model('PRM', PRMSchema);

module.exports = PRM;
