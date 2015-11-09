'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Gate process Schema
 */
var GateProcessSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Gate process name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
    startupGate: {type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    closureGate: {type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
	gates : [{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true}],
    created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

GateProcessSchema.plugin(deepPopulate);
mongoose.mtModel('GateProcess', GateProcessSchema);
