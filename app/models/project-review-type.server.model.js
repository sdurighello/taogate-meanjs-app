'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Project review type Schema
 */
var ProjectReviewTypeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Project review type name',
		trim: true
	},
	description:{
		type: String,
		default: '',
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

mongoose.mtModel('ProjectReviewType', ProjectReviewTypeSchema);
