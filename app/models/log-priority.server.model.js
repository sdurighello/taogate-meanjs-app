'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Log priority Schema
 */
var LogPrioritySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Log priority name',
		trim: true
	},
	numericalValue: {
		type: Number,
		default: 0,
		required: 'Please fill priority numerical value'
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	position:{
		type: Number,
		required: 'Property "position" of LogPrioritySchema not filled'
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

mongoose.mtModel('LogPriority', LogPrioritySchema);
