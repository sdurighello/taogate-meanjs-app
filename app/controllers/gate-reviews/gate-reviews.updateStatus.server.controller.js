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

    gateReview.user = req.user;
    gateReview.created = Date.now();
    gateReview.status = req.body.status;
    gateReview.overallScore = req.body.overallScore;
    gateReview.completed = req.body.completed;

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
