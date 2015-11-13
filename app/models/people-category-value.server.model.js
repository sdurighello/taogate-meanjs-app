'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * People category value Schema
 */
var PeopleCategoryValueSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill People category value name',
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

mongoose.mtModel('PeopleCategoryValue', PeopleCategoryValueSchema);
