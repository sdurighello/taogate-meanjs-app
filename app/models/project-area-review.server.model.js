'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Project area review Schema
 */

var areaReviewRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusReport: {type: Schema.Types.ObjectId, ref: 'ProjectStatusReport', default:null, $tenant:true},
    comment :{type: String, trim:true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var ProjectAreaReviewSchema = new Schema({
    project:{type: Schema.Types.ObjectId, ref: 'Project', $tenant:true},
    gate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true},
    logStatusArea:{type: Schema.Types.ObjectId, ref: 'LogStatusArea', $tenant:true},

    currentRecord: areaReviewRecord,
    history:[areaReviewRecord]
});

ProjectAreaReviewSchema.plugin(deepPopulate);
mongoose.mtModel('ProjectAreaReview', ProjectAreaReviewSchema);
