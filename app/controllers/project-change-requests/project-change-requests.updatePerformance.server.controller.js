'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');




// -------------------------- BASELINE --------------------------


exports.updateBaselineDuration = function(req, res) {
    var projectChangeRequest = req.projectChangeRequest ;
    projectChangeRequest.user = req.user;
    projectChangeRequest.created = Date.now();
    var baselineDurationReview = projectChangeRequest.baselineDurationReviews.id(req.params.baselineDurationReviewId);
    baselineDurationReview.dateChange = req.body.dateChange;
    projectChangeRequest.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectChangeRequest);
        }
    });
};

exports.updateBaselineCost = function(req, res) {
    var projectChangeRequest = req.projectChangeRequest ;
    projectChangeRequest.user = req.user;
    projectChangeRequest.created = Date.now();
    var baselineCostReview = projectChangeRequest.baselineCostReviews.id(req.params.baselineCostReviewId);
    baselineCostReview.costChange = req.body.costChange;
    projectChangeRequest.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectChangeRequest);
        }
    });
};

exports.updateBaselineCompletion = function(req, res) {
    var projectChangeRequest = req.projectChangeRequest ;
    projectChangeRequest.user = req.user;
    projectChangeRequest.created = Date.now();
    var baselineCompletionReview = projectChangeRequest.baselineCompletionReviews.id(req.params.baselineCompletionReviewId);
    baselineCompletionReview.completionChange = req.body.completionChange;
    projectChangeRequest.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectChangeRequest);
        }
    });
};


// -------------------------- ESTIMATE --------------------------


exports.updateEstimateDuration = function(req, res) {
    var projectChangeRequest = req.projectChangeRequest ;
    projectChangeRequest.user = req.user;
    projectChangeRequest.created = Date.now();
    var estimateDurationReview = projectChangeRequest.estimateDurationReviews.id(req.params.estimateDurationReviewId);
    estimateDurationReview.dateChange = req.body.dateChange;
    projectChangeRequest.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectChangeRequest);
        }
    });
};

exports.updateEstimateCost = function(req, res) {
    var projectChangeRequest = req.projectChangeRequest ;
    projectChangeRequest.user = req.user;
    projectChangeRequest.created = Date.now();
    var estimateCostReview = projectChangeRequest.estimateCostReviews.id(req.params.estimateCostReviewId);
    estimateCostReview.costChange = req.body.costChange;
    projectChangeRequest.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectChangeRequest);
        }
    });
};

exports.updateEstimateCompletion = function(req, res) {
    var projectChangeRequest = req.projectChangeRequest ;
    projectChangeRequest.user = req.user;
    projectChangeRequest.created = Date.now();
    var estimateCompletionReview = projectChangeRequest.estimateCompletionReviews.id(req.params.estimateCompletionReviewId);
    estimateCompletionReview.completionChange = req.body.completionChange;
    projectChangeRequest.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectChangeRequest);
        }
    });
};


// -------------------------- ACTUAL --------------------------


exports.updateActualDuration = function(req, res) {
    var projectChangeRequest = req.projectChangeRequest ;
    projectChangeRequest.user = req.user;
    projectChangeRequest.created = Date.now();
    var actualDurationReview = projectChangeRequest.actualDurationReviews.id(req.params.actualDurationReviewId);
    actualDurationReview.dateChange = req.body.dateChange;
    projectChangeRequest.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectChangeRequest);
        }
    });
};

exports.updateActualCost = function(req, res) {
    var projectChangeRequest = req.projectChangeRequest ;
    projectChangeRequest.user = req.user;
    projectChangeRequest.created = Date.now();
    var actualCostReview = projectChangeRequest.actualCostReviews.id(req.params.actualCostReviewId);
    actualCostReview.costChange = req.body.costChange;
    projectChangeRequest.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectChangeRequest);
        }
    });
};

exports.updateActualCompletion = function(req, res) {
    var projectChangeRequest = req.projectChangeRequest ;
    projectChangeRequest.user = req.user;
    projectChangeRequest.created = Date.now();
    var actualCompletionReview = projectChangeRequest.actualCompletionReviews.id(req.params.actualCompletionReviewId);
    actualCompletionReview.completionChange = req.body.completionChange;
    projectChangeRequest.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectChangeRequest);
        }
    });
};
