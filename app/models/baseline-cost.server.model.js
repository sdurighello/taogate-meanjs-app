'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Baseline cost Schema
 */
var BaselineCostSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Baseline cost name',
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

mongoose.model('BaselineCost', BaselineCostSchema);