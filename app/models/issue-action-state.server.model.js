'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('IssueActionState', IssueActionStateSchema);