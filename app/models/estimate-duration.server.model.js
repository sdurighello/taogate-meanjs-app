'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Estimate duration Schema
 */
var EstimateDurationSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Estimate duration name',
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

mongoose.model('EstimateDuration', EstimateDurationSchema);