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
    sourceReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    comment :{type: String, trim:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var GateOutcomeReviewSchema = new Schema({
    project:{type: Schema.Types.ObjectId, ref: 'Project', $tenant:true},
    gate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    outcome:{type: Schema.Types.ObjectId, ref: 'GateOutcome', $tenant:true},

    currentRecord: OutcomeReviewRecord,
    history:[OutcomeReviewRecord]
});

GateOutcomeReviewSchema.plugin(deepPopulate);
mongoose.mtModel('GateOutcomeReview', GateOutcomeReviewSchema);
