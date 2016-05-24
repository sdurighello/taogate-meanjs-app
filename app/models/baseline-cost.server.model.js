'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate')(mongoose),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Baseline cost Schema
 */

var PerformanceReviewRecord = {
	cost: {type: Number, min:0, default: null},
	completed : {type: Boolean, default: false},
	currentGate : {type: Boolean, default: false},
	sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
	sourceGateReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User'}
};

var BaselineCostSchema = new Schema({
	project:{type: Schema.Types.ObjectId, ref: 'Project', $tenant:true},
	sourceGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
	targetGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},

	currentRecord: PerformanceReviewRecord,
	history:[PerformanceReviewRecord]
});

BaselineCostSchema.plugin(deepPopulate);
mongoose.mtModel('BaselineCost', BaselineCostSchema);
