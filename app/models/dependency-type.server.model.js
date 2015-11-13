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
var DependencyTypeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Dependency type name',
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

mongoose.mtModel('DependencyType', DependencyTypeSchema);
