'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    getPortfolioPerformances = require('./gate-performances.server.controller').getPortfolioPerformances, // function(user, portfolio, callback)
    async = require('async'),
	_ = require('lodash');

/**
 * Create a Portfolio status report
 */
exports.create = function(req, res) {
    
    var PortfolioStatusReport = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioStatusReport');

    var portfolioStatusReport = new PortfolioStatusReport({
        user : req.user,

        portfolio : {
            _id: req.body.portfolio._id,
            name : req.body.portfolio.name
        },

        title : req.body.title,
        date : req.body.date,

        previousReport : {
            _id : (req.body.previousReport && req.body.previousReport._id) || null,
            title : (req.body.previousReport && req.body.previousReport.title) || null,
            date : (req.body.previousReport && req.body.previousReport.date) || null
        },

        portfolioManager : {
            _id : req.body.portfolio.portfolioManager._id,
            displayName : req.body.portfolio.portfolioManager.displayName
        },

        earmarkedFunds : {
            portfolioAmount : { previous: null, current: null, change: null, changeOnPrevious : null },
            projectsAmount : { previous: null, current: null, change: null, changeOnPrevious : null },
            variance : { previous: null, current: null, change: null, changeOnPrevious : null },
            variancePercent : { previous: null, current: null, change: null, changeOnPrevious : null }
        },

        performances : {
            numberOfProjects : { previous: null, current: null, change: null, changeOnPrevious : null },
            duration : {
                baselineDays : { previous: null, current: null, change: null, changeOnPrevious : null },
                estimateDays : { previous: null, current: null, change: null, changeOnPrevious : null },
                actualDays : { previous: null, current: null, change: null, changeOnPrevious : null },
                earnedActual : { previous: null, current: null, change: null, changeOnPrevious : null },
                variance : { previous: null, current: null, change: null, changeOnPrevious : null },
                variancePercent : { previous: null, current: null, change: null, changeOnPrevious : null }
            },
            cost : {
                baseline : { previous: null, current: null, change: null, changeOnPrevious : null },
                estimate : { previous: null, current: null, change: null, changeOnPrevious : null },
                actual : { previous: null, current: null, change: null, changeOnPrevious : null },
                earnedActual : { previous: null, current: null, change: null, changeOnPrevious : null },
                variance : { previous: null, current: null, change: null, changeOnPrevious : null },
                variancePercent : { previous: null, current: null, change: null, changeOnPrevious : null }
            },
            completion : {
                baseline : { previous: null, current: null, change: null, changeOnPrevious : null },
                estimate : { previous: null, current: null, change: null, changeOnPrevious : null },
                actual : { previous: null, current: null, change: null, changeOnPrevious : null },
                earnedActual : { previous: null, current: null, change: null, changeOnPrevious : null },
                variance : { previous: null, current: null, change: null, changeOnPrevious : null },
                variancePercent : { previous: null, current: null, change: null, changeOnPrevious : null }
            },
            budget : {
                amount : { previous: null, current: null, change: null, changeOnPrevious : null },
                averageAmount: { previous: null, current: null, change: null, changeOnPrevious : null },
                minAmount : { previous: null, current: null, change: null, changeOnPrevious : null },
                maxAmount : { previous: null, current: null, change: null, changeOnPrevious : null },
                varianceBaseline : { previous: null, current: null, change: null, changeOnPrevious : null }, // sum of projects' varianceBaselines
                varianceBaselinePercent : { previous: null, current: null, change: null, changeOnPrevious : null }, // varianceBaseline above / sum of project budgets
                varianceAtCompletion : { previous: null, current: null, change: null, changeOnPrevious : null }, // sum of project earnedActual - sum project budgets
                varianceAtCompletionPercent : { previous: null, current: null, change: null, changeOnPrevious : null } // varianceAtCompletion / sum project budgets
            },
            portfolioBudget : {
                amount : { previous: null, current: null, change: null, changeOnPrevious : null },
                variance : { previous: null, current: null, change: null, changeOnPrevious : null }, // sum project budgets / portfolio budget
                variancePercent : { previous: null, current: null, change: null, changeOnPrevious : null }, // projectsBudgetVariance / portfolio budget
                varianceBaseline : { previous: null, current: null, change: null, changeOnPrevious : null }, // sum of projects' cost baseline - portfolio budget
                varianceBaselinePercent : { previous: null, current: null, change: null, changeOnPrevious : null }, // varianceBaseline above / portfolio budget
                varianceAtCompletion : { previous: null, current: null, change: null, changeOnPrevious : null }, // sum of project earnedActual - portfolio budget
                varianceAtCompletionPercent : { previous: null, current: null, change: null, changeOnPrevious : null } // varianceAtCompletion / portfolio budget
            },
            earnedValueAnalysis : {
                earnedValueRatio: { previous: null, current: null, change: null, changeOnPrevious : null },
                earnedValue: { previous: null, current: null, change: null, changeOnPrevious : null },
                costVariance: { previous: null, current: null, change: null, changeOnPrevious : null },
                scheduleVariance: { previous: null, current: null, change: null, changeOnPrevious : null },
                percentScheduleVariance: { previous: null, current: null, change: null, changeOnPrevious : null },
                percentCostVariance: { previous: null, current: null, change: null, changeOnPrevious : null },
                costPerformanceIndex: { previous: null, current: null, change: null, changeOnPrevious : null },
                schedulePerformanceIndex: { previous: null, current: null, change: null, changeOnPrevious : null }
            }
        },

        deliveryStatus : {
            overallStatus : {
                projectDeliveryStatuses : []
            },
            portfolioStatusAreas : []
        },

        projectLogsStatistics : {
            milestones : [],
            issues : []
        },

        portfolioLogsStatistics : {
            milestones : [],
            issues : []
        }
    });

    // async.waterfall([
     //    // If there is a "previousReport" use it to populate all the previous fields, else they are null
     //    function(callback) {
     //        callback(null, 'one', 'two');
     //    },
     //    function(arg1, arg2, callback) {
     //        // arg1 now equals 'one' and arg2 now equals 'two'
     //        callback(null, 'three');
     //    },
     //    function(arg1, callback) {
     //        // arg1 now equals 'three'
     //        callback(null, 'done');
     //    }
    // ], function (err, result) {
     //    // result now equals 'done'
    // });
    //
    //
    //
    //
    //
    //
	// portfolioStatusReport.save(function(err) {
	// 	if (err) {
     //        console.log(err);
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.jsonp(portfolioStatusReport);
	// 	}
	// });
};

