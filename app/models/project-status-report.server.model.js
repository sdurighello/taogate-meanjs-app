'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project status report Schema
 */
var ProjectStatusReportSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Project status report name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('ProjectStatusReport', ProjectStatusReportSchema);