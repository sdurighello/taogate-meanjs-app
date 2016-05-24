'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate')(mongoose);
require('mongoose-multitenant');

/**
 * Qualitative impact group Schema
 */
var QualitativeImpactGroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Qualitative impact group name',
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
        required: 'Please fill Qualitative impact group weight'
    },
    impacts : [
        {type: Schema.Types.ObjectId, ref: 'QualitativeImpact', $tenant:true}
    ],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

QualitativeImpactGroupSchema.plugin(deepPopulate);
mongoose.mtModel('QualitativeImpactGroup', QualitativeImpactGroupSchema);
