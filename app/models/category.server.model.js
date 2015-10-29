'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Category Schema
 */
var CategorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Category name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
    categoryValues : [{type: Schema.Types.ObjectId, ref: 'CategoryValue', $tenant:true}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.mtModel('Category', CategorySchema);
