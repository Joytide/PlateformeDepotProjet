'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Person Class
const PersonSchema = new Schema({
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
	}
});
const Person = mongoose.model('Person', PersonSchema);

//Student Class
const StudentSchema = new Schema({
	id_specialization: {
		type: Schema.Types.ObjectId,
        ref: 'Specialization',
		required: true
	},
	study_year: {
		type: Number,
		required: true
	}
});
const Student = Person.discriminator('Student', StudentSchema);

//Partner Class
const PartnerSchema = new Schema({
	company: String
});
const Partner = Person.discriminator('Partner', PartnerSchema);

//Administration Class
const AdministrationSchema = new Schema({
	id_specialization: {
		type: Schema.Types.ObjectId,
        ref: 'Specialization',
		required: true
	},
	password: {
		type: String,
		required: true
	}
});
const Administration = Person.discriminator('Administration', AdministrationSchema);

module.exports = { Student, Partner, Administration };
