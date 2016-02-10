'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Dependency type Schema
 */
var DependencyStateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Dependency state name is required',
		trim: true
	},
	description:{
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

mongoose.mtModel('DependencyState', DependencyStateSchema);
