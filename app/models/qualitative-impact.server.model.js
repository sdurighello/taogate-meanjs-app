'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Qualitative impact Schema
 */
var QualitativeImpactSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Qualitative impact name',
		trim: true
	},
    description: {
        type: String,
        default: '',
        trim: true
    },
    weight: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
        required: 'Please fill Qualitative impact weight'
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

mongoose.mtModel('QualitativeImpact', QualitativeImpactSchema);
