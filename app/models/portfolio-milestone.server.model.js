'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Portfolio milestone Schema
 */

var statusReviewRecord = {
    baselineDeliveryDate : {type: Date, default: null},
    estimateDeliveryDate : {type: Date, default: null},
    actualDeliveryDate : {type: Date, default: null},
    completed : {type: Boolean, default: false, required:'Milestone completed flag is required'},
    status: {type: Schema.Types.ObjectId, default: null, ref: 'LogStatusIndicator', $tenant:true},
    statusComment : {type: String, default:'', trim: true},
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
};

var PortfolioMilestoneSchema = new Schema({
	portfolio: {type: Schema.Types.ObjectId, ref: 'Portfolio', $tenant:true, required:'Portfolio for portfolio milestone is required'},
	type : {type: Schema.Types.ObjectId, ref: 'PortfolioMilestoneType', $tenant:true, required:'Type for portfolio milestone is required'},

	name : {type: String, default:'', trim: true, required:'Name for portfolio milestone required'},
	description : {type: String, default:'', trim: true},
	state : {type: Schema.Types.ObjectId, default: null, ref: 'ChangeRequestState', $tenant:true},

    statusReview : {
        currentRecord : statusReviewRecord,
        history : [statusReviewRecord]
    },

    associatedProjectMilestones : [{type: Schema.Types.ObjectId, default: null, ref: 'ProjectMilestone', $tenant:true}],

	created: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: 'User' }
});

PortfolioMilestoneSchema.plugin(deepPopulate);
mongoose.mtModel('PortfolioMilestone', PortfolioMilestoneSchema);
