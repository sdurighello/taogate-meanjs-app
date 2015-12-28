'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Log status area Schema
 */
var LogStatusAreaSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Log status area name',
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

mongoose.model('LogStatusArea', LogStatusAreaSchema);