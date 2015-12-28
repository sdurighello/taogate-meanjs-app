'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Project gate status Schema
 */

var OverallStatusRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusReport: {type: Schema.Types.ObjectId, ref: 'ProjectStatusReport', default:null, $tenant:true},
    comment :{type: String, trim:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var DurationStatusRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusReport: {type: Schema.Types.ObjectId, ref: 'ProjectStatusReport', default:null, $tenant:true},
    comment :{type: String, trim:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var CostStatusRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusReport: {type: Schema.Types.ObjectId, ref: 'ProjectStatusReport', default:null, $tenant:true},
    comment :{type: String, trim:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var CompletionStatusRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusReport: {type: Schema.Types.ObjectId, ref: 'ProjectStatusReport', default:null, $tenant:true},
    comment :{type: String, trim:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var ProjectGateStatusSchema = new Schema({
    project:{type: Schema.Types.ObjectId, ref: 'Project', $tenant:true},
    gate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},

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


ProjectGateStatusSchema.plugin(deepPopulate);
mongoose.mtModel('ProjectGateStatus', ProjectGateStatusSchema);
