'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ProjectChangeRequest = mongoose.model('ProjectChangeRequest'),
	_ = require('lodash');

/**
 * Create a Project change request
 */
exports.create = function(req, res) {
	var projectChangeRequest = new ProjectChangeRequest(req.body);
	projectChangeRequest.user = req.user;

	projectChangeRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectChangeRequest);
		}
	});
};

/**
 * Show the current Project change request
 */
exports.read = function(req, res) {
	res.jsonp(req.projectChangeRequest);
};

/**
 * Update a Project change request
 */
exports.update = function(req, res) {
	var projectChangeRequest = req.projectChangeRequest ;

	projectChangeRequest = _.extend(projectChangeRequest , req.body);

	projectChangeRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectChangeRequest);
		}
	});
};

/**
 * Delete an Project change request
 */
exports.delete = function(req, res) {
	var projectChangeRequest = req.projectChangeRequest ;

	projectChangeRequest.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectChangeRequest);
		}
	});
};

/**
 * List of Project change requests
 */
exports.list = function(req, res) { 
	ProjectChangeRequest.find().sort('-created').populate('user', 'displayName').exec(function(err, projectChangeRequests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectChangeRequests);
		}
	});
};

/**
 * Project change request middleware
 */
exports.projectChangeRequestByID = function(req, res, next, id) { 
	ProjectChangeRequest.findById(id).populate('user', 'displayName').exec(function(err, projectChangeRequest) {
		if (err) return next(err);
		if (! projectChangeRequest) return next(new Error('Failed to load Project change request ' + id));
		req.projectChangeRequest = projectChangeRequest ;
		next();
	});
};

/**
 * Project change request authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.projectChangeRequest.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
