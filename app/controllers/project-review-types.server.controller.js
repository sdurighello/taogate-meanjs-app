'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Project review type
 */
exports.create = function(req, res) {
	var ProjectReviewType = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReviewType');
	var projectReviewType = new ProjectReviewType(req.body);
	projectReviewType.user = req.user;

	projectReviewType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReviewType);
		}
	});
};

/**
 * Show the current Project review type
 */
exports.read = function(req, res) {
	res.jsonp(req.projectReviewType);
};

/**
 * Update a Project review type
 */
exports.update = function(req, res) {
	var projectReviewType = req.projectReviewType ;
    projectReviewType.user = req.user;
    projectReviewType.created = Date.now();
    projectReviewType = _.extend(projectReviewType , req.body);

	projectReviewType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReviewType);
		}
	});
};

/**
 * Delete an Project review type
 */
exports.delete = function(req, res) {
	var projectReviewType = req.projectReviewType ;

	projectReviewType.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReviewType);
		}
	});
};

/**
 * List of Project review types
 */
exports.list = function(req, res) {
    var ProjectReviewType = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReviewType');
    ProjectReviewType.find().populate('user', 'displayName').exec(function(err, projectReviewTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReviewTypes);
		}
	});
};

/**
 * Project review type middleware
 */
exports.projectReviewTypeByID = function(req, res, next, id) {
    var ProjectReviewType = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReviewType');
    ProjectReviewType.findById(id).populate('user', 'displayName').exec(function(err, projectReviewType) {
		if (err) return next(err);
		if (! projectReviewType) return next(new Error('Failed to load Project review type ' + id));
		req.projectReviewType = projectReviewType ;
		next();
	});
};

/**
 * Project review type authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    // User role check
    if(!_.find(req.user.roles, function(role){
            return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
        })
    ){
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};
