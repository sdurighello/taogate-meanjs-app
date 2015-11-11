'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Issue action state Schema
 */
var IssueActionStateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Issue action state name',
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

mongoose.mtModel('IssueActionState', IssueActionStateSchema);
