'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

exports.projectPerformances = function(req, res){

	// var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    // var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
    // var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');
    //
    // var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');
    // var GateOutcomeReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeReview');
    //
    // var BaselineDuration = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineDuration');
    // var BaselineCost = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCost');
    // var BaselineCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCompletion');
    // var EstimateDuration = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateDuration');
    // var EstimateCost = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCost');
    // var EstimateCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCompletion');
    // var ActualDuration = mongoose.mtModel(req.user.tenantId + '.' + 'ActualDuration');
    // var ActualCost = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCost');
    // var ActualCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCompletion');
    //
	// async.waterfall([
	// 	// Get the process with its gates from the project
	// 	function(callback) {
     //        GateProcess.findById(req.project.process).exec( function(err, process){
     //            if(err){
     //                return callback(err);
     //            }
     //            if(!process){
     //                return (new Error({message: 'Cannot find process ' + req.project.process}));
     //            }
     //            if(!process.gates.length){
     //                return (new Error({message: 'There are no gates assigned to process ' + req.project.process}));
     //            }
     //            callback(null, process);
     //        });
	// 	},
     //    // Get gateStatusAssignments and lastCompleted/current gate
	// 	function(process, callback) {
     //        var retObj = {
     //            process : process,
     //            gateAssignments : [],
     //            lastCompleted : {},
     //            current : {},
     //            baselineDurations : [],
     //            baselineCosts : [],
     //            baselineCompletions : []
     //        };
     //        async.waterfall([
     //            function(callback){
     //                GateStatusAssignment.find({project: req.params.projectId, gate: {$in:process.gates}})
     //                    .populate('gate').populate('currentRecord.status').populate('currentRecord.overallScore').populate('overallStatus.currentRecord.status')
     //                    .exec(function(err, assignments){
     //                    if(err){
     //                        return callback(err);
     //                    }
     //                    if(!assignments){
     //                        return callback(new Error ({message: 'Cannot find assignments for process' + process._id}));
     //                    }
     //                    callback(null, assignments);
     //                });
     //            },
     //            function(assignments, callback){
    //
     //                retObj.lastCompleted = _.max(_.filter(assignments, function(assignment){
     //                    return assignment.currentRecord.completed;
     //                }),function(completedAssignment){
     //                    return completedAssignment.gate.position;
     //                });
    //
     //                retObj.gateAssignments = assignments;
     //                if(!retObj.lastCompleted){
     //                    retObj.current = _.find(assignments, function(assignment){
     //                        return assignment.gate.position === 1;
     //                    });
     //                } else if(retObj.lastCompleted.gate._id.equals(process.closureGate)){
     //                    retObj.current = retObj.lastCompleted;
     //                } else {
     //                    retObj.current = _.find(assignments, function(assignment){
     //                        return assignment.gate.position === retObj.lastCompleted.gate.position + 1;
     //                    });
     //                }
    //
     //                callback(null, retObj);
     //            }
     //        ], function(err, retObj){
     //            if(err){
     //                return callback(err);
     //            }
     //            callback(null, retObj);
     //        });
	// 	},
     //    // Get all raw performances
     //    function(retObj, callback){
     //        async.parallel([
     //            function(callback){
     //                BaselineDuration.find({project: req.params.projectId}).exec(function(err, performances){
     //                    if(err){
     //                        return callback(err);
     //                    }
     //                    if(!performances){
     //                        return callback(new Error ({message: 'Cannot find baseline duration for project' + req.params.projectId}));
     //                    }
     //                    retObj.baselineDurations = performances;
     //                    callback(null);
     //                });
     //            },
     //            function(callback){
     //                BaselineCost.find({project: req.params.projectId}).exec(function(err, performances){
     //                    if(err){
     //                        return callback(err);
     //                    }
     //                    if(!performances){
     //                        return callback(new Error ({message: 'Cannot find baseline cost for project' + req.params.projectId}));
     //                    }
     //                    retObj.baselineCosts = performances;
     //                    callback(null);
     //                });
     //            },
     //            function(callback){
     //                BaselineCompletion.find({project: req.params.projectId}).exec(function(err, performances){
     //                    if(err){
     //                        return callback(err);
     //                    }
     //                    if(!performances){
     //                        return callback(new Error ({message: 'Cannot find baseline cost for project' + req.params.projectId}));
     //                    }
     //                    retObj.baselineCompletions = performances;
     //                    callback(null);
     //                });
     //            },
     //            function(callback){
     //                EstimateDuration.find({project: req.params.projectId}).exec(function(err, performances){
     //                    if(err){
     //                        return callback(err);
     //                    }
     //                    if(!performances){
     //                        return callback(new Error ({message: 'Cannot find baseline duration for project' + req.params.projectId}));
     //                    }
     //                    retObj.estimateDurations = performances;
     //                    callback(null);
     //                });
     //            },
     //            function(callback){
     //                EstimateCost.find({project: req.params.projectId}).exec(function(err, performances){
     //                    if(err){
     //                        return callback(err);
     //                    }
     //                    if(!performances){
     //                        return callback(new Error ({message: 'Cannot find baseline cost for project' + req.params.projectId}));
     //                    }
     //                    retObj.estimateCosts = performances;
     //                    callback(null);
     //                });
     //            },
     //            function(callback){
     //                EstimateCompletion.find({project: req.params.projectId}).exec(function(err, performances){
     //                    if(err){
     //                        return callback(err);
     //                    }
     //                    if(!performances){
     //                        return callback(new Error ({message: 'Cannot find baseline cost for project' + req.params.projectId}));
     //                    }
     //                    retObj.estimateCompletions = performances;
     //                    callback(null);
     //                });
     //            },
     //            function(callback){
     //                ActualDuration.find({project: req.params.projectId}).exec(function(err, performances){
     //                    if(err){
     //                        return callback(err);
     //                    }
     //                    if(!performances){
     //                        return callback(new Error ({message: 'Cannot find baseline duration for project' + req.params.projectId}));
     //                    }
     //                    retObj.actualDurations = performances;
     //                    callback(null);
     //                });
     //            },
     //            function(callback){
     //                ActualCost.find({project: req.params.projectId}).exec(function(err, performances){
     //                    if(err){
     //                        return callback(err);
     //                    }
     //                    if(!performances){
     //                        return callback(new Error ({message: 'Cannot find baseline cost for project' + req.params.projectId}));
     //                    }
     //                    retObj.actualCosts = performances;
     //                    callback(null);
     //                });
     //            },
     //            function(callback){
     //                ActualCompletion.find({project: req.params.projectId}).exec(function(err, performances){
     //                    if(err){
     //                        return callback(err);
     //                    }
     //                    if(!performances){
     //                        return callback(new Error ({message: 'Cannot find baseline cost for project' + req.params.projectId}));
     //                    }
     //                    retObj.actualCompletions = performances;
     //                    callback(null);
     //                });
     //            }
     //        ], function(err){
     //            if(err){
     //                return callback(err);
     //            }
    //
     //            callback(null, retObj);
     //        });
     //    },
     //    // Create result array
     //    function(retObj, callback){
     //        var result = []; // contains resultObjects
    //
     //        // VARIABLES
     //        var currentPosition = retObj.current.gate.position;
     //        var closureGatePosition = _.find(retObj.gateAssignments, function(assignment){
     //            return assignment.gate._id.equals(retObj.process.closureGate);
     //        }).gate.position;
    //
     //        var previousGateDateBaseline = null;
     //        var previousGateDateEstimate = null;
     //        var previousGateDateActual = null;
    //
     //        var cumulativeBudget = 0;
    //
     //        var cumulativeBaselineDays = 0;
     //        var cumulativeBaselineCost = 0;
     //        var cumulativeBaselineCompletion = 0;
     //        var cumulativeEstimateDays = 0;
     //        var cumulativeEstimateCost = 0;
     //        var cumulativeEstimateCompletion = 0;
     //        var cumulativeActualDays = 0;
     //        var cumulativeActualCost = 0;
     //        var cumulativeActualCompletion = 0;
    //
     //        // For all gates BEFORE current (sourceGate === targetGate to filter performances)
     //        var loopFunctionBefore = function(lp){
     //            var resultObj = {
     //                gate : {},
     //                current : false,
     //                completed : false,
     //                gateStatus : null,
     //                overallScore : null,
     //                overallStatus : null,
     //                oneStage : {
     //                    budget : {
     //                        amount : 0,
     //                        varianceBaseline : 0, // costBaseline - budget
     //                        varianceBaselinePercent : 0, // varianceBaseline / budget
     //                        varianceAtCompletion : 0, // estimateCost (actual if completed) - budget
     //                        varianceAtCompletionPercent : 0 // varianceAtCompletion / budget
     //                    },
     //                    duration : {
     //                        baselineDate : null,
     //                        baselineDays : 0,
     //                        estimateDate : null,
     //                        estimateDays : 0,
     //                        actualDate : null,
     //                        actualDays : 0,
     //                        variance : 0, // baselineDays - estimateDays (actual if completed)
     //                        variancePercent : 0 // variance / baselineDays
     //                    },
     //                    cost : {
     //                        baseline : 0,
     //                        estimate : 0,
     //                        actual : 0,
     //                        earnedActual : 0,
     //                        variance : 0, // baseline - estimate (actual if completed)
     //                        variancePercent : 0 // variance / baseline
     //                    },
     //                    completion : {
     //                        baseline : 0,
     //                        estimate : 0,
     //                        actual : 0,
     //                        earnedActual : 0,
     //                        variance : 0, // baseline - estimate (actual if completed)
     //                        variancePercent : 0 // variance / baseline
     //                    },
     //                    earnedValueAnalysis : {
     //                        earnedValueRatio : 0,
     //                        earnedValue : 0,
     //                        costVariance : 0,
     //                        scheduleVariance : 0,
     //                        percentScheduleVariance : 0,
     //                        percentCostVariance : 0,
     //                        costPerformanceIndex : 0,
     //                        schedulePerformanceIndex : 0,
     //                        percentSpent : 0,
     //                        percentComplete : 0
     //                    }
     //                },
     //                cumulative : {
     //                    budget : {
     //                        amount : 0,
     //                        varianceBaseline : 0, // costBaseline - budget
     //                        varianceBaselinePercent : 0, // varianceBaseline / budget
     //                        varianceAtCompletion : 0, // estimateCost (actual if completed) - budget
     //                        varianceAtCompletionPercent : 0 // varianceAtCompletion / budget
     //                    },
     //                    duration : {
     //                        baselineDays : 0,
     //                        estimateDays : 0,
     //                        actualDays : 0,
     //                        variance : 0, // baselineDays - estimateDays (actual if completed)
     //                        variancePercent : 0 // variance / baselineDays
     //                    },
     //                    cost : {
     //                        baseline : 0,
     //                        estimate : 0,
     //                        actual : 0,
     //                        earnedActual : 0,
     //                        variance : 0, // baseline - estimate (actual if completed)
     //                        variancePercent : 0 // variance / baseline
     //                    },
     //                    completion : {
     //                        baseline : 0,
     //                        estimate : 0,
     //                        actual : 0,
     //                        earnedActual : 0,
     //                        variance : 0, // baseline - estimate (actual if completed)
     //                        variancePercent : 0 // variance / baseline
     //                    },
     //                    earnedValueAnalysis : {
     //                        earnedValueRatio : 0,
     //                        earnedValue : 0,
     //                        costVariance : 0,
     //                        scheduleVariance : 0,
     //                        percentScheduleVariance : 0,
     //                        percentCostVariance : 0,
     //                        costPerformanceIndex : 0,
     //                        schedulePerformanceIndex : 0,
     //                        percentSpent : 0,
     //                        percentComplete : 0,
     //                        toCompletePerformanceIndex : 0,
     //                        atCompletionCost : 0
     //                    }
     //                }
     //            };
     //            var loopAssignment = _.find(retObj.gateAssignments, function(assignment){
     //                return assignment.gate.position === lp;
     //            });
     //            var loopGate = loopAssignment.gate;
    //
     //            resultObj.gate = loopGate;
     //            resultObj.current = false;
     //            resultObj.completed = loopAssignment.currentRecord.completed;
     //            resultObj.gateStatus = loopAssignment.currentRecord.status;
     //            resultObj.overallScore = loopAssignment.currentRecord.overallScore;
     //            resultObj.overallStatus = loopAssignment.overallStatus.currentRecord.status;
    //
     //            // Duration
    //
     //            var baselineDuration = _.find(retObj.baselineDurations, function(performance){
     //                return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.duration.baselineDate = baselineDuration.currentRecord.gateDate;
    //
     //            if(lp !== 1 && baselineDuration.currentRecord.gateDate && previousGateDateBaseline){
     //                resultObj.oneStage.duration.baselineDays = (baselineDuration.currentRecord.gateDate - previousGateDateBaseline)/(1000*60*60*24);
     //                resultObj.cumulative.duration.baselineDays = cumulativeBaselineDays + resultObj.oneStage.duration.baselineDays;
     //            }
     //            previousGateDateBaseline = baselineDuration.currentRecord.gateDate;
     //            cumulativeBaselineDays = cumulativeBaselineDays + resultObj.oneStage.duration.baselineDays;
    //
     //            var estimateDuration = _.find(retObj.estimateDurations, function(performance){
     //                return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.duration.estimateDate = estimateDuration.currentRecord.gateDate;
     //            if(lp !== 1 && estimateDuration.currentRecord.gateDate && previousGateDateEstimate){
     //                resultObj.oneStage.duration.estimateDays = (estimateDuration.currentRecord.gateDate - previousGateDateEstimate)/(1000*60*60*24);
     //                resultObj.cumulative.duration.estimateDays = cumulativeEstimateDays + resultObj.oneStage.duration.estimateDays;
     //            }
     //            previousGateDateEstimate = estimateDuration.currentRecord.gateDate;
     //            cumulativeEstimateDays = cumulativeEstimateDays + resultObj.oneStage.duration.estimateDays;
    //
     //            var actualDuration = _.find(retObj.actualDurations, function(performance){
     //                return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.duration.actualDate = actualDuration.currentRecord.gateDate;
     //            if(lp !== 1 && actualDuration.currentRecord.gateDate && previousGateDateActual){
     //                resultObj.oneStage.duration.actualDays = (actualDuration.currentRecord.gateDate - previousGateDateActual)/(1000*60*60*24);
     //                resultObj.cumulative.duration.actualDays = cumulativeActualDays + resultObj.oneStage.duration.actualDays;
     //            }
     //            previousGateDateActual = actualDuration.currentRecord.gateDate;
     //            cumulativeActualDays = cumulativeActualDays + resultObj.oneStage.duration.actualDays;
    //
     //            // Cost
    //
     //            var baselineCost = _.find(retObj.baselineCosts, function(performance){
     //                return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.cost.baseline = baselineCost.currentRecord.cost;
     //            resultObj.cumulative.cost.baseline = cumulativeBaselineCost + resultObj.oneStage.cost.baseline;
     //            cumulativeBaselineCost = cumulativeBaselineCost + resultObj.oneStage.cost.baseline;
    //
     //            var estimateCost = _.find(retObj.estimateCosts, function(performance){
     //                return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.cost.estimate = estimateCost.currentRecord.cost;
     //            resultObj.cumulative.cost.estimate = cumulativeEstimateCost + resultObj.oneStage.cost.estimate;
     //            cumulativeEstimateCost = cumulativeEstimateCost + resultObj.oneStage.cost.estimate;
    //
     //            var actualCost = _.find(retObj.actualCosts, function(performance){
     //                return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.cost.actual = actualCost.currentRecord.cost;
     //            resultObj.cumulative.cost.actual = cumulativeActualCost + resultObj.oneStage.cost.actual;
     //            cumulativeActualCost = cumulativeActualCost + resultObj.oneStage.cost.actual;
    //
     //            // Completion
    //
     //            var baselineCompletion = _.find(retObj.baselineCompletions, function(performance){
     //                return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.completion.baseline = baselineCompletion.currentRecord.completion;
     //            resultObj.cumulative.completion.baseline = cumulativeBaselineCompletion + resultObj.oneStage.completion.baseline;
     //            cumulativeBaselineCompletion = cumulativeBaselineCompletion + resultObj.oneStage.completion.baseline;
    //
     //            var estimateCompletion = _.find(retObj.estimateCompletions, function(performance){
     //                return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.completion.estimate = estimateCompletion.currentRecord.completion;
     //            resultObj.cumulative.completion.estimate = cumulativeEstimateCompletion + resultObj.oneStage.completion.estimate;
     //            cumulativeEstimateCompletion = cumulativeEstimateCompletion + resultObj.oneStage.completion.estimate;
    //
     //            var actualCompletion = _.find(retObj.actualCompletions, function(performance){
     //                return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.completion.actual = actualCompletion.currentRecord.completion;
     //            resultObj.cumulative.completion.actual = cumulativeActualCompletion + resultObj.oneStage.completion.actual;
     //            cumulativeActualCompletion = cumulativeActualCompletion + resultObj.oneStage.completion.actual;
    //
     //            // Budget
     //            resultObj.oneStage.budget.amount = loopAssignment.budget.currentRecord.amount;
     //            resultObj.cumulative.budget.amount = cumulativeBudget + loopAssignment.budget.currentRecord.amount;
     //            cumulativeBudget = cumulativeBudget + loopAssignment.budget.currentRecord.amount;
    //
     //            // Variances
    //
     //            if(loopAssignment.currentRecord.completed){
     //                resultObj.oneStage.duration.variance = resultObj.oneStage.duration.actualDays - resultObj.oneStage.duration.baselineDays;
     //                resultObj.cumulative.duration.variance = resultObj.cumulative.duration.actualDays - resultObj.cumulative.duration.baselineDays;
    //
     //                resultObj.oneStage.cost.variance = resultObj.oneStage.cost.actual - resultObj.oneStage.cost.baseline;
     //                resultObj.cumulative.cost.variance = resultObj.cumulative.cost.actual - resultObj.cumulative.cost.baseline;
    //
     //                resultObj.oneStage.completion.variance = resultObj.oneStage.completion.actual - resultObj.oneStage.completion.baseline;
     //                resultObj.cumulative.completion.variance = resultObj.cumulative.completion.actual - resultObj.cumulative.completion.baseline;
    //
     //                resultObj.oneStage.budget.varianceAtCompletion = resultObj.oneStage.budget.amount - resultObj.oneStage.cost.actual;
     //                resultObj.cumulative.budget.varianceAtCompletion = resultObj.cumulative.budget.amount - resultObj.cumulative.cost.actual;
    //
     //            } else {
     //                resultObj.oneStage.duration.variance = resultObj.oneStage.duration.estimateDays - resultObj.oneStage.duration.baselineDays;
     //                resultObj.cumulative.duration.variance = resultObj.cumulative.duration.estimateDays - resultObj.cumulative.duration.baselineDays;
    //
     //                resultObj.oneStage.cost.variance = resultObj.oneStage.cost.estimate - resultObj.oneStage.cost.baseline;
     //                resultObj.cumulative.cost.variance = resultObj.cumulative.cost.estimate - resultObj.cumulative.cost.baseline;
    //
     //                resultObj.oneStage.completion.variance = resultObj.oneStage.completion.estimate - resultObj.oneStage.completion.baseline;
     //                resultObj.cumulative.completion.variance = resultObj.cumulative.completion.estimate - resultObj.cumulative.completion.baseline;
    //
     //                resultObj.oneStage.budget.varianceAtCompletion = resultObj.oneStage.budget.amount - resultObj.oneStage.cost.estimate;
     //                resultObj.cumulative.budget.varianceAtCompletion = resultObj.cumulative.budget.amount - resultObj.cumulative.cost.estimate;
     //            }
    //
     //            resultObj.oneStage.budget.varianceBaseline = resultObj.oneStage.budget.amount - resultObj.oneStage.cost.baseline;
     //            resultObj.cumulative.budget.varianceBaseline = resultObj.cumulative.budget.amount - resultObj.cumulative.cost.baseline;
    //
     //            if(resultObj.oneStage.budget.amount !== 0){
     //                resultObj.oneStage.budget.varianceAtCompletionPercent = resultObj.oneStage.budget.varianceAtCompletion / resultObj.oneStage.budget.amount;
     //            }
     //            if(resultObj.cumulative.budget.amount !== 0){
     //                resultObj.cumulative.budget.varianceAtCompletionPercent = resultObj.cumulative.budget.varianceAtCompletion / resultObj.cumulative.budget.amount;
     //            }
    //
     //            if(resultObj.oneStage.budget.amount !== 0){
     //                resultObj.oneStage.budget.varianceBaselinePercent = resultObj.oneStage.budget.varianceBaseline / resultObj.oneStage.budget.amount;
     //            }
     //            if(resultObj.cumulative.budget.amount !== 0){
     //                resultObj.cumulative.budget.varianceBaselinePercent = resultObj.cumulative.budget.varianceBaseline / resultObj.cumulative.budget.amount;
     //            }
    //
     //            if(resultObj.oneStage.duration.baselineDays !== 0){
     //                resultObj.oneStage.duration.variancePercent = resultObj.oneStage.duration.variance / resultObj.oneStage.duration.baselineDays;
     //            }
     //            if(resultObj.cumulative.duration.baselineDays !== 0){
     //                resultObj.cumulative.duration.variancePercent = resultObj.cumulative.duration.variance / resultObj.cumulative.duration.baselineDays;
     //            }
    //
     //            if(resultObj.oneStage.cost.baseline !== 0){
     //                resultObj.oneStage.cost.variancePercent = resultObj.oneStage.cost.variance / resultObj.oneStage.cost.baseline;
     //            }
     //            if(resultObj.cumulative.cost.baseline !== 0){
     //                resultObj.cumulative.cost.variancePercent = resultObj.cumulative.cost.variance / resultObj.cumulative.cost.baseline;
     //            }
    //
     //            if(resultObj.oneStage.completion.baseline !== 0){
     //                resultObj.oneStage.completion.variancePercent = resultObj.oneStage.completion.variance / resultObj.oneStage.completion.baseline;
     //            }
     //            if(resultObj.cumulative.completion.baseline !== 0){
     //                resultObj.cumulative.completion.variancePercent = resultObj.cumulative.completion.variance / resultObj.cumulative.completion.baseline;
     //            }
    //
     //            // Earned Value Analysis
    //
     //            if(loopAssignment.currentRecord.completed){
     //                resultObj.oneStage.completion.earnedActual = resultObj.oneStage.completion.actual;
     //                resultObj.oneStage.cost.earnedActual = resultObj.oneStage.cost.actual;
     //                resultObj.cumulative.completion.earnedActual = resultObj.cumulative.completion.earnedActual + resultObj.oneStage.completion.actual;
     //                resultObj.cumulative.cost.earnedActual = resultObj.cumulative.cost.earnedActual + resultObj.oneStage.cost.actual;
     //            } else {
     //                resultObj.oneStage.completion.earnedActual = resultObj.oneStage.completion.estimate;
     //                resultObj.oneStage.cost.earnedActual = resultObj.oneStage.cost.estimate;
     //                resultObj.cumulative.completion.earnedActual = resultObj.cumulative.completion.earnedActual + resultObj.oneStage.completion.estimate;
     //                resultObj.cumulative.cost.earnedActual = resultObj.cumulative.cost.earnedActual + resultObj.oneStage.cost.estimate;
     //            }
     //            // oneStage
    //
     //            // earnedValueRatio = estimateCompletion (or actual if completed) / baselineCompletion
     //            if(resultObj.oneStage.completion.baseline !== 0){
     //                resultObj.oneStage.earnedValueAnalysis.earnedValueRatio = resultObj.oneStage.completion.earnedActual / resultObj.oneStage.completion.baseline;
     //            }
     //            // earnedValue = earnedValueRatio * baselineCost
     //            resultObj.oneStage.earnedValueAnalysis.earnedValue = resultObj.oneStage.earnedValueAnalysis.earnedValueRatio * resultObj.oneStage.cost.baseline;
     //            // costVariance = earnedValue - estimateCost (or actualCost if completed)
     //            resultObj.oneStage.earnedValueAnalysis.costVariance = resultObj.oneStage.earnedValueAnalysis.earnedValue - resultObj.oneStage.cost.earnedActual;
     //            // scheduleVariance = earnedValue - baselineCost
     //            resultObj.oneStage.earnedValueAnalysis.scheduleVariance = resultObj.oneStage.earnedValueAnalysis.earnedValue - resultObj.oneStage.cost.baseline;
     //            // percentScheduleVariance = scheduleVariance / baselineCost
     //            if(resultObj.oneStage.cost.baseline !== 0){
     //                resultObj.oneStage.earnedValueAnalysis.percentScheduleVariance = resultObj.oneStage.earnedValueAnalysis.scheduleVariance / resultObj.oneStage.cost.baseline;
     //            }
     //            // percentCostVariance = costVariance / earnedValue
     //            if(resultObj.oneStage.earnedValueAnalysis.earnedValue !== 0){
     //                resultObj.oneStage.earnedValueAnalysis.percentCostVariance = resultObj.oneStage.earnedValueAnalysis.costVariance / resultObj.oneStage.earnedValueAnalysis.earnedValue;
     //            }
     //            // costPerformanceIndex = earnedValue / actualCost (or estimate if not completed)
     //            if(resultObj.oneStage.cost.actual !== 0){
     //                resultObj.oneStage.earnedValueAnalysis.costPerformanceIndex = resultObj.oneStage.earnedValueAnalysis.earnedValue / resultObj.oneStage.cost.earnedActual;
     //            }
     //            // schedulePerformanceIndex = earnedValue / baselineCost
     //            if(resultObj.oneStage.cost.baseline !== 0){
     //                resultObj.oneStage.earnedValueAnalysis.schedulePerformanceIndex = resultObj.oneStage.earnedValueAnalysis.earnedValue / resultObj.oneStage.cost.baseline;
     //            }
    //
     //            // cumulative
    //
     //            // earnedValueRatio = estimateCompletion (or actual if completed) / baselineCompletion
     //            if(resultObj.cumulative.completion.baseline !== 0){
     //                resultObj.cumulative.earnedValueAnalysis.earnedValueRatio = resultObj.cumulative.completion.earnedActual / resultObj.cumulative.completion.baseline;
     //            }
     //            // earnedValue = earnedValueRatio * baselineCost
     //            resultObj.cumulative.earnedValueAnalysis.earnedValue = resultObj.cumulative.earnedValueAnalysis.earnedValueRatio * resultObj.cumulative.cost.baseline;
     //            // costVariance = earnedValue - estimateCost (or actualCost if completed)
     //            resultObj.cumulative.earnedValueAnalysis.costVariance = resultObj.cumulative.earnedValueAnalysis.earnedValue - resultObj.cumulative.cost.earnedActual;
     //            // scheduleVariance = earnedValue - baselineCost
     //            resultObj.cumulative.earnedValueAnalysis.scheduleVariance = resultObj.cumulative.earnedValueAnalysis.earnedValue - resultObj.cumulative.cost.baseline;
     //            // percentScheduleVariance = scheduleVariance / baselineCost
     //            if(resultObj.cumulative.cost.baseline !== 0){
     //                resultObj.cumulative.earnedValueAnalysis.percentScheduleVariance = resultObj.cumulative.earnedValueAnalysis.scheduleVariance / resultObj.cumulative.cost.baseline;
     //            }
     //            // percentCostVariance = costVariance / earnedValue
     //            if(resultObj.cumulative.earnedValueAnalysis.earnedValue !== 0){
     //                resultObj.cumulative.earnedValueAnalysis.percentCostVariance = resultObj.cumulative.earnedValueAnalysis.costVariance / resultObj.cumulative.earnedValueAnalysis.earnedValue;
     //            }
     //            // costPerformanceIndex = earnedValue / actualCost (or estimate if not completed)
     //            if(resultObj.cumulative.cost.actual !== 0){
     //                resultObj.cumulative.earnedValueAnalysis.costPerformanceIndex = resultObj.cumulative.earnedValueAnalysis.earnedValue / resultObj.cumulative.cost.earnedActual;
     //            }
     //            // schedulePerformanceIndex = earnedValue / baselineCost
     //            if(resultObj.cumulative.cost.baseline !== 0){
     //                resultObj.cumulative.earnedValueAnalysis.schedulePerformanceIndex = resultObj.cumulative.earnedValueAnalysis.earnedValue / resultObj.cumulative.cost.baseline;
     //            }
    //
     //            // Push result object into result array
    //
     //            result.push(resultObj);
     //        };
     //        for(var lastPositionSeenBefore = 1; lastPositionSeenBefore < currentPosition; lastPositionSeenBefore++){
     //            loopFunctionBefore(lastPositionSeenBefore);
     //        }
    //
     //        // For CURRENT and all gates AFTER current (sourceGate === current gate, except actual that can only by its own gate)
     //        var loopFunctionAfter = function(lp){
     //            var resultObj = {
     //                gate : {},
     //                current : false,
     //                completed : false,
     //                gateStatus : null,
     //                overallScore : null,
     //                overallStatus : null,
     //                oneStage : {
     //                    budget : {
     //                        amount : 0,
     //                        varianceBaseline : 0, // costBaseline - budget
     //                        varianceBaselinePercent : 0, // varianceBaseline / budget
     //                        varianceAtCompletion : 0, // estimateCost (actual if completed) - budget
     //                        varianceAtCompletionPercent : 0 // varianceAtCompletion / budget
     //                    },
     //                    duration : {
     //                        baselineDate : null,
     //                        baselineDays : 0,
     //                        estimateDate : null,
     //                        estimateDays : 0,
     //                        actualDate : null,
     //                        actualDays : 0,
     //                        variance : 0, // baseline - estimate (actual if completed)
     //                        variancePercent : 0 // variance / baseline
     //                    },
     //                    cost : {
     //                        baseline : 0,
     //                        estimate : 0,
     //                        actual : 0,
     //                        earnedActual : 0,
     //                        variance : 0, // baseline - estimate (actual if completed)
     //                        variancePercent : 0 // variance / baseline
     //                    },
     //                    completion : {
     //                        baseline : 0,
     //                        estimate : 0,
     //                        actual : 0,
     //                        earnedActual : 0,
     //                        variance : 0, // baseline - estimate (actual if completed)
     //                        variancePercent : 0 // variance / baseline
     //                    },
     //                    earnedValueAnalysis : {
     //                        earnedValueRatio : 0,
     //                        earnedValue : 0,
     //                        costVariance : 0,
     //                        scheduleVariance : 0,
     //                        percentScheduleVariance : 0,
     //                        percentCostVariance : 0,
     //                        costPerformanceIndex : 0,
     //                        schedulePerformanceIndex : 0,
     //                        percentSpent : 0,
     //                        percentComplete : 0
     //                    }
     //                },
     //                cumulative : {
     //                    budget : {
     //                        amount : 0,
     //                        varianceBaseline : 0, // costBaseline - budget
     //                        varianceBaselinePercent : 0, // varianceBaseline / budget
     //                        varianceAtCompletion : 0, // estimateCost (actual if completed) - budget
     //                        varianceAtCompletionPercent : 0 // varianceAtCompletion / budget
     //                    },
     //                    duration : {
     //                        baselineDays : 0,
     //                        estimateDays : 0,
     //                        actualDays : 0
     //                    },
     //                    cost : {
     //                        baseline : 0,
     //                        estimate : 0,
     //                        actual : 0,
     //                        earnedActual : 0
     //                    },
     //                    completion : {
     //                        baseline : 0,
     //                        estimate : 0,
     //                        actual : 0,
     //                        earnedActual : 0
     //                    },
     //                    earnedValueAnalysis : {
     //                        earnedValueRatio : 0,
     //                        earnedValue : 0,
     //                        costVariance : 0,
     //                        scheduleVariance : 0,
     //                        percentScheduleVariance : 0,
     //                        percentCostVariance : 0,
     //                        costPerformanceIndex : 0,
     //                        schedulePerformanceIndex : 0,
     //                        percentSpent : 0,
     //                        percentComplete : 0,
     //                        toCompletePerformanceIndex : 0,
     //                        atCompletionCost : 0
     //                    }
     //                }
     //            };
     //            var loopAssignment = _.find(retObj.gateAssignments, function(assignment){
     //                return assignment.gate.position === lp;
     //            });
     //            var loopGate = loopAssignment.gate;
    //
     //            resultObj.gate = loopGate;
     //            if(lp === currentPosition){
     //                resultObj.current = true;
     //            }
     //            resultObj.completed = loopAssignment.currentRecord.completed;
     //            resultObj.gateStatus = loopAssignment.currentRecord.status;
     //            resultObj.overallScore = loopAssignment.currentRecord.overallScore;
     //            resultObj.overallStatus = loopAssignment.overallStatus.currentRecord.status;
    //
     //            // Duration
    //
     //            var baselineDuration = _.find(retObj.baselineDurations, function(performance){
     //                return performance.sourceGate.equals(retObj.current.gate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.duration.baselineDate = baselineDuration.currentRecord.gateDate;
     //            if(lp !== 1 && baselineDuration.currentRecord.gateDate && previousGateDateBaseline){
     //                resultObj.oneStage.duration.baselineDays = (baselineDuration.currentRecord.gateDate - previousGateDateBaseline)/(1000*60*60*24);
     //                resultObj.cumulative.duration.baselineDays = cumulativeBaselineDays + resultObj.oneStage.duration.baselineDays;
     //            }
     //            previousGateDateBaseline = baselineDuration.currentRecord.gateDate;
     //            cumulativeBaselineDays = cumulativeBaselineDays + resultObj.oneStage.duration.baselineDays;
    //
     //            var estimateDuration = _.find(retObj.estimateDurations, function(performance){
     //                return performance.sourceGate.equals(retObj.current.gate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.duration.estimateDate = estimateDuration.currentRecord.gateDate;
     //            if(lp !== 1 && estimateDuration.currentRecord.gateDate && previousGateDateEstimate){
     //                resultObj.oneStage.duration.estimateDays = (estimateDuration.currentRecord.gateDate - previousGateDateEstimate)/(1000*60*60*24);
     //                resultObj.cumulative.duration.estimateDays = cumulativeEstimateDays + resultObj.oneStage.duration.estimateDays;
     //            }
     //            previousGateDateEstimate = estimateDuration.currentRecord.gateDate;
     //            cumulativeEstimateDays = cumulativeEstimateDays + resultObj.oneStage.duration.estimateDays;
    //
     //            var actualDuration = _.find(retObj.actualDurations, function(performance){
     //                return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.duration.actualDate = actualDuration.currentRecord.gateDate;
     //            if(lp !== 1 && actualDuration.currentRecord.gateDate && previousGateDateActual){
     //                resultObj.oneStage.duration.actualDays = (actualDuration.currentRecord.gateDate - previousGateDateActual)/(1000*60*60*24);
     //                resultObj.cumulative.duration.actualDays = cumulativeActualDays + resultObj.oneStage.duration.actualDays;
     //            }
     //            previousGateDateActual = actualDuration.currentRecord.gateDate;
     //            cumulativeActualDays = cumulativeActualDays + resultObj.oneStage.duration.actualDays;
    //
     //            // Cost
    //
     //            var baselineCost = _.find(retObj.baselineCosts, function(performance){
     //                return performance.sourceGate.equals(retObj.current.gate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.cost.baseline = baselineCost.currentRecord.cost;
     //            resultObj.cumulative.cost.baseline = cumulativeBaselineCost + resultObj.oneStage.cost.baseline;
     //            cumulativeBaselineCost = cumulativeBaselineCost + resultObj.oneStage.cost.baseline;
    //
     //            var estimateCost = _.find(retObj.estimateCosts, function(performance){
     //                return performance.sourceGate.equals(retObj.current.gate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.cost.estimate = estimateCost.currentRecord.cost;
     //            resultObj.cumulative.cost.estimate = cumulativeEstimateCost + resultObj.oneStage.cost.estimate;
     //            cumulativeEstimateCost = cumulativeEstimateCost + resultObj.oneStage.cost.estimate;
    //
     //            var actualCost = _.find(retObj.actualCosts, function(performance){
     //                return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.cost.actual = actualCost.currentRecord.cost;
     //            resultObj.cumulative.cost.actual = cumulativeActualCost + resultObj.oneStage.cost.actual;
     //            cumulativeActualCost = cumulativeActualCost + resultObj.oneStage.cost.actual;
    //
     //            // Completion
    //
     //            var baselineCompletion = _.find(retObj.baselineCompletions, function(performance){
     //                return performance.sourceGate.equals(retObj.current.gate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.completion.baseline = baselineCompletion.currentRecord.completion;
     //            resultObj.cumulative.completion.baseline = cumulativeBaselineCompletion + resultObj.oneStage.completion.baseline;
     //            cumulativeBaselineCompletion = cumulativeBaselineCompletion + resultObj.oneStage.completion.baseline;
    //
     //            var estimateCompletion = _.find(retObj.estimateCompletions, function(performance){
     //                return performance.sourceGate.equals(retObj.current.gate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.completion.estimate = estimateCompletion.currentRecord.completion;
     //            resultObj.cumulative.completion.estimate = cumulativeEstimateCompletion + resultObj.oneStage.completion.estimate;
     //            cumulativeEstimateCompletion = cumulativeEstimateCompletion + resultObj.oneStage.completion.estimate;
    //
     //            var actualCompletion = _.find(retObj.actualCompletions, function(performance){
     //                return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
     //            });
     //            resultObj.oneStage.completion.actual = actualCompletion.currentRecord.completion;
     //            resultObj.cumulative.completion.actual = cumulativeActualCompletion + resultObj.oneStage.completion.actual;
     //            cumulativeActualCompletion = cumulativeActualCompletion + resultObj.oneStage.completion.actual;
    //
     //            // Budget
     //            resultObj.oneStage.budget.amount = loopAssignment.budget.currentRecord.amount;
     //            resultObj.cumulative.budget.amount = cumulativeBudget + loopAssignment.budget.currentRecord.amount;
     //            cumulativeBudget = cumulativeBudget + loopAssignment.budget.currentRecord.amount;
    //
     //            // Variances
    //
     //            if(loopAssignment.currentRecord.completed){
     //                resultObj.oneStage.duration.variance = resultObj.oneStage.duration.actualDays - resultObj.oneStage.duration.baselineDays;
     //                resultObj.cumulative.duration.variance = resultObj.cumulative.duration.actualDays - resultObj.cumulative.duration.baselineDays;
    //
     //                resultObj.oneStage.cost.variance = resultObj.oneStage.cost.actual - resultObj.oneStage.cost.baseline;
     //                resultObj.cumulative.cost.variance = resultObj.cumulative.cost.actual - resultObj.cumulative.cost.baseline;
    //
     //                resultObj.oneStage.completion.variance = resultObj.oneStage.completion.actual - resultObj.oneStage.completion.baseline;
     //                resultObj.cumulative.completion.variance = resultObj.cumulative.completion.actual - resultObj.cumulative.completion.baseline;
    //
     //                resultObj.oneStage.budget.varianceAtCompletion = resultObj.oneStage.budget.amount - resultObj.oneStage.cost.actual;
     //                resultObj.cumulative.budget.varianceAtCompletion = resultObj.cumulative.budget.amount - resultObj.cumulative.cost.actual;
    //
     //            } else {
     //                resultObj.oneStage.duration.variance = resultObj.oneStage.duration.estimateDays - resultObj.oneStage.duration.baselineDays;
     //                resultObj.cumulative.duration.variance = resultObj.cumulative.duration.estimateDays - resultObj.cumulative.duration.baselineDays;
    //
     //                resultObj.oneStage.cost.variance = resultObj.oneStage.cost.estimate - resultObj.oneStage.cost.baseline;
     //                resultObj.cumulative.cost.variance = resultObj.cumulative.cost.estimate - resultObj.cumulative.cost.baseline;
    //
     //                resultObj.oneStage.completion.variance = resultObj.oneStage.completion.estimate - resultObj.oneStage.completion.baseline;
     //                resultObj.cumulative.completion.variance = resultObj.cumulative.completion.estimate - resultObj.cumulative.completion.baseline;
    //
     //                resultObj.oneStage.budget.varianceAtCompletion = resultObj.oneStage.budget.amount - resultObj.oneStage.cost.estimate;
     //                resultObj.cumulative.budget.varianceAtCompletion = resultObj.cumulative.budget.amount - resultObj.cumulative.cost.estimate;
     //            }
    //
     //            resultObj.oneStage.budget.varianceBaseline = resultObj.oneStage.budget.amount - resultObj.oneStage.cost.baseline;
     //            resultObj.cumulative.budget.varianceBaseline = resultObj.cumulative.budget.amount - resultObj.cumulative.cost.baseline;
    //
     //            if(resultObj.oneStage.budget.amount !== 0){
     //                resultObj.oneStage.budget.varianceAtCompletionPercent = resultObj.oneStage.budget.varianceAtCompletion / resultObj.oneStage.budget.amount;
     //            }
     //            if(resultObj.cumulative.budget.amount !== 0){
     //                resultObj.cumulative.budget.varianceAtCompletionPercent = resultObj.cumulative.budget.varianceAtCompletion / resultObj.cumulative.budget.amount;
     //            }
    //
     //            if(resultObj.oneStage.budget.amount !== 0){
     //                resultObj.oneStage.budget.varianceBaselinePercent = resultObj.oneStage.budget.varianceBaseline / resultObj.oneStage.budget.amount;
     //            }
     //            if(resultObj.cumulative.budget.amount !== 0){
     //                resultObj.cumulative.budget.varianceBaselinePercent = resultObj.cumulative.budget.varianceBaseline / resultObj.cumulative.budget.amount;
     //            }
    //
     //            if(resultObj.oneStage.duration.baselineDays !== 0){
     //                resultObj.oneStage.duration.variancePercent = resultObj.oneStage.duration.variance / resultObj.oneStage.duration.baselineDays;
     //            }
     //            if(resultObj.cumulative.duration.baselineDays !== 0){
     //                resultObj.cumulative.duration.variancePercent = resultObj.cumulative.duration.variance / resultObj.cumulative.duration.baselineDays;
     //            }
    //
     //            if(resultObj.oneStage.cost.baseline !== 0){
     //                resultObj.oneStage.cost.variancePercent = resultObj.oneStage.cost.variance / resultObj.oneStage.cost.baseline;
     //            }
     //            if(resultObj.cumulative.cost.baseline !== 0){
     //                resultObj.cumulative.cost.variancePercent = resultObj.cumulative.cost.variance / resultObj.cumulative.cost.baseline;
     //            }
    //
     //            if(resultObj.oneStage.completion.baseline !== 0){
     //                resultObj.oneStage.completion.variancePercent = resultObj.oneStage.completion.variance / resultObj.oneStage.completion.baseline;
     //            }
     //            if(resultObj.cumulative.completion.baseline !== 0){
     //                resultObj.cumulative.completion.variancePercent = resultObj.cumulative.completion.variance / resultObj.cumulative.completion.baseline;
     //            }
    //
     //            // Earned Value Analysis
    //
     //            if(loopAssignment.currentRecord.completed){
     //                resultObj.oneStage.completion.earnedActual = resultObj.oneStage.completion.actual;
     //                resultObj.oneStage.cost.earnedActual = resultObj.oneStage.cost.actual;
     //                resultObj.cumulative.completion.earnedActual = resultObj.cumulative.completion.earnedActual + resultObj.oneStage.completion.actual;
     //                resultObj.cumulative.cost.earnedActual = resultObj.cumulative.cost.earnedActual + resultObj.oneStage.cost.actual;
     //            } else {
     //                resultObj.oneStage.completion.earnedActual = resultObj.oneStage.completion.estimate;
     //                resultObj.oneStage.cost.earnedActual = resultObj.oneStage.cost.estimate;
     //                resultObj.cumulative.completion.earnedActual = resultObj.cumulative.completion.earnedActual + resultObj.oneStage.completion.estimate;
     //                resultObj.cumulative.cost.earnedActual = resultObj.cumulative.cost.earnedActual + resultObj.oneStage.cost.estimate;
     //            }
     //                // oneStage
    //
     //            // earnedValueRatio = estimateCompletion (or actual if completed) / baselineCompletion
     //            if(resultObj.oneStage.completion.baseline !== 0){
     //                resultObj.oneStage.earnedValueAnalysis.earnedValueRatio = resultObj.oneStage.completion.earnedActual / resultObj.oneStage.completion.baseline;
     //            }
     //            // earnedValue = earnedValueRatio * baselineCost
     //            resultObj.oneStage.earnedValueAnalysis.earnedValue = resultObj.oneStage.earnedValueAnalysis.earnedValueRatio * resultObj.oneStage.cost.baseline;
     //            // costVariance = earnedValue - estimateCost (or actualCost if completed)
     //            resultObj.oneStage.earnedValueAnalysis.costVariance = resultObj.oneStage.earnedValueAnalysis.earnedValue - resultObj.oneStage.cost.earnedActual;
     //            // scheduleVariance = earnedValue - baselineCost
     //            resultObj.oneStage.earnedValueAnalysis.scheduleVariance = resultObj.oneStage.earnedValueAnalysis.earnedValue - resultObj.oneStage.cost.baseline;
     //            // percentScheduleVariance = scheduleVariance / baselineCost
     //            if(resultObj.oneStage.cost.baseline !== 0){
     //                resultObj.oneStage.earnedValueAnalysis.percentScheduleVariance = resultObj.oneStage.earnedValueAnalysis.scheduleVariance / resultObj.oneStage.cost.baseline;
     //            }
     //            // percentCostVariance = costVariance / earnedValue
     //            if(resultObj.oneStage.earnedValueAnalysis.earnedValue !== 0){
     //                resultObj.oneStage.earnedValueAnalysis.percentCostVariance = resultObj.oneStage.earnedValueAnalysis.costVariance / resultObj.oneStage.earnedValueAnalysis.earnedValue;
     //            }
     //            // costPerformanceIndex = earnedValue / actualCost (or estimate if not completed)
     //            if(resultObj.oneStage.cost.actual !== 0){
     //                resultObj.oneStage.earnedValueAnalysis.costPerformanceIndex = resultObj.oneStage.earnedValueAnalysis.earnedValue / resultObj.oneStage.cost.earnedActual;
     //            }
     //            // schedulePerformanceIndex = earnedValue / baselineCost
     //            if(resultObj.oneStage.cost.baseline !== 0){
     //                resultObj.oneStage.earnedValueAnalysis.schedulePerformanceIndex = resultObj.oneStage.earnedValueAnalysis.earnedValue / resultObj.oneStage.cost.baseline;
     //            }
    //
     //                // cumulative
    //
     //            // earnedValueRatio = estimateCompletion (or actual if completed) / baselineCompletion
     //            if(resultObj.cumulative.completion.baseline !== 0){
     //                resultObj.cumulative.earnedValueAnalysis.earnedValueRatio = resultObj.cumulative.completion.earnedActual / resultObj.cumulative.completion.baseline;
     //            }
     //            // earnedValue = earnedValueRatio * baselineCost
     //            resultObj.cumulative.earnedValueAnalysis.earnedValue = resultObj.cumulative.earnedValueAnalysis.earnedValueRatio * resultObj.cumulative.cost.baseline;
     //            // costVariance = earnedValue - estimateCost (or actualCost if completed)
     //            resultObj.cumulative.earnedValueAnalysis.costVariance = resultObj.cumulative.earnedValueAnalysis.earnedValue - resultObj.cumulative.cost.earnedActual;
     //            // scheduleVariance = earnedValue - baselineCost
     //            resultObj.cumulative.earnedValueAnalysis.scheduleVariance = resultObj.cumulative.earnedValueAnalysis.earnedValue - resultObj.cumulative.cost.baseline;
     //            // percentScheduleVariance = scheduleVariance / baselineCost
     //            if(resultObj.cumulative.cost.baseline !== 0){
     //                resultObj.cumulative.earnedValueAnalysis.percentScheduleVariance = resultObj.cumulative.earnedValueAnalysis.scheduleVariance / resultObj.cumulative.cost.baseline;
     //            }
     //            // percentCostVariance = costVariance / earnedValue
     //            if(resultObj.cumulative.earnedValueAnalysis.earnedValue !== 0){
     //                resultObj.cumulative.earnedValueAnalysis.percentCostVariance = resultObj.cumulative.earnedValueAnalysis.costVariance / resultObj.cumulative.earnedValueAnalysis.earnedValue;
     //            }
     //            // costPerformanceIndex = earnedValue / actualCost (or estimate if not completed)
     //            if(resultObj.cumulative.cost.actual !== 0){
     //                resultObj.cumulative.earnedValueAnalysis.costPerformanceIndex = resultObj.cumulative.earnedValueAnalysis.earnedValue / resultObj.cumulative.cost.earnedActual;
     //            }
     //            // schedulePerformanceIndex = earnedValue / baselineCost
     //            if(resultObj.cumulative.cost.baseline !== 0){
     //                resultObj.cumulative.earnedValueAnalysis.schedulePerformanceIndex = resultObj.cumulative.earnedValueAnalysis.earnedValue / resultObj.cumulative.cost.baseline;
     //            }
    //
    //
     //            // Push result object into result array
    //
     //            result.push(resultObj);
     //        };
     //        for(var lastPositionSeenAfter = currentPosition; lastPositionSeenAfter <= closureGatePosition; lastPositionSeenAfter++){
     //            loopFunctionAfter(lastPositionSeenAfter);
     //        }
    //
     //        // Earned Value Analysis requiring BAC
    //
     //        var budgetedAtCompletion = _.find(result, function(obj){
     //            return obj.gate._id.equals(retObj.process.closureGate);
     //        }).cumulative.cost.baseline;
    //
     //        _.each(result, function(obj){
     //            // Percents
     //            obj.oneStage.earnedValueAnalysis.percentSpent = obj.oneStage.cost.earnedActual / budgetedAtCompletion;
     //            obj.oneStage.earnedValueAnalysis.percentComplete = obj.oneStage.earnedValueAnalysis.earnedValue / budgetedAtCompletion;
     //            obj.cumulative.earnedValueAnalysis.percentSpent = obj.cumulative.cost.earnedActual / budgetedAtCompletion;
     //            obj.cumulative.earnedValueAnalysis.percentComplete = obj.cumulative.earnedValueAnalysis.earnedValue / budgetedAtCompletion;
     //            // toCompleteCPI
     //            if((budgetedAtCompletion - obj.cumulative.cost.earnedActual) !== 0){
     //                obj.cumulative.earnedValueAnalysis.toCompletePerformanceIndex = (budgetedAtCompletion - obj.cumulative.earnedValueAnalysis.earnedValue) / (budgetedAtCompletion - obj.cumulative.cost.earnedActual);
     //            }
     //            // atCompletionCost
     //            if((obj.cumulative.earnedValueAnalysis.costPerformanceIndex * obj.cumulative.earnedValueAnalysis.schedulePerformanceIndex) !== 0){
     //                obj.cumulative.earnedValueAnalysis.atCompletionCost = obj.cumulative.cost.earnedActual + ((budgetedAtCompletion - obj.cumulative.earnedValueAnalysis.earnedValue)/(obj.cumulative.earnedValueAnalysis.costPerformanceIndex * obj.cumulative.earnedValueAnalysis.schedulePerformanceIndex));
     //            }
     //        });
    //
     //        callback(null, result);
     //    }
	// ], function (err, result) {
	// 	if (err) {
	// 		console.log(err);
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.jsonp(result);
	// 	}
	// });

};