/**
 * Show the current Portfolio status report
 */
exports.read = function(req, res) {
	res.jsonp(req.portfolioStatusReport);
};

/**
 * Update a Portfolio status report
 */
exports.update = function(req, res) {
	var portfolioStatusReport = req.portfolioStatusReport ;

	portfolioStatusReport = _.extend(portfolioStatusReport , req.body);

	portfolioStatusReport.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioStatusReport);
		}
	});
};

/**
 * Delete an Portfolio status report
 */
exports.delete = function(req, res) {
	var portfolioStatusReport = req.portfolioStatusReport ;

	portfolioStatusReport.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioStatusReport);
		}
	});
};

/**
 * List of Portfolio status reports
 */
exports.list = function(req, res) {

    var PortfolioStatusReport = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioStatusReport');

    PortfolioStatusReport.find(req.query).populate('user', 'displayName').exec(function(err, portfolioStatusReports) {
		if (err) {
            console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioStatusReports);
		}
	});
};

/**
 * Portfolio status report middleware
 */
exports.portfolioStatusReportByID = function(req, res, next, id) {

    var PortfolioStatusReport = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioStatusReport');

    PortfolioStatusReport.findById(id).populate('user', 'displayName').exec(function(err, portfolioStatusReport) {
		if (err) return next(err);
		if (! portfolioStatusReport) return next(new Error('Failed to load Portfolio status report ' + id));
		req.portfolioStatusReport = portfolioStatusReport ;
		next();
	});
};

/**
 * Portfolio status report authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

	next();
};
