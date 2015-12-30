'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


// --------- Update OVERALL STATUS ---------

exports.updateOverallStatus = function(req, res) {

    var projectStatusUpdate = req.projectStatusUpdate ;

    projectStatusUpdate.user = req.user;
    projectStatusUpdate.created = Date.now();

    projectStatusUpdate.gateStatusUpdate.overallUpdate.status = req.body.gateStatusUpdate.overallUpdate.status;
    projectStatusUpdate.gateStatusUpdate.overallUpdate.comment = req.body.gateStatusUpdate.overallUpdate.comment;

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

// --------- Update DURATION STATUS ---------

exports.updateDurationStatus = function(req, res) {

    var projectStatusUpdate = req.projectStatusUpdate ;

    projectStatusUpdate.user = req.user;
    projectStatusUpdate.created = Date.now();

    projectStatusUpdate.gateStatusUpdate.durationUpdate.status = req.body.gateStatusUpdate.durationUpdate.status;
    projectStatusUpdate.gateStatusUpdate.durationUpdate.comment = req.body.gateStatusUpdate.durationUpdate.comment;

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

// --------- Update COST STATUS ---------

exports.updateCostStatus = function(req, res) {

    var projectStatusUpdate = req.projectStatusUpdate ;

    projectStatusUpdate.user = req.user;
    projectStatusUpdate.created = Date.now();

    projectStatusUpdate.gateStatusUpdate.costUpdate.status = req.body.gateStatusUpdate.costUpdate.status;
    projectStatusUpdate.gateStatusUpdate.costUpdate.comment = req.body.gateStatusUpdate.costUpdate.comment;

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

// --------- Update COMPLETION STATUS ---------

exports.updateCompletionStatus = function(req, res) {

    var projectStatusUpdate = req.projectStatusUpdate ;

    projectStatusUpdate.user = req.user;
    projectStatusUpdate.created = Date.now();

    projectStatusUpdate.gateStatusUpdate.completionUpdate.status = req.body.gateStatusUpdate.completionUpdate.status;
    projectStatusUpdate.gateStatusUpdate.completionUpdate.comment = req.body.gateStatusUpdate.completionUpdate.comment;

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
