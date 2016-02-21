'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Estimate duration Schema
 */

var PerformanceReviewRecord = {
	gateDate: {type: Date, default: null},
	completed : {type: Boolean, default: false},
	currentGate : {type: Boolean, default: false},
	sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
	sourceGateReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User'}
};

var EstimateDurationSchema = new Schema({
	project:{type: Schema.Types.ObjectId, ref: 'Project', $tenant:true},
	sourceGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
	targetGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},

	currentRecord: PerformanceReviewRecord,
	history:[PerformanceReviewRecord]
});

EstimateDurationSchema.plugin(deepPopulate);
mongoose.mtModel('EstimateDuration', EstimateDurationSchema);
