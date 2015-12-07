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

    gateReview.completed = false;

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
        // Create all the gate review arrays and passed them on
        function(callback){
            var retObjArrays = {

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

    var queryObject = {};
    var deepPopulateArray = [];

    if(req.query.queryObject){
        queryObject = req.query.queryObject;
    }
    if(req.query.deepPopulateArray){
        deepPopulateArray = req.query.deepPopulateArray;
    }

    GateReview.find(queryObject).deepPopulate(deepPopulateArray).populate('user', 'displayName').exec(function(err, gateReviews) {
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

    var retPropertiesString = '';
    var deepPopulateArray = [];

    if(req.query.retPropertiesString){
        retPropertiesString = req.query.retPropertiesString;
    }
    if(req.query.deepPopulateArray){
        deepPopulateArray = req.query.deepPopulateArray;
    }

	GateReview.findById(id, retPropertiesString).deepPopulate(deepPopulateArray).populate('user', 'displayName').exec(function(err, gateReview) {
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
