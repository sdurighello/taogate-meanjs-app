'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

var getPortfolioPerformances = function(user, portfolioId, callback){

    var Project = mongoose.mtModel(user.tenantId + '.' + 'Project');
    var Portfolio = mongoose.mtModel(user.tenantId + '.' + 'Portfolio');

    async.waterfall([
        // Get PORTFOLIO
        function(callback) {
            // Allow for null portfolio and return { } for "unassigned"
            if(portfolioId){
                Portfolio.findById(portfolioId).exec(function(err, portfolio){
                    if (err) {
                        return callback(err);
                    }
                    if (!portfolio) {
                        return callback({ message: 'Cannot find portfolio with id: '+ portfolioId });
                    }
                    callback(null, portfolio);
                });
            } else {
                callback(null, {_id: null, name: 'unassigned', budget: {currentRecord: {amount: 0}}, portfolioStatus: {overallStatus: null, portfolioStatusAreas: null}});
            }
        },
        // Get PROJECTS
        function(portfolio, callback) {
            Project.find({'portfolio': portfolio._id, 'selection.active':true, 'selection.selectedForDelivery':true, 'process.assignmentConfirmed': true})
                .exec(function(err, rawProjects){
                    if (err) {
                        return callback(err);
                    }
                    if(!rawProjects){
                        return callback({ message: 'No project data found' });
                    }
                    // Exclude projects that have no currentGate set (no approved gateReview, so no performances)
                    var filteredRawProjects = _.filter(rawProjects, function(project){
                        return _.some(project.process.gates, function(gate){
                            return gate.gateState.currentRecord.currentGate;
                        });
                    });
                    callback(null, portfolio, filteredRawProjects);
                });
        },
        // Create RESULT object
        function(portfolio, filteredRawProjects, callback) {
            
            var millisecondsPerDay = 1000 * 60 * 60 * 24;

            // Must create new array and objects otherwise doesn't allow you to add properties "oneGate / cumulative" to project
            var result = {
                portfolio : {
                    _id : portfolio._id,
                    name : portfolio.name,
                    numberOfProjects : 0,
                    duration : {
                        baselineDays : 0,
                        estimateDays : 0,
                        actualDays : 0,
                        earnedActual : 0,
                        variance : 0, // baselineDays - estimateDays (actual if completed)
                        variancePercent : 0 // variance / baselineDays
                    },
                    cost : {
                        baseline : 0,
                        estimate : 0,
                        actual : 0,
                        earnedActual : 0,
                        variance : 0, // baseline - estimate (actual if completed)
                        variancePercent : 0 // variance / baseline
                    },
                    completion : {
                        baseline : 0,
                        estimate : 0,
                        actual : 0,
                        earnedActual : 0,
                        variance : 0, // baseline - estimate (actual if completed)
                        variancePercent : 0 // variance / baseline
                    },
                    budget : {
                        amount : 0, // sum of project budgets
                        averageAmount: 0,
                        minAmount : 0,
                        maxAmount : 0,
                        varianceBaseline : 0, // sum of projects' varianceBaselines
                        varianceBaselinePercent : 0, // varianceBaseline above / sum of project budgets
                        varianceAtCompletion : 0, // sum of project earnedActual - sum project budgets
                        varianceAtCompletionPercent : 0 // varianceAtCompletion / sum project budgets
                    },
                    portfolioBudget : {
                        amount : (portfolio.budget && portfolio.budget.currentRecord && portfolio.budget.currentRecord.amount) || 0,
                        variance : 0, // sum project budgets / portfolio budget
                        variancePercent : 0, // projectsBudgetVariance / portfolio budget
                        varianceBaseline : 0, // sum of projects' cost baseline - portfolio budget
                        varianceBaselinePercent : 0, // varianceBaseline above / portfolio budget
                        varianceAtCompletion : 0, // sum of project earnedActual - portfolio budget
                        varianceAtCompletionPercent : 0 // varianceAtCompletion / portfolio budget
                    },
                    earnedValueAnalysis : {
                        earnedValueRatio: 0,
                        earnedValue: 0,
                        costVariance: 0,
                        scheduleVariance: 0,
                        percentScheduleVariance: 0,
                        percentCostVariance: 0,
                        costPerformanceIndex: 0,
                        schedulePerformanceIndex: 0
                    },
                    status : {
                        overallStatus: {
                            currentRecord: (portfolio.portfolioStatus.overallStatus && portfolio.portfolioStatus.overallStatus.currentRecord) || null,
                            projectStatuses : [] // { status, numberOfProjects, amountOfBudget }
                        },
                        portfolioStatusAreas: portfolio.portfolioStatus.portfolioStatusAreas ? _.map(portfolio.portfolioStatus.portfolioStatusAreas, function(portfolioStatusArea){
                            return {
                                statusArea : portfolioStatusArea.statusArea,
                                currentRecord : portfolioStatusArea.currentRecord,
                                projectStatuses : [] // { status, numberOfProjects, amountOfBudget }
                            };
                        }) : []
                    }
                },
                projects : []
            };

            _.each(filteredRawProjects, function(rawProject){

                var project = {
                    _id : rawProject._id,
                    idNumber : rawProject.idNumber,
                    identification : rawProject.identification,
                    portfolio : rawProject.portfolio,
                    parent : rawProject.parent,
                    process : {
                        standardProcess: rawProject.process.standardProcess,

                        assignmentType: rawProject.process.assignmentType,
                        assignmentConfirmed: rawProject.process.assignmentConfirmed,

                        name: rawProject.process.name,
                        description: rawProject.process.description,

                        startGate: rawProject.process.startGate,
                        endGate: rawProject.process.endGate,

                        gates: [],

                        approval : {
                            currentRecord : rawProject.process.approval.currentRecord
                        },

                        cumulativeData : {},
                        currentGate : {}
                    }
                };

                // Make sure gates are ordered by position
                rawProject.process.gates = _.sortBy(rawProject.process.gates, 'position');

                // Initialize cross-gate state properties
                project.cumulativeData = {
                    duration : {
                        baselineDays : 0,
                        estimateDays : 0,
                        actualDays : 0,
                        earnedActual : 0,
                        variance : 0, // baselineDays - estimateDays (actual if completed)
                        variancePercent : 0 // variance / baselineDays
                    },
                    cost : {
                        baseline : 0,
                        estimate : 0,
                        actual : 0,
                        earnedActual : 0,
                        variance : 0, // baseline - estimate (actual if completed)
                        variancePercent : 0 // variance / baseline
                    },
                    completion : {
                        baseline : 0,
                        estimate : 0,
                        actual : 0,
                        earnedActual : 0,
                        variance : 0, // baseline - estimate (actual if completed)
                        variancePercent : 0 // variance / baseline
                    },
                    budget : {
                        amount : 0,
                        varianceBaseline : 0, // costBaseline - budget
                        varianceBaselinePercent : 0, // varianceBaseline / budget
                        varianceAtCompletion : 0, // estimateCost (actual if completed) - budget
                        varianceAtCompletionPercent : 0 // varianceAtCompletion / budget
                    },
                    earnedValueAnalysis : {
                        earnedValueRatio : 0,
                        earnedValue : 0,
                        costVariance : 0,
                        scheduleVariance : 0,
                        percentScheduleVariance : 0,
                        percentCostVariance : 0,
                        costPerformanceIndex : 0,
                        schedulePerformanceIndex : 0,
                        // Earned Value Analysis requiring BAC --> budgetedAtCompletion = cost baseline
                        percentSpent : 0, // earnedActual / budgetedAtCompletion
                        percentComplete : 0, // earnedValue / budgetedAtCompletion
                        toCompletePerformanceIndex : 0, // (budgetedAtCompletion - earnedValue) / (budgetedAtCompletion - earnedActual)
                        atCompletionCost : 0 // earnedActual + ((budgetedAtCompletion - earnedValue)/(costPerformanceIndex * schedulePerformanceIndex))
                    }
                }; // This is just interim, since overall project performances will be available in "endGate cumulative"
                var gateLastSeen = {
                    duration : {
                        baselineDate : null,
                        estimateDate : null,
                        actualDate : null
                    }
                };

                // Find "current gate"
                var currentGate = _.find(rawProject.process.gates, function(gate){
                    return gate.gateState.currentRecord.currentGate === true;
                });

                // For each gate, create "oneGate" and "cumulative" performances
                _.each(rawProject.process.gates, function(gate){

                    // For all performances BEFORE OR EQUAL currentGate: the reference is the gate itself, so you have source = gate
                    // For all performances AFTER currentGate: the reference is the currentGate, so source = currentGate
                    // However: - target is always itself; - for actual the source is always itself
                    var referenceGate = gate.position <= currentGate.position ? gate : currentGate;

                    // GATE ONE-STAGE

                    // Initialize gate oneGate. Potential performance records that are null (e.g. estimate cost) are turned to zero!
                    var oneGate = {
                        duration : {
                            baselineDate : null,
                            baselineDays : 0,
                            estimateDate : null,
                            estimateDays : 0,
                            actualDate : null,
                            actualDays : 0,
                            earnedActual : 0,
                            variance : 0, // baselineDays - earnedActual
                            variancePercent : 0 // variance / baselineDays
                        },
                        cost : {
                            baseline : 0,
                            estimate : 0,
                            actual : 0,
                            earnedActual : 0, // actual if completed, else estimate
                            variance : 0, // baseline - earnedActual
                            variancePercent : 0 // variance / baseline
                        },
                        completion : {
                            baseline : 0,
                            estimate : 0,
                            actual : 0,
                            earnedActual : 0, // actual if completed, else estimate
                            variance : 0, // baseline - earnedActual
                            variancePercent : 0 // variance / baseline
                        },
                        budget : {
                            amount : 0,
                            varianceBaseline : 0, // costBaseline - budget
                            varianceBaselinePercent : 0, // varianceBaseline / budget
                            varianceAtCompletion : 0, // earnedActual - budget
                            varianceAtCompletionPercent : 0 // varianceAtCompletion / budget
                        },
                        earnedValueAnalysis : {
                            earnedValueRatio : 0, // earnedValueRatio = earnedActual completion / baselineCompletion
                            earnedValue : 0, // earnedValue = earnedValueRatio * baselineCost
                            costVariance : 0, // costVariance = earnedValue - earnedActual cost
                            scheduleVariance : 0, // scheduleVariance = earnedValue - baselineCost
                            percentScheduleVariance : 0, // percentScheduleVariance = scheduleVariance / baselineCost
                            percentCostVariance : 0, // percentCostVariance = costVariance / earnedValue
                            costPerformanceIndex : 0, // costPerformanceIndex = earnedValue / earnedActual
                            schedulePerformanceIndex : 0, // schedulePerformanceIndex = earnedValue / baselineCost
                            // Earned Value Analysis requiring BAC --> budgetedAtCompletion = cost baseline
                            percentSpent : 0, // earnedActual / budgetedAtCompletion
                            percentComplete : 0 // earnedValue / budgetedAtCompletion
                        },
                        deliveryStatus : {
                            overallStatus : {
                                currentRecord: {}
                            },
                            projectStatusAreas : []
                        }
                    };

                    // Update gate oneGate
                    oneGate.duration.baselineDate = _.find(referenceGate.performances.duration.baselineDurations, function(performance){
                        return performance.targetGate._id.equals(gate._id);
                    }).currentRecord.gateDate;
                    oneGate.duration.estimateDate = _.find(referenceGate.performances.duration.estimateDurations, function(performance){
                        return performance.targetGate._id.equals(gate._id);
                    }).currentRecord.gateDate;
                    oneGate.duration.actualDate = _.find(gate.performances.duration.actualDurations, function(performance){
                        return performance.targetGate._id.equals(gate._id);
                    }).currentRecord.gateDate;

                    oneGate.duration.baselineDays = gateLastSeen.duration.baselineDate && gateLastSeen.duration.baselineDate ? (oneGate.duration.baselineDate - gateLastSeen.duration.baselineDate) / millisecondsPerDay : 0;
                    oneGate.duration.estimateDays = gateLastSeen.duration.estimateDate && gateLastSeen.duration.estimateDate ? (oneGate.duration.estimateDate - gateLastSeen.duration.estimateDate) / millisecondsPerDay : 0;
                    oneGate.duration.actualDays = gateLastSeen.duration.actualDate && gateLastSeen.duration.actualDate ? (oneGate.duration.actualDate - gateLastSeen.duration.actualDate) / millisecondsPerDay : 0;

                    oneGate.duration.earnedActual = gate.gateState.currentRecord.completed ? oneGate.duration.actualDays : oneGate.duration.estimateDays;
                    oneGate.duration.variance = oneGate.duration.baselineDays - oneGate.duration.earnedActual; // baselineDays - earnedActual
                    oneGate.duration.variancePercent = oneGate.duration.baselineDays !== 0 ? oneGate.duration.variance / oneGate.duration.baselineDays : 0; // variance / baselineDays

                    oneGate.cost.baseline = _.find(referenceGate.performances.cost.baselineCosts, function(performance){
                            return performance.targetGate._id.equals(gate._id);
                        }).currentRecord.cost || 0;
                    oneGate.cost.estimate = _.find(referenceGate.performances.cost.estimateCosts, function(performance){
                            return performance.targetGate._id.equals(gate._id);
                        }).currentRecord.cost || 0;
                    oneGate.cost.actual = _.find(gate.performances.cost.actualCosts, function(performance){
                            return performance.targetGate._id.equals(gate._id);
                        }).currentRecord.cost || 0;

                    oneGate.cost.earnedActual = gate.gateState.currentRecord.completed ? oneGate.cost.actual : oneGate.cost.estimate; // actual if completed, else estimate
                    oneGate.cost.variance = oneGate.cost.baseline - oneGate.cost.earnedActual; // baseline - earnedActual
                    oneGate.cost.variancePercent = oneGate.cost.baseline !== 0 ? oneGate.cost.variance / oneGate.cost.baseline : 0;// variance / baseline

                    oneGate.completion.baseline = _.find(referenceGate.performances.completion.baselineCompletions, function(performance){
                            return performance.targetGate._id.equals(gate._id);
                        }).currentRecord.completion || 0;
                    oneGate.completion.estimate = _.find(referenceGate.performances.completion.estimateCompletions, function(performance){
                            return performance.targetGate._id.equals(gate._id);
                        }).currentRecord.completion || 0;
                    oneGate.completion.actual = _.find(gate.performances.completion.actualCompletions, function(performance){
                            return performance.targetGate._id.equals(gate._id);
                        }).currentRecord.completion || 0;

                    oneGate.completion.earnedActual = gate.gateState.currentRecord.completed ? oneGate.completion.actual : oneGate.completion.estimate; // actual if completed, else estimate
                    oneGate.completion.variance = oneGate.completion.baseline - oneGate.completion.earnedActual; // baseline - earnedActual
                    oneGate.completion.variancePercent = oneGate.completion.baseline !== 0 ? oneGate.completion.variance / oneGate.completion.baseline : 0; // variance / baseline

                    oneGate.budget.amount = gate.budget.currentRecord.amount;
                    oneGate.budget.varianceBaseline = oneGate.cost.baseline - oneGate.budget.amount; // costBaseline - budget
                    oneGate.budget.varianceBaselinePercent = oneGate.budget.amount !== 0 ? oneGate.budget.varianceBaseline / oneGate.budget.amount : 0; // varianceBaseline / budget
                    oneGate.budget.varianceAtCompletion = oneGate.cost.earnedActual - oneGate.budget.amount; // earnedActual cost - budget
                    oneGate.budget.varianceAtCompletionPercent = oneGate.budget.amount !== 0 ? oneGate.budget.varianceAtCompletion / oneGate.budget.amount : 0; // varianceAtCompletion / budget

                    oneGate.earnedValueAnalysis.earnedValueRatio = oneGate.completion.earnedActual - oneGate.completion.baseline; // earnedValueRatio = earnedActual completion / baselineCompletion
                    oneGate.earnedValueAnalysis.earnedValue = oneGate.earnedValueAnalysis.earnedValueRatio * oneGate.cost.baseline; // earnedValue = earnedValueRatio * baselineCost
                    oneGate.earnedValueAnalysis.costVariance = oneGate.earnedValueAnalysis.earnedValue - oneGate.cost.earnedActual; // costVariance = earnedValue - earnedActual cost
                    oneGate.earnedValueAnalysis.scheduleVariance = oneGate.earnedValueAnalysis.earnedValue - oneGate.cost.baseline; // scheduleVariance = earnedValue - baselineCost
                    oneGate.earnedValueAnalysis.percentScheduleVariance = oneGate.cost.baseline !== 0 ? oneGate.earnedValueAnalysis.scheduleVariance / oneGate.cost.baseline : 0; // percentScheduleVariance = scheduleVariance / baselineCost
                    oneGate.earnedValueAnalysis.percentCostVariance = oneGate.earnedValueAnalysis.earnedValue !==0 ? oneGate.earnedValueAnalysis.costVariance / oneGate.earnedValueAnalysis.earnedValue : 0; // percentCostVariance = costVariance / earnedValue
                    oneGate.earnedValueAnalysis.costPerformanceIndex = oneGate.cost.earnedActual !== 0 ? oneGate.earnedValueAnalysis.earnedValue / oneGate.cost.earnedActual : 0; // costPerformanceIndex = earnedValue / earnedActual
                    oneGate.earnedValueAnalysis.schedulePerformanceIndex = oneGate.cost.baseline !== 0 ? oneGate.earnedValueAnalysis.earnedValue / oneGate.cost.baseline : 0; // schedulePerformanceIndex = earnedValue / baselineCost

                    oneGate.deliveryStatus.overallStatus.currentRecord = referenceGate.deliveryStatus.overallStatus.currentRecord;
                    oneGate.deliveryStatus.projectStatusAreas = referenceGate.deliveryStatus.projectStatusAreas;


                    // GATE CUMULATIVE

                    // Initialize gate cumulative
                    var gateCumulative = {
                        duration : {
                            baselineDays : 0,
                            estimateDays : 0,
                            actualDays : 0,
                            earnedActual : 0,
                            variance : 0,
                            variancePercent : 0 // variance / baselineDays
                        },
                        cost : {
                            baseline : 0,
                            estimate : 0,
                            actual : 0,
                            earnedActual : 0,
                            variance : 0, // baseline - estimate (actual if completed)
                            variancePercent : 0 // variance / baseline
                        },
                        completion : {
                            baseline : 0,
                            estimate : 0,
                            actual : 0,
                            earnedActual : 0,
                            variance : 0, // baseline - estimate (actual if completed)
                            variancePercent : 0 // variance / baseline
                        },
                        budget : {
                            amount : 0,
                            varianceBaseline : 0, // costBaseline - budget
                            varianceBaselinePercent : 0, // varianceBaseline / budget
                            varianceAtCompletion : 0, // estimateCost (actual if completed) - budget
                            varianceAtCompletionPercent : 0 // varianceAtCompletion / budget
                        },
                        earnedValueAnalysis : {
                            earnedValueRatio : 0, // earnedValueRatio = earnedActual completion / baselineCompletion
                            earnedValue : 0, // earnedValue = earnedValueRatio * baselineCost
                            costVariance : 0, // costVariance = earnedValue - earnedActual cost
                            scheduleVariance : 0, // scheduleVariance = earnedValue - baselineCost
                            percentScheduleVariance : 0, // percentScheduleVariance = scheduleVariance / baselineCost
                            percentCostVariance : 0, // percentCostVariance = costVariance / earnedValue
                            costPerformanceIndex : 0, // costPerformanceIndex = earnedValue / earnedActual
                            schedulePerformanceIndex : 0, // schedulePerformanceIndex = earnedValue / baselineCost
                            // Earned Value Analysis requiring BAC --> budgetedAtCompletion = cost baseline
                            percentSpent : 0, // earnedActual / budgetedAtCompletion
                            percentComplete : 0, // earnedValue / budgetedAtCompletion
                            toCompletePerformanceIndex : 0, // (budgetedAtCompletion - earnedValue) / (budgetedAtCompletion - earnedActual)
                            atCompletionCost : 0 // earnedActual + ((budgetedAtCompletion - earnedValue)/(costPerformanceIndex * schedulePerformanceIndex))
                        }
                    };

                    // Update gate cumulative (by adding this gate data to the state)
                    gateCumulative.duration.baselineDays = project.cumulativeData.duration.baselineDays + oneGate.duration.baselineDays;
                    gateCumulative.duration.estimateDays = project.cumulativeData.duration.estimateDays + oneGate.duration.estimateDays;
                    gateCumulative.duration.actualDays = project.cumulativeData.duration.actualDays + oneGate.duration.actualDays;
                    gateCumulative.duration.earnedActual = project.cumulativeData.duration.earnedActual + oneGate.duration.earnedActual;
                    gateCumulative.duration.variance = project.cumulativeData.duration.variance + oneGate.duration.variance;
                    gateCumulative.duration.variancePercent = gateCumulative.duration.baselineDays !== 0 ? gateCumulative.duration.variance / gateCumulative.duration.baselineDays : 0; // variance / baselineDays

                    gateCumulative.cost.baseline = project.cumulativeData.cost.baseline + oneGate.cost.baseline;
                    gateCumulative.cost.estimate = project.cumulativeData.cost.estimate + oneGate.cost.estimate;
                    gateCumulative.cost.actual = project.cumulativeData.cost.actual + oneGate.cost.actual;
                    gateCumulative.cost.earnedActual = project.cumulativeData.cost.earnedActual + oneGate.cost.earnedActual;
                    gateCumulative.cost.variance = project.cumulativeData.cost.variance + oneGate.cost.variance;
                    gateCumulative.cost.variancePercent = gateCumulative.cost.baseline !== 0 ? gateCumulative.cost.variance / gateCumulative.cost.baseline : 0; // variance / baseline

                    gateCumulative.completion.baseline = project.cumulativeData.completion.baseline + oneGate.completion.baseline;
                    gateCumulative.completion.estimate = project.cumulativeData.completion.estimate + oneGate.completion.estimate;
                    gateCumulative.completion.actual = project.cumulativeData.completion.actual + oneGate.completion.actual;
                    gateCumulative.completion.earnedActual = project.cumulativeData.completion.earnedActual + oneGate.completion.earnedActual;
                    gateCumulative.completion.variance = project.cumulativeData.completion.variance + oneGate.completion.variance;
                    gateCumulative.completion.variancePercent = gateCumulative.completion.baseline !== 0 ? gateCumulative.completion.variance / gateCumulative.completion.baseline : 0; // variance / baseline

                    gateCumulative.budget.amount = project.cumulativeData.budget.amount + oneGate.budget.amount;
                    gateCumulative.budget.varianceBaseline = project.cumulativeData.budget.varianceBaseline + oneGate.budget.varianceBaseline;
                    gateCumulative.budget.varianceBaselinePercent = gateCumulative.budget.amount !== 0 ? gateCumulative.budget.varianceBaseline / gateCumulative.budget.amount : 0; // varianceBaseline / budget
                    gateCumulative.budget.varianceAtCompletion = project.cumulativeData.budget.varianceAtCompletion + oneGate.budget.varianceAtCompletion;
                    gateCumulative.budget.varianceAtCompletionPercent = gateCumulative.budget.amount !== 0 ? gateCumulative.budget.varianceAtCompletion / gateCumulative.budget.amount : 0; // varianceAtCompletion / budget

                    gateCumulative.earnedValueRatio = gateCumulative.completion.baseline !== 0 ? gateCumulative.completion.earnedActual / gateCumulative.completion.baseline : 0;// earnedValueRatio = earnedActual completion / baselineCompletion
                    gateCumulative.earnedValue = gateCumulative.cost.baseline !== 0 ? gateCumulative.earnedValueRatio / gateCumulative.cost.baseline : 0; // earnedValue = earnedValueRatio * baselineCost
                    gateCumulative.costVariance = gateCumulative.earnedValue - gateCumulative.cost.earnedActual; // costVariance = earnedValue - earnedActual cost
                    gateCumulative.scheduleVariance = gateCumulative.earnedValue - gateCumulative.cost.baseline; // scheduleVariance = earnedValue - baselineCost
                    gateCumulative.percentScheduleVariance = gateCumulative.cost.baseline !== 0 ? gateCumulative.scheduleVariance / gateCumulative.cost.baseline : 0; // percentScheduleVariance = scheduleVariance / baselineCost
                    gateCumulative.percentCostVariance = gateCumulative.earnedValue !== 0 ? gateCumulative.costVariance / gateCumulative.earnedValue : 0; // percentCostVariance = costVariance / earnedValue
                    gateCumulative.costPerformanceIndex = gateCumulative.cost.earnedActual !== 0 ? gateCumulative.earnedValue / gateCumulative.cost.earnedActual : 0; // costPerformanceIndex = earnedValue / earnedActual cost
                    gateCumulative.schedulePerformanceIndex = gateCumulative.cost.baseline !== 0 ? gateCumulative.earnedValue / gateCumulative.cost.baseline : 0; // schedulePerformanceIndex = earnedValue / baselineCost

                    // Update PROJECT CUMULATIVE (by setting the project cumulative state equal to the gate cumulative) for use in the next gate cumulative
                    project.cumulativeData.duration.baselineDays = gateCumulative.duration.baselineDays;
                    project.cumulativeData.duration.estimateDays = gateCumulative.duration.estimateDays;
                    project.cumulativeData.duration.actualDays = gateCumulative.duration.actualDays;
                    project.cumulativeData.duration.earnedActual = gateCumulative.duration.earnedActual;
                    project.cumulativeData.duration.variance = gateCumulative.duration.variance;
                    project.cumulativeData.duration.variancePercent = gateCumulative.duration.variancePercent;

                    project.cumulativeData.cost.baseline = gateCumulative.cost.baseline;
                    project.cumulativeData.cost.estimate = gateCumulative.cost.estimate;
                    project.cumulativeData.cost.actual = gateCumulative.cost.actual;
                    project.cumulativeData.cost.earnedActual = gateCumulative.cost.earnedActual;
                    project.cumulativeData.cost.variance = gateCumulative.cost.variance;
                    project.cumulativeData.cost.variancePercent = gateCumulative.cost.variancePercent;

                    project.cumulativeData.completion.baseline = gateCumulative.completion.baseline;
                    project.cumulativeData.completion.estimate = gateCumulative.completion.estimate;
                    project.cumulativeData.completion.actual = gateCumulative.completion.actual;
                    project.cumulativeData.completion.earnedActual =  gateCumulative.completion.earnedActual;
                    project.cumulativeData.completion.variance = gateCumulative.completion.variance;
                    project.cumulativeData.completion.variancePercent = gateCumulative.completion.variancePercent;

                    project.cumulativeData.budget.amount = gateCumulative.budget.amount;
                    project.cumulativeData.budget.varianceBaseline = gateCumulative.budget.varianceBaseline;
                    project.cumulativeData.budget.varianceBaselinePercent = gateCumulative.budget.varianceBaselinePercent;
                    project.cumulativeData.budget.varianceAtCompletion = gateCumulative.budget.varianceAtCompletion;
                    project.cumulativeData.budget.varianceAtCompletionPercent = gateCumulative.budget.varianceAtCompletionPercent;

                    project.cumulativeData.earnedValueRatio = gateCumulative.earnedValueRatio;
                    project.cumulativeData.earnedValue = gateCumulative.earnedValue;
                    project.cumulativeData.costVariance = gateCumulative.costVariance;
                    project.cumulativeData.scheduleVariance = gateCumulative.scheduleVariance;
                    project.cumulativeData.percentScheduleVariance = gateCumulative.percentScheduleVariance;
                    project.cumulativeData.percentCostVariance = gateCumulative.percentCostVariance;
                    project.cumulativeData.costPerformanceIndex = gateCumulative.costPerformanceIndex;
                    project.cumulativeData.schedulePerformanceIndex = gateCumulative.schedulePerformanceIndex;

                    // Update LAST SEEN
                    gateLastSeen.duration.baselineDate = oneGate.duration.baselineDate;
                    gateLastSeen.duration.estimateDate = oneGate.duration.estimateDate;
                    gateLastSeen.duration.actualDate = oneGate.duration.actualDate;

                    // Create retGate and push it to retProject
                    var retGate = {
                        _id: gate._id,
                        standardGate: gate.standardGate,
                        name: gate.name,
                        description: gate.description,
                        position:gate.position,
                        gateState: {
                            currentRecord: gate.gateState.currentRecord
                        },
                        deliveryStatus: {
                            overallStatus : {
                                currentRecord: gate.deliveryStatus.overallStatus.currentRecord
                            },
                            projectStatusAreas: gate.deliveryStatus.projectStatusAreas
                        },
                        oneGate : oneGate,
                        cumulative : gateCumulative
                    };

                    project.process.gates.push(retGate);

                    // If this is also the currentGate, then put it in the project.currentGate
                    if(retGate.gateState.currentRecord.currentGate){
                        project.process.currentGate = retGate;
                    }

                });

                var endGate = _.find(project.process.gates, function(gate){
                    return gate._id.equals(project.process.endGate);
                });

                // Get BAC and set the earnedValue ratios requiring BAC (these are only relevant for the overall project and are tracked within the endGate cumulative,
                // except for %spent and %Complete that go in each gate cumulative)
                var budgetedAtCompletion = endGate.cumulative.cost.baseline;

                _.each(project.process.gates, function(gate){
                    // Percents
                    gate.oneGate.earnedValueAnalysis.percentSpent = gate.oneGate.cost.earnedActual / budgetedAtCompletion;
                    gate.oneGate.earnedValueAnalysis.percentComplete = gate.oneGate.earnedValueAnalysis.earnedValue / budgetedAtCompletion;
                    gate.cumulative.earnedValueAnalysis.percentSpent = gate.cumulative.cost.earnedActual / budgetedAtCompletion;
                    gate.cumulative.earnedValueAnalysis.percentComplete = gate.cumulative.earnedValueAnalysis.earnedValue / budgetedAtCompletion;
                    // toCompleteCPI
                    if((budgetedAtCompletion - gate.cumulative.cost.earnedActual) !== 0){
                        gate.cumulative.earnedValueAnalysis.toCompletePerformanceIndex = (budgetedAtCompletion - gate.cumulative.earnedValueAnalysis.earnedValue) / (budgetedAtCompletion - gate.cumulative.cost.earnedActual);
                    }
                    // atCompletionCost
                    if((gate.cumulative.earnedValueAnalysis.costPerformanceIndex * gate.cumulative.earnedValueAnalysis.schedulePerformanceIndex) !== 0){
                        gate.cumulative.earnedValueAnalysis.atCompletionCost = gate.cumulative.cost.earnedActual + ((budgetedAtCompletion - gate.cumulative.earnedValueAnalysis.earnedValue)/(gate.cumulative.earnedValueAnalysis.costPerformanceIndex * gate.cumulative.earnedValueAnalysis.schedulePerformanceIndex));
                    }
                });

                // Use the "endGate cumulative" to update the PORTFOLIO data

                result.portfolio.numberOfProjects = result.portfolio.numberOfProjects + 1;

                result.portfolio.duration.baselineDays = result.portfolio.duration.baselineDays + endGate.cumulative.duration.baselineDays;
                result.portfolio.duration.estimateDays = result.portfolio.duration.estimateDays + endGate.cumulative.duration.estimateDays;
                result.portfolio.duration.actualDays = result.portfolio.duration.actualDays + endGate.cumulative.duration.actualDays;
                result.portfolio.duration.earnedActual = result.portfolio.duration.earnedActual + endGate.cumulative.duration.earnedActual;
                result.portfolio.duration.variance = result.portfolio.duration.baselineDays - result.portfolio.duration.earnedActual;
                result.portfolio.duration.variancePercent = result.portfolio.duration.baselineDays !== 0 ? result.portfolio.duration.variance / result.portfolio.duration.baselineDays : 0;

                result.portfolio.cost.baseline = result.portfolio.cost.baseline + endGate.cumulative.cost.baseline;
                result.portfolio.cost.estimate = result.portfolio.cost.estimate + endGate.cumulative.cost.estimate;
                result.portfolio.cost.actual = result.portfolio.cost.actual + endGate.cumulative.cost.actual;
                result.portfolio.cost.earnedActual = result.portfolio.cost.earnedActual + endGate.cumulative.cost.earnedActual;
                result.portfolio.cost.variance = result.portfolio.cost.baseline - result.portfolio.cost.earnedActual;
                result.portfolio.cost.variancePercent = result.portfolio.cost.baseline !== 0 ? result.portfolio.cost.variance / result.portfolio.cost.baseline : 0;

                result.portfolio.completion.baseline = result.portfolio.completion.baseline + endGate.cumulative.completion.baseline;
                result.portfolio.completion.estimate = result.portfolio.completion.estimate + endGate.cumulative.completion.estimate;
                result.portfolio.completion.actual = result.portfolio.completion.actual + endGate.cumulative.completion.actual;
                result.portfolio.completion.earnedActual = result.portfolio.completion.earnedActual + endGate.cumulative.completion.earnedActual;
                result.portfolio.completion.variance = result.portfolio.completion.baseline - result.portfolio.completion.earnedActual;
                result.portfolio.completion.variancePercent = result.portfolio.completion.baseline !== 0 ? result.portfolio.completion.variance / result.portfolio.completion.baseline : 0;

                result.portfolio.budget.amount = result.portfolio.budget.amount + endGate.cumulative.budget.amount;

                // Push the project in the "result"
                result.projects.push(project);

            });

            // Portfolio budget variances
            result.portfolio.portfolioBudget.variance = result.portfolio.portfolioBudget.amount - result.portfolio.budget.amount; // sum project budgets - portfolio budget
            result.portfolio.portfolioBudget.variancePercent = result.portfolio.portfolioBudget.amount !==0 ? result.portfolio.portfolioBudget.variance / result.portfolio.portfolioBudget.amount : 0; // variance / portfolio budget
            result.portfolio.portfolioBudget.varianceBaseline = result.portfolio.portfolioBudget.amount - result.portfolio.cost.baseline; // sum of projects' cost baseline - portfolio budget
            result.portfolio.portfolioBudget.varianceBaselinePercent = result.portfolio.portfolioBudget.amount !==0 ? result.portfolio.portfolioBudget.varianceBaseline / result.portfolio.portfolioBudget.amount : 0; // // varianceBaseline / portfolio budget
            result.portfolio.portfolioBudget.varianceAtCompletion = result.portfolio.portfolioBudget.amount - result.portfolio.cost.earnedActual; // sum of project earnedActual - portfolio budget
            result.portfolio.portfolioBudget.varianceAtCompletionPercent = result.portfolio.portfolioBudget.amount !==0 ? result.portfolio.portfolioBudget.varianceAtCompletion / result.portfolio.portfolioBudget.amount : 0; // varianceAtCompletion / portfolio budget

            // Projects budget
            result.portfolio.budget.averageAmount = result.portfolio.numberOfProjects !== 0 ? result.portfolio.budget.amount / result.portfolio.numberOfProjects : 0;
            result.portfolio.budget.maxAmount = result.projects.length > 0 ? _.max(result.projects, function(project){ return project.cumulativeData.budget.amount; }).cumulativeData.budget.amount : 0;
            result.portfolio.budget.minAmount = result.projects.length > 0 ? _.min(result.projects, function(project){ return project.cumulativeData.budget.amount; }).cumulativeData.budget.amount : 0;

            result.portfolio.budget.varianceBaseline = result.portfolio.cost.baseline - result.portfolio.budget.amount;
            result.portfolio.budget.varianceBaselinePercent = result.portfolio.budget.amount !== 0 ? result.portfolio.budget.varianceBaseline / result.portfolio.budget.amount : 0;
            result.portfolio.budget.varianceAtCompletion = result.portfolio.cost.earnedActual - result.portfolio.budget.amount;
            result.portfolio.budget.varianceAtCompletionPercent = result.portfolio.budget.amount !== 0 ? result.portfolio.budget.varianceAtCompletion / result.portfolio.budget.amount : 0;

            result.portfolio.earnedValueAnalysis.earnedValueRatio = result.portfolio.completion.baseline !==0 ? result.portfolio.completion.earnedActual / result.portfolio.completion.baseline : 0; // earnedValueRatio = earnedActual completion / baselineCompletion
            result.portfolio.earnedValueAnalysis.earnedValue = result.portfolio.earnedValueAnalysis.earnedValueRatio * result.portfolio.cost.baseline; // earnedValueRatio * baselineCost
            result.portfolio.earnedValueAnalysis.costVariance = result.portfolio.earnedValueAnalysis.earnedValue - result.portfolio.cost.earnedActual; // earnedValue - earnedActual cost
            result.portfolio.earnedValueAnalysis.scheduleVariance = result.portfolio.earnedValueAnalysis.earnedValue - result.portfolio.cost.baseline; // earnedValue - baselineCost
            result.portfolio.earnedValueAnalysis.percentScheduleVariance = result.portfolio.cost.baseline !== 0 ? result.portfolio.earnedValueAnalysis.scheduleVariance / result.portfolio.cost.baseline : 0; // scheduleVariance / baselineCost
            result.portfolio.earnedValueAnalysis.percentCostVariance = result.portfolio.earnedValueAnalysis.earnedValue !== 0 ? result.portfolio.earnedValueAnalysis.costVariance / result.portfolio.earnedValueAnalysis.earnedValue : 0; // costVariance / earnedValue
            result.portfolio.earnedValueAnalysis.costPerformanceIndex = result.portfolio.cost.earnedActual !== 0 ? result.portfolio.earnedValueAnalysis.earnedValue / result.portfolio.cost.earnedActual : 0; // earnedValue / earnedActual
            result.portfolio.earnedValueAnalysis.schedulePerformanceIndex = result.portfolio.cost.baseline !== 0 ? result.portfolio.earnedValueAnalysis.earnedValue / result.portfolio.cost.baseline : 0; // earnedValue / baselineCost

            // Overall status

            var aggregatedOverallStatuses = _.chain(result.projects)
                .groupBy(function(project){ return project.process.currentGate.deliveryStatus.overallStatus.currentRecord.status._id; })// {'statusId' : [{project}, ..], ...}
                .map(function(v, k){
                    return {
                        status: {
                            _id : mongoose.Types.ObjectId.isValid(k) ? mongoose.Types.ObjectId(k) : null,
                            name : v[0].process.currentGate.deliveryStatus.overallStatus.currentRecord.status.name,
                            color : v[0].process.currentGate.deliveryStatus.overallStatus.currentRecord.status.color
                        },
                        numberOfProjects : v.length,
                        ratioOfProjects : result.portfolio.numberOfProjects !== 0 ? v.length / result.portfolio.numberOfProjects : 0,
                        amountOfBudget : _.reduce(v, function(sum, project){
                            return sum + project.cumulativeData.budget.amount;
                        }, 0),
                        ratioOfBudget : result.portfolio.budget.amount !== 0 ? _.reduce(v, function(sum, project){
                            return sum + project.cumulativeData.budget.amount;
                        }, 0) / result.portfolio.budget.amount : 0
                    };
                })
                .value();

            _.each(aggregatedOverallStatuses, function(agg){
                result.portfolio.status.overallStatus.projectStatuses.push(agg);
            });

            // Status areas

            _.each(result.portfolio.status.portfolioStatusAreas, function(portfolioStatusArea){

                console.log(_.chain(result.projects)
                    .map(function(project){
                        return {
                            budget : project.cumulativeData.budget,
                            projectStatusArea : _.find(project.process.currentGate.deliveryStatus.projectStatusAreas, function(projectStatusArea){
                                return projectStatusArea.statusArea._id.equals(portfolioStatusArea.statusArea._id);
                            })
                        };
                    })
                    .filter(function(mapItem){ return !!mapItem.projectStatusArea; }) // Exclude no matches
                    .groupBy(function(filterItem){ return filterItem.projectStatusArea.currentRecord.status._id; }).value());

                var aggregatedStatuses = _.chain(result.projects)
                    .map(function(project){
                        return {
                            budget : project.cumulativeData.budget,
                            projectStatusArea : _.find(project.process.currentGate.deliveryStatus.projectStatusAreas, function(projectStatusArea){
                                return projectStatusArea.statusArea._id.equals(portfolioStatusArea.statusArea._id);
                            })
                        };
                    })
                    .filter(function(mapItem){ return !!mapItem.projectStatusArea; }) // Exclude no matches
                    .groupBy(function(filterItem){ return filterItem.projectStatusArea.currentRecord.status._id; })// {'statusId' : [{budget, projectStatusArea}, ..], ...}
                    .map(function(v, k){
                        return {
                            status: {
                                _id : mongoose.Types.ObjectId.isValid(k) ? mongoose.Types.ObjectId(k) : null,
                                name : v[0].projectStatusArea.currentRecord.status.name,
                                color : v[0].projectStatusArea.currentRecord.status.color
                            },
                            numberOfProjects : v.length,
                            ratioOfProjects : result.portfolio.numberOfProjects !== 0 ? v.length / result.portfolio.numberOfProjects : 0,
                            amountOfBudget : _.reduce(v, function(sum, item){
                                return sum + item.budget.amount;
                            }, 0),
                            ratioOfBudget : result.portfolio.budget.amount !== 0 ? _.reduce(v, function(sum, item){
                                return sum + item.budget.amount;
                            }, 0) / result.portfolio.budget.amount : 0
                        };
                    })
                    .value();

                _.each(aggregatedStatuses, function(agg){
                    portfolioStatusArea.projectStatuses.push(agg);
                });
            });


            callback(null, result);
        }
    ], function (err, result) {
        if(err){
            return callback(err);
        }
        callback(null, result);
    });
};

exports.getPortfolioPerformances = getPortfolioPerformances;


exports.portfolioPerformances = function(req, res){

    var portfolio = req.query;
    var user = req.user;

    getPortfolioPerformances(user, (portfolio && portfolio._id) || null, function(err, result){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.jsonp(result);
    });
};


/**
 * Delivery dashboard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

	next();
};
