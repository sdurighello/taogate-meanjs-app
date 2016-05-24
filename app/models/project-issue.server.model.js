'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate')(mongoose),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Project issue Schema
 */

var statusReviewRecord = {
    baselineDeliveryDate : {type: Date, default: null},
    estimateDeliveryDate : {type: Date, default: null},
    actualDeliveryDate : {type: Date, default: null},
    completed : {type: Boolean, default: false, required:'Issue completed flag is required'},
    status: {type: Schema.Types.ObjectId, default: null, ref: 'LogStatusIndicator', $tenant:true},
    statusComment : {type: String, default:'', trim: true},
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
};

var ProjectIssueSchema = new Schema({

    project: {type: Schema.Types.ObjectId, ref: 'Project', $tenant:true, required:'Project is required'},
    gate : {type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true, required:'Gate is required'},

    raisedOnDate : {type: Date, default: Date.now, required:'Raised on date required'},

    idNumber: {type: Number, required:'Sequential idNumber for projectIssue is required'},
	title: {type: String, default: '', trim: true, required: 'Please fill Project issue name'},
    description: {type: String, default: '', trim: true},

    reason : {type: Schema.Types.ObjectId, default: null, ref: 'LogReason', $tenant:true},
    state : {type: Schema.Types.ObjectId, default: null, ref: 'IssueState', $tenant:true},
    priority : {type: Schema.Types.ObjectId, default: null, ref: 'LogPriority', $tenant:true},

    statusReview : {
        currentRecord : statusReviewRecord,
        history : [statusReviewRecord]
    },

    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User', default:null}
});

ProjectIssueSchema.plugin(deepPopulate);
mongoose.mtModel('ProjectIssue', ProjectIssueSchema);
