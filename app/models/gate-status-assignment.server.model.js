'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Gate status assignment Schema
 */

var GateStatusAssignmentRecord = {
    completed: {type: Boolean, default: false},
    currentGate : {type: Boolean, default: false},
    status : {type: Schema.Types.ObjectId, ref: 'GateStatus', default:null, $tenant:true},
    overallScore : {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var BudgetRecord = {
    amount: {type: Number, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var OverallStatusRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var DurationStatusRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var CostStatusRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var CompletionStatusRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var GateStatusAssignmentSchema = new Schema({
    project:{type: Schema.Types.ObjectId, ref: 'Project', $tenant:true},
    gate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},

    currentRecord: GateStatusAssignmentRecord,
    history:[GateStatusAssignmentRecord],

    budget : {
        currentRecord: BudgetRecord,
        history:[BudgetRecord]
    },

    overallStatus : {
        currentRecord: OverallStatusRecord,
        history:[OverallStatusRecord]
    },

    durationStatus : {
        currentRecord: DurationStatusRecord,
        history:[DurationStatusRecord]
    },

    costStatus : {
        currentRecord: CostStatusRecord,
        history:[CostStatusRecord]
    },

    completionStatus : {
        currentRecord: CompletionStatusRecord,
        history:[CompletionStatusRecord]
    }
});

GateStatusAssignmentSchema.plugin(deepPopulate);
mongoose.mtModel('GateStatusAssignment', GateStatusAssignmentSchema);
