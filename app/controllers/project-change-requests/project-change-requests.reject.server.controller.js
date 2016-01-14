'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * REJECT CHANGE REQUEST
 */


exports.reject = function(req, res) {

    var projectChangeRequest = req.projectChangeRequest;

    projectChangeRequest.approval.history.push({
        approvalState : projectChangeRequest.approval.currentRecord.approvalState,
        user : projectChangeRequest.approval.currentRecord.user,
        created : projectChangeRequest.approval.currentRecord.created
    });

    projectChangeRequest.approval.currentRecord.approvalState = 'rejected';
    projectChangeRequest.approval.currentRecord.user = req.user;
    projectChangeRequest.approval.currentRecord.created = Date.now();

    projectChangeRequest.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectChangeRequest);
        }
    });

};
