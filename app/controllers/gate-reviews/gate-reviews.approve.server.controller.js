'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * APPROVE the gate -> Make changes to all performances records, status and current/completed flags
 */
exports.approve = function(req, res) {

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    var GateReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateReview');
    var gateReview = req.gateReview;

    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');

    var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');
    var GateOutcomeReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeReview');

    var BaselineDuration = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineDuration');
    var BaselineCost = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCost');
    var BaselineCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCompletion');
    var EstimateDuration = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateDuration');
    var EstimateCost = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCost');
    var EstimateCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCompletion');
    var ActualDuration = mongoose.mtModel(req.user.tenantId + '.' + 'ActualDuration');
    var ActualCost = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCost');
    var ActualCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCompletion');

    async.waterfall([
        // Get project's process
        function(callback) {
            Project.findById(req.gateReview.project).populate('process').exec(function(err, project){
                if(err){
                    return callback(err);
                }
                if(!project){
                    return new Error('Cannot not find project' + req.gateReview.project);
                }
                callback(null, project.process);
            });
        },
        // Find COMPLETED and CURRENT info
        function(process, callback) {
            GateStatusAssignment.find({project: req.gateReview.project, gate : {$in : process.gates}}).populate('gate').exec(function(err, assignments){
                if(err){
                    return callback(err);
                }
                // Set the 'completed' flag in current gate as per req.body
                _.each(assignments, function(assignment){
                    if(assignment.gate._id.equals(req.gateReview.gate)){
                        assignment.currentRecord.completed = req.body.completed;
                    }
                });
                // Completed: iterate and find the max that is completed
                var completedAssignments, lastCompletedGateAssignment;

                completedAssignments = _.filter(assignments, function(assignment){
                    return assignment.currentRecord.completed === true;
                });

                if(_.isEmpty(completedAssignments)){ // none is completed
                    lastCompletedGateAssignment = null;
                } else {
                    lastCompletedGateAssignment = _.max(completedAssignments, function(assignment){
                        return assignment.gate.position;
                    });
                }

                // Current: the next one will be the current
                // unless the completed is the 'closure', then it is also the current
                // or none has been set completed, so the current is 'startup'
                var currentGateAssignment = null;
                if(lastCompletedGateAssignment && lastCompletedGateAssignment.gate._id.equals(process.closureGate)){
                    currentGateAssignment = lastCompletedGateAssignment;
                } else if(!lastCompletedGateAssignment){
                    currentGateAssignment = _.find(assignments, function(assignment){
                        return assignment.gate._id.equals(process.startupGate);
                    });
                } else {
                    currentGateAssignment = _.find(assignments, function(assignment){
                        return assignment.gate.position === lastCompletedGateAssignment.gate.position + 1;
                    });
                }
                // Put all the other gate assignments in the 'neither' array
                var neither = _.filter(assignments, function(assignment){
                    return (!lastCompletedGateAssignment || !assignment._id.equals(lastCompletedGateAssignment._id)) && !assignment._id.equals(currentGateAssignment._id);
                });
                // Create an array with all assignments ids
                var allIds = _.map(assignments, function(assignment){
                    return assignment._id;
                });
                // Return a completedInfo object
                var completedInfo = {
                    lastCompleted : lastCompletedGateAssignment,
                    current : currentGateAssignment,
                    neither : neither, // [ obj ]
                    allIds : allIds // [ ids ]
                };
                callback(null, completedInfo);
            });
        },
        // GATE-STATUS-ASSIGNMENT
        function(completedInfo, callback){
            GateStatusAssignment.find({_id:{$in:completedInfo.allIds}}).exec(function(err, assignments){
                if(err){
                    return callback(err);
                } else if(!assignments){
                    return callback(new Error('Cannot find gateStatusAssignments for ' + gateReview.gateStatusAssignment));
                } else {
                    async.each(assignments, function(statusAssignment, callbackEach) {
                        // Handle the assignment of this gate review
                        if(statusAssignment._id.equals(req.body.gateStatusAssignment)){
                            // Status
                            statusAssignment.history.push({
                                user : statusAssignment.currentRecord.user,
                                created: statusAssignment.currentRecord.created,
                                sourceGateReview : statusAssignment.currentRecord.sourceGateReview,
                                status : statusAssignment.currentRecord.status,
                                overallScore : statusAssignment.currentRecord.overallScore,
                                completed : statusAssignment.currentRecord.completed,
                                currentGate : statusAssignment.currentRecord.currentGate
                            });
                            statusAssignment.currentRecord.status = req.body.status;
                            statusAssignment.currentRecord.overallScore = req.body.overallScore;
                            statusAssignment.currentRecord.sourceGateReview = req.body._id;
                            statusAssignment.currentRecord.created = Date.now();
                            statusAssignment.currentRecord.user = req.user;
                            // Completed / Current
                            statusAssignment.currentRecord.completed = req.body.completed;
                            statusAssignment.currentRecord.currentGate = !!statusAssignment._id.equals(completedInfo.current._id);
                            // Budget
                            statusAssignment.budget.history.push({
                                user : statusAssignment.budget.currentRecord.user,
                                created: statusAssignment.budget.currentRecord.created,
                                sourceGateReview : statusAssignment.budget.currentRecord.sourceGateReview,
                                sourceChangeRequest : statusAssignment.budget.currentRecord.sourceChangeRequest,
                                amount : statusAssignment.budget.currentRecord.amount
                            });
                            statusAssignment.budget.currentRecord.amount = req.body.budget;
                            statusAssignment.budget.currentRecord.sourceChangeRequest = null;
                            statusAssignment.budget.currentRecord.sourceGateReview = req.body._id;
                            statusAssignment.budget.currentRecord.created = Date.now();
                            statusAssignment.budget.currentRecord.user = req.user;
                            // Save
                            statusAssignment.save(function(err){
                                if(err){
                                    return callbackEach(err);
                                }
                                callbackEach();
                            });
                        } else {
                            if(statusAssignment._id.equals(completedInfo.current._id)){
                                statusAssignment.currentRecord.currentGate = true;
                                statusAssignment.save(function(err){
                                    if(err){
                                        return callbackEach(err);
                                    }
                                    callbackEach();
                                });
                            } else {
                                statusAssignment.currentRecord.currentGate = false;
                                statusAssignment.save(function(err){
                                    if(err){
                                        return callbackEach(err);
                                    }
                                    callbackEach();
                                });
                            }
                        }
                    }, function(err){
                        if(err){
                            return callback(err);
                        }
                        callback(null, completedInfo);
                    });
                }
            });
        },
        // OUTCOME-REVIEWS
        function(completedInfo, callback){
            async.eachSeries(req.body.outcomeReviews, function(grOutcomeReview, callback){
                GateOutcomeReview.findById(grOutcomeReview.outcomeReview._id).exec(function(err, outcomeReview){
                    if(err){
                        return callback(err);
                    } else if(!outcomeReview){
                        return callback(new Error('Cannot find gateOutcomeReview ' + grOutcomeReview.outcomeReview._id));
                    } else {
                        outcomeReview.history.push({
                            created: outcomeReview.currentRecord.created,
                            user: outcomeReview.currentRecord.user,
                            sourceGateReview: outcomeReview.currentRecord.sourceGateReview,
                            score: outcomeReview.currentRecord.score,
                            comment: outcomeReview.currentRecord.comment
                        });
                        outcomeReview.currentRecord.score = grOutcomeReview.newScore;
                        outcomeReview.currentRecord.comment = grOutcomeReview.reviewComment;
                        outcomeReview.currentRecord.sourceGateReview = req.body._id;
                        outcomeReview.currentRecord.created = Date.now();
                        outcomeReview.currentRecord.user = req.user;
                        outcomeReview.save(function(err){
                            if(err){ callback(err); }
                        });
                    }
                });
                callback();
            });
            callback(null, completedInfo);
        },
        // BASELINE-DURATION
        // Set the current gate to the another gate perf that it may not be in this sourceGate
        function(completedInfo, callback){
            BaselineDuration.find({project: req.gateReview.project}).exec(function(err, performances){
                async.each(performances, function(performance, callbackEach) {
                    performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                    performance.save(function(err){
                        if(err){
                            return callbackEach(err);
                        }
                        callbackEach();
                    });
                }, function(err){
                    if(err){
                        callback(err);
                    } else {
                        callback(null, completedInfo);
                    }
                });
            });
        },
        function(completedInfo, callback){
            async.eachSeries(req.body.baselineDurationReviews, function(baselineDurationReview, callbackEach){
                BaselineDuration.findById(baselineDurationReview.baselineDuration._id).exec(function(err, performance){
                    if(err){
                        return callbackEach(err);
                    } else if(! performance){
                        return callbackEach(new Error('Cannot find baseline duration ' + baselineDurationReview.baselineDuration._id));
                    } else {
                        performance.history.push({
                            user : performance.currentRecord.user,
                            created : performance.currentRecord.created,
                            sourceChangeRequest : performance.currentRecord.sourceChangeRequest,
                            sourceGateReview : performance.currentRecord.sourceGateReview,
                            gateDate : performance.currentRecord.gateDate,
                            completed : performance.currentRecord.completed,
                            currentGate : performance.currentRecord.currentGate
                        });
                        performance.currentRecord.gateDate = baselineDurationReview.newDate;
                        performance.currentRecord.sourceGateReview = req.body._id;
                        performance.currentRecord.sourceChangeRequest = null;
                        performance.currentRecord.created = Date.now();
                        performance.currentRecord.user = req.user;
                        performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                        performance.currentRecord.completed = req.body.completed;
                        performance.save(function(err){
                            if(err){
                                return callbackEach(err);
                            }
                            callbackEach();
                        });
                    }
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, completedInfo);
                }
            });
        },
        // ESTIMATE-DURATION
        function(completedInfo, callback){
            EstimateDuration.find({project: req.gateReview.project}).exec(function(err, performances){
                async.each(performances, function(performance, callbackEach) {
                    performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                    performance.save(function(err){
                        if(err){
                            return callbackEach(err);
                        }
                        callbackEach();
                    });
                }, function(err){
                    if(err){
                        callback(err);
                    } else {
                        callback(null, completedInfo);
                    }
                });
            });
        },
        function(completedInfo, callback){
            async.eachSeries(req.body.estimateDurationReviews, function(estimateDurationReview, callbackEach){
                EstimateDuration.findById(estimateDurationReview.estimateDuration._id).exec(function(err, performance){
                    if(err){
                        return callbackEach(err);
                    } else if(! performance){
                        return callbackEach(new Error('Cannot find estimate duration ' + estimateDurationReview.estimateDuration._id));
                    } else {
                        performance.history.push({
                            user : performance.currentRecord.user,
                            created : performance.currentRecord.created,
                            sourceStatusUpdate : performance.currentRecord.sourceStatusUpdate,
                            sourceGateReview : performance.currentRecord.sourceGateReview,
                            gateDate : performance.currentRecord.gateDate,
                            completed : performance.currentRecord.completed,
                            currentGate : performance.currentRecord.currentGate
                        });
                        performance.currentRecord.gateDate = estimateDurationReview.newDate;
                        performance.currentRecord.sourceGateReview = req.body._id;
                        performance.currentRecord.sourceStatusUpdate = null;
                        performance.currentRecord.created = Date.now();
                        performance.currentRecord.user = req.user;
                        performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                        performance.currentRecord.completed = req.body.completed;
                        performance.save(function(err){
                            if(err){
                                return callbackEach(err);
                            }
                            callbackEach();
                        });
                    }
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, completedInfo);
                }
            });
        },
        // ACTUAL-DURATION
        function(completedInfo, callback){
            ActualDuration.find({project: req.gateReview.project}).exec(function(err, performances){
                async.each(performances, function(performance, callbackEach) {
                    performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                    performance.save(function(err){
                        if(err){
                            return callbackEach(err);
                        }
                        callbackEach();
                    });
                }, function(err){
                    if(err){
                        callback(err);
                    } else {
                        callback(null, completedInfo);
                    }
                });
            });
        },
        function(completedInfo, callback){
            async.eachSeries(req.body.actualDurationReviews, function(actualDurationReview, callbackEach){
                ActualDuration.findById(actualDurationReview.actualDuration._id).exec(function(err, performance){
                    if(err){
                        return callbackEach(err);
                    } else if(! performance){
                        return callbackEach(new Error('Cannot find actual duration ' + actualDurationReview.actualDuration._id));
                    } else {
                        performance.history.push({
                            user : performance.currentRecord.user,
                            created : performance.currentRecord.created,
                            sourceChangeRequest : performance.currentRecord.sourceChangeRequest,
                            sourceGateReview : performance.currentRecord.sourceGateReview,
                            gateDate : performance.currentRecord.gateDate,
                            completed : performance.currentRecord.completed,
                            currentGate : performance.currentRecord.currentGate
                        });
                        performance.currentRecord.gateDate = actualDurationReview.newDate;
                        performance.currentRecord.sourceGateReview = req.body._id;
                        performance.currentRecord.sourceChangeRequest = null;
                        performance.currentRecord.created = Date.now();
                        performance.currentRecord.user = req.user;
                        performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                        performance.currentRecord.completed = req.body.completed;
                        performance.save(function(err){
                            if(err){
                                return callbackEach(err);
                            }
                            callbackEach();
                        });
                    }
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, completedInfo);
                }
            });
        },
        // BASELINE-COST
        function(completedInfo, callback){
            BaselineCost.find({project: req.gateReview.project}).exec(function(err, performances){
                async.each(performances, function(performance, callbackEach) {
                    performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                    performance.save(function(err){
                        if(err){
                            return callbackEach(err);
                        }
                        callbackEach();
                    });
                }, function(err){
                    if(err){
                        callback(err);
                    } else {
                        callback(null, completedInfo);
                    }
                });
            });
        },
        function(completedInfo, callback){
            async.eachSeries(req.body.baselineCostReviews, function(baselineCostReview, callbackEach){
                BaselineCost.findById(baselineCostReview.baselineCost._id).exec(function(err, performance){
                    if(err){
                        return callbackEach(err);
                    } else if(! performance){
                        return callbackEach(new Error('Cannot find baseline cost ' + baselineCostReview.baselineCost._id));
                    } else {
                        performance.history.push({
                            user : performance.currentRecord.user,
                            created : performance.currentRecord.created,
                            sourceChangeRequest : performance.currentRecord.sourceChangeRequest,
                            sourceGateReview : performance.currentRecord.sourceGateReview,
                            cost : performance.currentRecord.cost,
                            completed : performance.currentRecord.completed,
                            currentGate : performance.currentRecord.currentGate
                        });
                        performance.currentRecord.cost = baselineCostReview.newCost;
                        performance.currentRecord.sourceGateReview = req.body._id;
                        performance.currentRecord.sourceChangeRequest = null;
                        performance.currentRecord.created = Date.now();
                        performance.currentRecord.user = req.user;
                        performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                        performance.currentRecord.completed = req.body.completed;
                        performance.save(function(err){
                            if(err){
                                return callbackEach(err);
                            }
                            callbackEach();
                        });
                    }
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, completedInfo);
                }
            });
        },
        // ESTIMATE-COST
        function(completedInfo, callback){
            EstimateCost.find({project: req.gateReview.project}).exec(function(err, performances){
                async.each(performances, function(performance, callbackEach) {
                    performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                    performance.save(function(err){
                        if(err){
                            return callbackEach(err);
                        }
                        callbackEach();
                    });
                }, function(err){
                    if(err){
                        callback(err);
                    } else {
                        callback(null, completedInfo);
                    }
                });
            });
        },
        function(completedInfo, callback){
            async.eachSeries(req.body.estimateCostReviews, function(estimateCostReview, callbackEach){
                EstimateCost.findById(estimateCostReview.estimateCost._id).exec(function(err, performance){
                    if(err){
                        return callbackEach(err);
                    } else if(! performance){
                        return callbackEach(new Error('Cannot find estimate cost ' + estimateCostReview.estimateCost._id));
                    } else {
                        performance.history.push({
                            user : performance.currentRecord.user,
                            created : performance.currentRecord.created,
                            sourceStatusUpdate : performance.currentRecord.sourceStatusUpdate,
                            sourceGateReview : performance.currentRecord.sourceGateReview,
                            cost : performance.currentRecord.cost,
                            completed : performance.currentRecord.completed,
                            currentGate : performance.currentRecord.currentGate
                        });
                        performance.currentRecord.cost = estimateCostReview.newCost;
                        performance.currentRecord.sourceGateReview = req.body._id;
                        performance.currentRecord.sourceStatusUpdate = null;
                        performance.currentRecord.created = Date.now();
                        performance.currentRecord.user = req.user;
                        performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                        performance.currentRecord.completed = req.body.completed;
                        performance.save(function(err){
                            if(err){
                                return callbackEach(err);
                            }
                            callbackEach();
                        });
                    }
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, completedInfo);
                }
            });
        },
        // ACTUAL-COST
        function(completedInfo, callback){
            ActualCost.find({project: req.gateReview.project}).exec(function(err, performances){
                async.each(performances, function(performance, callbackEach) {
                    performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                    performance.save(function(err){
                        if(err){
                            return callbackEach(err);
                        }
                        callbackEach();
                    });
                }, function(err){
                    if(err){
                        callback(err);
                    } else {
                        callback(null, completedInfo);
                    }
                });
            });
        },
        function(completedInfo, callback){
            async.eachSeries(req.body.actualCostReviews, function(actualCostReview, callbackEach){
                ActualCost.findById(actualCostReview.actualCost._id).exec(function(err, performance){
                    if(err){
                        return callbackEach(err);
                    } else if(! performance){
                        return callbackEach(new Error('Cannot find actual cost ' + actualCostReview.actualCost._id));
                    } else {
                        performance.history.push({
                            user : performance.currentRecord.user,
                            created : performance.currentRecord.created,
                            sourceChangeRequest : performance.currentRecord.sourceChangeRequest,
                            sourceGateReview : performance.currentRecord.sourceGateReview,
                            cost : performance.currentRecord.cost,
                            completed : performance.currentRecord.completed,
                            currentGate : performance.currentRecord.currentGate
                        });
                        performance.currentRecord.cost = actualCostReview.newCost;
                        performance.currentRecord.sourceGateReview = req.body._id;
                        performance.currentRecord.sourceChangeRequest = null;
                        performance.currentRecord.created = Date.now();
                        performance.currentRecord.user = req.user;
                        performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                        performance.currentRecord.completed = req.body.completed;
                        performance.save(function(err){
                            if(err){
                                return callbackEach(err);
                            }
                            callbackEach();
                        });
                    }
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, completedInfo);
                }
            });
        },
        // BASELINE-COMPLETION
        function(completedInfo, callback){
            BaselineCompletion.find({project: req.gateReview.project}).exec(function(err, performances){
                async.each(performances, function(performance, callbackEach) {
                    performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                    performance.save(function(err){
                        if(err){
                            return callbackEach(err);
                        }
                        callbackEach();
                    });
                }, function(err){
                    if(err){
                        callback(err);
                    } else {
                        callback(null, completedInfo);
                    }
                });
            });
        },
        function(completedInfo, callback){
            async.eachSeries(req.body.baselineCompletionReviews, function(baselineCompletionReview, callbackEach){
                BaselineCompletion.findById(baselineCompletionReview.baselineCompletion._id).exec(function(err, performance){
                    if(err){
                        return callbackEach(err);
                    } else if(! performance){
                        return callbackEach(new Error('Cannot find baseline completion ' + baselineCompletionReview.baselineCompletion._id));
                    } else {
                        performance.history.push({
                            user : performance.currentRecord.user,
                            created : performance.currentRecord.created,
                            sourceChangeRequest : performance.currentRecord.sourceChangeRequest,
                            sourceGateReview : performance.currentRecord.sourceGateReview,
                            completion : performance.currentRecord.completion,
                            completed : performance.currentRecord.completed,
                            currentGate : performance.currentRecord.currentGate
                        });
                        performance.currentRecord.completion = baselineCompletionReview.newCompletion;
                        performance.currentRecord.sourceGateReview = req.body._id;
                        performance.currentRecord.sourceChangeRequest = null;
                        performance.currentRecord.created = Date.now();
                        performance.currentRecord.user = req.user;
                        performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                        performance.currentRecord.completed = req.body.completed;
                        performance.save(function(err){
                            if(err){
                                return callbackEach(err);
                            }
                            callbackEach();
                        });
                    }
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, completedInfo);
                }
            });
        },
        // ESTIMATE-COMPLETION
        function(completedInfo, callback){
            EstimateCompletion.find({project: req.gateReview.project}).exec(function(err, performances){
                async.each(performances, function(performance, callbackEach) {
                    performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                    performance.save(function(err){
                        if(err){
                            return callbackEach(err);
                        }
                        callbackEach();
                    });
                }, function(err){
                    if(err){
                        callback(err);
                    } else {
                        callback(null, completedInfo);
                    }
                });
            });
        },
        function(completedInfo, callback){
            async.eachSeries(req.body.estimateCompletionReviews, function(estimateCompletionReview, callbackEach){
                EstimateCompletion.findById(estimateCompletionReview.estimateCompletion._id).exec(function(err, performance){
                    if(err){
                        return callbackEach(err);
                    } else if(! performance){
                        return callbackEach(new Error('Cannot find estimate completion ' + estimateCompletionReview.estimateCompletion._id));
                    } else {
                        performance.history.push({
                            user : performance.currentRecord.user,
                            created : performance.currentRecord.created,
                            sourceStatusUpdate : performance.currentRecord.sourceStatusUpdate,
                            sourceGateReview : performance.currentRecord.sourceGateReview,
                            completion : performance.currentRecord.completion,
                            completed : performance.currentRecord.completed,
                            currentGate : performance.currentRecord.currentGate
                        });
                        performance.currentRecord.completion = estimateCompletionReview.newCompletion;
                        performance.currentRecord.sourceGateReview = req.body._id;
                        performance.currentRecord.sourceStatusUpdate = null;
                        performance.currentRecord.created = Date.now();
                        performance.currentRecord.user = req.user;
                        performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                        performance.currentRecord.completed = req.body.completed;
                        performance.save(function(err){
                            if(err){
                                return callbackEach(err);
                            }
                            callbackEach();
                        });
                    }
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, completedInfo);
                }
            });
        },
        // ACTUAL-COMPLETION
        function(completedInfo, callback){
            ActualCompletion.find({project: req.gateReview.project}).exec(function(err, performances){
                async.each(performances, function(performance, callbackEach) {
                    performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                    performance.save(function(err){
                        if(err){
                            return callbackEach(err);
                        }
                        callbackEach();
                    });
                }, function(err){
                    if(err){
                        callback(err);
                    } else {
                        callback(null, completedInfo);
                    }
                });
            });
        },
        function(completedInfo, callback){
            async.eachSeries(req.body.actualCompletionReviews, function(actualCompletionReview, callbackEach){
                ActualCompletion.findById(actualCompletionReview.actualCompletion._id).exec(function(err, performance){
                    if(err){
                        return callbackEach(err);
                    } else if(! performance){
                        return callbackEach(new Error('Cannot find actual completion ' + actualCompletionReview.actualCompletion._id));
                    } else {
                        performance.history.push({
                            user : performance.currentRecord.user,
                            created : performance.currentRecord.created,
                            sourceChangeRequest : performance.currentRecord.sourceChangeRequest,
                            sourceGateReview : performance.currentRecord.sourceGateReview,
                            completion : performance.currentRecord.completion,
                            completed : performance.currentRecord.completed,
                            currentGate : performance.currentRecord.currentGate
                        });
                        performance.currentRecord.completion = actualCompletionReview.newCompletion;
                        performance.currentRecord.sourceGateReview = req.body._id;
                        performance.currentRecord.sourceChangeRequest = null;
                        performance.currentRecord.created = Date.now();
                        performance.currentRecord.user = req.user;
                        performance.currentRecord.currentGate = !!performance.sourceGate.equals(completedInfo.current.gate._id);
                        performance.currentRecord.completed = req.body.completed;
                        performance.save(function(err){
                            if(err){
                                return callbackEach(err);
                            }
                            callbackEach();
                        });
                    }
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        },
        // If all the above series function are successful, change "approved" and save gateReview
        function(callback){
            gateReview.user = req.user;
            gateReview.created = Date.now();

            gateReview.approval.history.push({
                approvalState : gateReview.approval.currentRecord.approvalState,
                user : gateReview.approval.currentRecord.user,
                created : gateReview.approval.currentRecord.created
            });

            gateReview.approval.currentRecord.approvalState = 'approved';
            gateReview.approval.currentRecord.user = req.user;
            gateReview.approval.currentRecord.created = Date.now();

            gateReview.save(function(err){
                if(err){
                    return callback(err);
                }
                callback(null);
            });
        }
    ], function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });

};
