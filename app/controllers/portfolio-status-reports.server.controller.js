'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    getPortfolioPerformances = require('./gate-performances.server.controller').getPortfolioPerformances, // function(user, portfolioId (null for unassigned), callback)
    async = require('async'),
	_ = require('lodash');

/**
 * Create a Portfolio status report
 */
exports.create = function(req, res) {
    
    var PortfolioStatusReport = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioStatusReport');
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var LogStatusIndicator = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusIndicator');
    var LogPriority = mongoose.mtModel(req.user.tenantId + '.' + 'LogPriority');

    // Checks
    if(!(req.body.portfolio && req.body.portfolio._id)){
        return res.status(400).send({
            message: 'Portfolio id missing'
        });
    }

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
            _id : (req.body.portfolio.portfolioManager && req.body.portfolio.portfolioManager._id) || null,
            displayName : (req.body.portfolio.portfolioManager && req.body.portfolio.portfolioManager.displayName) || null
        },

        numberOfActiveProjects : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },

        earmarkedFunds : {
            portfolioAmount : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
            averageAmount : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
            minAmount : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
            maxAmount : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
            projectsAmount : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
            variance : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
            variancePercent : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }
        },

        performances : {
            numberOfProjects : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
            duration : {
                baselineDays : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                estimateDays : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                actualDays : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                earnedActual : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                variance : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                variancePercent : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }
            },
            cost : {
                baseline : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                estimate : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                actual : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                earnedActual : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                variance : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                variancePercent : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }
            },
            completion : {
                baseline : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                estimate : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                actual : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                earnedActual : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                variance : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                variancePercent : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }
            },
            budget : {
                amount : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                averageAmount: { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                minAmount : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                maxAmount : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                varianceBaseline : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }, // sum of projects' varianceBaselines
                varianceBaselinePercent : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }, // varianceBaseline above / sum of project budgets
                varianceAtCompletion : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }, // sum of project earnedActual - sum project budgets
                varianceAtCompletionPercent : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 } // varianceAtCompletion / sum project budgets
            },
            portfolioBudget : {
                amount : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                variance : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }, // sum project budgets / portfolio budget
                variancePercent : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }, // projectsBudgetVariance / portfolio budget
                varianceBaseline : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }, // sum of projects' cost baseline - portfolio budget
                varianceBaselinePercent : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }, // varianceBaseline above / portfolio budget
                varianceAtCompletion : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }, // sum of project earnedActual - portfolio budget
                varianceAtCompletionPercent : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 } // varianceAtCompletion / portfolio budget
            },
            earnedValueAnalysis : {
                earnedValueRatio: { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                earnedValue: { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                costVariance: { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                scheduleVariance: { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                percentScheduleVariance: { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                percentCostVariance: { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                costPerformanceIndex: { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                schedulePerformanceIndex: { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }
            }
        },

        deliveryStatus : {
            overallStatus : {
                projectStatuses : []
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

    async.waterfall([
        // Get INPUT DATA in parallel
        function(callback){
            async.parallel({
                portfolio: function (callback) {
                    Portfolio.findById(req.body.portfolio._id).select({stakeholders: 0}).exec(function (err, portfolio) {
                        if (err) {
                            return callback(err);
                        }
                        if (!portfolio) {
                            return callback({message: 'Cannot find portfolio with id: ' + req.body.portfolio._id});
                        }
                        callback(null, portfolio);
                    });
                },
                projects: function (callback) {
                    Project.find({'selection.active': true, portfolio: req.body.portfolio._id})
                        .select({
                            categorization: 0,
                            prioritization: 0,
                            qualitativeAnalysis: 0,
                            riskAnalysis: 0,
                            costs: 0,
                            benefits: 0,
                            stakeholders: 0
                        })
                        .exec(function (err, projects) {
                            if (err) {
                                return callback(err);
                            }
                            callback(null, projects);
                        });
                },
                previousReport: function (callback) {
                    if (req.body.previousReport && req.body.previousReport._id) {
                        PortfolioStatusReport.findById(req.body.previousReport._id).exec(function (err, previousReport) {
                            if (err) {
                                return callback(err);
                            }
                            if (!previousReport) {
                                return callback({message: 'Cannot find previous report with id: ' + req.body.previousReport._id});
                            }
                            callback(null, previousReport);
                        });
                    } else {
                        callback(null, {});
                    }
                },
                logStatusIndicators: function (callback) {
                    LogStatusIndicator.find().exec(function (err, retArray) {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, retArray);
                    });
                },
                logPriorities: function (callback) {
                    LogPriority.find().exec(function (err, retArray) {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, retArray);
                    });
                }
            }, function (err, inputObj) {
                if(err){
                    return callback(err);
                }
                getPortfolioPerformances(req.user, inputObj.portfolio._id, function (err, performances) {
                    if (err) {
                        return callback(err);
                    }
                    inputObj.performances = performances;
                    callback(null, inputObj);
                });
            });
        },
        // CREATE REPORT
        function(inputObj, callback) {

            // Number of active projects in portfolio
            portfolioStatusReport.numberOfActiveProjects.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.numberOfActiveProjects.current) || 0;
            portfolioStatusReport.numberOfActiveProjects.current = inputObj.projects.length;
            portfolioStatusReport.numberOfActiveProjects.change = portfolioStatusReport.numberOfActiveProjects.current - portfolioStatusReport.numberOfActiveProjects.previous;
            portfolioStatusReport.numberOfActiveProjects.changeOnPrevious = portfolioStatusReport.numberOfActiveProjects.previous !== 0 ? portfolioStatusReport.numberOfActiveProjects.change / portfolioStatusReport.numberOfActiveProjects.previous : 0;

            // Earmarked funds
            portfolioStatusReport.earmarkedFunds.portfolioAmount.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.earmarkedFunds.portfolioAmount.current) || 0;
            portfolioStatusReport.earmarkedFunds.portfolioAmount.current = inputObj.portfolio.earmarkedFunds;
            portfolioStatusReport.earmarkedFunds.portfolioAmount.change = portfolioStatusReport.earmarkedFunds.portfolioAmount.current - portfolioStatusReport.earmarkedFunds.portfolioAmount.previous;
            portfolioStatusReport.earmarkedFunds.portfolioAmount.changeOnPrevious = portfolioStatusReport.earmarkedFunds.portfolioAmount.previous !== 0 ? portfolioStatusReport.earmarkedFunds.portfolioAmount.change / portfolioStatusReport.earmarkedFunds.portfolioAmount.previous : 0;

            portfolioStatusReport.earmarkedFunds.averageAmount.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.earmarkedFunds.averageAmount.current) || 0;
            portfolioStatusReport.earmarkedFunds.averageAmount.current = portfolioStatusReport.numberOfActiveProjects.current !==0 ? portfolioStatusReport.earmarkedFunds.portfolioAmount.current / portfolioStatusReport.numberOfActiveProjects.current : 0;
            portfolioStatusReport.earmarkedFunds.averageAmount.change = portfolioStatusReport.earmarkedFunds.averageAmount.current - portfolioStatusReport.earmarkedFunds.averageAmount.previous;
            portfolioStatusReport.earmarkedFunds.averageAmount.changeOnPrevious = portfolioStatusReport.earmarkedFunds.averageAmount.previous !== 0 ? portfolioStatusReport.earmarkedFunds.averageAmount.change / portfolioStatusReport.earmarkedFunds.averageAmount.previous : 0;

            portfolioStatusReport.earmarkedFunds.minAmount.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.earmarkedFunds.minAmount.current) || 0;
            portfolioStatusReport.earmarkedFunds.minAmount.current = inputObj.projects.length > 0 ? _.min(inputObj.projects, function(project){ return project.identification.earmarkedFunds; }).identification.earmarkedFunds : 0;
            portfolioStatusReport.earmarkedFunds.minAmount.change = portfolioStatusReport.earmarkedFunds.minAmount.current - portfolioStatusReport.earmarkedFunds.minAmount.previous;
            portfolioStatusReport.earmarkedFunds.minAmount.changeOnPrevious = portfolioStatusReport.earmarkedFunds.minAmount.previous !== 0 ? portfolioStatusReport.earmarkedFunds.minAmount.change / portfolioStatusReport.earmarkedFunds.minAmount.previous : 0;

            portfolioStatusReport.earmarkedFunds.maxAmount.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.earmarkedFunds.maxAmount.current) || 0;
            portfolioStatusReport.earmarkedFunds.maxAmount.current = inputObj.projects.length > 0 ? _.max(inputObj.projects, function(project){ return project.identification.earmarkedFunds; }).identification.earmarkedFunds : 0;
            portfolioStatusReport.earmarkedFunds.maxAmount.change = portfolioStatusReport.earmarkedFunds.maxAmount.current - portfolioStatusReport.earmarkedFunds.maxAmount.previous;
            portfolioStatusReport.earmarkedFunds.maxAmount.changeOnPrevious = portfolioStatusReport.earmarkedFunds.maxAmount.previous !== 0 ? portfolioStatusReport.earmarkedFunds.maxAmount.change / portfolioStatusReport.earmarkedFunds.maxAmount.previous : 0;

            portfolioStatusReport.earmarkedFunds.projectsAmount.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.earmarkedFunds.projectsAmount.current) || 0;
            portfolioStatusReport.earmarkedFunds.projectsAmount.current = _.reduce(inputObj.projects, function (sum, project) { return sum + project.identification.earmarkedFunds; }, 0);
            portfolioStatusReport.earmarkedFunds.projectsAmount.change = portfolioStatusReport.earmarkedFunds.projectsAmount.current - portfolioStatusReport.earmarkedFunds.projectsAmount.previous;
            portfolioStatusReport.earmarkedFunds.projectsAmount.changeOnPrevious = portfolioStatusReport.earmarkedFunds.projectsAmount.previous !== 0 ? portfolioStatusReport.earmarkedFunds.projectsAmount.change / portfolioStatusReport.earmarkedFunds.projectsAmount.previous : 0;

            portfolioStatusReport.earmarkedFunds.variance.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.earmarkedFunds.variance.current) || 0;
            portfolioStatusReport.earmarkedFunds.variance.current = portfolioStatusReport.earmarkedFunds.portfolioAmount.current - portfolioStatusReport.earmarkedFunds.projectsAmount.current;
            portfolioStatusReport.earmarkedFunds.variance.change = portfolioStatusReport.earmarkedFunds.variance.current - portfolioStatusReport.earmarkedFunds.variance.previous;
            portfolioStatusReport.earmarkedFunds.variance.changeOnPrevious = portfolioStatusReport.earmarkedFunds.variance.previous !== 0 ? portfolioStatusReport.earmarkedFunds.variance.change / portfolioStatusReport.earmarkedFunds.variance.previous : 0;

            portfolioStatusReport.earmarkedFunds.variancePercent.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.earmarkedFunds.variancePercent.current) || 0;
            portfolioStatusReport.earmarkedFunds.variancePercent.current = portfolioStatusReport.earmarkedFunds.portfolioAmount.current !==0 ? portfolioStatusReport.earmarkedFunds.variance.current / portfolioStatusReport.earmarkedFunds.portfolioAmount.current : 0;
            portfolioStatusReport.earmarkedFunds.variancePercent.change = portfolioStatusReport.earmarkedFunds.variancePercent.current - portfolioStatusReport.earmarkedFunds.variancePercent.previous;
            portfolioStatusReport.earmarkedFunds.variancePercent.changeOnPrevious = portfolioStatusReport.earmarkedFunds.variancePercent.previous !== 0 ? portfolioStatusReport.earmarkedFunds.variancePercent.change / portfolioStatusReport.earmarkedFunds.variancePercent.previous : 0;

            // Performances - N. of projects (in delivery)
            portfolioStatusReport.performances.numberOfProjects.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.numberOfProjects.current) || 0;
            portfolioStatusReport.performances.numberOfProjects.current = inputObj.performances.portfolio.numberOfProjects;
            portfolioStatusReport.performances.numberOfProjects.change = portfolioStatusReport.performances.numberOfProjects.current - portfolioStatusReport.performances.numberOfProjects.previous;
            portfolioStatusReport.performances.numberOfProjects.changeOnPrevious = portfolioStatusReport.performances.numberOfProjects.previous !==0 ? portfolioStatusReport.performances.numberOfProjects.change / portfolioStatusReport.performances.numberOfProjects.previous : 0;

            // Performances - Duration
            portfolioStatusReport.performances.duration.baselineDays.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.duration.baselineDays.current) || 0;
            portfolioStatusReport.performances.duration.baselineDays.current = inputObj.performances.portfolio.duration.baselineDays;
            portfolioStatusReport.performances.duration.baselineDays.change = portfolioStatusReport.performances.duration.baselineDays.current - portfolioStatusReport.performances.duration.baselineDays.previous;
            portfolioStatusReport.performances.duration.baselineDays.changeOnPrevious = portfolioStatusReport.performances.duration.baselineDays.previous !== 0 ? portfolioStatusReport.performances.duration.baselineDays.change / portfolioStatusReport.performances.duration.baselineDays.previous : 0;

            portfolioStatusReport.performances.duration.estimateDays.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.duration.estimateDays.current) || 0;
            portfolioStatusReport.performances.duration.estimateDays.current = inputObj.performances.portfolio.duration.estimateDays;
            portfolioStatusReport.performances.duration.estimateDays.change = portfolioStatusReport.performances.duration.estimateDays.current - portfolioStatusReport.performances.duration.estimateDays.previous;
            portfolioStatusReport.performances.duration.estimateDays.changeOnPrevious = portfolioStatusReport.performances.duration.estimateDays.previous !== 0 ? portfolioStatusReport.performances.duration.estimateDays.change / portfolioStatusReport.performances.duration.estimateDays.previous : 0;

            portfolioStatusReport.performances.duration.actualDays.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.duration.actualDays.current) || 0;
            portfolioStatusReport.performances.duration.actualDays.current = inputObj.performances.portfolio.duration.actualDays;
            portfolioStatusReport.performances.duration.actualDays.change = portfolioStatusReport.performances.duration.actualDays.current - portfolioStatusReport.performances.duration.actualDays.previous;
            portfolioStatusReport.performances.duration.actualDays.changeOnPrevious = portfolioStatusReport.performances.duration.actualDays.previous !== 0 ? portfolioStatusReport.performances.duration.actualDays.change / portfolioStatusReport.performances.duration.actualDays.previous : 0;

            portfolioStatusReport.performances.duration.earnedActual.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.duration.earnedActual.current) || 0;
            portfolioStatusReport.performances.duration.earnedActual.current = inputObj.performances.portfolio.duration.earnedActual;
            portfolioStatusReport.performances.duration.earnedActual.change = portfolioStatusReport.performances.duration.earnedActual.current - portfolioStatusReport.performances.duration.earnedActual.previous;
            portfolioStatusReport.performances.duration.earnedActual.changeOnPrevious = portfolioStatusReport.performances.duration.earnedActual.previous !== 0 ? portfolioStatusReport.performances.duration.earnedActual.change / portfolioStatusReport.performances.duration.earnedActual.previous : 0;

            portfolioStatusReport.performances.duration.earnedActual.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.duration.earnedActual.current) || 0;
            portfolioStatusReport.performances.duration.earnedActual.current = inputObj.performances.portfolio.duration.earnedActual;
            portfolioStatusReport.performances.duration.earnedActual.change = portfolioStatusReport.performances.duration.earnedActual.current - portfolioStatusReport.performances.duration.earnedActual.previous;
            portfolioStatusReport.performances.duration.earnedActual.changeOnPrevious = portfolioStatusReport.performances.duration.earnedActual.previous !== 0 ? portfolioStatusReport.performances.duration.earnedActual.change / portfolioStatusReport.performances.duration.earnedActual.previous : 0;

            portfolioStatusReport.performances.duration.variance.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.duration.variance.current) || 0;
            portfolioStatusReport.performances.duration.variance.current = inputObj.performances.portfolio.duration.variance;
            portfolioStatusReport.performances.duration.variance.change = portfolioStatusReport.performances.duration.variance.current - portfolioStatusReport.performances.duration.variance.previous;
            portfolioStatusReport.performances.duration.variance.changeOnPrevious = portfolioStatusReport.performances.duration.variance.previous !== 0 ? portfolioStatusReport.performances.duration.variance.change / portfolioStatusReport.performances.duration.variance.previous : 0;

            portfolioStatusReport.performances.duration.variancePercent.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.duration.variancePercent.current) || 0;
            portfolioStatusReport.performances.duration.variancePercent.current = inputObj.performances.portfolio.duration.variancePercent;
            portfolioStatusReport.performances.duration.variancePercent.change = portfolioStatusReport.performances.duration.variancePercent.current - portfolioStatusReport.performances.duration.variancePercent.previous;
            portfolioStatusReport.performances.duration.variancePercent.changeOnPrevious = portfolioStatusReport.performances.duration.variancePercent.previous !== 0 ? portfolioStatusReport.performances.duration.variancePercent.change / portfolioStatusReport.performances.duration.variancePercent.previous : 0;

            // Performances - Cost
            portfolioStatusReport.performances.cost.baseline.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.cost.baseline.current) || 0;
            portfolioStatusReport.performances.cost.baseline.current = inputObj.performances.portfolio.cost.baseline;
            portfolioStatusReport.performances.cost.baseline.change = portfolioStatusReport.performances.cost.baseline.current - portfolioStatusReport.performances.cost.baseline.previous;
            portfolioStatusReport.performances.cost.baseline.changeOnPrevious = portfolioStatusReport.performances.cost.baseline.previous !== 0 ? portfolioStatusReport.performances.cost.baseline.change / portfolioStatusReport.performances.cost.baseline.previous : 0;

            portfolioStatusReport.performances.cost.estimate.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.cost.estimate.current) || 0;
            portfolioStatusReport.performances.cost.estimate.current = inputObj.performances.portfolio.cost.estimate;
            portfolioStatusReport.performances.cost.estimate.change = portfolioStatusReport.performances.cost.estimate.current - portfolioStatusReport.performances.cost.estimate.previous;
            portfolioStatusReport.performances.cost.estimate.changeOnPrevious = portfolioStatusReport.performances.cost.estimate.previous !== 0 ? portfolioStatusReport.performances.cost.estimate.change / portfolioStatusReport.performances.cost.estimate.previous : 0;

            portfolioStatusReport.performances.cost.actual.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.cost.actual.current) || 0;
            portfolioStatusReport.performances.cost.actual.current = inputObj.performances.portfolio.cost.actual;
            portfolioStatusReport.performances.cost.actual.change = portfolioStatusReport.performances.cost.actual.current - portfolioStatusReport.performances.cost.actual.previous;
            portfolioStatusReport.performances.cost.actual.changeOnPrevious = portfolioStatusReport.performances.cost.actual.previous !== 0 ? portfolioStatusReport.performances.cost.actual.change / portfolioStatusReport.performances.cost.actual.previous : 0;

            portfolioStatusReport.performances.cost.earnedActual.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.cost.earnedActual.current) || 0;
            portfolioStatusReport.performances.cost.earnedActual.current = inputObj.performances.portfolio.cost.earnedActual;
            portfolioStatusReport.performances.cost.earnedActual.change = portfolioStatusReport.performances.cost.earnedActual.current - portfolioStatusReport.performances.cost.earnedActual.previous;
            portfolioStatusReport.performances.cost.earnedActual.changeOnPrevious = portfolioStatusReport.performances.cost.earnedActual.previous !== 0 ? portfolioStatusReport.performances.cost.earnedActual.change / portfolioStatusReport.performances.cost.earnedActual.previous : 0;

            portfolioStatusReport.performances.cost.variance.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.cost.variance.current) || 0;
            portfolioStatusReport.performances.cost.variance.current = inputObj.performances.portfolio.cost.variance;
            portfolioStatusReport.performances.cost.variance.change = portfolioStatusReport.performances.cost.variance.current - portfolioStatusReport.performances.cost.variance.previous;
            portfolioStatusReport.performances.cost.variance.changeOnPrevious = portfolioStatusReport.performances.cost.variance.previous !== 0 ? portfolioStatusReport.performances.cost.variance.change / portfolioStatusReport.performances.cost.variance.previous : 0;

            portfolioStatusReport.performances.cost.variancePercent.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.cost.variancePercent.current) || 0;
            portfolioStatusReport.performances.cost.variancePercent.current = inputObj.performances.portfolio.cost.variancePercent;
            portfolioStatusReport.performances.cost.variancePercent.change = portfolioStatusReport.performances.cost.variancePercent.current - portfolioStatusReport.performances.cost.variancePercent.previous;
            portfolioStatusReport.performances.cost.variancePercent.changeOnPrevious = portfolioStatusReport.performances.cost.variancePercent.previous !== 0 ? portfolioStatusReport.performances.cost.variancePercent.change / portfolioStatusReport.performances.cost.variancePercent.previous : 0;

            // Performances - Completion
            portfolioStatusReport.performances.completion.baseline.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.completion.baseline.current) || 0;
            portfolioStatusReport.performances.completion.baseline.current = inputObj.performances.portfolio.completion.baseline;
            portfolioStatusReport.performances.completion.baseline.change = portfolioStatusReport.performances.completion.baseline.current - portfolioStatusReport.performances.completion.baseline.previous;
            portfolioStatusReport.performances.completion.baseline.changeOnPrevious = portfolioStatusReport.performances.completion.baseline.previous !== 0 ? portfolioStatusReport.performances.completion.baseline.change / portfolioStatusReport.performances.completion.baseline.previous : 0;

            portfolioStatusReport.performances.completion.estimate.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.completion.estimate.current) || 0;
            portfolioStatusReport.performances.completion.estimate.current = inputObj.performances.portfolio.completion.estimate;
            portfolioStatusReport.performances.completion.estimate.change = portfolioStatusReport.performances.completion.estimate.current - portfolioStatusReport.performances.completion.estimate.previous;
            portfolioStatusReport.performances.completion.estimate.changeOnPrevious = portfolioStatusReport.performances.completion.estimate.previous !== 0 ? portfolioStatusReport.performances.completion.estimate.change / portfolioStatusReport.performances.completion.estimate.previous : 0;

            portfolioStatusReport.performances.completion.actual.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.completion.actual.current) || 0;
            portfolioStatusReport.performances.completion.actual.current = inputObj.performances.portfolio.completion.actual;
            portfolioStatusReport.performances.completion.actual.change = portfolioStatusReport.performances.completion.actual.current - portfolioStatusReport.performances.completion.actual.previous;
            portfolioStatusReport.performances.completion.actual.changeOnPrevious = portfolioStatusReport.performances.completion.actual.previous !== 0 ? portfolioStatusReport.performances.completion.actual.change / portfolioStatusReport.performances.completion.actual.previous : 0;

            portfolioStatusReport.performances.completion.earnedActual.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.completion.earnedActual.current) || 0;
            portfolioStatusReport.performances.completion.earnedActual.current = inputObj.performances.portfolio.completion.earnedActual;
            portfolioStatusReport.performances.completion.earnedActual.change = portfolioStatusReport.performances.completion.earnedActual.current - portfolioStatusReport.performances.completion.earnedActual.previous;
            portfolioStatusReport.performances.completion.earnedActual.changeOnPrevious = portfolioStatusReport.performances.completion.earnedActual.previous !== 0 ? portfolioStatusReport.performances.completion.earnedActual.change / portfolioStatusReport.performances.completion.earnedActual.previous : 0;

            portfolioStatusReport.performances.completion.variance.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.completion.variance.current) || 0;
            portfolioStatusReport.performances.completion.variance.current = inputObj.performances.portfolio.completion.variance;
            portfolioStatusReport.performances.completion.variance.change = portfolioStatusReport.performances.completion.variance.current - portfolioStatusReport.performances.completion.variance.previous;
            portfolioStatusReport.performances.completion.variance.changeOnPrevious = portfolioStatusReport.performances.completion.variance.previous !== 0 ? portfolioStatusReport.performances.completion.variance.change / portfolioStatusReport.performances.completion.variance.previous : 0;

            portfolioStatusReport.performances.completion.variancePercent.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.completion.variancePercent.current) || 0;
            portfolioStatusReport.performances.completion.variancePercent.current = inputObj.performances.portfolio.completion.variancePercent;
            portfolioStatusReport.performances.completion.variancePercent.change = portfolioStatusReport.performances.completion.variancePercent.current - portfolioStatusReport.performances.completion.variancePercent.previous;
            portfolioStatusReport.performances.completion.variancePercent.changeOnPrevious = portfolioStatusReport.performances.completion.variancePercent.previous !== 0 ? portfolioStatusReport.performances.completion.variancePercent.change / portfolioStatusReport.performances.completion.variancePercent.previous : 0;

            // Performances - Budget (projects)
            portfolioStatusReport.performances.budget.amount.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.budget.amount.current) || 0;
            portfolioStatusReport.performances.budget.amount.current = inputObj.performances.portfolio.budget.amount;
            portfolioStatusReport.performances.budget.amount.change = portfolioStatusReport.performances.budget.amount.current - portfolioStatusReport.performances.budget.amount.previous;
            portfolioStatusReport.performances.budget.amount.changeOnPrevious = portfolioStatusReport.performances.budget.amount.previous !== 0 ? portfolioStatusReport.performances.budget.amount.change / portfolioStatusReport.performances.budget.amount.previous : 0;

            portfolioStatusReport.performances.budget.averageAmount.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.budget.averageAmount.current) || 0;
            portfolioStatusReport.performances.budget.averageAmount.current = inputObj.performances.portfolio.budget.averageAmount;
            portfolioStatusReport.performances.budget.averageAmount.change = portfolioStatusReport.performances.budget.averageAmount.current - portfolioStatusReport.performances.budget.averageAmount.previous;
            portfolioStatusReport.performances.budget.averageAmount.changeOnPrevious = portfolioStatusReport.performances.budget.averageAmount.previous !== 0 ? portfolioStatusReport.performances.budget.averageAmount.change / portfolioStatusReport.performances.budget.averageAmount.previous : 0;

            portfolioStatusReport.performances.budget.minAmount.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.budget.minAmount.current) || 0;
            portfolioStatusReport.performances.budget.minAmount.current = inputObj.performances.portfolio.budget.minAmount;
            portfolioStatusReport.performances.budget.minAmount.change = portfolioStatusReport.performances.budget.minAmount.current - portfolioStatusReport.performances.budget.minAmount.previous;
            portfolioStatusReport.performances.budget.minAmount.changeOnPrevious = portfolioStatusReport.performances.budget.minAmount.previous !== 0 ? portfolioStatusReport.performances.budget.minAmount.change / portfolioStatusReport.performances.budget.minAmount.previous : 0;

            portfolioStatusReport.performances.budget.maxAmount.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.budget.maxAmount.current) || 0;
            portfolioStatusReport.performances.budget.maxAmount.current = inputObj.performances.portfolio.budget.maxAmount;
            portfolioStatusReport.performances.budget.maxAmount.change = portfolioStatusReport.performances.budget.maxAmount.current - portfolioStatusReport.performances.budget.maxAmount.previous;
            portfolioStatusReport.performances.budget.maxAmount.changeOnPrevious = portfolioStatusReport.performances.budget.maxAmount.previous !== 0 ? portfolioStatusReport.performances.budget.maxAmount.change / portfolioStatusReport.performances.budget.maxAmount.previous : 0;

            portfolioStatusReport.performances.budget.varianceBaseline.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.budget.varianceBaseline.current) || 0;
            portfolioStatusReport.performances.budget.varianceBaseline.current = inputObj.performances.portfolio.budget.varianceBaseline;
            portfolioStatusReport.performances.budget.varianceBaseline.change = portfolioStatusReport.performances.budget.varianceBaseline.current - portfolioStatusReport.performances.budget.varianceBaseline.previous;
            portfolioStatusReport.performances.budget.varianceBaseline.changeOnPrevious = portfolioStatusReport.performances.budget.varianceBaseline.previous !== 0 ? portfolioStatusReport.performances.budget.varianceBaseline.change / portfolioStatusReport.performances.budget.varianceBaseline.previous : 0;

            portfolioStatusReport.performances.budget.varianceBaselinePercent.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.budget.varianceBaselinePercent.current) || 0;
            portfolioStatusReport.performances.budget.varianceBaselinePercent.current = inputObj.performances.portfolio.budget.varianceBaselinePercent;
            portfolioStatusReport.performances.budget.varianceBaselinePercent.change = portfolioStatusReport.performances.budget.varianceBaselinePercent.current - portfolioStatusReport.performances.budget.varianceBaselinePercent.previous;
            portfolioStatusReport.performances.budget.varianceBaselinePercent.changeOnPrevious = portfolioStatusReport.performances.budget.varianceBaselinePercent.previous !== 0 ? portfolioStatusReport.performances.budget.varianceBaselinePercent.change / portfolioStatusReport.performances.budget.varianceBaselinePercent.previous : 0;

            portfolioStatusReport.performances.budget.varianceAtCompletion.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.budget.varianceAtCompletion.current) || 0;
            portfolioStatusReport.performances.budget.varianceAtCompletion.current = inputObj.performances.portfolio.budget.varianceAtCompletion;
            portfolioStatusReport.performances.budget.varianceAtCompletion.change = portfolioStatusReport.performances.budget.varianceAtCompletion.current - portfolioStatusReport.performances.budget.varianceAtCompletion.previous;
            portfolioStatusReport.performances.budget.varianceAtCompletion.changeOnPrevious = portfolioStatusReport.performances.budget.varianceAtCompletion.previous !== 0 ? portfolioStatusReport.performances.budget.varianceAtCompletion.change / portfolioStatusReport.performances.budget.varianceAtCompletion.previous : 0;

            portfolioStatusReport.performances.budget.varianceAtCompletionPercent.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.budget.varianceAtCompletionPercent.current) || 0;
            portfolioStatusReport.performances.budget.varianceAtCompletionPercent.current = inputObj.performances.portfolio.budget.varianceAtCompletionPercent;
            portfolioStatusReport.performances.budget.varianceAtCompletionPercent.change = portfolioStatusReport.performances.budget.varianceAtCompletionPercent.current - portfolioStatusReport.performances.budget.varianceAtCompletionPercent.previous;
            portfolioStatusReport.performances.budget.varianceAtCompletionPercent.changeOnPrevious = portfolioStatusReport.performances.budget.varianceAtCompletionPercent.previous !== 0 ? portfolioStatusReport.performances.budget.varianceAtCompletionPercent.change / portfolioStatusReport.performances.budget.varianceAtCompletionPercent.previous : 0;

            // Performances - Portfolio Budget
            portfolioStatusReport.performances.portfolioBudget.amount.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.portfolioBudget.amount.current) || 0;
            portfolioStatusReport.performances.portfolioBudget.amount.current = inputObj.performances.portfolio.portfolioBudget.amount;
            portfolioStatusReport.performances.portfolioBudget.amount.change = portfolioStatusReport.performances.portfolioBudget.amount.current - portfolioStatusReport.performances.portfolioBudget.amount.previous;
            portfolioStatusReport.performances.portfolioBudget.amount.changeOnPrevious = portfolioStatusReport.performances.portfolioBudget.amount.previous !== 0 ? portfolioStatusReport.performances.portfolioBudget.amount.change / portfolioStatusReport.performances.portfolioBudget.amount.previous : 0;

            portfolioStatusReport.performances.portfolioBudget.variance.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.portfolioBudget.variance.current) || 0;
            portfolioStatusReport.performances.portfolioBudget.variance.current = inputObj.performances.portfolio.portfolioBudget.variance;
            portfolioStatusReport.performances.portfolioBudget.variance.change = portfolioStatusReport.performances.portfolioBudget.variance.current - portfolioStatusReport.performances.portfolioBudget.variance.previous;
            portfolioStatusReport.performances.portfolioBudget.variance.changeOnPrevious = portfolioStatusReport.performances.portfolioBudget.variance.previous !== 0 ? portfolioStatusReport.performances.portfolioBudget.variance.change / portfolioStatusReport.performances.portfolioBudget.variance.previous : 0;

            portfolioStatusReport.performances.portfolioBudget.variancePercent.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.portfolioBudget.variancePercent.current) || 0;
            portfolioStatusReport.performances.portfolioBudget.variancePercent.current = inputObj.performances.portfolio.portfolioBudget.variancePercent;
            portfolioStatusReport.performances.portfolioBudget.variancePercent.change = portfolioStatusReport.performances.portfolioBudget.variancePercent.current - portfolioStatusReport.performances.portfolioBudget.variancePercent.previous;
            portfolioStatusReport.performances.portfolioBudget.variancePercent.changeOnPrevious = portfolioStatusReport.performances.portfolioBudget.variancePercent.previous !== 0 ? portfolioStatusReport.performances.portfolioBudget.variancePercent.change / portfolioStatusReport.performances.portfolioBudget.variancePercent.previous : 0;

            portfolioStatusReport.performances.portfolioBudget.varianceBaseline.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.portfolioBudget.varianceBaseline.current) || 0;
            portfolioStatusReport.performances.portfolioBudget.varianceBaseline.current = inputObj.performances.portfolio.portfolioBudget.varianceBaseline;
            portfolioStatusReport.performances.portfolioBudget.varianceBaseline.change = portfolioStatusReport.performances.portfolioBudget.varianceBaseline.current - portfolioStatusReport.performances.portfolioBudget.varianceBaseline.previous;
            portfolioStatusReport.performances.portfolioBudget.varianceBaseline.changeOnPrevious = portfolioStatusReport.performances.portfolioBudget.varianceBaseline.previous !== 0 ? portfolioStatusReport.performances.portfolioBudget.varianceBaseline.change / portfolioStatusReport.performances.portfolioBudget.varianceBaseline.previous : 0;

            portfolioStatusReport.performances.portfolioBudget.varianceBaselinePercent.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.portfolioBudget.varianceBaselinePercent.current) || 0;
            portfolioStatusReport.performances.portfolioBudget.varianceBaselinePercent.current = inputObj.performances.portfolio.portfolioBudget.varianceBaselinePercent;
            portfolioStatusReport.performances.portfolioBudget.varianceBaselinePercent.change = portfolioStatusReport.performances.portfolioBudget.varianceBaselinePercent.current - portfolioStatusReport.performances.portfolioBudget.varianceBaselinePercent.previous;
            portfolioStatusReport.performances.portfolioBudget.varianceBaselinePercent.changeOnPrevious = portfolioStatusReport.performances.portfolioBudget.varianceBaselinePercent.previous !== 0 ? portfolioStatusReport.performances.portfolioBudget.varianceBaselinePercent.change / portfolioStatusReport.performances.portfolioBudget.varianceBaselinePercent.previous : 0;

            portfolioStatusReport.performances.portfolioBudget.varianceAtCompletion.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.portfolioBudget.varianceAtCompletion.current) || 0;
            portfolioStatusReport.performances.portfolioBudget.varianceAtCompletion.current = inputObj.performances.portfolio.portfolioBudget.varianceAtCompletion;
            portfolioStatusReport.performances.portfolioBudget.varianceAtCompletion.change = portfolioStatusReport.performances.portfolioBudget.varianceAtCompletion.current - portfolioStatusReport.performances.portfolioBudget.varianceAtCompletion.previous;
            portfolioStatusReport.performances.portfolioBudget.varianceAtCompletion.changeOnPrevious = portfolioStatusReport.performances.portfolioBudget.varianceAtCompletion.previous !== 0 ? portfolioStatusReport.performances.portfolioBudget.varianceAtCompletion.change / portfolioStatusReport.performances.portfolioBudget.varianceAtCompletion.previous : 0;

            portfolioStatusReport.performances.portfolioBudget.varianceAtCompletionPercent.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.portfolioBudget.varianceAtCompletionPercent.current) || 0;
            portfolioStatusReport.performances.portfolioBudget.varianceAtCompletionPercent.current = inputObj.performances.portfolio.portfolioBudget.varianceAtCompletionPercent;
            portfolioStatusReport.performances.portfolioBudget.varianceAtCompletionPercent.change = portfolioStatusReport.performances.portfolioBudget.varianceAtCompletionPercent.current - portfolioStatusReport.performances.portfolioBudget.varianceAtCompletionPercent.previous;
            portfolioStatusReport.performances.portfolioBudget.varianceAtCompletionPercent.changeOnPrevious = portfolioStatusReport.performances.portfolioBudget.varianceAtCompletionPercent.previous !== 0 ? portfolioStatusReport.performances.portfolioBudget.varianceAtCompletionPercent.change / portfolioStatusReport.performances.portfolioBudget.varianceAtCompletionPercent.previous : 0;

            // Performances - Earned value analysis
            portfolioStatusReport.performances.earnedValueAnalysis.earnedValueRatio.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.earnedValueAnalysis.earnedValueRatio.current) || 0;
            portfolioStatusReport.performances.earnedValueAnalysis.earnedValueRatio.current = inputObj.performances.portfolio.earnedValueAnalysis.earnedValueRatio;
            portfolioStatusReport.performances.earnedValueAnalysis.earnedValueRatio.change = portfolioStatusReport.performances.earnedValueAnalysis.earnedValueRatio.current - portfolioStatusReport.performances.earnedValueAnalysis.earnedValueRatio.previous;
            portfolioStatusReport.performances.earnedValueAnalysis.earnedValueRatio.changeOnPrevious = portfolioStatusReport.performances.earnedValueAnalysis.earnedValueRatio.previous !== 0 ? portfolioStatusReport.performances.earnedValueAnalysis.earnedValueRatio.change / portfolioStatusReport.performances.earnedValueAnalysis.earnedValueRatio.previous : 0;

            portfolioStatusReport.performances.earnedValueAnalysis.earnedValue.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.earnedValueAnalysis.earnedValue.current) || 0;
            portfolioStatusReport.performances.earnedValueAnalysis.earnedValue.current = inputObj.performances.portfolio.earnedValueAnalysis.earnedValue;
            portfolioStatusReport.performances.earnedValueAnalysis.earnedValue.change = portfolioStatusReport.performances.earnedValueAnalysis.earnedValue.current - portfolioStatusReport.performances.earnedValueAnalysis.earnedValue.previous;
            portfolioStatusReport.performances.earnedValueAnalysis.earnedValue.changePercent = portfolioStatusReport.performances.earnedValueAnalysis.earnedValue.previous !== 0 ? portfolioStatusReport.performances.earnedValueAnalysis.earnedValue.change / portfolioStatusReport.performances.earnedValueAnalysis.earnedValue.previous : 0;

            portfolioStatusReport.performances.earnedValueAnalysis.costVariance.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.earnedValueAnalysis.costVariance.current) || 0;
            portfolioStatusReport.performances.earnedValueAnalysis.costVariance.current = inputObj.performances.portfolio.earnedValueAnalysis.costVariance;
            portfolioStatusReport.performances.earnedValueAnalysis.costVariance.change = portfolioStatusReport.performances.earnedValueAnalysis.costVariance.current - portfolioStatusReport.performances.earnedValueAnalysis.costVariance.previous;
            portfolioStatusReport.performances.earnedValueAnalysis.costVariance.changeOnPrevious = portfolioStatusReport.performances.earnedValueAnalysis.costVariance.previous !== 0 ? portfolioStatusReport.performances.earnedValueAnalysis.costVariance.change / portfolioStatusReport.performances.earnedValueAnalysis.costVariance.previous : 0;

            portfolioStatusReport.performances.earnedValueAnalysis.scheduleVariance.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.earnedValueAnalysis.scheduleVariance.current) || 0;
            portfolioStatusReport.performances.earnedValueAnalysis.scheduleVariance.current = inputObj.performances.portfolio.earnedValueAnalysis.scheduleVariance;
            portfolioStatusReport.performances.earnedValueAnalysis.scheduleVariance.change = portfolioStatusReport.performances.earnedValueAnalysis.scheduleVariance.current - portfolioStatusReport.performances.earnedValueAnalysis.scheduleVariance.previous;
            portfolioStatusReport.performances.earnedValueAnalysis.scheduleVariance.changeOnPrevious = portfolioStatusReport.performances.earnedValueAnalysis.scheduleVariance.previous !== 0 ? portfolioStatusReport.performances.earnedValueAnalysis.scheduleVariance.change / portfolioStatusReport.performances.earnedValueAnalysis.scheduleVariance.previous : 0;

            portfolioStatusReport.performances.earnedValueAnalysis.percentScheduleVariance.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.earnedValueAnalysis.percentScheduleVariance.current) || 0;
            portfolioStatusReport.performances.earnedValueAnalysis.percentScheduleVariance.current = inputObj.performances.portfolio.earnedValueAnalysis.percentScheduleVariance;
            portfolioStatusReport.performances.earnedValueAnalysis.percentScheduleVariance.change = portfolioStatusReport.performances.earnedValueAnalysis.percentScheduleVariance.current - portfolioStatusReport.performances.earnedValueAnalysis.percentScheduleVariance.previous;
            portfolioStatusReport.performances.earnedValueAnalysis.percentScheduleVariance.changeOnPrevious = portfolioStatusReport.performances.earnedValueAnalysis.percentScheduleVariance.previous !== 0 ? portfolioStatusReport.performances.earnedValueAnalysis.percentScheduleVariance.change / portfolioStatusReport.performances.earnedValueAnalysis.percentScheduleVariance.previous : 0;

            portfolioStatusReport.performances.earnedValueAnalysis.percentCostVariance.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.earnedValueAnalysis.percentCostVariance.current) || 0;
            portfolioStatusReport.performances.earnedValueAnalysis.percentCostVariance.current = inputObj.performances.portfolio.earnedValueAnalysis.percentCostVariance;
            portfolioStatusReport.performances.earnedValueAnalysis.percentCostVariance.change = portfolioStatusReport.performances.earnedValueAnalysis.percentCostVariance.current - portfolioStatusReport.performances.earnedValueAnalysis.percentCostVariance.previous;
            portfolioStatusReport.performances.earnedValueAnalysis.percentCostVariance.changeOnPrevious = portfolioStatusReport.performances.earnedValueAnalysis.percentCostVariance.previous !== 0 ? portfolioStatusReport.performances.earnedValueAnalysis.percentCostVariance.change / portfolioStatusReport.performances.earnedValueAnalysis.percentCostVariance.previous : 0;

            portfolioStatusReport.performances.earnedValueAnalysis.costPerformanceIndex.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.earnedValueAnalysis.costPerformanceIndex.current) || 0;
            portfolioStatusReport.performances.earnedValueAnalysis.costPerformanceIndex.current = inputObj.performances.portfolio.earnedValueAnalysis.costPerformanceIndex;
            portfolioStatusReport.performances.earnedValueAnalysis.costPerformanceIndex.change = portfolioStatusReport.performances.earnedValueAnalysis.costPerformanceIndex.current - portfolioStatusReport.performances.earnedValueAnalysis.costPerformanceIndex.previous;
            portfolioStatusReport.performances.earnedValueAnalysis.costPerformanceIndex.changeOnPrevious = portfolioStatusReport.performances.earnedValueAnalysis.costPerformanceIndex.previous !== 0 ? portfolioStatusReport.performances.earnedValueAnalysis.costPerformanceIndex.change / portfolioStatusReport.performances.earnedValueAnalysis.costPerformanceIndex.previous : 0;

            portfolioStatusReport.performances.earnedValueAnalysis.schedulePerformanceIndex.previous = (!_.isEmpty(inputObj.previousReport) && inputObj.previousReport.performances.earnedValueAnalysis.schedulePerformanceIndex.current) || 0;
            portfolioStatusReport.performances.earnedValueAnalysis.schedulePerformanceIndex.current = inputObj.performances.portfolio.earnedValueAnalysis.schedulePerformanceIndex;
            portfolioStatusReport.performances.earnedValueAnalysis.schedulePerformanceIndex.change = portfolioStatusReport.performances.earnedValueAnalysis.schedulePerformanceIndex.current - portfolioStatusReport.performances.earnedValueAnalysis.schedulePerformanceIndex.previous;
            portfolioStatusReport.performances.earnedValueAnalysis.schedulePerformanceIndex.changeOnPrevious = portfolioStatusReport.performances.earnedValueAnalysis.schedulePerformanceIndex.previous !== 0 ? portfolioStatusReport.performances.earnedValueAnalysis.schedulePerformanceIndex.change / portfolioStatusReport.performances.earnedValueAnalysis.schedulePerformanceIndex.previous : 0;

            // Delivery Status - Overall status (must allow for new ones not existing in previous, and previous ones not existing in current)

            portfolioStatusReport.deliveryStatus.overallStatus.previousStatus = {
                _id : !_.isEmpty(inputObj.previousReport) ? inputObj.previousReport.deliveryStatus.overallStatus.currentStatus._id : null,
                name : !_.isEmpty(inputObj.previousReport) ? inputObj.previousReport.deliveryStatus.overallStatus.currentStatus.name : null,
                color : !_.isEmpty(inputObj.previousReport) ? inputObj.previousReport.deliveryStatus.overallStatus.currentStatus.color : null
            };
            portfolioStatusReport.deliveryStatus.overallStatus.currentStatus = {
                _id : inputObj.portfolio.portfolioStatus.overallStatus.currentRecord.status._id,
                name : inputObj.portfolio.portfolioStatus.overallStatus.currentRecord.status.name,
                color : inputObj.portfolio.portfolioStatus.overallStatus.currentRecord.status.color
            };
            portfolioStatusReport.deliveryStatus.overallStatus.comment = inputObj.portfolio.portfolioStatus.overallStatus.currentRecord.comment;

            _.each(inputObj.performances.portfolio.status.overallStatus.projectStatuses, function(projectStatus){

                var previousProjectStatus = null;
                if(!_.isEmpty(inputObj.previousReport)){
                    previousProjectStatus = _.find(inputObj.previousReport.deliveryStatus.overallStatus.projectStatuses, function(ps){
                        return (ps.status._id && projectStatus.status._id && ps.status._id.equals(projectStatus.status._id)) || true;
                    });
                }

                var newProjectStatus = {
                    status: {
                        _id: projectStatus.status._id,
                        name: projectStatus.status.name,
                        color: projectStatus.status.color
                    },
                    numberOfProjects : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                    ratioOfProjects : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                    amountOfBudget : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                    ratioOfBudget : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }
                };

                newProjectStatus.numberOfProjects.previous = (previousProjectStatus && previousProjectStatus.numberOfProjects.current) || 0;
                newProjectStatus.numberOfProjects.current = projectStatus.numberOfProjects;
                newProjectStatus.numberOfProjects.change = newProjectStatus.numberOfProjects.current - newProjectStatus.numberOfProjects.previous;
                newProjectStatus.numberOfProjects.changeOnPrevious = newProjectStatus.numberOfProjects.previous !== 0 ? newProjectStatus.numberOfProjects.change / newProjectStatus.numberOfProjects.previous : 0;

                newProjectStatus.ratioOfProjects.previous = (previousProjectStatus && previousProjectStatus.ratioOfProjects.current) || 0;
                newProjectStatus.ratioOfProjects.current = projectStatus.ratioOfProjects;
                newProjectStatus.ratioOfProjects.change = newProjectStatus.ratioOfProjects.current - newProjectStatus.ratioOfProjects.previous;
                newProjectStatus.ratioOfProjects.changeOnPrevious = newProjectStatus.ratioOfProjects.previous !== 0 ? newProjectStatus.ratioOfProjects.change / newProjectStatus.ratioOfProjects.previous : 0;

                newProjectStatus.amountOfBudget.previous = (previousProjectStatus && previousProjectStatus.amountOfBudget.current) || 0;
                newProjectStatus.amountOfBudget.current = projectStatus.amountOfBudget;
                newProjectStatus.amountOfBudget.change = newProjectStatus.amountOfBudget.current - newProjectStatus.amountOfBudget.previous;
                newProjectStatus.amountOfBudget.changeOnPrevious = newProjectStatus.amountOfBudget.previous !== 0 ? newProjectStatus.amountOfBudget.change / newProjectStatus.amountOfBudget.previous : 0;

                newProjectStatus.ratioOfBudget.previous = (previousProjectStatus && previousProjectStatus.ratioOfBudget.current) || 0;
                newProjectStatus.ratioOfBudget.current = projectStatus.ratioOfBudget;
                newProjectStatus.ratioOfBudget.change = newProjectStatus.ratioOfBudget.current - newProjectStatus.ratioOfBudget.previous;
                newProjectStatus.ratioOfBudget.changeOnPrevious = newProjectStatus.ratioOfBudget.previous !== 0 ? newProjectStatus.ratioOfBudget.change / newProjectStatus.ratioOfBudget.previous : 0;

                portfolioStatusReport.deliveryStatus.overallStatus.projectStatuses.push(newProjectStatus);

            });

            var previousStatusesNotInCurrent = null;
            if(!_.isEmpty(inputObj.previousReport)){
                previousStatusesNotInCurrent = _.filter(inputObj.previousReport.deliveryStatus.overallStatus.projectStatuses, function(ps){
                    return !_.some(inputObj.performances.portfolio.status.overallStatus.projectStatuses, function(ps2){
                        return (ps2.status._id && ps.status._id && ps2.status._id.equals(ps.status._id)) || true; // either both with id or both null
                    });
                });
            }

            _.each(previousStatusesNotInCurrent, function(lonelyProjectStatus){
            
                var newProjectStatus = {
                    status: {
                        _id : lonelyProjectStatus.status._id,
                        name: lonelyProjectStatus.status.name,
                        color : lonelyProjectStatus.status.color
                    },
                    numberOfProjects : {
                        previous: lonelyProjectStatus.numberOfProjects.current,
                        current: 0,
                        change: - lonelyProjectStatus.numberOfProjects.current,
                        changeOnPrevious : -1
                    },
                    ratioOfProjects : {
                        previous: lonelyProjectStatus.ratioOfProjects.current,
                        current: 0,
                        change: - lonelyProjectStatus.ratioOfProjects.current,
                        changeOnPrevious : -1
                    },
                    amountOfBudget : {
                        previous: lonelyProjectStatus.amountOfBudget.current,
                        current: 0,
                        change: - lonelyProjectStatus.amountOfBudget.current,
                        changeOnPrevious : -1
                    },
                    ratioOfBudget : {
                        previous: lonelyProjectStatus.ratioOfBudget.current,
                        current: 0,
                        change: - lonelyProjectStatus.ratioOfBudget.current,
                        changeOnPrevious : -1
                    }
                };

                portfolioStatusReport.deliveryStatus.overallStatus.projectStatuses.push(newProjectStatus);

            });

            // Delivery Status - Portfolio status areas (must allow for new ones not existing in previous, and previous ones not existing in current)

            _.each(inputObj.performances.portfolio.status.portfolioStatusAreas, function(portfolioStatusArea){

                var previousPortfolioStatusArea = null;
                if(!_.isEmpty(inputObj.previousReport)){
                    previousPortfolioStatusArea = _.find(inputObj.previousReport.deliveryStatus.portfolioStatusAreas, function(ps){
                        return ps.statusArea._id.equals(portfolioStatusArea.statusArea._id);
                    });
                }

                var newPortfolioStatusArea = {
                    statusArea : {
                        _id: portfolioStatusArea.statusArea._id,
                        name: portfolioStatusArea.statusArea.name
                    },
                    currentStatus: {
                        _id : portfolioStatusArea.currentRecord.status._id,
                        name: portfolioStatusArea.currentRecord.status.name,
                        color: portfolioStatusArea.currentRecord.status.color
                    },
                    previousStatus: {
                        _id: previousPortfolioStatusArea && previousPortfolioStatusArea.currentStatus._id,
                        name : previousPortfolioStatusArea && previousPortfolioStatusArea.currentStatus.name,
                        color : previousPortfolioStatusArea && previousPortfolioStatusArea.currentStatus.color
                    },
                    comment : portfolioStatusArea.currentRecord.comment,
                    projectStatuses : []
                };

                _.each(portfolioStatusArea.projectStatuses, function(projectStatus){

                    var previousProjectStatus = null;

                    if(previousPortfolioStatusArea && previousPortfolioStatusArea._id){
                        previousProjectStatus = _.find(previousPortfolioStatusArea.projectStatuses, function(ps){
                            return (ps.status._id && projectStatus.status._id && ps.status._id.equals(projectStatus.status._id)) || true;
                        });
                    }

                    var newProjectStatus = {
                        status: {
                            _id: projectStatus.status._id,
                            name: projectStatus.status.name,
                            color : projectStatus.status.color
                        },
                        numberOfProjects : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                        ratioOfProjects : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                        amountOfBudget : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 },
                        ratioOfBudget : { previous: 0, current: 0, change: 0, changeOnPrevious : 0 }
                    };

                    newProjectStatus.numberOfProjects.previous = (previousProjectStatus && previousProjectStatus.numberOfProjects.current) || 0;
                    newProjectStatus.numberOfProjects.current = projectStatus.numberOfProjects;
                    newProjectStatus.numberOfProjects.change = newProjectStatus.numberOfProjects.current - newProjectStatus.numberOfProjects.previous;
                    newProjectStatus.numberOfProjects.changeOnPrevious = newProjectStatus.numberOfProjects.previous !== 0 ? newProjectStatus.numberOfProjects.change / newProjectStatus.numberOfProjects.previous : 0;

                    newProjectStatus.ratioOfProjects.previous = (previousProjectStatus && previousProjectStatus.ratioOfProjects.current) || 0;
                    newProjectStatus.ratioOfProjects.current = projectStatus.ratioOfProjects;
                    newProjectStatus.ratioOfProjects.change = newProjectStatus.ratioOfProjects.current - newProjectStatus.ratioOfProjects.previous;
                    newProjectStatus.ratioOfProjects.changeOnPrevious = newProjectStatus.ratioOfProjects.previous !== 0 ? newProjectStatus.ratioOfProjects.change / newProjectStatus.ratioOfProjects.previous : 0;

                    newProjectStatus.amountOfBudget.previous = (previousProjectStatus && previousProjectStatus.amountOfBudget.current) || 0;
                    newProjectStatus.amountOfBudget.current = projectStatus.amountOfBudget;
                    newProjectStatus.amountOfBudget.change = newProjectStatus.amountOfBudget.current - newProjectStatus.amountOfBudget.previous;
                    newProjectStatus.amountOfBudget.changeOnPrevious = newProjectStatus.amountOfBudget.previous !== 0 ? newProjectStatus.amountOfBudget.change / newProjectStatus.amountOfBudget.previous : 0;

                    newProjectStatus.ratioOfBudget.previous = (previousProjectStatus && previousProjectStatus.ratioOfBudget.current) || 0;
                    newProjectStatus.ratioOfBudget.current = projectStatus.ratioOfBudget;
                    newProjectStatus.ratioOfBudget.change = newProjectStatus.ratioOfBudget.current - newProjectStatus.ratioOfBudget.previous;
                    newProjectStatus.ratioOfBudget.changeOnPrevious = newProjectStatus.ratioOfBudget.previous !== 0 ? newProjectStatus.ratioOfBudget.change / newProjectStatus.ratioOfBudget.previous : 0;

                    newPortfolioStatusArea.projectStatuses.push(newProjectStatus);

                });

                var previousStatusesNotInCurrent = [];

                if(previousPortfolioStatusArea && previousPortfolioStatusArea._id){
                    previousStatusesNotInCurrent = _.filter(previousPortfolioStatusArea.projectStatuses, function(ps){
                        return !_.some(portfolioStatusArea.projectStatuses, function(ps2){
                            return (ps2.status && ps.status && ps2.status._id.equals(ps.status._id)) || true;
                        });
                    });
                }

                _.each(previousStatusesNotInCurrent, function(lonelyProjectStatus){

                    var newProjectStatus = {
                        status: {
                            _id: lonelyProjectStatus.status._id,
                            name: lonelyProjectStatus.status.name,
                            color: lonelyProjectStatus.status.color
                        },
                        numberOfProjects : {
                            previous: lonelyProjectStatus.numberOfProjects.current,
                            current: 0,
                            change: - lonelyProjectStatus.numberOfProjects.current,
                            changeOnPrevious : -1
                        },
                        ratioOfProjects : {
                            previous: lonelyProjectStatus.ratioOfProjects.current,
                            current: 0,
                            change: - lonelyProjectStatus.ratioOfProjects.current,
                            changeOnPrevious : -1
                        },
                        amountOfBudget : {
                            previous: lonelyProjectStatus.amountOfBudget.current,
                            current: 0,
                            change: - lonelyProjectStatus.amountOfBudget.current,
                            changeOnPrevious : -1
                        },
                        ratioOfBudget : {
                            previous: lonelyProjectStatus.ratioOfBudget.current,
                            current: 0,
                            change: - lonelyProjectStatus.ratioOfBudget.current,
                            changeOnPrevious : -1
                        }
                    };

                    newPortfolioStatusArea.projectStatuses.push(newProjectStatus);

                });

                portfolioStatusReport.deliveryStatus.portfolioStatusAreas.push(newPortfolioStatusArea);

            });

            // Project Logs - Milestones


            // Project Logs - Issues

            callback(null);
        },
        // Save the new portfolioStatusReport
        function(callback) {
            portfolioStatusReport.save(function(err) {
                callback(err);
            });
        }
    ], function (err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioStatusReport);
        }
    });
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
