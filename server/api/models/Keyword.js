'use strict';

const mongoose = require('../helpers/mongo');
const Schema = mongoose.Schema;

//Comment Class
const KeywordSchema = new Schema({
    //name: String
    name: {
        fr: {
            type: String,
            required: true
        },
        en: {
            type: String,
            required: true
        }
    }
});
const Keyword = mongoose.model('Keyword', KeywordSchema);

module.exports = Keyword;