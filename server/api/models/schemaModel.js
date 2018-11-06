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
});*/


var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
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
module.exports = mongoose.model('Person', PersonSchema);

//Student Class
var StudentSchema = PersonSchema.extend({
	id_specialization: {
		type: Number,
		required: true
	},
	study_year: {
		type: Number,
		required: true
	}
});
module.exports = mongoose.model('Student', StudentSchema);

//Partner Class
var PartnerSchema = PersonSchema.extend({
	company: String
});
module.exports = mongoose.model('Partner', PartnerSchema);

//Administration Class
var AdministrationSchema = PersonSchema.extend({
	id_specialization: {
		type: Number,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});
module.exports = mongoose.model('Administration', AdministrationSchema);

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
module.exports = mongoose.model('Comment', CommentSchema);

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
module.exports = mongoose.model('Project', ProjectSchema);

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
module.exports = mongoose.model('Specialization', SpecializationSchema);
