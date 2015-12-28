'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Estimate completion Schema
 */

var PerformanceReviewRecord = {
	completion: {type: Number, min:0, default: null},
	sourceProjectStatus: {type: Schema.Types.ObjectId, ref: 'ProjectStatus', default:null, $tenant:true},
	sourceGateReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User'}
};

var EstimateCompletionSchema = new Schema({
	project:{type: Schema.Types.ObjectId, ref: 'Project', $tenant:true},
	sourceGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
	targetGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},

	currentRecord: PerformanceReviewRecord,
	history:[PerformanceReviewRecord]
});

EstimateCompletionSchema.plugin(deepPopulate);
mongoose.mtModel('EstimateCompletion', EstimateCompletionSchema);
