'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpecializationSchema = new Schema({
    specialization: {
        type: Schema.Types.ObjectId,
        ref: "Specialization",
        required: true
    },
    status: {
        type: String,
        enum: ["validated", "rejected", "pending"],
        required: true,
        default: "pending"
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "Administration"
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    specializations: [SpecializationSchema],
    study_year: [{
        type: Schema.Types.ObjectId,
        ref: "Year",
        required: true
    }], //(Number)
    keywords: {
        type: Array,
        required: true
    },  //(String)
    status: {
        type: String,
        enum: ["validated", "rejected", "pending"],
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
    skills: String,
    infos: String,
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
    pdf: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    number: String
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;