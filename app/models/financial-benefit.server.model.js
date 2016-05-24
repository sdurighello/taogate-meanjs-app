'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    deepPopulate = require('mongoose-deep-populate')(mongoose);
require('mongoose-multitenant');

/**
 * Financial benefit Schema
 */
var FinancialBenefitSchema = new Schema({
	group : {type: Schema.Types.ObjectId, ref: 'FinancialBenefitGroup', $tenant:true, required:'Financial Benefit Group missing'},
	type : {type: Schema.Types.ObjectId, ref: 'FinancialBenefitType', $tenant:true, required:'Financial Benefit Type missing'},
	name : {type: String, default: '', trim: true, required:'Benefit name is required'},
	year : {type: Number, min:0, required: 'Year for benefit is missing'},
	amount : {type: Number, min:0, required: 'Amount for benefit is missing'},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

FinancialBenefitSchema.plugin(deepPopulate);
mongoose.mtModel('FinancialBenefit', FinancialBenefitSchema);
