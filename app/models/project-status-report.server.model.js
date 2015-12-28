'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Project status report Schema
 */


var ProjectStatusReportSchema = new Schema({
	project: {type: Schema.Types.ObjectId, ref: 'Project', $tenant:true, required:'Project for gate review required'},
	gate : {type: Schema.Types.ObjectId, ref: 'Gate', $tenant:true, required:'Gate for gate review required'},

	raisedOnDate : {type: Date, default: Date.now, required:'Raised on date required'},

	title : {type: String, default:'', trim: true, required:'Review title required'},
	description : {type: String, default:'', trim: true},

	reason : {type: Schema.Types.ObjectId, default: null, ref: 'LogReason', $tenant:true},
	state : {type: Schema.Types.ObjectId, default: null, ref: 'ChangeRequestState', $tenant:true},
	priority : {type: Schema.Types.ObjectId, default: null, ref: 'LogPriority', $tenant:true},

	statusReview : {
		currentRecord : statusReviewRecord,
		history : [statusReviewRecord]
	},

	appliedChanges : [appliedChangeRecord],

	baselineDurationReviews : [BaselineDurationReviewSchema],
	actualDurationReviews : [ActualDurationReviewSchema],
	baselineCostReviews : [BaselineCostReviewSchema],
	actualCostReviews : [ActualCostReviewSchema],
	baselineCompletionReviews : [BaselineCompletionReviewSchema],
	actualCompletionReviews : [ActualCompletionReviewSchema],

	created: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: 'User' }
});



ProjectStatusReportSchema.plugin(deepPopulate);
mongoose.mtModel('ProjectStatusReport', ProjectStatusReportSchema);
