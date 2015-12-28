'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Gate outcome review Schema
 */

var OutcomeReviewRecord = {
    score: {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    comment :{type: String, trim:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var StatusUpdateRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatus', default:null, $tenant:true},
    sourceStatusReport: {type: Schema.Types.ObjectId, ref: 'ProjectStatusReport', default:null, $tenant:true},
    comment :{type: String, trim:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var GateOutcomeReviewSchema = new Schema({
    project:{type: Schema.Types.ObjectId, ref: 'Project', $tenant:true},
    gate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    outcome:{type: Schema.Types.ObjectId, ref: 'GateOutcome', $tenant:true},

    currentRecord: OutcomeReviewRecord,
    history:[OutcomeReviewRecord],

    currentStatus: StatusUpdateRecord,
    historyStatus:[StatusUpdateRecord]
});

GateOutcomeReviewSchema.plugin(deepPopulate);
mongoose.mtModel('GateOutcomeReview', GateOutcomeReviewSchema);
