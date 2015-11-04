'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate');
require('mongoose-multitenant');

/**
 * Financial cost group Schema
 */
var FinancialCostGroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Financial cost group name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	costs : [{type: Schema.Types.ObjectId, ref: 'FinancialCost', $tenant:true}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

FinancialCostGroupSchema.plugin(deepPopulate);
mongoose.mtModel('FinancialCostGroup', FinancialCostGroupSchema);
