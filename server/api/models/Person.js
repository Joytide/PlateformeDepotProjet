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
});
const Student = Person.discriminator('Student', StudentSchema);

//Administration Class
const AdministrationSchema = new Schema({
	EPGE: {
		type: Boolean,
		default: false
	},
	admin: {
		type: Boolean,
		default: false
	},
	password: {
		required: true,
		type: String,
		minlength: 60,
		maxlength: 60
	}
});
const Administration = Person.discriminator('Administration', AdministrationSchema);

//Partner Class
const PartnerSchema = new Schema({
	__t: {
		type: String,
		default: "Partner",
		required: true
	},
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
	company: String,
	key: String,
	projects: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Project'
		}
	]
});
const Partner = mongoose.model('Partner', PartnerSchema);

module.exports = { Person, Student, Partner, Administration };
