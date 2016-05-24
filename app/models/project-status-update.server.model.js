'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate')(mongoose),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Project status update Schema
 */

// -- Sub-schemas --

var StatusAreaUpdateSchema = new Schema({
    projectAreaReview : {type: Schema.Types.ObjectId, ref: 'ProjectAreaReview', $tenant:true},
    newStatus : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', $tenant:true},
    comment : {type: String, trim: true}
});

var OutcomeStatusUpdateSchema = new Schema({
    outcomeReview : {type: Schema.Types.ObjectId, ref: 'GateOutcomeReview', $tenant:true},
    newStatus : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', $tenant:true},
    comment : {type: String}
});

var EstimateDurationReviewSchema = new Schema({
    estimateDuration: {type: Schema.Types.ObjectId, ref: 'EstimateDuration', $tenant:true},
    newDate : {type: Date}
});

var EstimateCostReviewSchema = new Schema({
    estimateCost: {type: Schema.Types.ObjectId, ref: 'EstimateCost', $tenant:true},
    newCost : {type: Number}
});

var EstimateCompletionReviewSchema = new Schema({
    estimateCompletion: {type: Schema.Types.ObjectId, ref: 'EstimateCompletion', $tenant:true},
    newCompletion : {type: Number}
});

var approvalRecord = {
    approvalState: {type: String, enum: ['draft', 'submitted', 'approved','rejected'], default:'draft', required:'Approval flag is required'},
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
};

// -- Main schema --

var ProjectStatusUpdateSchema = new Schema({
	project: {type: Schema.Types.ObjectId, ref: 'Project', $tenant:true, required:'Project for gate review required'},
	gate : {type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true, required:'Gate for gate review required'},

	title : {type: String, default:'', trim: true, required:'Review title required'},
    description : {type: String, default:'', trim: true},

    approval : {
        currentRecord : approvalRecord,
        history : [approvalRecord]
    },

    // Gate Status Assignment
    gateStatusUpdate : {
        gateStatusAssignment: {type: Schema.Types.ObjectId, ref: 'GateStatusAssignment', $tenant:true},
        overallUpdate : {
            status : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', $tenant:true},
            comment : {type: String, trim: true}
        },
        durationUpdate : {
            status : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', $tenant:true},
            comment : {type: String, trim: true}
        },
        costUpdate : {
            status : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', $tenant:true},
            comment : {type: String, trim: true}
        },
        completionUpdate : {
            status : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', $tenant:true},
            comment : {type: String, trim: true}
        }
    },

    // Areas
    statusAreaUpdates : [StatusAreaUpdateSchema],

    // Outcomes
    outcomeStatusUpdates : [OutcomeStatusUpdateSchema],

    // Performances
    estimateDurationReviews : [EstimateDurationReviewSchema],
    estimateCostReviews : [EstimateCostReviewSchema],
    estimateCompletionReviews : [EstimateCompletionReviewSchema],

	created: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: 'User' }
});

ProjectStatusUpdateSchema.plugin(deepPopulate);
mongoose.mtModel('ProjectStatusUpdate', ProjectStatusUpdateSchema);
