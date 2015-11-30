'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Estimate cost Schema
 */
var EstimateCostSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Estimate cost name',
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

mongoose.model('EstimateCost', EstimateCostSchema);