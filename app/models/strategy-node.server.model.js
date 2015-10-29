'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate');

require('mongoose-multitenant');

/**
 * StrategyNode Schema
 */
var StrategyNodeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill StrategyNode name',
		trim: true
	},
	type : {type: Schema.Types.ObjectId, ref: 'StrategyNodeType', default:null, $tenant:true},
	parent : {type: Schema.Types.ObjectId, ref: 'StrategyNode', default:null, $tenant:true},
	ancestors : [{type: Schema.Types.ObjectId, ref: 'StrategyNode', default:null, $tenant:true}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

StrategyNodeSchema.plugin(deepPopulate);
mongoose.mtModel('StrategyNode', StrategyNodeSchema);
