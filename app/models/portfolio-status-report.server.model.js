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
    status: {
        _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
        name : {type: String, default:null},
        color : {type: String, default: null}
    },
    numberOfProjects : numberStatisticsRecord,
    ratioOfProjects : numberStatisticsRecord,
    amountOfBudget : numberStatisticsRecord
});

// Portfolio Status Areas stats

var PortfolioStatusAreaSchema = new Schema({
    status: {
        _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
        name : {type: String, default:null},
        color : {type: String, default: null}
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

    earmarkedFunds : {
        portfolioAmount : numberStatisticsRecord,
        projectsAmount : numberStatisticsRecord,
        variance : numberStatisticsRecord,
        variancePercent : numberStatisticsRecord
    },

    performances : {
        numberOfProjects : numberStatisticsRecord,
        duration : {
            baselineDays : numberStatisticsRecord,
            estimateDays : numberStatisticsRecord,
            actualDays : numberStatisticsRecord,
            earnedActual : numberStatisticsRecord,
            variance : numberStatisticsRecord, // baselineDays - estimateDays (actual if completed)
            variancePercent : numberStatisticsRecord // variance / baselineDays
        },
        cost : {
            baseline : numberStatisticsRecord,
            estimate : numberStatisticsRecord,
            actual : numberStatisticsRecord,
            earnedActual : numberStatisticsRecord,
            variance : numberStatisticsRecord, // baseline - estimate (actual if completed)
            variancePercent : numberStatisticsRecord // variance / baseline
        },
        completion : {
            baseline : numberStatisticsRecord,
            estimate : numberStatisticsRecord,
            actual : numberStatisticsRecord,
            earnedActual : numberStatisticsRecord,
            variance : numberStatisticsRecord, // baseline - estimate (actual if completed)
            variancePercent : numberStatisticsRecord // variance / baseline
        },
        budget : {
            amount : numberStatisticsRecord, // sum of project budgets
            averageAmount: numberStatisticsRecord,
            minAmount : numberStatisticsRecord,
            maxAmount : numberStatisticsRecord,
            varianceBaseline : numberStatisticsRecord, // sum of projects' varianceBaselines
            varianceBaselinePercent : numberStatisticsRecord, // varianceBaseline above / sum of project budgets
            varianceAtCompletion : numberStatisticsRecord, // sum of project earnedActual - sum project budgets
            varianceAtCompletionPercent : numberStatisticsRecord // varianceAtCompletion / sum project budgets
        },
        portfolioBudget : {
            amount : numberStatisticsRecord,
            variance : numberStatisticsRecord, // sum project budgets / portfolio budget
            variancePercent : numberStatisticsRecord, // projectsBudgetVariance / portfolio budget
            varianceBaseline : numberStatisticsRecord, // sum of projects' cost baseline - portfolio budget
            varianceBaselinePercent : numberStatisticsRecord, // varianceBaseline above / portfolio budget
            varianceAtCompletion : numberStatisticsRecord, // sum of project earnedActual - portfolio budget
            varianceAtCompletionPercent : numberStatisticsRecord // varianceAtCompletion / portfolio budget
        },
        earnedValueAnalysis : {
            earnedValueRatio: numberStatisticsRecord,
            earnedValue: numberStatisticsRecord,
            costVariance: numberStatisticsRecord,
            scheduleVariance: numberStatisticsRecord,
            percentScheduleVariance: numberStatisticsRecord,
            percentCostVariance: numberStatisticsRecord,
            costPerformanceIndex: numberStatisticsRecord,
            schedulePerformanceIndex: numberStatisticsRecord
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
    }
    
});

mongoose.mtModel('PortfolioStatusReport', PortfolioStatusReportSchema);
