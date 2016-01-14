'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * SUBMIT GATE REVIEW
 */


exports.submit = function(req, res) {

    var gateReview = req.gateReview;

    gateReview.approval.history.push({
        approvalState : gateReview.approval.currentRecord.approvalState,
        user : gateReview.approval.currentRecord.user,
        created : gateReview.approval.currentRecord.created
    });

    gateReview.approval.currentRecord.approvalState = 'submitted';
    gateReview.approval.currentRecord.user = req.user;
    gateReview.approval.currentRecord.created = Date.now();

    gateReview.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateReview);
        }
    });

};
