/*
  The permitted SchemaTypes are

String
Number
Date
Buffer
Boolean
Mixed
ObjectId
Array
});

*/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Person Class
var PersonSchema = new Schema({
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
var Person = mongoose.model('Person', PersonSchema);

//Student Class
var StudentSchema = new Schema({
	id_specialization: {
		type: Number,
		required: true
	},
	study_year: {
		type: Number,
		required: true
	}
});
var Student = Person.discriminator('Student', StudentSchema);

//Partner Class
var PartnerSchema = new Schema({
	company: String
});
var Partner = Person.discriminator('Partner', PartnerSchema);

//Administration Class
var AdministrationSchema = new Schema({
	id_specialization: {
		type: Number,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});
var Administration = Person.discriminator('Administration', AdministrationSchema);

//Comment Class
var CommentSchema = new Schema({
	id_project: {
		type: String
	},
	author: {
		type: PersonSchema,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	responses: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}
	] // CommentSchema
});
var Comment = mongoose.model('Comment', CommentSchema);

//Project Class
var ProjectSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	majors_concerned: {
		type: Array,
		required: true
	},
	study_year: {
		type: Array,
		required: true
	}, //(Number)
	keywords: {
		type: Array,
		required: true
	},  //(String)
	media_files: Array, //(String)
	status: {
		type: String,
		required: true
	},
	sub_date: {
		type: Date,
		default: Date.now
	},
	edit_date: {
		type: Date,
		default: Date.now
	},
	edit_key: {
		type: String,
		required: true
	},
	likes: Array, //(StudentSchema)
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}
	], //(CommentSchema)
	partner: {
		type: PartnerSchema,
		required: true
	}
})
var Project = mongoose.model('Project', ProjectSchema);

//Specialization Class
var SpecializationSchema = new Schema({
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
var Specialization = mongoose.model('Specialization', SpecializationSchema)
module.exports = { Student, Partner, Administration, Comment, Project, Specialization };
