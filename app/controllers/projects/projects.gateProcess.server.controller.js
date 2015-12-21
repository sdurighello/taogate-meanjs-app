'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');



/**
 *  Update Gate process
 */

exports.updateProcessAssignment = function(req, res) {
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

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

    var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');
    var GateReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateReview');


    async.series([
        // OLD PERFORMANCE RECORDS: Delete all existing performance records associated with the project's process
        function(callback){
            async.series([
                // Gates status assignment
                function(callback){
                    GateStatusAssignment.find({project: project._id}, function(err, assignments){
                        if(err) { callback(err); } else {
                            async.each(assignments, function(assignment, callback){
                                assignment.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                // Outcomes
                function(callback){
                    GateOutcomeReview.find({project: project._id}, function(err, outcomeReviews){
                        if(err) { callback(err); } else {
                            async.each(outcomeReviews, function(outcomeReview, callback){
                                outcomeReview.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                // Duration
                function(callback){
                    BaselineDuration.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    EstimateDuration.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    ActualDuration.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                // Cost
                function(callback){
                    BaselineCost.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    EstimateCost.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    ActualCost.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                // Completion
                function(callback){
                    BaselineCompletion.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    EstimateCompletion.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    ActualCompletion.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                }
            ], function(err){
                callback(err);
            });
        },
        // OLD DELIVERY DOCUMENTS: Delete all project's delivery documents associated with the old process
        function(callback){
            async.series([
                // Gate Reviews
                function(callback){
                    GateReview.find({project: project._id}, function(err, gateReviews){
                        if(err) { callback(err); } else {
                            async.each(gateReviews, function(gateReview, callback){
                                gateReview.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                }
            ], function(err){
                callback(err);
            });
        },
        // PROJECT.PROCESS: Assign the new process to the project
        function(callback){
            project.process = req.body.processId;
            project.save(function(err){
                callback(err);
            });
        },
        // NEW PERFORMANCES: Create an expected performance record for each gate
        function(callback){
            if(req.body.processId){ // Check project.process is set to a new process or just to "null", then find one
                GateProcess.findOne({_id: req.body.processId}).exec(function(err, process){
                    if(err){
                        return callback(err);
                    } else if(process.gates.length !==0){
                        async.eachSeries(process.gates, function(sourceGate, callback){
                            async.series([
                                function(callback){
                                    var gateStatusAssignment = new GateStatusAssignment({project: project._id, gate: sourceGate, currentRecord: {user: req.user}, history: []});
                                    gateStatusAssignment.save(function(err){ callback(err); });
                                },
                                function(callback){
                                    Gate.findById(sourceGate).exec(function(err, retGate){
                                        if(err){
                                            return callback(err);
                                        } else {
                                            if(retGate.gateOutcomes){
                                                async.eachSeries(retGate.gateOutcomes, function(outcome, callback){
                                                    var gateOutcomeReview = new GateOutcomeReview({project: project._id, gate: sourceGate, outcome: outcome, currentRecord: {user: req.user}, history: []});
                                                    gateOutcomeReview.save(function(err){
                                                        if(err){ return callback(err); }
                                                    });
                                                    callback();
                                                });
                                            }
                                            callback(null);
                                        }
                                    });
                                },
                                function(callback){
                                    var actualDuration = new ActualDuration({project: project._id, sourceGate: sourceGate, targetGate: sourceGate, currentRecord: {user: req.user}, history: []});
                                    actualDuration.save(function(err){ callback(err); });
                                },
                                function(callback){
                                    var actualCost = new ActualCost({project: project._id, sourceGate: sourceGate, targetGate: sourceGate, currentRecord: {user: req.user}, history: []});
                                    actualCost.save(function(err){ callback(err); });
                                },
                                function(callback){
                                    var actualCompletion = new ActualCompletion({project: project._id, sourceGate: sourceGate, targetGate: sourceGate, currentRecord: {user: req.user}, history: []});
                                    actualCompletion.save(function(err){ callback(err); });
                                },
                                function(callback){
                                    async.waterfall([
                                        function(callback){
                                            var sourceGatePosition;
                                            Gate.findById(sourceGate).exec(function(err, sourceGateObj){
                                                if(err){return callback(err);} else{
                                                    sourceGatePosition = sourceGateObj.position;
                                                    callback(null, sourceGatePosition);
                                                }
                                            });
                                        },
                                        function(sourceGatePosition, callback){
                                            async.eachSeries(process.gates, function(targetGate, callback){
                                                async.waterfall([
                                                    function(callback){
                                                        var targetGatePosition;
                                                        Gate.findById(targetGate).exec(function(err, targetGateObj){
                                                            if(err){return callback(err);} else{
                                                                targetGatePosition = targetGateObj.position;
                                                                callback(null, targetGatePosition);
                                                            }
                                                        });
                                                    },
                                                    function(targetGatePosition, callback){
                                                        if(sourceGatePosition < targetGatePosition){
                                                            async.series([
                                                                function(callback){
                                                                    var baselineDuration = new BaselineDuration({project: project._id, sourceGate: sourceGate, targetGate: targetGate, currentRecord: {user: req.user}, history: []});
                                                                    baselineDuration.save(function(err){ callback(err); });
                                                                },
                                                                function(callback){
                                                                    var baselineCost = new BaselineCost({project: project._id, sourceGate: sourceGate, targetGate: targetGate, currentRecord: {user: req.user}, history: []});
                                                                    baselineCost.save(function(err){ callback(err); });
                                                                },
                                                                function(callback){
                                                                    var baselineCompletion = new BaselineCompletion({project: project._id, sourceGate: sourceGate, targetGate: targetGate, currentRecord: {user: req.user}, history: []});
                                                                    baselineCompletion.save(function(err){ callback(err); });
                                                                },
                                                                function(callback){
                                                                    var estimateDuration = new EstimateDuration({project: project._id, sourceGate: sourceGate, targetGate: targetGate, currentRecord: {user: req.user}, history: []});
                                                                    estimateDuration.save(function(err){ callback(err); });
                                                                },
                                                                function(callback){
                                                                    var estimateCost = new EstimateCost({project: project._id, sourceGate: sourceGate, targetGate: targetGate, currentRecord: {user: req.user}, history: []});
                                                                    estimateCost.save(function(err){ callback(err); });
                                                                },
                                                                function(callback){
                                                                    var estimateCompletion = new EstimateCompletion({project: project._id, sourceGate: sourceGate, targetGate: targetGate, currentRecord: {user: req.user}, history: []});
                                                                    estimateCompletion.save(function(err){ callback(err); });
                                                                }
                                                            ], function(err){
                                                                if(err){ return callback(err); }
                                                            });
                                                        }
                                                        callback(null);
                                                    }
                                                ], function(err){
                                                    if(err){return callback(err);} else {return callback();}
                                                });
                                            }, function(err){
                                                if(err){ callback(err); }
                                            });
                                            callback(null);
                                        }
                                    ], function(err){
                                        return callback(err);
                                    });
                                }
                            ], function(err){
                                if(err){ return callback(err); } else {
                                    return callback();
                                }
                            });
                        }, function(err){
                            if(err) { callback(err); }
                        });
                    }
                });
            }
            callback(null);
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });

};

