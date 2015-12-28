'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ProjectGateStatus = mongoose.model('ProjectGateStatus'),
	_ = require('lodash');

/**
 * Create a Project gate status
 */
exports.create = function(req, res) {
	var projectGateStatus = new ProjectGateStatus(req.body);
	projectGateStatus.user = req.user;

	projectGateStatus.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectGateStatus);
		}
	});
};

/**
 * Show the current Project gate status
 */
exports.read = function(req, res) {
	res.jsonp(req.projectGateStatus);
};

/**
 * Update a Project gate status
 */
exports.update = function(req, res) {
	var projectGateStatus = req.projectGateStatus ;

	projectGateStatus = _.extend(projectGateStatus , req.body);

	projectGateStatus.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectGateStatus);
		}
	});
};

/**
 * Delete an Project gate status
 */
exports.delete = function(req, res) {
	var projectGateStatus = req.projectGateStatus ;

	projectGateStatus.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectGateStatus);
		}
	});
};

/**
 * List of Project gate statuses
 */
exports.list = function(req, res) { 
	ProjectGateStatus.find().sort('-created').populate('user', 'displayName').exec(function(err, projectGateStatuses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectGateStatuses);
		}
	});
};

/**
 * Project gate status middleware
 */
exports.projectGateStatusByID = function(req, res, next, id) { 
	ProjectGateStatus.findById(id).populate('user', 'displayName').exec(function(err, projectGateStatus) {
		if (err) return next(err);
		if (! projectGateStatus) return next(new Error('Failed to load Project gate status ' + id));
		req.projectGateStatus = projectGateStatus ;
		next();
	});
};

/**
 * Project gate status authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.projectGateStatus.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
