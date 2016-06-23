'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * People project group Schema
 */
var PeopleProjectGroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill People project group name',
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

mongoose.mtModel('PeopleProjectGroup', PeopleProjectGroupSchema);
