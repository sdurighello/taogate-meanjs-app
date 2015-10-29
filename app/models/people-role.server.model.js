'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * People role Schema
 */
var PeopleRoleSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill role name',
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

mongoose.mtModel('PeopleRole', PeopleRoleSchema);
