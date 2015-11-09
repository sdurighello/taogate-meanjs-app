'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Gate status Schema
 */
var GateStatusSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Gate status name',
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

mongoose.mtModel('GateStatus', GateStatusSchema);
