'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Baseline completion Schema
 */
var BaselineCompletionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Baseline completion name',
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

mongoose.model('BaselineCompletion', BaselineCompletionSchema);