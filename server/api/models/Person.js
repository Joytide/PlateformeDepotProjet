'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Person Class
const PersonSchema = new Schema({
	first_name: {
		type: String,
		required: true
	},
	username: String, // Temporaire. Ne sera pas utilisé en prod
	password: String, // Temporaire. Ne sera pas utilisé en prod
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

//Partner Class
const PartnerSchema = new Schema({
	company: String,
	key: String,
	projects: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Project'
		}
	]
});
const Partner = Person.discriminator('Partner', PartnerSchema);

//Administration Class
const AdministrationSchema = new Schema({
	EPGE: Boolean,
	admin: {
		type: Boolean,
		default: false
	}
});
const Administration = Person.discriminator('Administration', AdministrationSchema);

module.exports = { Person, Student, Partner, Administration };
