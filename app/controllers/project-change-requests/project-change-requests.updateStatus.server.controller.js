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

    var projectChangeRequest = req.projectChangeRequest ;

    projectChangeRequest.statusReview.history.push({
        baselineDeliveryDate : projectChangeRequest.statusReview.currentRecord.baselineDeliveryDate,
        estimateDeliveryDate : projectChangeRequest.statusReview.currentRecord.estimateDeliveryDate,
        actualDeliveryDate : projectChangeRequest.statusReview.currentRecord.actualDeliveryDate,
        status : projectChangeRequest.statusReview.currentRecord.status,
        completed : projectChangeRequest.statusReview.currentRecord.completed,
        statusComment : projectChangeRequest.statusReview.currentRecord.statusComment
    });
    projectChangeRequest.statusReview.currentRecord.user = req.user;
    projectChangeRequest.statusReview.currentRecord.created = Date.now();
    projectChangeRequest.statusReview.currentRecord.baselineDeliveryDate = req.body.statusReview.currentRecord.baselineDeliveryDate;
    projectChangeRequest.statusReview.currentRecord.estimateDeliveryDate = req.body.statusReview.currentRecord.estimateDeliveryDate;
    projectChangeRequest.statusReview.currentRecord.actualDeliveryDate = req.body.statusReview.currentRecord.actualDeliveryDate;
    projectChangeRequest.statusReview.currentRecord.status = req.body.statusReview.currentRecord.status;
    projectChangeRequest.statusReview.currentRecord.completed = req.body.statusReview.currentRecord.completed;
    projectChangeRequest.statusReview.currentRecord.statusComment = req.body.statusReview.currentRecord.statusComment;

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
