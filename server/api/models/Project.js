'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    majors_concerned: [{
        type: Schema.Types.ObjectId,
        ref: "Specialization",
        required: true
    }],
    study_year: [{
        type: Schema.Types.ObjectId,
        ref: "Year",
        required: true
    }], //(Number)
    keywords: {
        type: Array,
        required: true
    },  //(String)
    media_files: Array, //(String)
    status: {
        type: String,
        required: true,
        default: "pending"
    },
    sub_date: {
        type: Date,
        default: Date.now
    },
    edit_date: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Partner'
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ], //(CommentSchema)
    partner: {
        type: Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
    },
    files: [
        {
            type: Schema.Types.ObjectId,
            ref: 'File',
        }
    ],
    number: String
})
const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;