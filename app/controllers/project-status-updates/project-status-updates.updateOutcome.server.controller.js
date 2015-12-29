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

    var projectStatusUpdate = req.projectStatusUpdate ;

    projectStatusUpdate.user = req.user;
    projectStatusUpdate.created = Date.now();

    var outcomeStatusUpdate = projectStatusUpdate.outcomeStatusUpdates.id(req.params.outcomeStatusUpdateId);
    outcomeStatusUpdate.newStatus = req.body.newStatus;
    outcomeStatusUpdate.comment = req.body.comment;

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
