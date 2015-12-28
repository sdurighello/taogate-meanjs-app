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
    baselineDurationReview.newDate = req.body.newDate;
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
    baselineCostReview.newCost = req.body.newCost;
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
    baselineCompletionReview.newCompletion = req.body.newCompletion;
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
    estimateDurationReview.newDate = req.body.newDate;
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
    estimateCostReview.newCost = req.body.newCost;
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
    estimateCompletionReview.newCompletion = req.body.newCompletion;
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
    actualDurationReview.newDate = req.body.newDate;
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
    actualCostReview.newCost = req.body.newCost;
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
    actualCompletionReview.newCompletion = req.body.newCompletion;
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
