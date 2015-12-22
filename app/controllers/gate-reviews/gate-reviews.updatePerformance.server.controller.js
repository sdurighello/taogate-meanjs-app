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
    var gateReview = req.gateReview ;
    gateReview.user = req.user;
    gateReview.created = Date.now();
    var baselineDurationReview = gateReview.baselineDurationReviews.id(req.params.baselineDurationReviewId);
    baselineDurationReview.newDate = req.body.newDate;
    gateReview.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });
};

exports.updateBaselineCost = function(req, res) {
    var gateReview = req.gateReview ;
    gateReview.user = req.user;
    gateReview.created = Date.now();
    var baselineCostReview = gateReview.baselineCostReviews.id(req.params.baselineCostReviewId);
    baselineCostReview.newCost = req.body.newCost;
    gateReview.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });
};

exports.updateBaselineCompletion = function(req, res) {
    var gateReview = req.gateReview ;
    gateReview.user = req.user;
    gateReview.created = Date.now();
    var baselineCompletionReview = gateReview.baselineCompletionReviews.id(req.params.baselineCompletionReviewId);
    baselineCompletionReview.newCompletion = req.body.newCompletion;
    gateReview.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });
};


    // -------------------------- ESTIMATE --------------------------


exports.updateEstimateDuration = function(req, res) {
    var gateReview = req.gateReview ;
    gateReview.user = req.user;
    gateReview.created = Date.now();
    var estimateDurationReview = gateReview.estimateDurationReviews.id(req.params.estimateDurationReviewId);
    estimateDurationReview.newDate = req.body.newDate;
    gateReview.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });
};

exports.updateEstimateCost = function(req, res) {
    var gateReview = req.gateReview ;
    gateReview.user = req.user;
    gateReview.created = Date.now();
    var estimateCostReview = gateReview.estimateCostReviews.id(req.params.estimateCostReviewId);
    estimateCostReview.newCost = req.body.newCost;
    gateReview.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });
};

exports.updateEstimateCompletion = function(req, res) {
    var gateReview = req.gateReview ;
    gateReview.user = req.user;
    gateReview.created = Date.now();
    var estimateCompletionReview = gateReview.estimateCompletionReviews.id(req.params.estimateCompletionReviewId);
    estimateCompletionReview.newCompletion = req.body.newCompletion;
    gateReview.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });
};


    // -------------------------- ACTUAL --------------------------


exports.updateActualDuration = function(req, res) {
    var gateReview = req.gateReview ;
    gateReview.user = req.user;
    gateReview.created = Date.now();
    var actualDurationReview = gateReview.actualDurationReviews.id(req.params.actualDurationReviewId);
    actualDurationReview.newDate = req.body.newDate;
    gateReview.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });
};

exports.updateActualCost = function(req, res) {
    var gateReview = req.gateReview ;
    gateReview.user = req.user;
    gateReview.created = Date.now();
    var actualCostReview = gateReview.actualCostReviews.id(req.params.actualCostReviewId);
    actualCostReview.newCost = req.body.newCost;
    gateReview.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });
};

exports.updateActualCompletion = function(req, res) {
    var gateReview = req.gateReview ;
    gateReview.user = req.user;
    gateReview.created = Date.now();
    var actualCompletionReview = gateReview.actualCompletionReviews.id(req.params.actualCompletionReviewId);
    actualCompletionReview.newCompletion = req.body.newCompletion;
    gateReview.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });
};
