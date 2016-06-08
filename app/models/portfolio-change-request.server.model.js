'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate')(mongoose),
    async = require('async'),
    _ = require('lodash'),
    Schema = mongoose.Schema;

require('mongoose-multitenant');


/**
 * Portfolio change request Schema
 */

var FundingRequestSchema = new Schema({
        title : {type: String, default:'', trim: true, required:'Request title required'},
        description : {type: String, default:'', trim: true},
        funds : {type: Number, default: 0, required:'Request funds required'},
        created: { type: Date, default: Date.now }
});

var approvalRecord = {
    approvalState: {type: String, enum: ['draft', 'submitted', 'approved','rejected'], default:'draft', required:'Approval flag is required'},
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
};

var AssociatedProjectChangeRequestSchema = new Schema({
    _id : {type: Schema.Types.ObjectId, ref: 'Project.process.gates.projectChangeRequests', $tenant:true},
    project: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project', $tenant:true},
        name: {type: String}
    },
    gate : {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
        name: {type: String}
    },
    raisedOnDate : {type: Date},
    title : {type: String},
    description : {type: String},

    reason : {type: Schema.Types.ObjectId, ref: 'LogReason', $tenant:true},
    state : {type: Schema.Types.ObjectId, ref: 'ChangeRequestState', $tenant:true},
    priority : {type: Schema.Types.ObjectId, ref: 'LogPriority', $tenant:true},

    changeStatus : {
        currentRecord : {
            status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', $tenant:true}
        }
    },

    approval : {
        currentRecord : {
            approvalState: {type: String, enum: ['draft', 'submitted', 'approved','rejected']}
        }
    },

    budgetReview : {
        budgetChange : {type: Number}
    }
});

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

    associatedProjectChangeRequests : [AssociatedProjectChangeRequestSchema],

    fundingRequests : [FundingRequestSchema],
    
    totalFunding: {
        totalFundingRequests : {type: Number},
        totalFundingProjectChangeRequests : {type: Number},
        totalFundingPortfolioChangeRequest : {type: Number}
    },

    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }

});

PortfolioChangeRequestSchema.pre('save', function (next) {
    var totalFundingRequests = 0;
    var totalFundingProjectChangeRequests = 0;
    var totalFundingPortfolioChangeRequest;
    
    _.each(this.associatedProjectChangeRequests, function(cr){
        totalFundingProjectChangeRequests = totalFundingProjectChangeRequests + cr.budgetReview.budgetChange;
    });

    _.each(this.fundingRequests, function(fr){
        totalFundingRequests = totalFundingRequests + fr.funds;
    });

    totalFundingPortfolioChangeRequest = totalFundingRequests + totalFundingProjectChangeRequests;
    
    this.totalFunding = {
        totalFundingRequests : totalFundingRequests,
        totalFundingProjectChangeRequests : totalFundingProjectChangeRequests,
        totalFundingPortfolioChangeRequest : totalFundingPortfolioChangeRequest
    };
    
    next();
});

PortfolioChangeRequestSchema.plugin(deepPopulate);
mongoose.mtModel('PortfolioChangeRequest', PortfolioChangeRequestSchema);
