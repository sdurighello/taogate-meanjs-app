'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Improvement activity Schema
 */

var statusReviewRecord = {
	baselineDeliveryDate : {type: Date, default: null},
	estimateDeliveryDate : {type: Date, default: null},
	actualDeliveryDate : {type: Date, default: null},
	completed : {type: Boolean, default: false, required:'Activity completed flag is required'},
	status: {type: Schema.Types.ObjectId, default: null, ref: 'LogStatusIndicator', $tenant:true},
	statusComment : {type: String, default:'', trim: true},
	created: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: 'User' }
};

var ImprovementActivitySchema = new Schema({

	portfolio: {type: Schema.Types.ObjectId, ref: 'Portfolio', $tenant:true},
    assignedTo: {type: Schema.Types.ObjectId, ref: 'Person', $tenant:true},
	raisedOnDate : {type: Date, default: Date.now, required:'Raised on date required'},

	idNumber: {type: Number, required:'Sequential idNumber for improvementActivity is required'},
	title: {type: String, default: '', trim: true, required: 'Please fill improvement activity title'},
	description: {type: String, default: '', trim: true},

	type : {type: Schema.Types.ObjectId, default: null, ref: 'ImprovementType', $tenant:true},
	reason : {type: Schema.Types.ObjectId, default: null, ref: 'ImprovementReason', $tenant:true},
	state : {type: Schema.Types.ObjectId, default: null, ref: 'ImprovementState', $tenant:true},
	priority : {type: Schema.Types.ObjectId, default: null, ref: 'LogPriority', $tenant:true},

	statusReview : {
		currentRecord : statusReviewRecord,
		history : [statusReviewRecord]
	},

	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User', default:null}
});

ImprovementActivitySchema.plugin(deepPopulate);
mongoose.mtModel('ImprovementActivity', ImprovementActivitySchema);
