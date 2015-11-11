'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Project milestone type
 */
exports.create = function(req, res) {
	var ProjectMilestoneType = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectMilestoneType');
	var projectMilestoneType = new ProjectMilestoneType(req.body);
	projectMilestoneType.user = req.user;

	projectMilestoneType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectMilestoneType);
		}
	});
};

/**
 * Show the current Project milestone type
 */
exports.read = function(req, res) {
	res.jsonp(req.projectMilestoneType);
};

/**
 * Update a Project milestone type
 */
exports.update = function(req, res) {
	var projectMilestoneType = req.projectMilestoneType ;
    projectMilestoneType.user = req.user;
    projectMilestoneType.created = Date.now();
	projectMilestoneType = _.extend(projectMilestoneType , req.body);

	projectMilestoneType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectMilestoneType);
		}
	});
};

/**
 * Delete an Project milestone type
 */
exports.delete = function(req, res) {
	var projectMilestoneType = req.projectMilestoneType ;

	projectMilestoneType.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectMilestoneType);
		}
	});
};

/**
 * List of Project milestone types
 */
exports.list = function(req, res) {
	var ProjectMilestoneType = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectMilestoneType');
	ProjectMilestoneType.find().sort('-created').populate('user', 'displayName').exec(function(err, projectMilestoneTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectMilestoneTypes);
		}
	});
};

/**
 * Project milestone type middleware
 */
exports.projectMilestoneTypeByID = function(req, res, next, id) {
	var ProjectMilestoneType = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectMilestoneType');
	ProjectMilestoneType.findById(id).populate('user', 'displayName').exec(function(err, projectMilestoneType) {
		if (err) return next(err);
		if (! projectMilestoneType) return next(new Error('Failed to load Project milestone type ' + id));
		req.projectMilestoneType = projectMilestoneType ;
		next();
	});
};

/**
 * Project milestone type authorization middleware
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
