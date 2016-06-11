'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Portfolio status report Schema
 */

// Previous/Current - Number

var numberStatisticsRecord = {
    previous: {type: Number, default: null},
    current: {type: Number, default: null},
    change: {type: Number, default: null},
    changeOnPrevious : {type: Number, default: null}
};

// Project Delivery Status stats

var ProjectDeliveryStatusSchema = new Schema({
    statusArea:{
        _id: {type: Schema.Types.ObjectId, ref: 'LogStatusArea', $tenant:true},
        name: {type: String}
    },
    numberOfProjects : numberStatisticsRecord,
    ratioOfProjects : numberStatisticsRecord,
    amountOfBudget : numberStatisticsRecord
});

// Portfolio Status Areas stats

var PortfolioStatusAreaSchema = new Schema({
    statusArea:{
        _id: {type: Schema.Types.ObjectId, ref: 'LogStatusArea', $tenant:true},
        name: {type: String}
    },
    comment :{type: String, trim:true, default: null},
    projectDeliveryStatuses : [ProjectDeliveryStatusSchema]
});

// Logs stats

var LogStatusStatisticsSchema = new Schema({
    status: {
        _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
        name : {type: String, default:null},
        color : {type: String, default: null}
    },
    numberOfLogItems : numberStatisticsRecord,
    ratioOfLogItems : numberStatisticsRecord
});

var LogPriorityStatisticsSchema = new Schema({
    priority: {
        _id : {type: Schema.Types.ObjectId, ref: 'LogPriority', default:null, $tenant:true},
        name : {type: String, default:null},
        position : {type: Number, default: null}
    },
    numberOfLogItems : numberStatisticsRecord, // n. of milestones or issues with that priority across all projects in the portfolio or for the portfolio
    ratioOfLogItems : numberStatisticsRecord,
    byStatus : [LogStatusStatisticsSchema]

});

// Appendix

var PortfolioMilestoneSchema = new Schema({

});

var PortfolioIssueSchema = new Schema({

});

var PortfolioChangeRequestSchema = new Schema({

});


/* ---- MAIN SCHEMA ---- */

var PortfolioStatusReportSchema = new Schema({

    // All comments can be overwritten at "edit" time. All the rest read-only.

    created : {type: Date, default: Date.now()},
    user : {type: Schema.Types.ObjectId, ref: 'User'},

    portfolio : {
        _id: {type: Schema.Types.ObjectId, ref: 'Portfolio', $tenant: true, required: 'Portfolio is required'},
        name : {type: String}
    },

    title : {type: String, trim: true, required: 'Title is required'},
    date : {type: Date, required: 'Date is required'},

    previousReport : {
        _id : {type: Schema.Types.ObjectId, ref: 'PortfolioStatusReport', $tenant: true, default: null},
        title : {type: String, default: null},
        date : {type: Date, default: null}
    },

    portfolioManager : {
        _id : {type: Schema.Types.ObjectId, ref: 'User', default:null},
        displayName : {type: String, default: null}
    },

    totalNumberOfProjects : numberStatisticsRecord,

    budgetStatistics : {
        earmarkedFunds : {
            portfolioFunds : numberStatisticsRecord,
            projectsFunds : numberStatisticsRecord
        },
        budget : {
            portfolioBudget : numberStatisticsRecord,
            projectsBudget : numberStatisticsRecord,
            portfolioBudgetShortfall : numberStatisticsRecord, // portfolioBudget - projectsBudget
            portfolioBudgetShortfallRatio : numberStatisticsRecord, // portfolioBudgetShortfall / projectsBudget
            AvgProjectsBudget : numberStatisticsRecord,
            maxProjectsBudget : numberStatisticsRecord,
            minProjectsBudget : numberStatisticsRecord
        }
    },

    deliveryStatus : {
        overallStatus : {
            status: {
                _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
                name : {type: String, default:null},
                color : {type: String, default: null}
            },
            comment :{type: String, trim:true, default: null},
            projectDeliveryStatuses : [ProjectDeliveryStatusSchema]
        },
        portfolioStatusAreas : [PortfolioStatusAreaSchema]
    },

    projectLogsStatistics : {
        milestones : [LogPriorityStatisticsSchema],
        issues : [LogPriorityStatisticsSchema]
    },

    portfolioLogsStatistics : {
        milestones : [LogPriorityStatisticsSchema],
        issues : [LogPriorityStatisticsSchema]
    },

    appendix : { // Tick box to choose which logs to bring in at "create report". Once click "save", server copies the data here and you can "edit" by removing/overwriting
        portfolioMilestones : [PortfolioMilestoneSchema],
        portfolioIssues : [PortfolioIssueSchema],
        portfolioChangeRequests : [PortfolioChangeRequestSchema]
        // roadmap chart
        // dependencies force graph
    }

});

mongoose.mtModel('PortfolioStatusReport', PortfolioStatusReportSchema);
