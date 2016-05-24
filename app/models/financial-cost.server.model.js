'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    deepPopulate = require('mongoose-deep-populate')(mongoose);
require('mongoose-multitenant');

/**
 * Financial cost Schema
 */
var FinancialCostSchema = new Schema({
	group : {type: Schema.Types.ObjectId, ref: 'FinancialCostGroup', $tenant:true, required:'Financial Cost Group missing'},
	type : {type: Schema.Types.ObjectId, ref: 'FinancialCostType', $tenant:true, required:'Financial Cost Type missing'},
	name : {type: String, default: '', trim: true, required:'Cost name is required'},
	year : {type: Number, min:0, required: 'Year for cost is missing'},
	amount : {type: Number, min:0, required: 'Amount for cost is missing'},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

FinancialCostSchema.plugin(deepPopulate);
mongoose.mtModel('FinancialCost', FinancialCostSchema);
