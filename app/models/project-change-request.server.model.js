'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate')(mongoose),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Project change request Schema
 */
//
// var BaselineDurationReviewSchema = new Schema({
//     baselineDuration: {type: Schema.Types.ObjectId, ref: 'BaselineDuration', $tenant:true},
//     dateChange : {type: Number}
// });
//
// var ActualDurationReviewSchema = new Schema({
//     actualDuration: {type: Schema.Types.ObjectId, ref: 'ActualDuration', $tenant:true},
//     dateChange : {type: Number}
// });
//
// var BaselineCostReviewSchema = new Schema({
//     baselineCost: {type: Schema.Types.ObjectId, ref: 'BaselineCost', $tenant:true},
//     costChange : {type: Number}
// });
//
// var ActualCostReviewSchema = new Schema({
//     actualCost: {type: Schema.Types.ObjectId, ref: 'ActualCost', $tenant:true},
//     costChange : {type: Number}
// });
//
// var BaselineCompletionReviewSchema = new Schema({
//     baselineCompletion: {type: Schema.Types.ObjectId, ref: 'BaselineCompletion', $tenant:true},
//     completionChange : {type: Number}
// });
//
// var ActualCompletionReviewSchema = new Schema({
//     actualCompletion: {type: Schema.Types.ObjectId, ref: 'ActualCompletion', $tenant:true},
//     completionChange : {type: Number}
// });
//
// var statusReviewRecord = {
//     baselineDeliveryDate : {type: Date, default: null},
//     estimateDeliveryDate : {type: Date, default: null},
//     actualDeliveryDate : {type: Date, default: null},
//     completed : {type: Boolean, default: false, required:'Change request completed flag is required'},
//     status: {type: Schema.Types.ObjectId, default: null, ref: 'LogStatusIndicator', $tenant:true},
//     statusComment : {type: String, default:'', trim: true},
//     created: { type: Date, default: Date.now },
//     user: { type: Schema.ObjectId, ref: 'User' }
// };
//
// var approvalRecord = {
//     approvalState: {type: String, enum: ['draft', 'submitted', 'approved','rejected'], default:'draft', required:'Approval flag is required'},
//     created: { type: Date, default: Date.now },
//     user: { type: Schema.ObjectId, ref: 'User' }
// };


var ProjectChangeRequestSchema = new Schema({

    // project: {type: Schema.Types.ObjectId, ref: 'Project', $tenant:true, required:'Project for gate review required'},
    // gate : {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true, required:'Gate for gate review required'},
    //
    // raisedOnDate : {type: Date, default: Date.now, required:'Raised on date required'},
    //
    // title : {type: String, default:'', trim: true, required:'Review title required'},
    // description : {type: String, default:'', trim: true},
    //
    // reason : {type: Schema.Types.ObjectId, default: null, ref: 'LogReason', $tenant:true},
    // state : {type: Schema.Types.ObjectId, default: null, ref: 'ChangeRequestState', $tenant:true},
    // priority : {type: Schema.Types.ObjectId, default: null, ref: 'LogPriority', $tenant:true},
    //
    // approval : {
    //     currentRecord : approvalRecord,
    //     history : [approvalRecord]
    // },
    //
    // // This status refers to the changeRequest document implementation itself
    // statusReview : {
    //     currentRecord : statusReviewRecord,
    //     history : [statusReviewRecord]
    // },
    //
    // gateAssignmentReview : {
    //     budgetChange : {type: Number, default: null}
    // },
    //
    // baselineDurationReviews : [BaselineDurationReviewSchema],
    // actualDurationReviews : [ActualDurationReviewSchema],
    // baselineCostReviews : [BaselineCostReviewSchema],
    // actualCostReviews : [ActualCostReviewSchema],
    // baselineCompletionReviews : [BaselineCompletionReviewSchema],
    // actualCompletionReviews : [ActualCompletionReviewSchema],
    //
    // created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});


ProjectChangeRequestSchema.plugin(deepPopulate);
mongoose.mtModel('ProjectChangeRequest', ProjectChangeRequestSchema);
