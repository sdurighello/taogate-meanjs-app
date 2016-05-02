'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * Get a Roadmap
 */

exports.getDefinitionRoadmap = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    Project.find({'selection.active': true}, {'idNumber':1, 'parent':1, 'portfolio':1, 'identification':1, 'selection':1}).exec(function(err, projects){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projects);
        }
    });
};

/**
 * Roadmap authorization middleware
 */

exports.hasAuthorization = function(req, res, next) {

	next();
};
