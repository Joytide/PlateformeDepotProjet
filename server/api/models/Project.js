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

const LastUpdateSchema = new Schema({
    by: {
        type: Schema.Types.ObjectId,
        ref: "Person",
        required: true
    },
    at: {
        type: Date
    }
})

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
    keywords: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Keyword'
        }
    ],
    status: {
        type: String,
        enum: ["validated", "rejected", "pending"],
        required: true,
        default: "pending"
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    lastUpdate: LastUpdateSchema,
    suggestedKeywords: String,
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
    number: String,
    maxTeams: {
        type: Number,
        default: 1,
        required: true
    },
    confidential: {
        type: Boolean,
        default: false,
        required: true
    }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;