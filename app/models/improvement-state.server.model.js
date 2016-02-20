'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Improvement state Schema
 */
var ImprovementStateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Improvement state name',
		trim: true
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

mongoose.mtModel('ImprovementState', ImprovementStateSchema);
