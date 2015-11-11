'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Milestone state Schema
 */
var MilestoneStateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Milestone state name',
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

mongoose.model('MilestoneState', MilestoneStateSchema);