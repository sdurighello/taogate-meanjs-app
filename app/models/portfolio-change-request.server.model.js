'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');


/**
 * Portfolio change request Schema
 */

var fundingRequestSchema = new Schema({
        title : {type: String, default:'', trim: true, required:'Request title required'},
        description : {type: String, default:'', trim: true},
        funds : {type: Number, default: 0, required:'Request funds required'},
        created: { type: Date, default: Date.now }
});

var PortfolioChangeRequestSchema = new Schema({

    portfolio: {type: Schema.Types.ObjectId, ref: 'Portfolio', $tenant:true, required:'Portfolio for portfolio CR is required'},

    raisedOnDate : {type: Date, default: Date.now, required:'Raised on date required'},

    title : {type: String, default:'', trim: true, required:'Change title required'},
    description : {type: String, default:'', trim: true},

    state : {type: Schema.Types.ObjectId, default: null, ref: 'ChangeRequestState', $tenant:true},
    priority : {type: Schema.Types.ObjectId, default: null, ref: 'LogPriority', $tenant:true},

    approval: {type: String, enum: ['draft', 'submitted', 'approved'], default:'draft', required:'Approval flag is required'},

    associatedProjectChangeRequests : [{type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', $tenant:true}],

    fundingRequests : [fundingRequestSchema],

    calculatedFundsRequested : {
        projectRequests : {type: Number},
        portfolioRequests : {type: Number},
        total : {type: Number}
    },

    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});

PortfolioChangeRequestSchema.plugin(deepPopulate);
mongoose.mtModel('PortfolioChangeRequest', PortfolioChangeRequestSchema);
