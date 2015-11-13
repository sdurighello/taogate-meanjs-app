'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Dependency impact Schema
 */
var DependencyImpactSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Dependency impact name',
		trim: true
	},
    numericalValue: {
        type: Number,
        default: 0,
        required: 'Please fill dependency impact numerical value'
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    position:{
        type: Number,
        required: 'Property "position" of DependencyImpactSchema not filled'
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

mongoose.mtModel('DependencyImpact', DependencyImpactSchema);
