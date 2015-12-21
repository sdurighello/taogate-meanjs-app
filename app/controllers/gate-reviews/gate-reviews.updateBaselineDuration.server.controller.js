'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * Update Baseline Duration
 */
exports.updateBaselineDuration = function(req, res) {
    var BaselineDuration = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineDuration');

    var gateReview = req.gateReview ;

    async.series([
        // GATE-REVIEW: Update the specific performance record in the gate-review
        function(callback){
            var baselineDurationReview = gateReview.baselineDurationReviews.id(req.params.baselineDurationReviewId);
            baselineDurationReview.newDate = req.body.newDate;
            gateReview.save(function(err){
                callback(err);
            });
        },
        // BASELINE-DURATION: Update performance record
        function(callback){
            BaselineDuration.findById(req.params.baselineDurationId).exec(function(err, performance){
                if(err){
                    return callback(err);
                } else if(! performance){
                    return callback(new Error('Cannot find baseline duration ' + req.params.baselineDurationId));
                } else {
                    performance.history.push(performance.currentRecord);
                    performance.currentRecord.gateDate = req.body.newDate;
                    performance.currentRecord.sourceReview = gateReview._id;
                    performance.currentRecord.created = Date.now();
                    performance.currentRecord.user = req.user;
                    performance.save(function(err){
                        callback(err);
                    });
                }
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
