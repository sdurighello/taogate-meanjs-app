'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


exports.reject = function(req, res) {

    var projectStatusUpdate = req.projectStatusUpdate ;

    projectStatusUpdate.user = req.user;
    projectStatusUpdate.created = Date.now();

    projectStatusUpdate.approval.history.push({
        approvalState : projectStatusUpdate.approval.currentRecord.approvalState,
        user : projectStatusUpdate.approval.currentRecord.user,
        created : projectStatusUpdate.approval.currentRecord.created
    });

    projectStatusUpdate.approval.currentRecord.approvalState = 'rejected';
    projectStatusUpdate.approval.currentRecord.user = req.user;
    projectStatusUpdate.approval.currentRecord.created = Date.now();

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
