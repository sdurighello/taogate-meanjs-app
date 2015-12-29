'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


// -------------------------- ESTIMATE --------------------------


exports.updateEstimateDuration = function(req, res) {
    var projectStatusUpdate = req.projectStatusUpdate ;
    projectStatusUpdate.user = req.user;
    projectStatusUpdate.created = Date.now();
    var estimateDurationReview = projectStatusUpdate.estimateDurationReviews.id(req.params.estimateDurationReviewId);
    estimateDurationReview.newDate = req.body.newDate;
    projectStatusUpdate.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectStatusUpdate);
        }
    });
};

exports.updateEstimateCost = function(req, res) {
    var projectStatusUpdate = req.projectStatusUpdate ;
    projectStatusUpdate.user = req.user;
    projectStatusUpdate.created = Date.now();
    var estimateCostReview = projectStatusUpdate.estimateCostReviews.id(req.params.estimateCostReviewId);
    estimateCostReview.newCost = req.body.newCost;
    projectStatusUpdate.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectStatusUpdate);
        }
    });
};

exports.updateEstimateCompletion = function(req, res) {
    var projectStatusUpdate = req.projectStatusUpdate ;
    projectStatusUpdate.user = req.user;
    projectStatusUpdate.created = Date.now();
    var estimateCompletionReview = projectStatusUpdate.estimateCompletionReviews.id(req.params.estimateCompletionReviewId);
    estimateCompletionReview.newCompletion = req.body.newCompletion;
    projectStatusUpdate.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectStatusUpdate);
        }
    });
};
