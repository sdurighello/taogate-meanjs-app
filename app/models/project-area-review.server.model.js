'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate')(mongoose),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Project area review Schema
 */

var areaReviewRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User', default:null}
};

var ProjectAreaReviewSchema = new Schema({
    project:{type: Schema.Types.ObjectId, ref: 'Project', $tenant:true, required:'Project reference in ProjectAreaReview required'},
    gate:{type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true, required:'Gate reference in ProjectAreaReview required'},
    statusArea:{type: Schema.Types.ObjectId, ref: 'LogStatusArea', $tenant:true, required:'LogStatusArea reference in ProjectAreaReview required'},

    currentRecord: areaReviewRecord,
    history:[areaReviewRecord]
});

ProjectAreaReviewSchema.plugin(deepPopulate);
mongoose.mtModel('ProjectAreaReview', ProjectAreaReviewSchema);
