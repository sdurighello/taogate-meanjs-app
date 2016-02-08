'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Project review score Schema
 */
var ProjectReviewScoreSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Project review score name',
		trim: true
	},
	numericalValue: {
		type: Number,
		default: 0,
		required: 'Please fill Qualitative impact numerical value'
	},
	description: {
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

mongoose.mtModel('ProjectReviewScore', ProjectReviewScoreSchema);
