'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Priority Schema
 */
var PrioritySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Priority name',
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

mongoose.model('Priority', PrioritySchema);
