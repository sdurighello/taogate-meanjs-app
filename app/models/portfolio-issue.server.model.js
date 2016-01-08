'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Portfolio issue Schema
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

var escalationActionSchema = new Schema({
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' },

    raisedOnDate : {type: Date, default: Date.now, required:'Raised on date required'},
    escalatedTo : {type: Schema.Types.ObjectId, default:null, ref: 'Person', $tenant:true},
    idNumber: {type: Number, required:'Sequential idNumber for escalation action is required'},
    title: {type: String, default: '', trim: true, required: 'Please fill Portfolio issue name'},
    description: {type: String, default: '', trim: true},
    state : {type: Schema.Types.ObjectId, default: null, ref: 'IssueActionState', $tenant:true},
    priority : {type: Schema.Types.ObjectId, default: null, ref: 'LogPriority', $tenant:true},

    statusReview : {
        currentRecord : statusReviewRecord,
        history : [statusReviewRecord]
    }
});

var PortfolioIssueSchema = new Schema({

	portfolio: {type: Schema.Types.ObjectId, ref: 'Portfolio', $tenant:true, required:'Portfolio is required'},

	raisedOnDate : {type: Date, default: Date.now, required:'Raised on date required'},

	idNumber: {type: Number, required:'Sequential idNumber for portfolioIssue is required'},
	title: {type: String, default: '', trim: true, required: 'Please fill Portfolio issue name'},
	description: {type: String, default: '', trim: true},

	reason : {type: Schema.Types.ObjectId, default: null, ref: 'LogReason', $tenant:true},
	state : {type: Schema.Types.ObjectId, default: null, ref: 'IssueState', $tenant:true},
	priority : {type: Schema.Types.ObjectId, default: null, ref: 'LogPriority', $tenant:true},

	statusReview : {
		currentRecord : statusReviewRecord,
		history : [statusReviewRecord]
	},

	escalationActions : [escalationActionSchema],

    associatedProjectIssues : [{type: Schema.Types.ObjectId, ref: 'ProjectIssue', $tenant:true}],

	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User', default:null}
});

PortfolioIssueSchema.plugin(deepPopulate);
mongoose.mtModel('PortfolioIssue', PortfolioIssueSchema);
