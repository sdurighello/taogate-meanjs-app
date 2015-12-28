'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * APPLY CHANGES TO PERFORMANCES FROM CR
 */
exports.applyChange = function(req, res) {

    var ProjectChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectChangeRequest');
    var projectChangeRequest = req.projectChangeRequest;

    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');

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
            // Async.series inside an async.series so it doesn't save the projectChangeRequest if the rest is not done
            async.series([
                // BASELINE-DURATION
                function(callback){
                    async.eachSeries(req.body.baselineDurationReviews, function(baselineDurationReview, callback){
                        BaselineDuration.findById(baselineDurationReview.baselineDuration._id).exec(function(err, performance){
                            if(err){
                                return callback(err);
                            } else if(! performance){
                                return callback(new Error('Cannot find baseline duration ' + baselineDurationReview.baselineDuration._id));
                            } else {
                                performance.history.push({
                                    user : performance.currentRecord.user,
                                    created : performance.currentRecord.created,
                                    sourceChangeRequest : performance.currentRecord.sourceChangeRequest,
                                    sourceGateReview : performance.currentRecord.sourceGateReview,
                                    gateDate : performance.currentRecord.gateDate
                                });
                                performance.currentRecord.gateDate = baselineDurationReview.newDate;
                                performance.currentRecord.sourceGateReview = null;
                                performance.currentRecord.sourceChangeRequest = req.body._id;
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
                                performance.history.push({
                                    user : performance.currentRecord.user,
                                    created : performance.currentRecord.created,
                                    sourceChangeRequest : performance.currentRecord.sourceChangeRequest,
                                    sourceGateReview : performance.currentRecord.sourceGateReview,
                                    gateDate : performance.currentRecord.gateDate
                                });
                                performance.currentRecord.gateDate = actualDurationReview.newDate;
                                performance.currentRecord.sourceGateReview = null;
                                performance.currentRecord.sourceChangeRequest = req.body._id;
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
                                performance.history.push({
                                    user : performance.currentRecord.user,
                                    created : performance.currentRecord.created,
                                    sourceChangeRequest : performance.currentRecord.sourceChangeRequest,
                                    sourceGateReview : performance.currentRecord.sourceGateReview,
                                    cost : performance.currentRecord.cost
                                });
                                performance.currentRecord.cost = baselineCostReview.newCost;
                                performance.currentRecord.sourceGateReview = null;
                                performance.currentRecord.sourceChangeRequest = req.body._id;
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
                                performance.history.push({
                                    user : performance.currentRecord.user,
                                    created : performance.currentRecord.created,
                                    sourceChangeRequest : performance.currentRecord.sourceChangeRequest,
                                    sourceGateReview : performance.currentRecord.sourceGateReview,
                                    cost : performance.currentRecord.cost
                                });
                                performance.currentRecord.cost = actualCostReview.newCost;
                                performance.currentRecord.sourceGateReview = null;
                                performance.currentRecord.sourceChangeRequest = req.body._id;
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
                                performance.history.push({
                                    user : performance.currentRecord.user,
                                    created : performance.currentRecord.created,
                                    sourceChangeRequest : performance.currentRecord.sourceChangeRequest,
                                    sourceGateReview : performance.currentRecord.sourceGateReview,
                                    completion : performance.currentRecord.completion
                                });
                                performance.currentRecord.completion = baselineCompletionReview.newCompletion;
                                performance.currentRecord.sourceGateReview = null;
                                performance.currentRecord.sourceChangeRequest = req.body._id;
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
                                performance.history.push({
                                    user : performance.currentRecord.user,
                                    created : performance.currentRecord.created,
                                    sourceChangeRequest : performance.currentRecord.sourceChangeRequest,
                                    sourceGateReview : performance.currentRecord.sourceGateReview,
                                    completion : performance.currentRecord.completion
                                });
                                performance.currentRecord.completion = actualCompletionReview.newCompletion;
                                performance.currentRecord.sourceGateReview = null;
                                performance.currentRecord.sourceChangeRequest = req.body._id;
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
        },
        // If all the above series function are successful, created an 'applyChange" record
        function(callback){
            projectChangeRequest.user = req.user;
            projectChangeRequest.created = Date.now();
            projectChangeRequest.appliedChanges.push({
                user : req.user,
                created : Date.now()
            });
            projectChangeRequest.save(function(err){
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
            res.jsonp(projectChangeRequest);
        }
    });

};
