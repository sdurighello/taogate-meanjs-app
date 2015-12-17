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
    status : {type: Schema.Types.ObjectId, ref: 'GateStatus', default:null, $tenant:true},
    overallScore : {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', default:null, $tenant:true},
    sourceReview: {type: Schema.Types.ObjectId, ref: 'GateReview', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var GateStatusAssignmentSchema = new Schema({
    project:{type: Schema.Types.ObjectId, ref: 'Project', $tenant:true},
    gate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},

    currentRecord: GateStatusAssignmentRecord,
    history:[GateStatusAssignmentRecord]
});

GateStatusAssignmentSchema.plugin(deepPopulate);
mongoose.mtModel('GateStatusAssignment', GateStatusAssignmentSchema);
