'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate');
require('mongoose-multitenant');

/**
 * Process assignment Schema
 */




// ---------------------------- PERFORMANCES SCHEMAS -----------------------------

    // -- Completions --

var ActualCompletionRecord = {
    completion: {type: Number, min:0, default: null},
    sourceDoc: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var ActualCompletionSchema = new Schema({
    targetGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    currentRecord: ActualCompletionRecord,
    history:[ActualCompletionRecord]
});

var BaselineCompletionRecord = {
    completion: {type: Number, min:0, default: null},
    sourceDoc: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var BaselineCompletionSchema = new Schema({
    targetGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    currentRecord: BaselineCompletionRecord,
    history:[BaselineCompletionRecord]
});

var EstimateCompletionRecord = {
    completion: {type: Number, min:0, default: null},
    sourceDoc: {type: Schema.Types.ObjectId, ref: 'ProjectStatus', default:null, $tenant:true},
    sourceReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var EstimateCompletionSchema = new Schema({
    targetGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    currentRecord: EstimateCompletionRecord,
    history:[EstimateCompletionRecord]
});

    // -- Costs --

var ActualCostRecord = {
    cost: {type: Number, min:0, default: null},
    sourceDoc: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var ActualCostSchema = new Schema({
    targetGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    currentRecord: ActualCostRecord,
    history:[ActualCostRecord]
});

var BaselineCostRecord = {
    cost: {type: Number, min:0, default: null},
    sourceDoc: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var BaselineCostSchema = new Schema({
    targetGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    currentRecord: BaselineCostRecord,
    history:[BaselineCostRecord]
});

var EstimateCostRecord = {
    cost: {type: Number, min:0, default: null},
    sourceDoc: {type: Schema.Types.ObjectId, ref: 'ProjectStatus', default:null, $tenant:true},
    sourceReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var EstimateCostSchema = new Schema({
    targetGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    currentRecord: EstimateCostRecord,
    history:[EstimateCostRecord]
});

    // -- Durations --

var ActualDurationRecord = {
    gateDate: {type: Date, default: null},
    sourceDoc: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var ActualDurationSchema = new Schema({
    targetGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    currentRecord: ActualDurationRecord,
    history:[ActualDurationRecord]
});

var BaselineDurationRecord = {
    gateDate: {type: Date, default: null},
    sourceDoc: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var BaselineDurationSchema = new Schema({
    targetGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    currentRecord: BaselineDurationRecord,
    history:[BaselineDurationRecord]
});

var EstimateDurationRecord = {
    gateDate: {type: Date, default: null},
    sourceDoc: {type: Schema.Types.ObjectId, ref: 'ProjectStatus', default:null, $tenant:true},
    sourceReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var EstimateDurationSchema = new Schema({
    targetGate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    currentRecord: EstimateDurationRecord,
    history:[EstimateDurationRecord]
});


// ---------------------------- OUTCOME DATA SCHEMA -----------------------------

var OutcomeScoreRecord = {
    score: {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', default:null, $tenant:true},
    sourceReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var AssignedGateOutcomeSchema = new Schema({
    outcome : {type: Schema.Types.ObjectId, ref: 'GateOutcome', $tenant:true},
    currentRecord: OutcomeScoreRecord,
    history:[OutcomeScoreRecord]
});


// ---------------------------- GATE DATA SCHEMA -----------------------------

var AssignedProcessGateSchema = new Schema({
    gate : {type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    status : {type: Schema.Types.ObjectId, ref: 'GateStatus', $tenant:true},
    overallScore : {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', $tenant:true},
    completed : {type: Boolean, default: false, required:'Completed flag required'},

    outcomes : [AssignedGateOutcomeSchema],

    baselineDurations : [BaselineDurationSchema],
    estimateDurations : [EstimateDurationSchema],
    actualDurations : [ActualDurationSchema],

    baselineCosts : [BaselineCostSchema],
    estimateCosts : [EstimateCostSchema],
    actualCosts : [ActualCostSchema],

    baselineCompletions : [BaselineCompletionSchema],
    estimateCompletions : [EstimateCompletionSchema],
    actualCompletions : [ActualCompletionSchema]

});


// ---------------------------- MAIN SCHEMA -----------------------------

var ProcessAssignmentSchema = new Schema({
    project: {type: Schema.ObjectId, ref: 'Project', default:null, $tenant:true},
    process: {type: Schema.ObjectId, ref: 'GateProcess', default:null, $tenant:true},

    gates:[AssignedProcessGateSchema],

	created: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: 'User'}
});





ProcessAssignmentSchema.plugin(deepPopulate);
mongoose.mtModel('ProcessAssignment', ProcessAssignmentSchema);
