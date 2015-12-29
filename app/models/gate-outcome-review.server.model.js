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
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User', default:null}
};

var StatusUpdateRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User', default:null}
};

var GateOutcomeReviewSchema = new Schema({
    project:{type: Schema.Types.ObjectId, ref: 'Project', $tenant:true, required:'Project in GateOutcomeReview is required'},
    gate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true, required:'Gate in GateOutcomeReview is required'},
    outcome:{type: Schema.Types.ObjectId, ref: 'GateOutcome', $tenant:true, required:'Outcome in GateOutcomeReview is required'},

    currentRecord: OutcomeReviewRecord,
    history:[OutcomeReviewRecord],

    currentStatus: StatusUpdateRecord,
    historyStatus:[StatusUpdateRecord]
});

GateOutcomeReviewSchema.plugin(deepPopulate);
mongoose.mtModel('GateOutcomeReview', GateOutcomeReviewSchema);
