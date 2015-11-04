'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Qualitative impact score Schema
 */
var QualitativeImpactScoreSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Qualitative impact score name',
		trim: true
	},
    numericalValue: {
        type: Number,
        default: 0,
        required: 'Please fill Qualitative impact numerical value'
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

mongoose.mtModel('QualitativeImpactScore', QualitativeImpactScoreSchema);
