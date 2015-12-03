'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project status Schema
 */
var ProjectStatusSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Project status name',
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

mongoose.model('ProjectStatus', ProjectStatusSchema);