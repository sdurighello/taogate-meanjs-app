'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');


exports.portfolioPerformances = function(req, res){

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    Project.find({'portfolio': req.query._id, 'selection.active':true, 'selection.selectedForDelivery':true, 'process.assignmentConfirmed': true})
        .exec(function(err, rawProjects){

            if (err) {
                console.log(err);
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }

            if(!rawProjects){
                return res.status(400).send({
                    message: 'No project data found'
                });
            }

            // Exclude projects that have no currentGate set (no approved gateReview, so no performances)
            var filteredRawProjects = _.filter(rawProjects, function(project){
                return _.some(project.process.gates, function(gate){
                    return gate.gateState.currentRecord.currentGate;
                });
            });

            var millisecondsPerDay = 1000 * 60 * 60 * 24;

            // Must create new array and objects otherwise doesn't allow you to add properties "oneGate / cumulative" to project
            var result = {
                portfolio : {
                    _id : req.query._id || null,
                    name : req.query.name,
                    portfolioBudget : {
                        amount : (req.query.budget && req.query.budget.currentRecord && req.query.budget.currentRecord.amount) || 0,
                        varianceBaseline : 0, // costBaseline - budget
                        varianceBaselinePercent : 0, // varianceBaseline / budget
                        varianceAtCompletion : 0, // estimateCost (actual if completed) - budget
                        varianceAtCompletionPercent : 0 // varianceAtCompletion / budget
                    },
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
                        earnedValueRatio: 0,
                        earnedValue: 0,
                        costVariance: 0,
                        scheduleVariance: 0,
                        percentScheduleVariance: 0,
                        percentCostVariance: 0,
                        costPerformanceIndex: 0,
                        schedulePerformanceIndex: 0,
                        // Earned Value Analysis requiring BAC --> budgetedAtCompletion = cost baseline
                        percentSpent: 0, // earnedActual / budgetedAtCompletion
                        percentComplete: 0, // earnedValue / budgetedAtCompletion
                        toCompletePerformanceIndex: 0, // (budgetedAtCompletion - earnedValue) / (budgetedAtCompletion - earnedActual)
                        atCompletionCost: 0 // earnedActual + ((budgetedAtCompletion - earnedValue)/(costPerformanceIndex * schedulePerformanceIndex))
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
                        }
                    }
                };

                // Make sure gates are ordered by position
                rawProject.process.gates = _.sortBy(rawProject.process.gates, 'position');

                // Initialize cross-gate state properties
                var overallCumulative = {
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
                    gateCumulative.duration.baselineDays = overallCumulative.duration.baselineDays + oneGate.duration.baselineDays;
                    gateCumulative.duration.estimateDays = overallCumulative.duration.estimateDays + oneGate.duration.estimateDays;
                    gateCumulative.duration.actualDays = overallCumulative.duration.actualDays + oneGate.duration.actualDays;
                    gateCumulative.duration.earnedActual = overallCumulative.duration.earnedActual + oneGate.duration.earnedActual;
                    gateCumulative.duration.variance = overallCumulative.duration.variance + oneGate.duration.variance;
                    gateCumulative.duration.variancePercent = gateCumulative.duration.baselineDays !== 0 ? gateCumulative.duration.variance / gateCumulative.duration.baselineDays : 0; // variance / baselineDays

                    gateCumulative.cost.baseline = overallCumulative.cost.baseline + oneGate.cost.baseline;
                    gateCumulative.cost.estimate = overallCumulative.cost.estimate + oneGate.cost.estimate;
                    gateCumulative.cost.actual = overallCumulative.cost.actual + oneGate.cost.actual;
                    gateCumulative.cost.earnedActual = overallCumulative.cost.earnedActual + oneGate.cost.earnedActual;
                    gateCumulative.cost.variance = overallCumulative.cost.variance + oneGate.cost.variance;
                    gateCumulative.cost.variancePercent = gateCumulative.cost.baseline !== 0 ? gateCumulative.cost.variance / gateCumulative.cost.baseline : 0; // variance / baseline

                    gateCumulative.completion.baseline = overallCumulative.completion.baseline + oneGate.completion.baseline;
                    gateCumulative.completion.estimate = overallCumulative.completion.estimate + oneGate.completion.estimate;
                    gateCumulative.completion.actual = overallCumulative.completion.actual + oneGate.completion.actual;
                    gateCumulative.completion.earnedActual = overallCumulative.completion.earnedActual + oneGate.completion.earnedActual;
                    gateCumulative.completion.variance = overallCumulative.completion.variance + oneGate.completion.variance;
                    gateCumulative.completion.variancePercent = gateCumulative.completion.baseline !== 0 ? gateCumulative.completion.variance / gateCumulative.completion.baseline : 0; // variance / baseline

                    gateCumulative.budget.amount = overallCumulative.budget.amount + oneGate.budget.amount;
                    gateCumulative.budget.varianceBaseline = overallCumulative.budget.varianceBaseline + oneGate.budget.varianceBaseline;
                    gateCumulative.budget.varianceBaselinePercent = gateCumulative.budget.amount !== 0 ? gateCumulative.budget.varianceBaseline / gateCumulative.budget.amount : 0; // varianceBaseline / budget
                    gateCumulative.budget.varianceAtCompletion = overallCumulative.budget.varianceAtCompletion + oneGate.budget.varianceAtCompletion;
                    gateCumulative.budget.varianceAtCompletionPercent = gateCumulative.budget.amount !== 0 ? gateCumulative.budget.varianceAtCompletion / gateCumulative.budget.amount : 0; // varianceAtCompletion / budget

                    gateCumulative.earnedValueRatio = gateCumulative.completion.baseline !== 0 ? gateCumulative.completion.earnedActual / gateCumulative.completion.baseline : 0;// earnedValueRatio = earnedActual completion / baselineCompletion
                    gateCumulative.earnedValue = gateCumulative.cost.baseline !== 0 ? gateCumulative.earnedValueRatio / gateCumulative.cost.baseline : 0; // earnedValue = earnedValueRatio * baselineCost
                    gateCumulative.costVariance = gateCumulative.earnedValue - gateCumulative.cost.earnedActual; // costVariance = earnedValue - earnedActual cost
                    gateCumulative.scheduleVariance = gateCumulative.earnedValue - gateCumulative.cost.baseline; // scheduleVariance = earnedValue - baselineCost
                    gateCumulative.percentScheduleVariance = gateCumulative.cost.baseline !== 0 ? gateCumulative.scheduleVariance / gateCumulative.cost.baseline : 0; // percentScheduleVariance = scheduleVariance / baselineCost
                    gateCumulative.percentCostVariance = gateCumulative.earnedValue !== 0 ? gateCumulative.costVariance / gateCumulative.earnedValue : 0; // percentCostVariance = costVariance / earnedValue
                    gateCumulative.costPerformanceIndex = gateCumulative.cost.earnedActual !== 0 ? gateCumulative.earnedValue / gateCumulative.cost.earnedActual : 0; // costPerformanceIndex = earnedValue / earnedActual cost
                    gateCumulative.schedulePerformanceIndex = gateCumulative.cost.baseline !== 0 ? gateCumulative.earnedValue / gateCumulative.cost.baseline : 0; // schedulePerformanceIndex = earnedValue / baselineCost

                    // Update PROCESS CUMULATIVE (by setting the process state equal to the gate cumulative) for use in the next gate cumulative
                    overallCumulative.duration.baselineDays = gateCumulative.duration.baselineDays;
                    overallCumulative.duration.estimateDays = gateCumulative.duration.estimateDays;
                    overallCumulative.duration.actualDays = gateCumulative.duration.actualDays;
                    overallCumulative.duration.earnedActual = gateCumulative.duration.earnedActual;
                    overallCumulative.duration.variance = gateCumulative.duration.variance;
                    overallCumulative.duration.variancePercent = gateCumulative.duration.variancePercent;

                    overallCumulative.cost.baseline = gateCumulative.cost.baseline;
                    overallCumulative.cost.estimate = gateCumulative.cost.estimate;
                    overallCumulative.cost.actual = gateCumulative.cost.actual;
                    overallCumulative.cost.earnedActual = gateCumulative.cost.earnedActual;
                    overallCumulative.cost.variance = gateCumulative.cost.variance;
                    overallCumulative.cost.variancePercent = gateCumulative.cost.variancePercent;

                    overallCumulative.completion.baseline = gateCumulative.completion.baseline;
                    overallCumulative.completion.estimate = gateCumulative.completion.estimate;
                    overallCumulative.completion.actual = gateCumulative.completion.actual;
                    overallCumulative.completion.earnedActual =  gateCumulative.completion.earnedActual;
                    overallCumulative.completion.variance = gateCumulative.completion.variance;
                    overallCumulative.completion.variancePercent = gateCumulative.completion.variancePercent;

                    overallCumulative.budget.amount = gateCumulative.budget.amount;
                    overallCumulative.budget.varianceBaseline = gateCumulative.budget.varianceBaseline;
                    overallCumulative.budget.varianceBaselinePercent = gateCumulative.budget.varianceBaselinePercent;
                    overallCumulative.budget.varianceAtCompletion = gateCumulative.budget.varianceAtCompletion;
                    overallCumulative.budget.varianceAtCompletionPercent = gateCumulative.budget.varianceAtCompletionPercent;

                    overallCumulative.earnedValueRatio = gateCumulative.earnedValueRatio;
                    overallCumulative.earnedValue = gateCumulative.earnedValue;
                    overallCumulative.costVariance = gateCumulative.costVariance;
                    overallCumulative.scheduleVariance = gateCumulative.scheduleVariance;
                    overallCumulative.percentScheduleVariance = gateCumulative.percentScheduleVariance;
                    overallCumulative.percentCostVariance = gateCumulative.percentCostVariance;
                    overallCumulative.costPerformanceIndex = gateCumulative.costPerformanceIndex;
                    overallCumulative.schedulePerformanceIndex = gateCumulative.schedulePerformanceIndex;

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
                            }
                        },
                        oneGate : oneGate,
                        cumulative : gateCumulative
                    };
                    
                    project.process.gates.push(retGate);
                    
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
                result.portfolio.budget.varianceBaseline = result.portfolio.cost.baseline - result.portfolio.budget.amount;
                result.portfolio.budget.varianceBaselinePercent = result.portfolio.budget.amount !== 0 ? result.portfolio.budget.varianceBaseline / result.portfolio.budget.amount : 0;
                result.portfolio.budget.varianceAtCompletion = result.portfolio.cost.earnedActual - result.portfolio.budget.amount;
                result.portfolio.budget.varianceAtCompletionPercent = result.portfolio.budget.amount !== 0 ? result.portfolio.budget.varianceAtCompletion / result.portfolio.budget.amount : 0;

                result.portfolio.earnedValueAnalysis.earnedValueRatio = 0;
                result.portfolio.earnedValueAnalysis.earnedValue = 0;
                result.portfolio.earnedValueAnalysis.costVariance = 0;
                result.portfolio.earnedValueAnalysis.scheduleVariance = 0;
                result.portfolio.earnedValueAnalysis.percentScheduleVariance = 0;
                result.portfolio.earnedValueAnalysis.percentCostVariance = 0;
                result.portfolio.earnedValueAnalysis.costPerformanceIndex = 0;
                result.portfolio.earnedValueAnalysis.schedulePerformanceIndex = 0;

                result.portfolio.earnedValueAnalysis.percentSpent = 0;
                result.portfolio.earnedValueAnalysis.percentComplete = 0;
                result.portfolio.earnedValueAnalysis.toCompletePerformanceIndex = 0;
                result.portfolio.earnedValueAnalysis.atCompletionCost = 0;

                // Push the project in the "result"
                result.projects.push(project);

            });

            console.log(result);

            res.jsonp(result);

        }
    );

};


/**
 * Delivery dashboard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

	next();
};
