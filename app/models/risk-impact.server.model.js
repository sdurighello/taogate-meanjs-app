'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Risk impact Schema
 */
var RiskImpactSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Risk impact name',
		trim: true
	},
    description: {
        type: String,
        default: '',
        trim: true
    },
    impactValue: {
        type: Number,
        default: 0,
        required: 'Please fill Risk impact value'
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

mongoose.mtModel('RiskImpact', RiskImpactSchema);
