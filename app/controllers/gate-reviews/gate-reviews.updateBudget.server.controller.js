'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


// --------- Update BUDGET ---------

exports.updateBudget = function(req, res) {

    var gateReview = req.gateReview ;

    gateReview.user = req.user;
    gateReview.created = Date.now();
    gateReview.budget = req.body.budget;

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
