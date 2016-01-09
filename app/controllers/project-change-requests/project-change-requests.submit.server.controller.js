'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * SUBMIT CHANGE REQUEST
 */


exports.submit = function(req, res) {

    var projectChangeRequest = req.projectChangeRequest;
    projectChangeRequest.approval = 'submitted';

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
