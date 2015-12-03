'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project change request Schema
 */
var ProjectChangeRequestSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Project change request name',
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

mongoose.model('ProjectChangeRequest', ProjectChangeRequestSchema);