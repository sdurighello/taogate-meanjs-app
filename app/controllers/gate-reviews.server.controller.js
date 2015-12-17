'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * Create a Gate review
 */
exports.create = function(req, res) {
    var GateReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateReview');
    var gateReview = new GateReview(req.body);
    gateReview.user = req.user;

    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');

    var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');

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
        // Create all the gate review arrays and passed them on
        function(callback){
            var retObjArrays = {

                gateStatusReview : {},

                outcomeReviews : [],

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
                // Gate Status Assignment
                function(callback){
                    GateStatusAssignment.findOne({project: req.body.project, gate: req.body.gate}, function(err, assignment){
                        if(err){
                            return callback(err);
                        }
                        retObjArrays.gateStatusReview.gateStatusAssignment = assignment._id;
                        retObjArrays.gateStatusReview.status = assignment.currentRecord.status;
                        retObjArrays.gateStatusReview.overallScore = assignment.currentRecord.overallScore;
                        retObjArrays.gateStatusReview.completed = assignment.currentRecord.completed;

                        callback(null);
                    });
                },
                // Outcomes
                function(callback){
                    Gate.findById(req.body.gate).exec(function(err, gate){
                        if(err){
                            return callback(err);
                        }
                        async.each(gate.gateOutcomes, function(outcome, callback){
                            retObjArrays.outcomeReviews.push({
                                outcome: outcome,
                                score: null,
                                reviewComment: null
                            });
                            callback();
                        });
                        callback(null);
                    });
                },
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
        // Assign the arrays and save the new gate review
        function(retObjArrays, callback){

            gateReview.overallComment = '';

            gateReview.gateStatusAssignment = retObjArrays.gateStatusReview.gateStatusAssignment;
            gateReview.status = retObjArrays.gateStatusReview.status;
            gateReview.overallScore = retObjArrays.gateStatusReview.overallScore;
            gateReview.completed = retObjArrays.gateStatusReview.completed;

            gateReview.outcomeReviews = retObjArrays.outcomeReviews;
            gateReview.baselineDurationReviews = retObjArrays.baselineDurationReviews;
            gateReview.estimateDurationReviews = retObjArrays.estimateDurationReviews;
            gateReview.actualDurationReviews = retObjArrays.actualDurationReviews;
            gateReview.baselineCostReviews = retObjArrays.baselineCostReviews;
            gateReview.estimateCostReviews = retObjArrays.estimateCostReviews;
            gateReview.actualCostReviews = retObjArrays.actualCostReviews;
            gateReview.baselineCompletionReviews = retObjArrays.baselineCompletionReviews;
            gateReview.estimateCompletionReviews = retObjArrays.estimateCompletionReviews;
            gateReview.actualCompletionReviews = retObjArrays.actualCompletionReviews;

            gateReview.save(function(err){
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
            res.jsonp(gateReview);
        }
    });
};

/**
 * Show the current Gate review
 */
exports.read = function(req, res) {
    res.jsonp(req.gateReview);
};

/**
 * Update a Gate review
 */
exports.update = function(req, res) {
    var gateReview = req.gateReview ;
    gateReview.user = req.user;
    gateReview.created = Date.now();
    gateReview = _.extend(gateReview , req.body);

    gateReview.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });
};

/**
 * Update a Gate review HEADER
 */
exports.updateHeader = function(req, res) {
    var gateReview = req.gateReview ;
    var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');

    async.series([
        // GATE-REVIEW: Update only header and save gate review to its collection
        function(callback){
            gateReview.user = req.user;
            gateReview.created = Date.now();
            gateReview.reviewDate = req.body.reviewDate;
            gateReview.title = req.body.title;
            gateReview.overallComment = req.body.overallComment;
            gateReview.status = req.body.status;
            gateReview.overallScore = req.body.overallScore;
            gateReview.completed = req.body.completed;

            gateReview.save(function(err){
                callback(err);
            });
        },
        // GATE-STATUS-ASSIGNMENT: Update associated gate-status-assignment with the new gate data
        function(callback){
            GateStatusAssignment.findById(req.params.headerId).exec(function(err, assignment){
                if(err){
                    return callback(err);
                } else if(! assignment){
                    return callback(new Error('Cannot find gate status assignment ' + req.params.headerId));
                } else {
                    assignment.history.push(assignment.currentRecord);

                    assignment.currentRecord.completed = req.body.completed;
                    assignment.currentRecord.status = req.body.status;
                    assignment.currentRecord.overallScore = req.body.overallScore;

                    assignment.currentRecord.sourceReview = gateReview._id;

                    assignment.currentRecord.created = Date.now();
                    assignment.currentRecord.user = req.user;

                    assignment.save(function(err){
                        callback(err);
                    });
                }
            });
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });
};

/**
 * Delete an Gate review
 */
exports.delete = function(req, res) {
    var gateReview = req.gateReview ;

    gateReview.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });
};

/**
 * List of Gate reviews
 */
exports.list = function(req, res) {
    var GateReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateReview');

    GateReview.find(req.query).deepPopulate(['overallScore', 'status']).populate('user', 'displayName').exec(function(err, gateReviews) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReviews);
        }
    });
};

/**
 * Gate review middleware
 */
exports.gateReviewByID = function(req, res, next, id) {
    var GateReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateReview');

    GateReview.findById(id).deepPopulate([
        'gateStatusAssignment',
        'outcomeReviews.outcome',
        'baselineDurationReviews.baselineDuration', 'estimateDurationReviews.estimateDuration', 'actualDurationReviews.actualDuration',
        'baselineCostReviews.baselineCost', 'estimateCostReviews.estimateCost', 'actualCostReviews.actualCost',
        'baselineCompletionReviews.baselineCompletion', 'estimateCompletionReviews.estimateCompletion', 'actualCompletionReviews.actualCompletion'
    ]).populate('user', 'displayName').exec(function(err, gateReview) {
        if (err) return next(err);
        if (! gateReview) return next(new Error('Failed to load Gate review ' + id));
        req.gateReview = gateReview ;
        next();
    });
};

/**
 * Gate review authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    // User role check
    if(!_.find(req.user.roles, function(role){
            return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
        })
    ){
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};
