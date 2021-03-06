'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Subuser Schema
 */
var SubuserSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Subuser name',
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

mongoose.model('Subuser', SubuserSchema);