'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * Set FINAL for a Gate review
 */
exports.setFinal = function(req, res) {

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

    async.series([
        function(callback){
            if(req.body.final === true){
                // Async.series inside an async.series so it doesn't save the gateReview if the rest is not done
                async.series([
                    // GATE-STATUS-ASSIGNMENT
                    function(callback){
                        GateStatusAssignment.findById(req.body.gateStatusAssignment).exec(function(err, statusAssignment){
                            if(err){
                                return callback(err);
                            } else if(!statusAssignment){
                                return callback(new Error('Cannot find gateStatusAssignment ' + gateReview.gateStatusAssignment));
                            } else {
                                statusAssignment.history.push(statusAssignment.currentRecord);
                                statusAssignment.currentRecord.status = req.body.status;
                                statusAssignment.currentRecord.overallScore = req.body.overallScore;
                                statusAssignment.currentRecord.completed = req.body.completed;
                                statusAssignment.currentRecord.sourceReview = req.body._id;
                                statusAssignment.currentRecord.created = Date.now();
                                statusAssignment.currentRecord.user = req.user;
                                statusAssignment.save(function(err){
                                    callback(err);
                                });
                            }
                        });
                    },
                    // OUTCOME-REVIEWS
                    function(callback){
                        async.eachSeries(req.body.outcomeReviews, function(grOutcomeReview, callback){
                            GateOutcomeReview.findById(grOutcomeReview.outcomeReview._id).exec(function(err, outcomeReview){
                                if(err){
                                    return callback(err);
                                } else if(!outcomeReview){
                                    return callback(new Error('Cannot find gateOutcomeReview ' + grOutcomeReview.outcomeReview._id));
                                } else {
                                    outcomeReview.history.push(outcomeReview.currentRecord);
                                    outcomeReview.currentRecord.score = grOutcomeReview.newScore;
                                    outcomeReview.currentRecord.comment = grOutcomeReview.reviewComment;
                                    outcomeReview.currentRecord.sourceReview = req.body._id;
                                    outcomeReview.currentRecord.created = Date.now();
                                    outcomeReview.currentRecord.user = req.user;
                                    outcomeReview.save(function(err){
                                        if(err){ callback(err); }
                                    });
                                }
                            });
                            callback();
                        });
                        callback(null);
                    },
                    // BASELINE-DURATION
                    function(callback){
                        async.eachSeries(req.body.baselineDurationReviews, function(baselineDurationReview, callback){
                            BaselineDuration.findById(baselineDurationReview.baselineDuration._id).exec(function(err, performance){
                                if(err){
                                    return callback(err);
                                } else if(! performance){
                                    return callback(new Error('Cannot find baseline duration ' + baselineDurationReview.baselineDuration._id));
                                } else {
                                    performance.history.push(performance.currentRecord);
                                    performance.currentRecord.gateDate = baselineDurationReview.newDate;
                                    performance.currentRecord.sourceReview = req.body._id;
                                    performance.currentRecord.sourceDoc = null;
                                    performance.currentRecord.created = Date.now();
                                    performance.currentRecord.user = req.user;
                                    performance.save(function(err){
                                        if(err){ callback(err); }
                                    });
                                }
                            });
                            callback();
                        });
                        callback(null);
                    },
                    // ESTIMATE-DURATION
                    function(callback){
                        async.eachSeries(req.body.estimateDurationReviews, function(estimateDurationReview, callback){
                            EstimateDuration.findById(estimateDurationReview.estimateDuration._id).exec(function(err, performance){
                                if(err){
                                    return callback(err);
                                } else if(! performance){
                                    return callback(new Error('Cannot find estimate duration ' + estimateDurationReview.estimateDuration._id));
                                } else {
                                    performance.history.push(performance.currentRecord);
                                    performance.currentRecord.gateDate = estimateDurationReview.newDate;
                                    performance.currentRecord.sourceReview = req.body._id;
                                    performance.currentRecord.sourceDoc = null;
                                    performance.currentRecord.created = Date.now();
                                    performance.currentRecord.user = req.user;
                                    performance.save(function(err){
                                        if(err){ callback(err); }
                                    });
                                }
                            });
                            callback();
                        });
                        callback(null);
                    },
                    // ACTUAL-DURATION
                    function(callback){
                        async.eachSeries(req.body.actualDurationReviews, function(actualDurationReview, callback){
                            ActualDuration.findById(actualDurationReview.actualDuration._id).exec(function(err, performance){
                                if(err){
                                    return callback(err);
                                } else if(! performance){
                                    return callback(new Error('Cannot find actual duration ' + actualDurationReview.actualDuration._id));
                                } else {
                                    performance.history.push(performance.currentRecord);
                                    performance.currentRecord.gateDate = actualDurationReview.newDate;
                                    performance.currentRecord.sourceReview = req.body._id;
                                    performance.currentRecord.sourceDoc = null;
                                    performance.currentRecord.created = Date.now();
                                    performance.currentRecord.user = req.user;
                                    performance.save(function(err){
                                        if(err){ callback(err); }
                                    });
                                }
                            });
                            callback();
                        });
                        callback(null);
                    },
                    // BASELINE-COST
                    function(callback){
                        async.eachSeries(req.body.baselineCostReviews, function(baselineCostReview, callback){
                            BaselineCost.findById(baselineCostReview.baselineCost._id).exec(function(err, performance){
                                if(err){
                                    return callback(err);
                                } else if(! performance){
                                    return callback(new Error('Cannot find baseline cost ' + baselineCostReview.baselineCost._id));
                                } else {
                                    performance.history.push(performance.currentRecord);
                                    performance.currentRecord.cost = baselineCostReview.newCost;
                                    performance.currentRecord.sourceReview = req.body._id;
                                    performance.currentRecord.sourceDoc = null;
                                    performance.currentRecord.created = Date.now();
                                    performance.currentRecord.user = req.user;
                                    performance.save(function(err){
                                        if(err){ callback(err); }
                                    });
                                }
                            });
                            callback();
                        });
                        callback(null);
                    },
                    // ESTIMATE-COST
                    function(callback){
                        async.eachSeries(req.body.estimateCostReviews, function(estimateCostReview, callback){
                            EstimateCost.findById(estimateCostReview.estimateCost._id).exec(function(err, performance){
                                if(err){
                                    return callback(err);
                                } else if(! performance){
                                    return callback(new Error('Cannot find estimate cost ' + estimateCostReview.estimateCost._id));
                                } else {
                                    performance.history.push(performance.currentRecord);
                                    performance.currentRecord.cost = estimateCostReview.newCost;
                                    performance.currentRecord.sourceReview = req.body._id;
                                    performance.currentRecord.sourceDoc = null;
                                    performance.currentRecord.created = Date.now();
                                    performance.currentRecord.user = req.user;
                                    performance.save(function(err){
                                        if(err){ callback(err); }
                                    });
                                }
                            });
                            callback();
                        });
                        callback(null);
                    },
                    // ACTUAL-COST
                    function(callback){
                        async.eachSeries(req.body.actualCostReviews, function(actualCostReview, callback){
                            ActualCost.findById(actualCostReview.actualCost._id).exec(function(err, performance){
                                if(err){
                                    return callback(err);
                                } else if(! performance){
                                    return callback(new Error('Cannot find actual cost ' + actualCostReview.actualCost._id));
                                } else {
                                    performance.history.push(performance.currentRecord);
                                    performance.currentRecord.cost = actualCostReview.newCost;
                                    performance.currentRecord.sourceReview = req.body._id;
                                    performance.currentRecord.sourceDoc = null;
                                    performance.currentRecord.created = Date.now();
                                    performance.currentRecord.user = req.user;
                                    performance.save(function(err){
                                        if(err){ callback(err); }
                                    });
                                }
                            });
                            callback();
                        });
                        callback(null);
                    },
                    // BASELINE-COMPLETION
                    function(callback){
                        async.eachSeries(req.body.baselineCompletionReviews, function(baselineCompletionReview, callback){
                            BaselineCompletion.findById(baselineCompletionReview.baselineCompletion._id).exec(function(err, performance){
                                if(err){
                                    return callback(err);
                                } else if(! performance){
                                    return callback(new Error('Cannot find baseline completion ' + baselineCompletionReview.baselineCompletion._id));
                                } else {
                                    performance.history.push(performance.currentRecord);
                                    performance.currentRecord.completion = baselineCompletionReview.newCompletion;
                                    performance.currentRecord.sourceReview = req.body._id;
                                    performance.currentRecord.sourceDoc = null;
                                    performance.currentRecord.created = Date.now();
                                    performance.currentRecord.user = req.user;
                                    performance.save(function(err){
                                        if(err){ callback(err); }
                                    });
                                }
                            });
                            callback();
                        });
                        callback(null);
                    },
                    // ESTIMATE-COMPLETION
                    function(callback){
                        async.eachSeries(req.body.estimateCompletionReviews, function(estimateCompletionReview, callback){
                            EstimateCompletion.findById(estimateCompletionReview.estimateCompletion._id).exec(function(err, performance){
                                if(err){
                                    return callback(err);
                                } else if(! performance){
                                    return callback(new Error('Cannot find estimate completion ' + estimateCompletionReview.estimateCompletion._id));
                                } else {
                                    performance.history.push(performance.currentRecord);
                                    performance.currentRecord.completion = estimateCompletionReview.newCompletion;
                                    performance.currentRecord.sourceReview = req.body._id;
                                    performance.currentRecord.sourceDoc = null;
                                    performance.currentRecord.created = Date.now();
                                    performance.currentRecord.user = req.user;
                                    performance.save(function(err){
                                        if(err){ callback(err); }
                                    });
                                }
                            });
                            callback();
                        });
                        callback(null);
                    },
                    // ACTUAL-COMPLETION
                    function(callback){
                        async.eachSeries(req.body.actualCompletionReviews, function(actualCompletionReview, callback){
                            ActualCompletion.findById(actualCompletionReview.actualCompletion._id).exec(function(err, performance){
                                if(err){
                                    return callback(err);
                                } else if(! performance){
                                    return callback(new Error('Cannot find actual completion ' + actualCompletionReview.actualCompletion._id));
                                } else {
                                    performance.history.push(performance.currentRecord);
                                    performance.currentRecord.completion = actualCompletionReview.newCompletion;
                                    performance.currentRecord.sourceReview = req.body._id;
                                    performance.currentRecord.sourceDoc = null;
                                    performance.currentRecord.created = Date.now();
                                    performance.currentRecord.user = req.user;
                                    performance.save(function(err){
                                        if(err){ callback(err); }
                                    });
                                }
                            });
                            callback();
                        });
                        callback(null);
                    }
                ], function(err){
                    if(err){
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            } else {
                // If 'final' is set to "false" then don't do any performance change but go directly to gateReview
                callback(null);
            }
        },
        // If all the above series function are successful, change "final" and save gateReview
        function(callback){
            gateReview.user = req.user;
            gateReview.created = Date.now();
            gateReview.final = req.body.final;
            gateReview.save(function(err){
                callback(err);
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
