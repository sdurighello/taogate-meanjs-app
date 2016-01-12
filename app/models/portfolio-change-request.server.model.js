'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
    async = require('async'),
    _ = require('lodash'),
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

var approvalRecord = {
    approvalState: {type: String, enum: ['draft', 'submitted', 'approved'], default:'draft', required:'Approval flag is required'},
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
};

var PortfolioChangeRequestSchema = new Schema({

    portfolio: {type: Schema.Types.ObjectId, ref: 'Portfolio', $tenant:true, required:'Portfolio for portfolio CR is required'},

    raisedOnDate : {type: Date, default: Date.now, required:'Raised on date required'},

    title : {type: String, default:'', trim: true, required:'Change title required'},
    description : {type: String, default:'', trim: true},

    state : {type: Schema.Types.ObjectId, default: null, ref: 'ChangeRequestState', $tenant:true},
    priority : {type: Schema.Types.ObjectId, default: null, ref: 'LogPriority', $tenant:true},

    approval : {
        currentRecord : approvalRecord,
        history : [approvalRecord]
    },

    associatedProjectChangeRequests : [{type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', $tenant:true}],

    fundingRequests : [fundingRequestSchema],

    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' },

    statistics : {
        totalBaselineCostChange : {type: Number},
        totalCurrentBaselineCost : {type: Number},
        totalNewBaselineCost : {type: Number},

        totalActualCostChange : {type: Number},
        totalCurrentActualCost : {type: Number},
        totalNewActualCost : {type: Number}
    }

}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

PortfolioChangeRequestSchema.virtual('totalFundingRequests').get(function(){
    return _.reduce(this.fundingRequests, function(sum, request){
        return sum + request.funds;
    },0);
});

PortfolioChangeRequestSchema.plugin(deepPopulate);
mongoose.mtModel('PortfolioChangeRequest', PortfolioChangeRequestSchema);
