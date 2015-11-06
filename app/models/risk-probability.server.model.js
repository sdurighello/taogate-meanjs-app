'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Risk probability Schema
 */
var RiskProbabilitySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Risk probability name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
    value: {
        type: Number,
        default: 0,
        required: 'Please fill Risk probability value'
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

mongoose.mtModel('RiskProbability', RiskProbabilitySchema);
