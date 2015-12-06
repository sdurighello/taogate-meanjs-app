'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate'),
    Schema = mongoose.Schema;
require('mongoose-multitenant');


/**
 * Gate review Schema
 */


var OutcomeGateReviewSchema = new Schema({
    outcome : {type: Schema.Types.ObjectId, ref: 'GateOutcome', $tenant:true},
    score : {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', $tenant:true},
    reviewComment : {type: String}
});

var BaselineDurationReviewSchema = new Schema({
    baselineDuration: {type: Schema.Types.ObjectId, ref: 'BaselineDuration', $tenant:true},
    newDate : {type: Date}
});

var EstimateDurationReviewSchema = new Schema({
    estimateDuration: {type: Schema.Types.ObjectId, ref: 'EstimateDuration', $tenant:true},
    newDate : {type: Date}
});

var ActualDurationReviewSchema = new Schema({
    actualDuration: {type: Schema.Types.ObjectId, ref: 'ActualDuration', $tenant:true},
    newDate : {type: Date}
});

var BaselineCostReviewSchema = new Schema({
    baselineCost: {type: Schema.Types.ObjectId, ref: 'BaselineCost', $tenant:true},
    newCost : {type: Number}
});

var EstimateCostReviewSchema = new Schema({
    estimateCost: {type: Schema.Types.ObjectId, ref: 'EstimateCost', $tenant:true},
    newCost : {type: Number}
});

var ActualCostReviewSchema = new Schema({
    actualCost: {type: Schema.Types.ObjectId, ref: 'ActualCost', $tenant:true},
    newCost : {type: Number}
});

var BaselineCompletionReviewSchema = new Schema({
    baselineCompletion: {type: Schema.Types.ObjectId, ref: 'BaselineCompletion', $tenant:true},
    newCompletion : {type: Number}
});

var EstimateCompletionReviewSchema = new Schema({
    estimateCompletion: {type: Schema.Types.ObjectId, ref: 'EstimateCompletion', $tenant:true},
    newCompletion : {type: Number}
});

var ActualCompletionReviewSchema = new Schema({
    actualCompletion: {type: Schema.Types.ObjectId, ref: 'ActualCompletion', $tenant:true},
    newCompletion : {type: Number}
});

var GateReviewSchema = new Schema({
    project: {type: Schema.Types.ObjectId, ref: 'Project', $tenant:true},
    gate : {type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    status : {type: Schema.Types.ObjectId, ref: 'GateStatus', $tenant:true},
    reviewDate : {type: Date, default: Date.now},
    reviewTitle : {type: String, default:'', required:'Review title required'},
    overallScore : {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', $tenant:true},
    overallComment : {type: String},
    completed : {type: Boolean, default: null, required:true},
    outcomeReviews : [OutcomeGateReviewSchema],
    baselineDurationReviews : [BaselineDurationReviewSchema],
    estimateDurationReviews : [EstimateDurationReviewSchema],
    actualDurationReviews : [ActualDurationReviewSchema],
    baselineCostReviews : [BaselineCostReviewSchema],
    estimateCostReviews : [EstimateCostReviewSchema],
    actualCostReviews : [ActualCostReviewSchema],
    baselineCompletionReviews : [BaselineCompletionReviewSchema],
    estimateCompletionReviews : [EstimateCompletionReviewSchema],
    actualCompletionReviews : [ActualCompletionReviewSchema],
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});


GateReviewSchema.plugin(deepPopulate);
mongoose.mtModel('GateReview', GateReviewSchema);
