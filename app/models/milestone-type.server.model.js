'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Milestone type Schema
 */
var MilestoneTypeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Milestone type name',
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

mongoose.model('MilestoneType', MilestoneTypeSchema);