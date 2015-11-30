'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Baseline duration Schema
 */
var BaselineDurationSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Baseline duration name',
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

mongoose.model('BaselineDuration', BaselineDurationSchema);