'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate'),
    Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Actual completion Schema
 */

var PerformanceReviewRecord = {
    completion: {type: Number, min:0, default: null},
    sourceDoc: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var ActualCompletionSchema = new Schema({
    project:{type: Schema.Types.ObjectId, ref: 'Project', $tenant:true},
	sourceGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    targetGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},

    currentRecord: PerformanceReviewRecord,
    history:[PerformanceReviewRecord],

	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User'}
});

ActualCompletionSchema.plugin(deepPopulate);
mongoose.mtModel('ActualCompletion', ActualCompletionSchema);
