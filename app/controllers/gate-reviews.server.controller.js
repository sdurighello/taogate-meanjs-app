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

exports.create = require('./gate-reviews/gate-reviews.create.server.controller').create;

/**
 * Show the current Gate review
 */
exports.read = function(req, res) {
    res.jsonp(req.gateReview);
};


/**
 * UPDATE a Gate review
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

exports.updateHeader = require('./gate-reviews/gate-reviews.updateHeader.server.controller').updateHeader;

exports.updateStatus = require('./gate-reviews/gate-reviews.updateStatus.server.controller').updateStatus;

exports.updateBudget = require('./gate-reviews/gate-reviews.updateBudget.server.controller').updateBudget;

exports.updateOutcome = require('./gate-reviews/gate-reviews.updateOutcome.server.controller').updateOutcome;

    // --- Approval ---

exports.submit = require('./gate-reviews/gate-reviews.submit.server.controller.js').submit;

exports.approve = require('./gate-reviews/gate-reviews.approve.server.controller.js').approve;

exports.reject = require('./gate-reviews/gate-reviews.reject.server.controller.js').reject;

exports.draft = require('./gate-reviews/gate-reviews.draft.server.controller.js').draft;


    // --- Baseline ---

exports.updateBaselineDuration = require('./gate-reviews/gate-reviews.updatePerformance.server.controller.js').updateBaselineDuration;

exports.updateBaselineCost = require('./gate-reviews/gate-reviews.updatePerformance.server.controller.js').updateBaselineCost;

exports.updateBaselineCompletion = require('./gate-reviews/gate-reviews.updatePerformance.server.controller.js').updateBaselineCompletion;

    // --- Estimate ---

exports.updateEstimateDuration = require('./gate-reviews/gate-reviews.updatePerformance.server.controller.js').updateEstimateDuration;

exports.updateEstimateCost = require('./gate-reviews/gate-reviews.updatePerformance.server.controller.js').updateEstimateCost;

exports.updateEstimateCompletion = require('./gate-reviews/gate-reviews.updatePerformance.server.controller.js').updateEstimateCompletion;

    // --- Actual ---

exports.updateActualDuration = require('./gate-reviews/gate-reviews.updatePerformance.server.controller.js').updateActualDuration;

exports.updateActualCost = require('./gate-reviews/gate-reviews.updatePerformance.server.controller.js').updateActualCost;

exports.updateActualCompletion = require('./gate-reviews/gate-reviews.updatePerformance.server.controller.js').updateActualCompletion;



/**
 * Delete a Gate Review
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
 * List of reviews for a project
 */
exports.reviewsForProject = function(req, res) {
    var GateReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateReview');
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    async.waterfall([
        // Get the project and populate its process's gates
        function(callback) {
            Project.findById(req.query.project).deepPopulate(['process.gates']).exec(function(err, project){
                if(err){
                    return callback(err);
                }
                if(!project){
                    return callback(new Error('Failed to load project ' + req.query.project));
                }
                callback(null, project);
            });
        },
        // Get all the reviews for that project
        function(project, callback) {
            GateReview.find(req.query).deepPopulate(['overallScore', 'status']).populate('user', 'displayName').exec(function(err, gateReviews) {
                if (err) {
                    return callback(err);
                }
                if(!gateReviews){
                    return callback(new Error('Failed to load gate reviews for project ' + project._id));
                }
                callback(null, project, gateReviews);
            });
        },
        // Create the gateReviewLIst array
        function(project, gateReviews, callback) {
            var gateReviewList = _.chain(project.process.gates)
                .map(function (gate) {
                    return {
                        gate: gate,
                        gateReviews: _.filter(gateReviews, function(review){
                            return review.gate.equals(gate._id);
                        })
                    };
                })
                .value();

            callback(null, gateReviewList);
        },
        // Sort by gate position (since lodash sortBy in the chain doesn't seem to work ...
        function(gateReviewList, callback) {
            async.sortBy(gateReviewList, function(reviewObj, callback){
                callback(null, reviewObj.gate.position);
            }, function(err, gateReviewList){
                if(err){
                    return callback(err);
                }
                callback(null, gateReviewList);
            });
        }
    ], function (err, gateReviewList) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReviewList);
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
        'outcomeReviews.outcomeReview.outcome',
        'baselineDurationReviews.baselineDuration.targetGate', 'estimateDurationReviews.estimateDuration.targetGate', 'actualDurationReviews.actualDuration.targetGate',
        'baselineCostReviews.baselineCost.targetGate', 'estimateCostReviews.estimateCost.targetGate', 'actualCostReviews.actualCost.targetGate',
        'baselineCompletionReviews.baselineCompletion.targetGate', 'estimateCompletionReviews.estimateCompletion.targetGate', 'actualCompletionReviews.actualCompletion.targetGate'
    ]).populate('user', 'displayName').populate('approval.currentRecord.user', 'displayName').populate('approval.history.user', 'displayName').exec(function(err, gateReview) {
        if (err){ return next(err); }
        if (! gateReview){ return next(new Error('Failed to load Gate review ' + id)); }
        req.gateReview = gateReview ;
        next();
    });
};

/**
 * Gate review authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

    var roleIsAuthorized = _.some(req.user.roles, function(role){
        return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
    });
    if(!roleIsAuthorized){
        return res.status(403).send({
            message: 'Role is not authorized'
        });
    }

    next();
};
