'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Financial benefit Schema
 */
var FinancialBenefitSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Financial benefit name',
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

mongoose.mtModel('FinancialBenefit', FinancialBenefitSchema);
