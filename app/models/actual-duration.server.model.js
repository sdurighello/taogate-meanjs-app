'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Actual duration Schema
 */
var ActualDurationSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Actual duration name',
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

mongoose.model('ActualDuration', ActualDurationSchema);