exports.portfolioPerformances = function(req, res){

    // var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    // var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
    // var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');
    //
    // var PortfolioRanking = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioRanking');
    // var OverallRanking = mongoose.mtModel(req.user.tenantId + '.' + 'OverallRanking');
    //
    // var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');
    // var GateOutcomeReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeReview');
    //
    // var BaselineDuration = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineDuration');
    // var BaselineCost = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCost');
    // var BaselineCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCompletion');
    // var EstimateDuration = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateDuration');
    // var EstimateCost = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCost');
    // var EstimateCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCompletion');
    // var ActualDuration = mongoose.mtModel(req.user.tenantId + '.' + 'ActualDuration');
    // var ActualCost = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCost');
    // var ActualCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCompletion');
    //
    // async.waterfall([
    //     // Get all the projects in delivery, active and with an assigned process
    //     function(callback){
    //         Project.find({'selection.active' : true, 'selection.selectedForDelivery' : true, process: {$ne: null}})
    //             .populate('process').populate('portfolio')
    //             .exec(function(err, projects){
    //             if(err){
    //                 return callback(err);
    //             }
    //             callback(null, projects);
    //         });
    //     },
    //     // For each project, get its ranking (portfolio and overall)
    //     function(projects, callback){
    //         var projectsWithRankings = [];
    //         async.eachSeries(projects, function(project, callbackEach) {
    //             async.series([
    //                 // Add portfolio ranking
    //                 function(callback) {
    //                     if(project.portfolio){
    //                         PortfolioRanking.findOne({portfolio : project.portfolio._id}).exec(function (err, rankingObj) {
    //                             if (err) {
    //                                 return callback(err);
    //                             }
    //                             var projectRanking = _.findIndex(rankingObj.projects, function(p){
    //                                     return p.equals(project._id);
    //                                 }) + 1;
    //                             if(projectRanking){
    //                                 project.portfolioRanking = projectRanking;
    //                             } else {
    //                                 project.portfolioRanking = null;
    //                             }
    //                             callback(null);
    //                         });
    //                     } else {
    //                         project.portfolioRanking = null;
    //                         callback(null);
    //                     }
    //                 },
    //                 // Add overall ranking
    //                 function(callback) {
    //                     OverallRanking.find().exec(function (err, rankingArray) {
    //                         var rankingObj = rankingArray[0];
    //                         if (err) {
    //                             return callback(err);
    //                         }
    //                         var projectRanking = _.findIndex(rankingObj.projects, function(p){
    //                                 return p.equals(project._id);
    //                             }) + 1;
    //                         if(projectRanking){
    //                             project.overallRanking = projectRanking;
    //                         } else {
    //                             project.overallRanking = null;
    //                         }
    //                         callback(null);
    //                     });
    //                 }
    //             ], function (err) {
    //                 if(err){
    //                     return callbackEach(err);
    //                 }
    //                 projectsWithRankings.push(project);
    //                 callbackEach();
    //             });
    //         }, function(err){
    //             if( err ) {
    //                 callback(err);
    //             } else {
    //                 callback(null, projectsWithRankings);
    //             }
    //         });
    //     },
    //     // Iterate through all projects and create their delivery profile
    //     function(projectsWithRankings, callback){
    //         var allProfiles = [];
    //         async.eachSeries(projectsWithRankings, function(project, callbackEach) {
    //             var projectProfile = {
    //                 project : {
    //                     _id : project._id,
    //                     process : project.process,
    //                     portfolio : project.portfolio,
    //                     identification : project.identification,
    //                     portfolioRanking : project.portfolioRanking,
    //                     overallRanking : project.overallRanking
    //                 },
    //                 cumulativeData : {},
    //                 gates : []
    //             };
    //             async.waterfall([
    //                 // Get gateStatusAssignments and lastCompleted/current gate
    //                 function(callback) {
    //                     var process = project.process;
    //                     var retObj = {
    //                         process : process,
    //                         gateAssignments : [],
    //                         lastCompleted : {},
    //                         current : {},
    //                         baselineDurations : [],
    //                         baselineCosts : [],
    //                         baselineCompletions : []
    //                     };
    //                     async.waterfall([
    //                         function(callback){
    //                             GateStatusAssignment.find({project: project._id, gate: {$in:process.gates}})
    //                                 .populate('gate').populate('currentRecord.status').populate('currentRecord.overallScore').populate('overallStatus.currentRecord.status')
    //                                 .exec(function(err, assignments){
    //                                     if(err){
    //                                         return callback(err);
    //                                     }
    //                                     if(!assignments){
    //                                         return callback(new Error ({message: 'Cannot find assignments for process' + process._id}));
    //                                     }
    //                                     callback(null, assignments);
    //                                 });
    //                         },
    //                         function(assignments, callback){
    //
    //                             // get last completed assignment. _.max() of empty returns infinity and if(!xxx) doesn't work
    //
    //                             var completedAssignments = _.filter(assignments, function(assignment){
    //                                 return assignment.currentRecord.completed;
    //                             });
    //
    //                             if(_.isEmpty(completedAssignments)){
    //                                 retObj.lastCompleted = null;
    //                             } else {
    //                                 retObj.lastCompleted = _.max(completedAssignments,function(completedAssignment){
    //                                     return completedAssignment.gate.position;
    //                                 });
    //                             }
    //
    //                             retObj.gateAssignments = assignments;
    //                             if(!retObj.lastCompleted){
    //                                 retObj.current = _.find(assignments, function(assignment){
    //                                     return assignment.gate.position === 1;
    //                                 });
    //                             } else if(retObj.lastCompleted.gate._id.equals(process.closureGate)){
    //                                 retObj.current = retObj.lastCompleted;
    //                             } else {
    //                                 retObj.current = _.find(assignments, function(assignment){
    //                                     return assignment.gate.position === retObj.lastCompleted.gate.position + 1;
    //                                 });
    //                             }
    //
    //                             callback(null, retObj);
    //                         }
    //                     ], function(err, retObj){
    //                         if(err){
    //                             return callback(err);
    //                         }
    //                         callback(null, retObj);
    //                     });
    //                 },
    //                 // Get all raw performances
    //                 function(retObj, callback){
    //                     async.parallel([
    //                         function(callback){
    //                             BaselineDuration.find({project: project._id}).exec(function(err, performances){
    //                                 if(err){
    //                                     return callback(err);
    //                                 }
    //                                 if(!performances){
    //                                     return callback(new Error ({message: 'Cannot find baseline duration for project' + project._id}));
    //                                 }
    //                                 retObj.baselineDurations = performances;
    //                                 callback(null);
    //                             });
    //                         },
    //                         function(callback){
    //                             BaselineCost.find({project: project._id}).exec(function(err, performances){
    //                                 if(err){
    //                                     return callback(err);
    //                                 }
    //                                 if(!performances){
    //                                     return callback(new Error ({message: 'Cannot find baseline cost for project' + project._id}));
    //                                 }
    //                                 retObj.baselineCosts = performances;
    //                                 callback(null);
    //                             });
    //                         },
    //                         function(callback){
    //                             BaselineCompletion.find({project: project._id}).exec(function(err, performances){
    //                                 if(err){
    //                                     return callback(err);
    //                                 }
    //                                 if(!performances){
    //                                     return callback(new Error ({message: 'Cannot find baseline cost for project' + project._id}));
    //                                 }
    //                                 retObj.baselineCompletions = performances;
    //                                 callback(null);
    //                             });
    //                         },
    //                         function(callback){
    //                             EstimateDuration.find({project: project._id}).exec(function(err, performances){
    //                                 if(err){
    //                                     return callback(err);
    //                                 }
    //                                 if(!performances){
    //                                     return callback(new Error ({message: 'Cannot find baseline duration for project' + project._id}));
    //                                 }
    //                                 retObj.estimateDurations = performances;
    //                                 callback(null);
    //                             });
    //                         },
    //                         function(callback){
    //                             EstimateCost.find({project: project._id}).exec(function(err, performances){
    //                                 if(err){
    //                                     return callback(err);
    //                                 }
    //                                 if(!performances){
    //                                     return callback(new Error ({message: 'Cannot find baseline cost for project' + project._id}));
    //                                 }
    //                                 retObj.estimateCosts = performances;
    //                                 callback(null);
    //                             });
    //                         },
    //                         function(callback){
    //                             EstimateCompletion.find({project: project._id}).exec(function(err, performances){
    //                                 if(err){
    //                                     return callback(err);
    //                                 }
    //                                 if(!performances){
    //                                     return callback(new Error ({message: 'Cannot find baseline cost for project' + project._id}));
    //                                 }
    //                                 retObj.estimateCompletions = performances;
    //                                 callback(null);
    //                             });
    //                         },
    //                         function(callback){
    //                             ActualDuration.find({project: project._id}).exec(function(err, performances){
    //                                 if(err){
    //                                     return callback(err);
    //                                 }
    //                                 if(!performances){
    //                                     return callback(new Error ({message: 'Cannot find baseline duration for project' + project._id}));
    //                                 }
    //                                 retObj.actualDurations = performances;
    //                                 callback(null);
    //                             });
    //                         },
    //                         function(callback){
    //                             ActualCost.find({project: project._id}).exec(function(err, performances){
    //                                 if(err){
    //                                     return callback(err);
    //                                 }
    //                                 if(!performances){
    //                                     return callback(new Error ({message: 'Cannot find baseline cost for project' + project._id}));
    //                                 }
    //                                 retObj.actualCosts = performances;
    //                                 callback(null);
    //                             });
    //                         },
    //                         function(callback){
    //                             ActualCompletion.find({project: project._id}).exec(function(err, performances){
    //                                 if(err){
    //                                     return callback(err);
    //                                 }
    //                                 if(!performances){
    //                                     return callback(new Error ({message: 'Cannot find baseline cost for project' + project._id}));
    //                                 }
    //                                 retObj.actualCompletions = performances;
    //                                 callback(null);
    //                             });
    //                         }
    //                     ], function(err){
    //                         if(err){
    //                             return callback(err);
    //                         }
    //
    //                         callback(null, retObj);
    //                     });
    //                 },
    //                 // Create result array
    //                 function(retObj, callback){
    //                     var result = []; // contains resultObjects
    //
    //                     // VARIABLES
    //                     var currentPosition = retObj.current.gate.position;
    //                     var closureGatePosition = _.find(retObj.gateAssignments, function(assignment){
    //                         return assignment.gate._id.equals(retObj.process.closureGate);
    //                     }).gate.position;
    //
    //                     var previousGateDateBaseline = null;
    //                     var previousGateDateEstimate = null;
    //                     var previousGateDateActual = null;
    //
    //                     var cumulativeBudget = 0;
    //
    //                     var cumulativeBaselineDays = 0;
    //                     var cumulativeBaselineCost = 0;
    //                     var cumulativeBaselineCompletion = 0;
    //                     var cumulativeEstimateDays = 0;
    //                     var cumulativeEstimateCost = 0;
    //                     var cumulativeEstimateCompletion = 0;
    //                     var cumulativeActualDays = 0;
    //                     var cumulativeActualCost = 0;
    //                     var cumulativeActualCompletion = 0;
    //
    //                     // For all gates BEFORE current (sourceGate === targetGate to filter performances)
    //                     var loopFunctionBefore = function(lp){
    //                         var resultObj = {
    //                             gate : {},
    //                             current : false,
    //                             completed : false,
    //                             gateStatus : null,
    //                             overallScore : null,
    //                             overallStatus : null,
    //                             oneStage : {
    //                                 budget : {
    //                                     amount : 0,
    //                                     varianceBaseline : 0, // costBaseline - budget
    //                                     varianceBaselinePercent : 0, // varianceBaseline / budget
    //                                     varianceAtCompletion : 0, // estimateCost (actual if completed) - budget
    //                                     varianceAtCompletionPercent : 0 // varianceAtCompletion / budget
    //                                 },
    //                                 duration : {
    //                                     baselineDate : null,
    //                                     baselineDays : 0,
    //                                     estimateDate : null,
    //                                     estimateDays : 0,
    //                                     actualDate : null,
    //                                     actualDays : 0,
    //                                     variance : 0, // baselineDays - estimateDays (actual if completed)
    //                                     variancePercent : 0 // variance / baselineDays
    //                                 },
    //                                 cost : {
    //                                     baseline : 0,
    //                                     estimate : 0,
    //                                     actual : 0,
    //                                     earnedActual : 0,
    //                                     variance : 0, // baseline - estimate (actual if completed)
    //                                     variancePercent : 0 // variance / baseline
    //                                 },
    //                                 completion : {
    //                                     baseline : 0,
    //                                     estimate : 0,
    //                                     actual : 0,
    //                                     earnedActual : 0,
    //                                     variance : 0, // baseline - estimate (actual if completed)
    //                                     variancePercent : 0 // variance / baseline
    //                                 },
    //                                 earnedValueAnalysis : {
    //                                     earnedValueRatio : 0,
    //                                     earnedValue : 0,
    //                                     costVariance : 0,
    //                                     scheduleVariance : 0,
    //                                     percentScheduleVariance : 0,
    //                                     percentCostVariance : 0,
    //                                     costPerformanceIndex : 0,
    //                                     schedulePerformanceIndex : 0,
    //                                     percentSpent : 0,
    //                                     percentComplete : 0
    //                                 }
    //                             },
    //                             cumulative : {
    //                                 budget : {
    //                                     amount : 0,
    //                                     varianceBaseline : 0, // costBaseline - budget
    //                                     varianceBaselinePercent : 0, // varianceBaseline / budget
    //                                     varianceAtCompletion : 0, // estimateCost (actual if completed) - budget
    //                                     varianceAtCompletionPercent : 0 // varianceAtCompletion / budget
    //                                 },
    //                                 duration : {
    //                                     baselineDays : 0,
    //                                     estimateDays : 0,
    //                                     actualDays : 0,
    //                                     variance : 0, // baselineDays - estimateDays (actual if completed)
    //                                     variancePercent : 0 // variance / baselineDays
    //                                 },
    //                                 cost : {
    //                                     baseline : 0,
    //                                     estimate : 0,
    //                                     actual : 0,
    //                                     earnedActual : 0,
    //                                     variance : 0, // baseline - estimate (actual if completed)
    //                                     variancePercent : 0 // variance / baseline
    //                                 },
    //                                 completion : {
    //                                     baseline : 0,
    //                                     estimate : 0,
    //                                     actual : 0,
    //                                     earnedActual : 0,
    //                                     variance : 0, // baseline - estimate (actual if completed)
    //                                     variancePercent : 0 // variance / baseline
    //                                 },
    //                                 earnedValueAnalysis : {
    //                                     earnedValueRatio : 0,
    //                                     earnedValue : 0,
    //                                     costVariance : 0,
    //                                     scheduleVariance : 0,
    //                                     percentScheduleVariance : 0,
    //                                     percentCostVariance : 0,
    //                                     costPerformanceIndex : 0,
    //                                     schedulePerformanceIndex : 0,
    //                                     percentSpent : 0,
    //                                     percentComplete : 0,
    //                                     toCompletePerformanceIndex : 0,
    //                                     atCompletionCost : 0
    //                                 }
    //                             }
    //                         };
    //                         var loopAssignment = _.find(retObj.gateAssignments, function(assignment){
    //                             return assignment.gate.position === lp;
    //                         });
    //                         var loopGate = loopAssignment.gate;
    //
    //                         resultObj.gate = loopGate;
    //                         resultObj.current = false;
    //                         resultObj.completed = loopAssignment.currentRecord.completed;
    //                         resultObj.gateStatus = loopAssignment.currentRecord.status;
    //                         resultObj.overallScore = loopAssignment.currentRecord.overallScore;
    //                         resultObj.overallStatus = loopAssignment.overallStatus.currentRecord.status;
    //
    //                         // Duration
    //
    //                         var baselineDuration = _.find(retObj.baselineDurations, function(performance){
    //                             return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.duration.baselineDate = baselineDuration.currentRecord.gateDate;
    //
    //                         if(lp !== 1 && baselineDuration.currentRecord.gateDate && previousGateDateBaseline){
    //                             resultObj.oneStage.duration.baselineDays = (baselineDuration.currentRecord.gateDate - previousGateDateBaseline)/(1000*60*60*24);
    //                             resultObj.cumulative.duration.baselineDays = cumulativeBaselineDays + resultObj.oneStage.duration.baselineDays;
    //                         }
    //                         previousGateDateBaseline = baselineDuration.currentRecord.gateDate;
    //                         cumulativeBaselineDays = cumulativeBaselineDays + resultObj.oneStage.duration.baselineDays;
    //
    //                         var estimateDuration = _.find(retObj.estimateDurations, function(performance){
    //                             return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.duration.estimateDate = estimateDuration.currentRecord.gateDate;
    //                         if(lp !== 1 && estimateDuration.currentRecord.gateDate && previousGateDateEstimate){
    //                             resultObj.oneStage.duration.estimateDays = (estimateDuration.currentRecord.gateDate - previousGateDateEstimate)/(1000*60*60*24);
    //                             resultObj.cumulative.duration.estimateDays = cumulativeEstimateDays + resultObj.oneStage.duration.estimateDays;
    //                         }
    //                         previousGateDateEstimate = estimateDuration.currentRecord.gateDate;
    //                         cumulativeEstimateDays = cumulativeEstimateDays + resultObj.oneStage.duration.estimateDays;
    //
    //                         var actualDuration = _.find(retObj.actualDurations, function(performance){
    //                             return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.duration.actualDate = actualDuration.currentRecord.gateDate;
    //                         if(lp !== 1 && actualDuration.currentRecord.gateDate && previousGateDateActual){
    //                             resultObj.oneStage.duration.actualDays = (actualDuration.currentRecord.gateDate - previousGateDateActual)/(1000*60*60*24);
    //                             resultObj.cumulative.duration.actualDays = cumulativeActualDays + resultObj.oneStage.duration.actualDays;
    //                         }
    //                         previousGateDateActual = actualDuration.currentRecord.gateDate;
    //                         cumulativeActualDays = cumulativeActualDays + resultObj.oneStage.duration.actualDays;
    //
    //                         // Cost
    //
    //                         var baselineCost = _.find(retObj.baselineCosts, function(performance){
    //                             return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.cost.baseline = baselineCost.currentRecord.cost;
    //                         resultObj.cumulative.cost.baseline = cumulativeBaselineCost + resultObj.oneStage.cost.baseline;
    //                         cumulativeBaselineCost = cumulativeBaselineCost + resultObj.oneStage.cost.baseline;
    //
    //                         var estimateCost = _.find(retObj.estimateCosts, function(performance){
    //                             return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.cost.estimate = estimateCost.currentRecord.cost;
    //                         resultObj.cumulative.cost.estimate = cumulativeEstimateCost + resultObj.oneStage.cost.estimate;
    //                         cumulativeEstimateCost = cumulativeEstimateCost + resultObj.oneStage.cost.estimate;
    //
    //                         var actualCost = _.find(retObj.actualCosts, function(performance){
    //                             return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.cost.actual = actualCost.currentRecord.cost;
    //                         resultObj.cumulative.cost.actual = cumulativeActualCost + resultObj.oneStage.cost.actual;
    //                         cumulativeActualCost = cumulativeActualCost + resultObj.oneStage.cost.actual;
    //
    //                         // Completion
    //
    //                         var baselineCompletion = _.find(retObj.baselineCompletions, function(performance){
    //                             return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.completion.baseline = baselineCompletion.currentRecord.completion;
    //                         resultObj.cumulative.completion.baseline = cumulativeBaselineCompletion + resultObj.oneStage.completion.baseline;
    //                         cumulativeBaselineCompletion = cumulativeBaselineCompletion + resultObj.oneStage.completion.baseline;
    //
    //                         var estimateCompletion = _.find(retObj.estimateCompletions, function(performance){
    //                             return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.completion.estimate = estimateCompletion.currentRecord.completion;
    //                         resultObj.cumulative.completion.estimate = cumulativeEstimateCompletion + resultObj.oneStage.completion.estimate;
    //                         cumulativeEstimateCompletion = cumulativeEstimateCompletion + resultObj.oneStage.completion.estimate;
    //
    //                         var actualCompletion = _.find(retObj.actualCompletions, function(performance){
    //                             return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.completion.actual = actualCompletion.currentRecord.completion;
    //                         resultObj.cumulative.completion.actual = cumulativeActualCompletion + resultObj.oneStage.completion.actual;
    //                         cumulativeActualCompletion = cumulativeActualCompletion + resultObj.oneStage.completion.actual;
    //
    //                         // Budget
    //                         resultObj.oneStage.budget.amount = loopAssignment.budget.currentRecord.amount;
    //                         resultObj.cumulative.budget.amount = cumulativeBudget + loopAssignment.budget.currentRecord.amount;
    //                         cumulativeBudget = cumulativeBudget + loopAssignment.budget.currentRecord.amount;
    //
    //                         // Variances
    //
    //                         if(loopAssignment.currentRecord.completed){
    //                             resultObj.oneStage.duration.variance = resultObj.oneStage.duration.actualDays - resultObj.oneStage.duration.baselineDays;
    //                             resultObj.cumulative.duration.variance = resultObj.cumulative.duration.actualDays - resultObj.cumulative.duration.baselineDays;
    //
    //                             resultObj.oneStage.cost.variance = resultObj.oneStage.cost.actual - resultObj.oneStage.cost.baseline;
    //                             resultObj.cumulative.cost.variance = resultObj.cumulative.cost.actual - resultObj.cumulative.cost.baseline;
    //
    //                             resultObj.oneStage.completion.variance = resultObj.oneStage.completion.actual - resultObj.oneStage.completion.baseline;
    //                             resultObj.cumulative.completion.variance = resultObj.cumulative.completion.actual - resultObj.cumulative.completion.baseline;
    //
    //                             resultObj.oneStage.budget.varianceAtCompletion = resultObj.oneStage.budget.amount - resultObj.oneStage.cost.actual;
    //                             resultObj.cumulative.budget.varianceAtCompletion = resultObj.cumulative.budget.amount - resultObj.cumulative.cost.actual;
    //
    //                         } else {
    //                             resultObj.oneStage.duration.variance = resultObj.oneStage.duration.estimateDays - resultObj.oneStage.duration.baselineDays;
    //                             resultObj.cumulative.duration.variance = resultObj.cumulative.duration.estimateDays - resultObj.cumulative.duration.baselineDays;
    //
    //                             resultObj.oneStage.cost.variance = resultObj.oneStage.cost.estimate - resultObj.oneStage.cost.baseline;
    //                             resultObj.cumulative.cost.variance = resultObj.cumulative.cost.estimate - resultObj.cumulative.cost.baseline;
    //
    //                             resultObj.oneStage.completion.variance = resultObj.oneStage.completion.estimate - resultObj.oneStage.completion.baseline;
    //                             resultObj.cumulative.completion.variance = resultObj.cumulative.completion.estimate - resultObj.cumulative.completion.baseline;
    //
    //                             resultObj.oneStage.budget.varianceAtCompletion = resultObj.oneStage.budget.amount - resultObj.oneStage.cost.estimate;
    //                             resultObj.cumulative.budget.varianceAtCompletion = resultObj.cumulative.budget.amount - resultObj.cumulative.cost.estimate;
    //                         }
    //
    //                         resultObj.oneStage.budget.varianceBaseline = resultObj.oneStage.budget.amount - resultObj.oneStage.cost.baseline;
    //                         resultObj.cumulative.budget.varianceBaseline = resultObj.cumulative.budget.amount - resultObj.cumulative.cost.baseline;
    //
    //                         if(resultObj.oneStage.budget.amount !== 0){
    //                             resultObj.oneStage.budget.varianceAtCompletionPercent = resultObj.oneStage.budget.varianceAtCompletion / resultObj.oneStage.budget.amount;
    //                         }
    //                         if(resultObj.cumulative.budget.amount !== 0){
    //                             resultObj.cumulative.budget.varianceAtCompletionPercent = resultObj.cumulative.budget.varianceAtCompletion / resultObj.cumulative.budget.amount;
    //                         }
    //
    //                         if(resultObj.oneStage.budget.amount !== 0){
    //                             resultObj.oneStage.budget.varianceBaselinePercent = resultObj.oneStage.budget.varianceBaseline / resultObj.oneStage.budget.amount;
    //                         }
    //                         if(resultObj.cumulative.budget.amount !== 0){
    //                             resultObj.cumulative.budget.varianceBaselinePercent = resultObj.cumulative.budget.varianceBaseline / resultObj.cumulative.budget.amount;
    //                         }
    //
    //                         if(resultObj.oneStage.duration.baselineDays !== 0){
    //                             resultObj.oneStage.duration.variancePercent = resultObj.oneStage.duration.variance / resultObj.oneStage.duration.baselineDays;
    //                         }
    //                         if(resultObj.cumulative.duration.baselineDays !== 0){
    //                             resultObj.cumulative.duration.variancePercent = resultObj.cumulative.duration.variance / resultObj.cumulative.duration.baselineDays;
    //                         }
    //
    //                         if(resultObj.oneStage.cost.baseline !== 0){
    //                             resultObj.oneStage.cost.variancePercent = resultObj.oneStage.cost.variance / resultObj.oneStage.cost.baseline;
    //                         }
    //                         if(resultObj.cumulative.cost.baseline !== 0){
    //                             resultObj.cumulative.cost.variancePercent = resultObj.cumulative.cost.variance / resultObj.cumulative.cost.baseline;
    //                         }
    //
    //                         if(resultObj.oneStage.completion.baseline !== 0){
    //                             resultObj.oneStage.completion.variancePercent = resultObj.oneStage.completion.variance / resultObj.oneStage.completion.baseline;
    //                         }
    //                         if(resultObj.cumulative.completion.baseline !== 0){
    //                             resultObj.cumulative.completion.variancePercent = resultObj.cumulative.completion.variance / resultObj.cumulative.completion.baseline;
    //                         }
    //
    //                         // Earned Value Analysis
    //
    //                         if(loopAssignment.currentRecord.completed){
    //                             resultObj.oneStage.completion.earnedActual = resultObj.oneStage.completion.actual;
    //                             resultObj.oneStage.cost.earnedActual = resultObj.oneStage.cost.actual;
    //                             resultObj.cumulative.completion.earnedActual = resultObj.cumulative.completion.earnedActual + resultObj.oneStage.completion.actual;
    //                             resultObj.cumulative.cost.earnedActual = resultObj.cumulative.cost.earnedActual + resultObj.oneStage.cost.actual;
    //                         } else {
    //                             resultObj.oneStage.completion.earnedActual = resultObj.oneStage.completion.estimate;
    //                             resultObj.oneStage.cost.earnedActual = resultObj.oneStage.cost.estimate;
    //                             resultObj.cumulative.completion.earnedActual = resultObj.cumulative.completion.earnedActual + resultObj.oneStage.completion.estimate;
    //                             resultObj.cumulative.cost.earnedActual = resultObj.cumulative.cost.earnedActual + resultObj.oneStage.cost.estimate;
    //                         }
    //                         // oneStage
    //
    //                         // earnedValueRatio = estimateCompletion (or actual if completed) / baselineCompletion
    //                         if(resultObj.oneStage.completion.baseline !== 0){
    //                             resultObj.oneStage.earnedValueAnalysis.earnedValueRatio = resultObj.oneStage.completion.earnedActual / resultObj.oneStage.completion.baseline;
    //                         }
    //                         // earnedValue = earnedValueRatio * baselineCost
    //                         resultObj.oneStage.earnedValueAnalysis.earnedValue = resultObj.oneStage.earnedValueAnalysis.earnedValueRatio * resultObj.oneStage.cost.baseline;
    //                         // costVariance = earnedValue - estimateCost (or actualCost if completed)
    //                         resultObj.oneStage.earnedValueAnalysis.costVariance = resultObj.oneStage.earnedValueAnalysis.earnedValue - resultObj.oneStage.cost.earnedActual;
    //                         // scheduleVariance = earnedValue - baselineCost
    //                         resultObj.oneStage.earnedValueAnalysis.scheduleVariance = resultObj.oneStage.earnedValueAnalysis.earnedValue - resultObj.oneStage.cost.baseline;
    //                         // percentScheduleVariance = scheduleVariance / baselineCost
    //                         if(resultObj.oneStage.cost.baseline !== 0){
    //                             resultObj.oneStage.earnedValueAnalysis.percentScheduleVariance = resultObj.oneStage.earnedValueAnalysis.scheduleVariance / resultObj.oneStage.cost.baseline;
    //                         }
    //                         // percentCostVariance = costVariance / earnedValue
    //                         if(resultObj.oneStage.earnedValueAnalysis.earnedValue !== 0){
    //                             resultObj.oneStage.earnedValueAnalysis.percentCostVariance = resultObj.oneStage.earnedValueAnalysis.costVariance / resultObj.oneStage.earnedValueAnalysis.earnedValue;
    //                         }
    //                         // costPerformanceIndex = earnedValue / actualCost (or estimate if not completed)
    //                         if(resultObj.oneStage.cost.actual !== 0){
    //                             resultObj.oneStage.earnedValueAnalysis.costPerformanceIndex = resultObj.oneStage.earnedValueAnalysis.earnedValue / resultObj.oneStage.cost.earnedActual;
    //                         }
    //                         // schedulePerformanceIndex = earnedValue / baselineCost
    //                         if(resultObj.oneStage.cost.baseline !== 0){
    //                             resultObj.oneStage.earnedValueAnalysis.schedulePerformanceIndex = resultObj.oneStage.earnedValueAnalysis.earnedValue / resultObj.oneStage.cost.baseline;
    //                         }
    //
    //                         // cumulative
    //
    //                         // earnedValueRatio = estimateCompletion (or actual if completed) / baselineCompletion
    //                         if(resultObj.cumulative.completion.baseline !== 0){
    //                             resultObj.cumulative.earnedValueAnalysis.earnedValueRatio = resultObj.cumulative.completion.earnedActual / resultObj.cumulative.completion.baseline;
    //                         }
    //                         // earnedValue = earnedValueRatio * baselineCost
    //                         resultObj.cumulative.earnedValueAnalysis.earnedValue = resultObj.cumulative.earnedValueAnalysis.earnedValueRatio * resultObj.cumulative.cost.baseline;
    //                         // costVariance = earnedValue - estimateCost (or actualCost if completed)
    //                         resultObj.cumulative.earnedValueAnalysis.costVariance = resultObj.cumulative.earnedValueAnalysis.earnedValue - resultObj.cumulative.cost.earnedActual;
    //                         // scheduleVariance = earnedValue - baselineCost
    //                         resultObj.cumulative.earnedValueAnalysis.scheduleVariance = resultObj.cumulative.earnedValueAnalysis.earnedValue - resultObj.cumulative.cost.baseline;
    //                         // percentScheduleVariance = scheduleVariance / baselineCost
    //                         if(resultObj.cumulative.cost.baseline !== 0){
    //                             resultObj.cumulative.earnedValueAnalysis.percentScheduleVariance = resultObj.cumulative.earnedValueAnalysis.scheduleVariance / resultObj.cumulative.cost.baseline;
    //                         }
    //                         // percentCostVariance = costVariance / earnedValue
    //                         if(resultObj.cumulative.earnedValueAnalysis.earnedValue !== 0){
    //                             resultObj.cumulative.earnedValueAnalysis.percentCostVariance = resultObj.cumulative.earnedValueAnalysis.costVariance / resultObj.cumulative.earnedValueAnalysis.earnedValue;
    //                         }
    //                         // costPerformanceIndex = earnedValue / actualCost (or estimate if not completed)
    //                         if(resultObj.cumulative.cost.actual !== 0){
    //                             resultObj.cumulative.earnedValueAnalysis.costPerformanceIndex = resultObj.cumulative.earnedValueAnalysis.earnedValue / resultObj.cumulative.cost.earnedActual;
    //                         }
    //                         // schedulePerformanceIndex = earnedValue / baselineCost
    //                         if(resultObj.cumulative.cost.baseline !== 0){
    //                             resultObj.cumulative.earnedValueAnalysis.schedulePerformanceIndex = resultObj.cumulative.earnedValueAnalysis.earnedValue / resultObj.cumulative.cost.baseline;
    //                         }
    //
    //                         // Push result object into result array
    //
    //                         result.push(resultObj);
    //                     };
    //                     for(var lastPositionSeenBefore = 1; lastPositionSeenBefore < currentPosition; lastPositionSeenBefore++){
    //                         loopFunctionBefore(lastPositionSeenBefore);
    //                     }
    //
    //                     // For CURRENT and all gates AFTER current (sourceGate === current gate, except actual that can only by its own gate)
    //                     var loopFunctionAfter = function(lp){
    //                         var resultObj = {
    //                             gate : {},
    //                             current : false,
    //                             completed : false,
    //                             gateStatus : null,
    //                             overallScore : null,
    //                             overallStatus : null,
    //                             oneStage : {
    //                                 budget : {
    //                                     amount : 0,
    //                                     varianceBaseline : 0, // costBaseline - budget
    //                                     varianceBaselinePercent : 0, // varianceBaseline / budget
    //                                     varianceAtCompletion : 0, // estimateCost (actual if completed) - budget
    //                                     varianceAtCompletionPercent : 0 // varianceAtCompletion / budget
    //                                 },
    //                                 duration : {
    //                                     baselineDate : null,
    //                                     baselineDays : 0,
    //                                     estimateDate : null,
    //                                     estimateDays : 0,
    //                                     actualDate : null,
    //                                     actualDays : 0,
    //                                     variance : 0, // baseline - estimate (actual if completed)
    //                                     variancePercent : 0 // variance / baseline
    //                                 },
    //                                 cost : {
    //                                     baseline : 0,
    //                                     estimate : 0,
    //                                     actual : 0,
    //                                     earnedActual : 0,
    //                                     variance : 0, // baseline - estimate (actual if completed)
    //                                     variancePercent : 0 // variance / baseline
    //                                 },
    //                                 completion : {
    //                                     baseline : 0,
    //                                     estimate : 0,
    //                                     actual : 0,
    //                                     earnedActual : 0,
    //                                     variance : 0, // baseline - estimate (actual if completed)
    //                                     variancePercent : 0 // variance / baseline
    //                                 },
    //                                 earnedValueAnalysis : {
    //                                     earnedValueRatio : 0,
    //                                     earnedValue : 0,
    //                                     costVariance : 0,
    //                                     scheduleVariance : 0,
    //                                     percentScheduleVariance : 0,
    //                                     percentCostVariance : 0,
    //                                     costPerformanceIndex : 0,
    //                                     schedulePerformanceIndex : 0,
    //                                     percentSpent : 0,
    //                                     percentComplete : 0
    //                                 }
    //                             },
    //                             cumulative : {
    //                                 budget : {
    //                                     amount : 0,
    //                                     varianceBaseline : 0, // costBaseline - budget
    //                                     varianceBaselinePercent : 0, // varianceBaseline / budget
    //                                     varianceAtCompletion : 0, // estimateCost (actual if completed) - budget
    //                                     varianceAtCompletionPercent : 0 // varianceAtCompletion / budget
    //                                 },
    //                                 duration : {
    //                                     baselineDays : 0,
    //                                     estimateDays : 0,
    //                                     actualDays : 0
    //                                 },
    //                                 cost : {
    //                                     baseline : 0,
    //                                     estimate : 0,
    //                                     actual : 0,
    //                                     earnedActual : 0
    //                                 },
    //                                 completion : {
    //                                     baseline : 0,
    //                                     estimate : 0,
    //                                     actual : 0,
    //                                     earnedActual : 0
    //                                 },
    //                                 earnedValueAnalysis : {
    //                                     earnedValueRatio : 0,
    //                                     earnedValue : 0,
    //                                     costVariance : 0,
    //                                     scheduleVariance : 0,
    //                                     percentScheduleVariance : 0,
    //                                     percentCostVariance : 0,
    //                                     costPerformanceIndex : 0,
    //                                     schedulePerformanceIndex : 0,
    //                                     percentSpent : 0,
    //                                     percentComplete : 0,
    //                                     toCompletePerformanceIndex : 0,
    //                                     atCompletionCost : 0
    //                                 }
    //                             }
    //                         };
    //                         var loopAssignment = _.find(retObj.gateAssignments, function(assignment){
    //                             return assignment.gate.position === lp;
    //                         });
    //                         var loopGate = loopAssignment.gate;
    //
    //                         resultObj.gate = loopGate;
    //                         if(lp === currentPosition){
    //                             resultObj.current = true;
    //                         }
    //                         resultObj.completed = loopAssignment.currentRecord.completed;
    //                         resultObj.gateStatus = loopAssignment.currentRecord.status;
    //                         resultObj.overallScore = loopAssignment.currentRecord.overallScore;
    //                         resultObj.overallStatus = loopAssignment.overallStatus.currentRecord.status;
    //
    //                         // Duration
    //
    //                         var baselineDuration = _.find(retObj.baselineDurations, function(performance){
    //                             return performance.sourceGate.equals(retObj.current.gate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.duration.baselineDate = baselineDuration.currentRecord.gateDate;
    //                         if(lp !== 1 && baselineDuration.currentRecord.gateDate && previousGateDateBaseline){
    //                             resultObj.oneStage.duration.baselineDays = (baselineDuration.currentRecord.gateDate - previousGateDateBaseline)/(1000*60*60*24);
    //                             resultObj.cumulative.duration.baselineDays = cumulativeBaselineDays + resultObj.oneStage.duration.baselineDays;
    //                         }
    //                         previousGateDateBaseline = baselineDuration.currentRecord.gateDate;
    //                         cumulativeBaselineDays = cumulativeBaselineDays + resultObj.oneStage.duration.baselineDays;
    //
    //                         var estimateDuration = _.find(retObj.estimateDurations, function(performance){
    //                             return performance.sourceGate.equals(retObj.current.gate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.duration.estimateDate = estimateDuration.currentRecord.gateDate;
    //                         if(lp !== 1 && estimateDuration.currentRecord.gateDate && previousGateDateEstimate){
    //                             resultObj.oneStage.duration.estimateDays = (estimateDuration.currentRecord.gateDate - previousGateDateEstimate)/(1000*60*60*24);
    //                             resultObj.cumulative.duration.estimateDays = cumulativeEstimateDays + resultObj.oneStage.duration.estimateDays;
    //                         }
    //                         previousGateDateEstimate = estimateDuration.currentRecord.gateDate;
    //                         cumulativeEstimateDays = cumulativeEstimateDays + resultObj.oneStage.duration.estimateDays;
    //
    //                         var actualDuration = _.find(retObj.actualDurations, function(performance){
    //                             return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.duration.actualDate = actualDuration.currentRecord.gateDate;
    //                         if(lp !== 1 && actualDuration.currentRecord.gateDate && previousGateDateActual){
    //                             resultObj.oneStage.duration.actualDays = (actualDuration.currentRecord.gateDate - previousGateDateActual)/(1000*60*60*24);
    //                             resultObj.cumulative.duration.actualDays = cumulativeActualDays + resultObj.oneStage.duration.actualDays;
    //                         }
    //                         previousGateDateActual = actualDuration.currentRecord.gateDate;
    //                         cumulativeActualDays = cumulativeActualDays + resultObj.oneStage.duration.actualDays;
    //
    //                         // Cost
    //
    //                         var baselineCost = _.find(retObj.baselineCosts, function(performance){
    //                             return performance.sourceGate.equals(retObj.current.gate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.cost.baseline = baselineCost.currentRecord.cost;
    //                         resultObj.cumulative.cost.baseline = cumulativeBaselineCost + resultObj.oneStage.cost.baseline;
    //                         cumulativeBaselineCost = cumulativeBaselineCost + resultObj.oneStage.cost.baseline;
    //
    //                         var estimateCost = _.find(retObj.estimateCosts, function(performance){
    //                             return performance.sourceGate.equals(retObj.current.gate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.cost.estimate = estimateCost.currentRecord.cost;
    //                         resultObj.cumulative.cost.estimate = cumulativeEstimateCost + resultObj.oneStage.cost.estimate;
    //                         cumulativeEstimateCost = cumulativeEstimateCost + resultObj.oneStage.cost.estimate;
    //
    //                         var actualCost = _.find(retObj.actualCosts, function(performance){
    //                             return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.cost.actual = actualCost.currentRecord.cost;
    //                         resultObj.cumulative.cost.actual = cumulativeActualCost + resultObj.oneStage.cost.actual;
    //                         cumulativeActualCost = cumulativeActualCost + resultObj.oneStage.cost.actual;
    //
    //                         // Completion
    //
    //                         var baselineCompletion = _.find(retObj.baselineCompletions, function(performance){
    //                             return performance.sourceGate.equals(retObj.current.gate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.completion.baseline = baselineCompletion.currentRecord.completion;
    //                         resultObj.cumulative.completion.baseline = cumulativeBaselineCompletion + resultObj.oneStage.completion.baseline;
    //                         cumulativeBaselineCompletion = cumulativeBaselineCompletion + resultObj.oneStage.completion.baseline;
    //
    //                         var estimateCompletion = _.find(retObj.estimateCompletions, function(performance){
    //                             return performance.sourceGate.equals(retObj.current.gate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.completion.estimate = estimateCompletion.currentRecord.completion;
    //                         resultObj.cumulative.completion.estimate = cumulativeEstimateCompletion + resultObj.oneStage.completion.estimate;
    //                         cumulativeEstimateCompletion = cumulativeEstimateCompletion + resultObj.oneStage.completion.estimate;
    //
    //                         var actualCompletion = _.find(retObj.actualCompletions, function(performance){
    //                             return performance.sourceGate.equals(loopGate._id) && performance.targetGate.equals(loopGate._id);
    //                         });
    //                         resultObj.oneStage.completion.actual = actualCompletion.currentRecord.completion;
    //                         resultObj.cumulative.completion.actual = cumulativeActualCompletion + resultObj.oneStage.completion.actual;
    //                         cumulativeActualCompletion = cumulativeActualCompletion + resultObj.oneStage.completion.actual;
    //
    //                         // Budget
    //                         resultObj.oneStage.budget.amount = loopAssignment.budget.currentRecord.amount;
    //                         resultObj.cumulative.budget.amount = cumulativeBudget + loopAssignment.budget.currentRecord.amount;
    //                         cumulativeBudget = cumulativeBudget + loopAssignment.budget.currentRecord.amount;
    //
    //                         // Variances
    //
    //                         if(loopAssignment.currentRecord.completed){
    //                             resultObj.oneStage.duration.variance = resultObj.oneStage.duration.actualDays - resultObj.oneStage.duration.baselineDays;
    //                             resultObj.cumulative.duration.variance = resultObj.cumulative.duration.actualDays - resultObj.cumulative.duration.baselineDays;
    //
    //                             resultObj.oneStage.cost.variance = resultObj.oneStage.cost.actual - resultObj.oneStage.cost.baseline;
    //                             resultObj.cumulative.cost.variance = resultObj.cumulative.cost.actual - resultObj.cumulative.cost.baseline;
    //
    //                             resultObj.oneStage.completion.variance = resultObj.oneStage.completion.actual - resultObj.oneStage.completion.baseline;
    //                             resultObj.cumulative.completion.variance = resultObj.cumulative.completion.actual - resultObj.cumulative.completion.baseline;
    //
    //                             resultObj.oneStage.budget.varianceAtCompletion = resultObj.oneStage.budget.amount - resultObj.oneStage.cost.actual;
    //                             resultObj.cumulative.budget.varianceAtCompletion = resultObj.cumulative.budget.amount - resultObj.cumulative.cost.actual;
    //
    //                         } else {
    //                             resultObj.oneStage.duration.variance = resultObj.oneStage.duration.estimateDays - resultObj.oneStage.duration.baselineDays;
    //                             resultObj.cumulative.duration.variance = resultObj.cumulative.duration.estimateDays - resultObj.cumulative.duration.baselineDays;
    //
    //                             resultObj.oneStage.cost.variance = resultObj.oneStage.cost.estimate - resultObj.oneStage.cost.baseline;
    //                             resultObj.cumulative.cost.variance = resultObj.cumulative.cost.estimate - resultObj.cumulative.cost.baseline;
    //
    //                             resultObj.oneStage.completion.variance = resultObj.oneStage.completion.estimate - resultObj.oneStage.completion.baseline;
    //                             resultObj.cumulative.completion.variance = resultObj.cumulative.completion.estimate - resultObj.cumulative.completion.baseline;
    //
    //                             resultObj.oneStage.budget.varianceAtCompletion = resultObj.oneStage.budget.amount - resultObj.oneStage.cost.estimate;
    //                             resultObj.cumulative.budget.varianceAtCompletion = resultObj.cumulative.budget.amount - resultObj.cumulative.cost.estimate;
    //                         }
    //
    //                         resultObj.oneStage.budget.varianceBaseline = resultObj.oneStage.budget.amount - resultObj.oneStage.cost.baseline;
    //                         resultObj.cumulative.budget.varianceBaseline = resultObj.cumulative.budget.amount - resultObj.cumulative.cost.baseline;
    //
    //                         if(resultObj.oneStage.budget.amount !== 0){
    //                             resultObj.oneStage.budget.varianceAtCompletionPercent = resultObj.oneStage.budget.varianceAtCompletion / resultObj.oneStage.budget.amount;
    //                         }
    //                         if(resultObj.cumulative.budget.amount !== 0){
    //                             resultObj.cumulative.budget.varianceAtCompletionPercent = resultObj.cumulative.budget.varianceAtCompletion / resultObj.cumulative.budget.amount;
    //                         }
    //
    //                         if(resultObj.oneStage.budget.amount !== 0){
    //                             resultObj.oneStage.budget.varianceBaselinePercent = resultObj.oneStage.budget.varianceBaseline / resultObj.oneStage.budget.amount;
    //                         }
    //                         if(resultObj.cumulative.budget.amount !== 0){
    //                             resultObj.cumulative.budget.varianceBaselinePercent = resultObj.cumulative.budget.varianceBaseline / resultObj.cumulative.budget.amount;
    //                         }
    //
    //                         if(resultObj.oneStage.duration.baselineDays !== 0){
    //                             resultObj.oneStage.duration.variancePercent = resultObj.oneStage.duration.variance / resultObj.oneStage.duration.baselineDays;
    //                         }
    //                         if(resultObj.cumulative.duration.baselineDays !== 0){
    //                             resultObj.cumulative.duration.variancePercent = resultObj.cumulative.duration.variance / resultObj.cumulative.duration.baselineDays;
    //                         }
    //
    //                         if(resultObj.oneStage.cost.baseline !== 0){
    //                             resultObj.oneStage.cost.variancePercent = resultObj.oneStage.cost.variance / resultObj.oneStage.cost.baseline;
    //                         }
    //                         if(resultObj.cumulative.cost.baseline !== 0){
    //                             resultObj.cumulative.cost.variancePercent = resultObj.cumulative.cost.variance / resultObj.cumulative.cost.baseline;
    //                         }
    //
    //                         if(resultObj.oneStage.completion.baseline !== 0){
    //                             resultObj.oneStage.completion.variancePercent = resultObj.oneStage.completion.variance / resultObj.oneStage.completion.baseline;
    //                         }
    //                         if(resultObj.cumulative.completion.baseline !== 0){
    //                             resultObj.cumulative.completion.variancePercent = resultObj.cumulative.completion.variance / resultObj.cumulative.completion.baseline;
    //                         }
    //
    //                         // Earned Value Analysis
    //
    //                         if(loopAssignment.currentRecord.completed){
    //                             resultObj.oneStage.completion.earnedActual = resultObj.oneStage.completion.actual;
    //                             resultObj.oneStage.cost.earnedActual = resultObj.oneStage.cost.actual;
    //                             resultObj.cumulative.completion.earnedActual = resultObj.cumulative.completion.earnedActual + resultObj.oneStage.completion.actual;
    //                             resultObj.cumulative.cost.earnedActual = resultObj.cumulative.cost.earnedActual + resultObj.oneStage.cost.actual;
    //                         } else {
    //                             resultObj.oneStage.completion.earnedActual = resultObj.oneStage.completion.estimate;
    //                             resultObj.oneStage.cost.earnedActual = resultObj.oneStage.cost.estimate;
    //                             resultObj.cumulative.completion.earnedActual = resultObj.cumulative.completion.earnedActual + resultObj.oneStage.completion.estimate;
    //                             resultObj.cumulative.cost.earnedActual = resultObj.cumulative.cost.earnedActual + resultObj.oneStage.cost.estimate;
    //                         }
    //                         // oneStage
    //
    //                         // earnedValueRatio = estimateCompletion (or actual if completed) / baselineCompletion
    //                         if(resultObj.oneStage.completion.baseline !== 0){
    //                             resultObj.oneStage.earnedValueAnalysis.earnedValueRatio = resultObj.oneStage.completion.earnedActual / resultObj.oneStage.completion.baseline;
    //                         }
    //                         // earnedValue = earnedValueRatio * baselineCost
    //                         resultObj.oneStage.earnedValueAnalysis.earnedValue = resultObj.oneStage.earnedValueAnalysis.earnedValueRatio * resultObj.oneStage.cost.baseline;
    //                         // costVariance = earnedValue - estimateCost (or actualCost if completed)
    //                         resultObj.oneStage.earnedValueAnalysis.costVariance = resultObj.oneStage.earnedValueAnalysis.earnedValue - resultObj.oneStage.cost.earnedActual;
    //                         // scheduleVariance = earnedValue - baselineCost
    //                         resultObj.oneStage.earnedValueAnalysis.scheduleVariance = resultObj.oneStage.earnedValueAnalysis.earnedValue - resultObj.oneStage.cost.baseline;
    //                         // percentScheduleVariance = scheduleVariance / baselineCost
    //                         if(resultObj.oneStage.cost.baseline !== 0){
    //                             resultObj.oneStage.earnedValueAnalysis.percentScheduleVariance = resultObj.oneStage.earnedValueAnalysis.scheduleVariance / resultObj.oneStage.cost.baseline;
    //                         }
    //                         // percentCostVariance = costVariance / earnedValue
    //                         if(resultObj.oneStage.earnedValueAnalysis.earnedValue !== 0){
    //                             resultObj.oneStage.earnedValueAnalysis.percentCostVariance = resultObj.oneStage.earnedValueAnalysis.costVariance / resultObj.oneStage.earnedValueAnalysis.earnedValue;
    //                         }
    //                         // costPerformanceIndex = earnedValue / actualCost (or estimate if not completed)
    //                         if(resultObj.oneStage.cost.actual !== 0){
    //                             resultObj.oneStage.earnedValueAnalysis.costPerformanceIndex = resultObj.oneStage.earnedValueAnalysis.earnedValue / resultObj.oneStage.cost.earnedActual;
    //                         }
    //                         // schedulePerformanceIndex = earnedValue / baselineCost
    //                         if(resultObj.oneStage.cost.baseline !== 0){
    //                             resultObj.oneStage.earnedValueAnalysis.schedulePerformanceIndex = resultObj.oneStage.earnedValueAnalysis.earnedValue / resultObj.oneStage.cost.baseline;
    //                         }
    //
    //                         // cumulative
    //
    //                         // earnedValueRatio = estimateCompletion (or actual if completed) / baselineCompletion
    //                         if(resultObj.cumulative.completion.baseline !== 0){
    //                             resultObj.cumulative.earnedValueAnalysis.earnedValueRatio = resultObj.cumulative.completion.earnedActual / resultObj.cumulative.completion.baseline;
    //                         }
    //                         // earnedValue = earnedValueRatio * baselineCost
    //                         resultObj.cumulative.earnedValueAnalysis.earnedValue = resultObj.cumulative.earnedValueAnalysis.earnedValueRatio * resultObj.cumulative.cost.baseline;
    //                         // costVariance = earnedValue - estimateCost (or actualCost if completed)
    //                         resultObj.cumulative.earnedValueAnalysis.costVariance = resultObj.cumulative.earnedValueAnalysis.earnedValue - resultObj.cumulative.cost.earnedActual;
    //                         // scheduleVariance = earnedValue - baselineCost
    //                         resultObj.cumulative.earnedValueAnalysis.scheduleVariance = resultObj.cumulative.earnedValueAnalysis.earnedValue - resultObj.cumulative.cost.baseline;
    //                         // percentScheduleVariance = scheduleVariance / baselineCost
    //                         if(resultObj.cumulative.cost.baseline !== 0){
    //                             resultObj.cumulative.earnedValueAnalysis.percentScheduleVariance = resultObj.cumulative.earnedValueAnalysis.scheduleVariance / resultObj.cumulative.cost.baseline;
    //                         }
    //                         // percentCostVariance = costVariance / earnedValue
    //                         if(resultObj.cumulative.earnedValueAnalysis.earnedValue !== 0){
    //                             resultObj.cumulative.earnedValueAnalysis.percentCostVariance = resultObj.cumulative.earnedValueAnalysis.costVariance / resultObj.cumulative.earnedValueAnalysis.earnedValue;
    //                         }
    //                         // costPerformanceIndex = earnedValue / actualCost (or estimate if not completed)
    //                         if(resultObj.cumulative.cost.actual !== 0){
    //                             resultObj.cumulative.earnedValueAnalysis.costPerformanceIndex = resultObj.cumulative.earnedValueAnalysis.earnedValue / resultObj.cumulative.cost.earnedActual;
    //                         }
    //                         // schedulePerformanceIndex = earnedValue / baselineCost
    //                         if(resultObj.cumulative.cost.baseline !== 0){
    //                             resultObj.cumulative.earnedValueAnalysis.schedulePerformanceIndex = resultObj.cumulative.earnedValueAnalysis.earnedValue / resultObj.cumulative.cost.baseline;
    //                         }
    //
    //
    //                         // Push result object into result array
    //
    //                         result.push(resultObj);
    //                     };
    //                     for(var lastPositionSeenAfter = currentPosition; lastPositionSeenAfter <= closureGatePosition; lastPositionSeenAfter++){
    //                         loopFunctionAfter(lastPositionSeenAfter);
    //                     }
    //
    //                     // Earned Value Analysis requiring BAC
    //
    //                     var budgetedAtCompletion = _.find(result, function(obj){
    //                         return obj.gate._id.equals(retObj.process.closureGate);
    //                     }).cumulative.cost.baseline;
    //
    //                     _.each(result, function(obj){
    //                         // Percents
    //                         obj.oneStage.earnedValueAnalysis.percentSpent = obj.oneStage.cost.earnedActual / budgetedAtCompletion;
    //                         obj.oneStage.earnedValueAnalysis.percentComplete = obj.oneStage.earnedValueAnalysis.earnedValue / budgetedAtCompletion;
    //                         obj.cumulative.earnedValueAnalysis.percentSpent = obj.cumulative.cost.earnedActual / budgetedAtCompletion;
    //                         obj.cumulative.earnedValueAnalysis.percentComplete = obj.cumulative.earnedValueAnalysis.earnedValue / budgetedAtCompletion;
    //                         // toCompleteCPI
    //                         if((budgetedAtCompletion - obj.cumulative.cost.earnedActual) !== 0){
    //                             obj.cumulative.earnedValueAnalysis.toCompletePerformanceIndex = (budgetedAtCompletion - obj.cumulative.earnedValueAnalysis.earnedValue) / (budgetedAtCompletion - obj.cumulative.cost.earnedActual);
    //                         }
    //                         // atCompletionCost
    //                         if((obj.cumulative.earnedValueAnalysis.costPerformanceIndex * obj.cumulative.earnedValueAnalysis.schedulePerformanceIndex) !== 0){
    //                             obj.cumulative.earnedValueAnalysis.atCompletionCost = obj.cumulative.cost.earnedActual + ((budgetedAtCompletion - obj.cumulative.earnedValueAnalysis.earnedValue)/(obj.cumulative.earnedValueAnalysis.costPerformanceIndex * obj.cumulative.earnedValueAnalysis.schedulePerformanceIndex));
    //                         }
    //                     });
    //
    //                     callback(null, result);
    //                 }
    //             ], function (err, result) {
    //                 if (err) {
    //                     callbackEach(err);
    //                 } else {
    //                     projectProfile.cumulativeData = _.max(result, function(resultObj){
    //                         return resultObj.gate.position;
    //                     }).cumulative;
    //                     projectProfile.gates = result;
    //                     allProfiles.push(projectProfile);
    //                     callbackEach();
    //                 }
    //             });
    //         }, function(err){
    //             if(err){
    //                 return callback(err);
    //             }
    //             callback(null, allProfiles);
    //         });
    //     }
    // ], function (err, allProfiles) {
    //     if (err) {
    //         console.log(err);
    //         return res.status(400).send({
    //             message: errorHandler.getErrorMessage(err)
    //         });
    //     } else {
    //         res.jsonp(allProfiles);
    //     }
    // });

};


/**
 * Delivery dashboard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

	next();
};
