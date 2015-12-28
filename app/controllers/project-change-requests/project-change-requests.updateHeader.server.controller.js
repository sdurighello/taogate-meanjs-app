'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


exports.updateHeader = function(req, res) {

    var ProjectChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectChangeRequest');

    var projectChangeRequest = req.projectChangeRequest ;

    projectChangeRequest.user = req.user;
    projectChangeRequest.created = Date.now();
    projectChangeRequest.reviewDate = req.body.reviewDate;
    projectChangeRequest.title = req.body.title;
    projectChangeRequest.overallComment = req.body.description;
    projectChangeRequest.reason = req.body.reason;
    projectChangeRequest.state = req.body.state;
    projectChangeRequest.priority = req.body.priority;

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
