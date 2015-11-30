'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Actual cost Schema
 */
var ActualCostSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Actual cost name',
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

mongoose.model('ActualCost', ActualCostSchema);