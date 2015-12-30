'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * CREATE A PROJECT-STATUS-UPDATE
 */

exports.create = function(req, res) {
    var ProjectStatusUpdate = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectStatusUpdate');
    var projectStatusUpdate = new ProjectStatusUpdate(req.body);
    projectStatusUpdate.user = req.user;

    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');

    var EstimateDuration = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateDuration');
    var EstimateCost = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCost');
    var EstimateCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCompletion');

    var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');
    var GateOutcomeReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeReview');

    var LogStatusArea = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusArea');
    var ProjectAreaReview = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectAreaReview');


    async.waterfall([
        // Create all the CR arrays and passed them on
        function(callback){
            var retObjArrays = {

                gateStatusUpdate : {
                    gateStatusAssignment: {},
                    overallUpdate : {
                        status : {},
                        comment : {}
                    },
                    durationUpdate : {
                        status : {},
                        comment : {}
                    },
                    costUpdate : {
                        status : {},
                        comment : {}
                    },
                    completionUpdate : {
                        status : {},
                        comment : {}
                    }
                },

                statusAreaUpdates : [],
                outcomeStatusUpdates : [],

                estimateDurationReviews : [],
                estimateCostReviews : [],
                estimateCompletionReviews : []
            };
            async.parallel([
                // Gate Status Assignment
                function(callback){
                    GateStatusAssignment.findOne({project: req.body.project, gate: req.body.gate}, function(err, assignment){
                        if(err){
                            return callback(err);
                        }
                        if(!assignment){
                            return callback(new Error('Cannot find Gate Status Assignment '));
                        }
                        retObjArrays.gateStatusUpdate.gateStatusAssignment = assignment._id;

                        retObjArrays.gateStatusUpdate.overallUpdate.status = assignment.overallStatus.currentRecord.status;
                        retObjArrays.gateStatusUpdate.overallUpdate.comment = assignment.overallStatus.currentRecord.comment;

                        retObjArrays.gateStatusUpdate.durationUpdate.status = assignment.durationStatus.currentRecord.status;
                        retObjArrays.gateStatusUpdate.durationUpdate.comment = assignment.durationStatus.currentRecord.comment;

                        retObjArrays.gateStatusUpdate.costUpdate.status = assignment.costStatus.currentRecord.status;
                        retObjArrays.gateStatusUpdate.costUpdate.comment = assignment.costStatus.currentRecord.comment;

                        retObjArrays.gateStatusUpdate.completionUpdate.status = assignment.completionStatus.currentRecord.status;
                        retObjArrays.gateStatusUpdate.completionUpdate.comment = assignment.completionStatus.currentRecord.comment;

                        callback(null);
                    });
                },
                // Outcomes
                function(callback){
                    Gate.findById(req.body.gate).exec(function(err, gate){
                        if(err){
                            return callback(err);
                        }
                        if(! gate){
                            return new Error('Cannot find gate' + req.body.gate);
                        }
                        if(gate.gateOutcomes){
                            async.each(gate.gateOutcomes, function(outcome, callback){
                                GateOutcomeReview.find({project: req.body.project, gate: req.body.gate, outcome: outcome}, function(err, outcomeReviews){
                                    if(err){
                                        return callback(err);
                                    }
                                    async.each(outcomeReviews, function(outcomeReview, callback){
                                        retObjArrays.outcomeStatusUpdates.push({
                                            outcomeReview: outcomeReview._id,
                                            newStatus: outcomeReview.currentStatus.status,
                                            comment: outcomeReview.currentStatus.comment
                                        });
                                        callback();
                                    });
                                });
                                callback();
                            });
                        }
                        callback(null);
                    });
                },
                // Status-areas
                function(callback){
                    LogStatusArea.find().exec(function(err, statusAreas){
                        if(err){
                            return callback(err);
                        }
                        if(statusAreas){
                            async.each(statusAreas, function(statusArea, callback){
                                ProjectAreaReview.find({project: req.body.project, gate: req.body.gate, statusArea: statusArea}, function(err, areaReviews){
                                    if(err){
                                        return callback(err);
                                    }
                                    async.each(areaReviews, function(areaReview, callback){
                                        retObjArrays.statusAreaUpdates.push({
                                            projectAreaReview: areaReview._id,
                                            newStatus: areaReview.currentRecord.status,
                                            comment: areaReview.currentRecord.comment
                                        });
                                        callback();
                                    });
                                });
                                callback();
                            });
                        }
                        callback(null);
                    });
                },
                // Duration
                function(callback){
                    EstimateDuration.find({project: req.body.project, sourceGate: req.body.gate}, function(err, estimateDurations){
                        if(err){
                            return callback(err);
                        }
                        async.each(estimateDurations, function(estimateDuration, callback){
                            retObjArrays.estimateDurationReviews.push({
                                estimateDuration: estimateDuration._id,
                                newDate: estimateDuration.currentRecord.gateDate
                            });
                            callback();
                        });
                        callback(null);
                    });
                },
                // Cost
                function(callback){
                    EstimateCost.find({project: req.body.project, sourceGate: req.body.gate}, function(err, estimateCosts){
                        if(err){
                            return callback(err);
                        }
                        async.each(estimateCosts, function(estimateCost, callback){
                            retObjArrays.estimateCostReviews.push({
                                estimateCost: estimateCost._id,
                                newCost: estimateCost.currentRecord.cost
                            });
                            callback();
                        });
                        callback(null);
                    });
                },
                // Completion
                function(callback){
                    EstimateCompletion.find({project: req.body.project, sourceGate: req.body.gate}, function(err, estimateCompletions){
                        if(err){
                            return callback(err);
                        }
                        async.each(estimateCompletions, function(estimateCompletion, callback){
                            retObjArrays.estimateCompletionReviews.push({
                                estimateCompletion: estimateCompletion._id,
                                newCompletion: estimateCompletion.currentRecord.completion
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
            projectStatusUpdate.description = '';
            projectStatusUpdate.final = false;
            // Status Areas Update
            projectStatusUpdate.statusAreaUpdates = retObjArrays.statusAreaUpdates;
            // Gate Status
            projectStatusUpdate.gateStatusUpdate = retObjArrays.gateStatusUpdate;
            // Outcome Status
            projectStatusUpdate.outcomeStatusUpdates = retObjArrays.outcomeStatusUpdates;
            // Performances
            projectStatusUpdate.estimateDurationReviews = retObjArrays.estimateDurationReviews;
            projectStatusUpdate.estimateCostReviews = retObjArrays.estimateCostReviews;
            projectStatusUpdate.estimateCompletionReviews = retObjArrays.estimateCompletionReviews;
            // Applied changes
            projectStatusUpdate.appliedChanges = [];

            projectStatusUpdate.save(function(err){
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
            res.jsonp(projectStatusUpdate);
        }
    });
};
