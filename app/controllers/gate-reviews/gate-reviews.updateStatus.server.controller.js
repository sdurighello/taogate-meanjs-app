'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


// --------- Update STATUS ---------

exports.updateStatus = function(req, res) {
    var gateReview = req.gateReview ;
    var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');

    async.series([
        // GATE-REVIEW: Update only status details and save gate review to its collection
        function(callback){
            gateReview.user = req.user;
            gateReview.created = Date.now();
            gateReview.status = req.body.status;
            gateReview.overallScore = req.body.overallScore;
            gateReview.completed = req.body.completed;

            gateReview.save(function(err){
                callback(err);
            });
        },
        // GATE-STATUS-ASSIGNMENT: Update associated gate-status-assignment with the new gate data
        function(callback){
            GateStatusAssignment.findById(req.params.gateStatusAssignmentId).exec(function(err, assignment){
                if(err){
                    return callback(err);
                } else if(! assignment){
                    return callback(new Error('Cannot find gate status assignment ' + req.params.gateStatusAssignmentId));
                } else {
                    assignment.history.push(assignment.currentRecord);

                    assignment.currentRecord.completed = req.body.completed;
                    assignment.currentRecord.status = req.body.status;
                    assignment.currentRecord.overallScore = req.body.overallScore;

                    assignment.currentRecord.sourceReview = gateReview._id;

                    assignment.currentRecord.created = Date.now();
                    assignment.currentRecord.user = req.user;

                    assignment.save(function(err){
                        callback(err);
                    });
                }
            });
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });
};
