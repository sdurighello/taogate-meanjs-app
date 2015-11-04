'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate');
require('mongoose-multitenant');

/**
 * Priority group Schema
 */
var PriorityGroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Priority group name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	priorities : [
		{type: Schema.Types.ObjectId, ref: 'Priority', $tenant:true}
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

PriorityGroupSchema.plugin(deepPopulate);
mongoose.mtModel('PriorityGroup', PriorityGroupSchema);
