'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


exports.updateBudget = function(req, res) {

    var ProjectChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectChangeRequest');

    var projectChangeRequest = req.projectChangeRequest ;

    projectChangeRequest.user = req.user;
    projectChangeRequest.created = Date.now();
    projectChangeRequest.gateAssignmentReview.budgetChange = req.body.gateAssignmentReview.budgetChange;

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
