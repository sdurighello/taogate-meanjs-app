'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Baseline duration Schema
 */

var PerformanceReviewRecord = {
	gateDate: {type: Date, default: null},
	sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
	sourceGateReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User'}
};

var BaselineDurationSchema = new Schema({
	project:{type: Schema.Types.ObjectId, ref: 'Project', $tenant:true},
	sourceGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
	targetGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},

	currentRecord: PerformanceReviewRecord,
	history:[PerformanceReviewRecord]
});

BaselineDurationSchema.plugin(deepPopulate);
mongoose.mtModel('BaselineDuration', BaselineDurationSchema);
