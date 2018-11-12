'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpecializationSchema = new Schema({
    school_name: {
        type: String,
        required: true
    },
    major_name: {
        type: String,
        required: true
    },
    referent: {
        type: String,
        required: true
    }
});
const Specialization = mongoose.model('Specialization', SpecializationSchema);

module.exports = Specialization;