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
    status: {type: Schema.Types.ObjectId, ref: 'LogStatus', default:null, $tenant:true},
    sourceProjectStatusReport: {type: Schema.Types.ObjectId, ref: 'ProjectStatusReport', default:null, $tenant:true},
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
    }


});


ProjectGateStatusSchema.plugin(deepPopulate);
mongoose.mtModel('ProjectGateStatus', ProjectGateStatusSchema);
