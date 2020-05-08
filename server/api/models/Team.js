'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Person Class
const TeamSchema = new Schema({
    year: {
        type: Number,
        required: true
    },
    teamNumber: {
        type: Number,
        required: true
    },
    prm: {
        type: Schema.Types.ObjectId,
        ref: 'PRM'
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    }
});
const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;
