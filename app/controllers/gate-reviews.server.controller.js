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

exports.updateOutcome = require('./gate-reviews/gate-reviews.updateOutcome.server.controller').updateOutcome;

    // --- Final ---

exports.setFinal = require('./gate-reviews/gate-reviews.setFinal.server.controller.js').setFinal;

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
    ]).populate('user', 'displayName').exec(function(err, gateReview) {
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

    if(req.gateReview){ // When you create the object doesn't exist in the req
        var objectIsAuthorized = _.isEqual(req.gateReview.final, false);
        if(!objectIsAuthorized){
            return res.status(403).send({
                message: 'Object is not authorized'
            });
        }
    }

    next();
};
