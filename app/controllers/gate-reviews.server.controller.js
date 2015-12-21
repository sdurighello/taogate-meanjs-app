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

exports.updateHeader = require('./gate-reviews/gate-reviews.updateHeader.server.controller').updateHeader;

exports.updateStatus = require('./gate-reviews/gate-reviews.updateStatus.server.controller').updateStatus;

exports.updateBaselineDuration = require('./gate-reviews/gate-reviews.updateBaselineDuration.server.controller').updateBaselineDuration;



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
        'baselineDurationReviews.baselineDuration.targetGate', 'estimateDurationReviews.estimateDuration', 'actualDurationReviews.actualDuration',
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
