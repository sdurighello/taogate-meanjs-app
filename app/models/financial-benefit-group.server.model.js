'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate');
require('mongoose-multitenant');

/**
 * Financial benefit group Schema
 */
var FinancialBenefitGroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Financial benefit group name',
		trim: true
	},
    description: {
        type: String,
        default: '',
        trim: true
    },
    benefitTypes : [{type: Schema.Types.ObjectId, ref: 'FinancialBenefitType', $tenant:true}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

FinancialBenefitGroupSchema.plugin(deepPopulate);
mongoose.mtModel('FinancialBenefitGroup', FinancialBenefitGroupSchema);
