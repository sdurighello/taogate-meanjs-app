'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


// --------- Update OUTCOME ---------

exports.updateOutcome = function(req, res) {

    var gateReview = req.gateReview ;

    gateReview.user = req.user;
    gateReview.created = Date.now();

    var outcomeReview = gateReview.outcomeReviews.id(req.params.outcomeReviewId);
    outcomeReview.newScore = req.body.newScore;
    outcomeReview.reviewComment = req.body.reviewComment;

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
