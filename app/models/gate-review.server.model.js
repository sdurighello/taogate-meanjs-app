'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose),
    Schema = mongoose.Schema;
require('mongoose-multitenant');


// Outcome review

var OutcomeReviewSchema = new Schema({
    outcome : {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.outcomes', $tenant:true},
        name: {type: String}
    },
    newScore : {type: Schema.Types.ObjectId, default: null, ref: 'GateOutcomeScore', $tenant:true},
    reviewComment : {type: String, default: ''}
});

// Performances review

var BaselineDurationReviewSchema = new Schema({
    baselineDuration: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.duration.baselineDurations', $tenant:true},
        targetGateName: {type: String},
        targetGatePosition: {type: Number}
    },
    newDate : {type: Date, default: null}
});

var EstimateDurationReviewSchema = new Schema({
    estimateDuration: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.duration.estimateDurations', $tenant: true},
        targetGateName: {type: String},
        targetGatePosition: {type: Number}
    },
    newDate : {type: Date, default: null}
});

var ActualDurationReviewSchema = new Schema({
    actualDuration: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.duration.actualDurations', $tenant: true},
        targetGateName: {type: String},
        targetGatePosition: {type: Number}
    },
    newDate : {type: Date, default: null}
});

var BaselineCostReviewSchema = new Schema({
    baselineCost: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.cost.baselineCosts', $tenant: true},
        targetGateName: {type: String},
        targetGatePosition: {type: Number}
    },
    newCost : {type: Number, default: null}
});

var EstimateCostReviewSchema = new Schema({
    estimateCost: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.cost.estimateCosts', $tenant: true},
        targetGateName: {type: String},
        targetGatePosition: {type: Number}
    },
    newCost : {type: Number}
});

var ActualCostReviewSchema = new Schema({
    actualCost: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.cost.actualCosts', $tenant: true},
        targetGateName: {type: String},
        targetGatePosition: {type: Number}
    },
    newCost : {type: Number, default: null}
});

var BaselineCompletionReviewSchema = new Schema({
    baselineCompletion: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.completion.baselineCompletions', $tenant: true},
        targetGateName: {type: String},
        targetGatePosition: {type: Number}
    },
    newCompletion : {type: Number, default: null}
});

var EstimateCompletionReviewSchema = new Schema({
    estimateCompletion: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.completion.estimateCompletions', $tenant: true},
        targetGateName: {type: String},
        targetGatePosition: {type: Number}
    },
    newCompletion : {type: Number, default: null}
});

var ActualCompletionReviewSchema = new Schema({
    actualCompletion: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.completion.actualCompletions', $tenant: true},
        targetGateName: {type: String},
        targetGatePosition: {type: Number}
    },
    newCompletion : {type: Number, default: null}
});


// Approval

var approvalRecord = {
    approvalState: {type: String, enum: ['draft', 'submitted', 'approved','rejected'], default:'draft', required:'Approval flag is required'},
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
};


/* Gate review Schema */

var GateReviewSchema = new Schema({

    project: {type: Schema.Types.ObjectId, ref: 'Project', $tenant:true, required:'Project for gate review required'},
    gate : {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true, required:'Gate for gate review required'},

    reviewDate : {type: Date, default: Date.now, required:'Review date required'},
    title : {type: String, default:'', required:'Review title required'},
    overallComment : {type: String, default:''},

    approval : {
        currentRecord : approvalRecord,
        history : [approvalRecord]
    },

    outcomes : [OutcomeReviewSchema],

    gateStatus: {
        status : {type: Schema.Types.ObjectId, ref: 'GateStatus', default: null, $tenant:true},
        overallScore : {type: Schema.Types.ObjectId, default: null, ref: 'GateOutcomeScore', $tenant:true},
        completed : {type: Boolean, default: false, required:'Completed flag required'}
    },
    
    budget : {
        amount: {type: Number, default: null}
    },
    
    performances: {
        duration: {
            baselineDurations: [BaselineDurationReviewSchema],
            estimateDurations: [EstimateDurationReviewSchema],
            actualDurations: [ActualDurationReviewSchema]
        },
        cost: {
            baselineCosts: [BaselineCostReviewSchema],
            estimateCosts: [EstimateCostReviewSchema],
            actualCosts: [ActualCostReviewSchema]
        },
        completion: {
            baselineCompletions: [BaselineCompletionReviewSchema],
            estimateCompletions: [EstimateCompletionReviewSchema],
            actualCompletions: [ActualCompletionReviewSchema]
        }
    },    

    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});


GateReviewSchema.plugin(deepPopulate);
mongoose.mtModel('GateReview', GateReviewSchema);
