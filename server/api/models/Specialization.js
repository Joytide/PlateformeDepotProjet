'use strict';

const mongoose = require('mongoose');

const SpecializationSchema = mongoose.Schema({
    name: {
        fr: {
            type: String,
            required: true
        },
        en: {
            type: String,
            required: true
        }
    },
    description: {
        fr: {
            type: String,
            required: true
        },
        en: {
            type: String,
            required: true
        }
    },
    abbreviation: {
        type: String,
        required: true
    },
    referent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Administration'
        }
    ]
});

const Specialization = mongoose.model('Specialization', SpecializationSchema);

module.exports = Specialization;