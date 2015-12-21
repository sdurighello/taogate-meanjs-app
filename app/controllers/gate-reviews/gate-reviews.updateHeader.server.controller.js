'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


exports.updateHeader = function(req, res) {

    var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');

    var gateReview = req.gateReview ;

    gateReview.user = req.user;
    gateReview.created = Date.now();
    gateReview.reviewDate = req.body.reviewDate;
    gateReview.title = req.body.title;
    gateReview.overallComment = req.body.overallComment;

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
