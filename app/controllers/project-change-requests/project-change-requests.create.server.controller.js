'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * CREATE A CHANGE REQUEST
 */
exports.create = function(req, res) {
    var ProjectChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectChangeRequest');
    var projectChangeRequest = new ProjectChangeRequest(req.body);
    projectChangeRequest.user = req.user;

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

    async.waterfall([
        // Create all the CR arrays and passed them on
        function(callback){
            var retObjArrays = {
                baselineDurationReviews : [],
                estimateDurationReviews : [],
                actualDurationReviews : [],

                baselineCostReviews : [],
                estimateCostReviews : [],
                actualCostReviews : [],

                baselineCompletionReviews : [],
                estimateCompletionReviews : [],
                actualCompletionReviews : []
            };
            async.parallel([
                // Duration
                function(callback){
                    BaselineDuration.find({project: req.body.project, sourceGate: req.body.gate}, function(err, baselineDurations){
                        if(err){
                            return callback(err);
                        }
                        async.each(baselineDurations, function(baselineDuration, callback){
                            retObjArrays.baselineDurationReviews.push({
                                baselineDuration: baselineDuration._id,
                                newDate: baselineDuration.currentRecord.gateDate
                            });
                            callback();
                        });
                        callback(null);
                    });
                },
                function(callback){
                    ActualDuration.find({project: req.body.project, sourceGate: req.body.gate}, function(err, actualDurations){
                        if(err){
                            return callback(err);
                        }
                        async.each(actualDurations, function(actualDuration, callback){
                            retObjArrays.actualDurationReviews.push({
                                actualDuration: actualDuration._id,
                                newDate: actualDuration.currentRecord.gateDate
                            });
                            callback();
                        });
                        callback(null);
                    });
                },
                // Cost
                function(callback){
                    BaselineCost.find({project: req.body.project, sourceGate: req.body.gate}, function(err, baselineCosts){
                        if(err){
                            return callback(err);
                        }
                        async.each(baselineCosts, function(baselineCost, callback){
                            retObjArrays.baselineCostReviews.push({
                                baselineCost: baselineCost._id,
                                newCost: baselineCost.currentRecord.cost
                            });
                            callback();
                        });
                        callback(null);
                    });
                },
                function(callback){
                    ActualCost.find({project: req.body.project, sourceGate: req.body.gate}, function(err, actualCosts){
                        if(err){
                            return callback(err);
                        }
                        async.each(actualCosts, function(actualCost, callback){
                            retObjArrays.actualCostReviews.push({
                                actualCost: actualCost._id,
                                newCost: actualCost.currentRecord.cost
                            });
                            callback();
                        });
                        callback(null);
                    });
                },
                // Completion
                function(callback){
                    BaselineCompletion.find({project: req.body.project, sourceGate: req.body.gate}, function(err, baselineCompletions){
                        if(err){
                            return callback(err);
                        }
                        async.each(baselineCompletions, function(baselineCompletion, callback){
                            retObjArrays.baselineCompletionReviews.push({
                                baselineCompletion: baselineCompletion._id,
                                newCompletion: baselineCompletion.currentRecord.completion
                            });
                            callback();
                        });
                        callback(null);
                    });
                },
                function(callback){
                    ActualCompletion.find({project: req.body.project, sourceGate: req.body.gate}, function(err, actualCompletions){
                        if(err){
                            return callback(err);
                        }
                        async.each(actualCompletions, function(actualCompletion, callback){
                            retObjArrays.actualCompletionReviews.push({
                                actualCompletion: actualCompletion._id,
                                newCompletion: actualCompletion.currentRecord.completion
                            });
                            callback();
                        });
                        callback(null);
                    });
                }
            ], function(err){
                if(err){
                    return callback(err);
                }
                callback(null, retObjArrays);
            });
        },
        // Assign the arrays and save the new CR
        function(retObjArrays, callback){
            // Header
            projectChangeRequest.description = '';
            projectChangeRequest.reason = null;
            projectChangeRequest.state = null;
            projectChangeRequest.priority = null;
            // Status
            projectChangeRequest.statusReview = {
                currentRecord : {
                    baselineDeliveryDate : null,
                    estimateDeliveryDate : null,
                    actualDeliveryDate : null,
                    completed : false,
                    status: null,
                    statusComment : ''
                },
                history : []
            };
            projectChangeRequest.appliedChanges = [];
            // Performances
            projectChangeRequest.baselineDurationReviews = retObjArrays.baselineDurationReviews;
            projectChangeRequest.actualDurationReviews = retObjArrays.actualDurationReviews;
            projectChangeRequest.baselineCostReviews = retObjArrays.baselineCostReviews;
            projectChangeRequest.actualCostReviews = retObjArrays.actualCostReviews;
            projectChangeRequest.baselineCompletionReviews = retObjArrays.baselineCompletionReviews;
            projectChangeRequest.actualCompletionReviews = retObjArrays.actualCompletionReviews;

            projectChangeRequest.save(function(err){
                if(err){return callback(err);}
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
            res.jsonp(projectChangeRequest);
        }
    });
};
