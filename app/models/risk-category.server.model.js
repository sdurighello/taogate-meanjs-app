'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate');
require('mongoose-multitenant');

/**
 * Risk category Schema
 */
var RiskCategorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Risk category name',
		trim: true
	},
    description: {
        type: String,
        default: '',
        trim: true
    },
    risks : [{type: Schema.Types.ObjectId, ref: 'Risk', $tenant:true}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

RiskCategorySchema.plugin(deepPopulate);
mongoose.mtModel('RiskCategory', RiskCategorySchema);
