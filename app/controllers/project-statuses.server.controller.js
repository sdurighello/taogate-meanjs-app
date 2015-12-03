'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ProjectStatus = mongoose.model('ProjectStatus'),
	_ = require('lodash');

/**
 * Create a Project status
 */
exports.create = function(req, res) {
	var projectStatus = new ProjectStatus(req.body);
	projectStatus.user = req.user;

	projectStatus.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectStatus);
		}
	});
};

/**
 * Show the current Project status
 */
exports.read = function(req, res) {
	res.jsonp(req.projectStatus);
};

/**
 * Update a Project status
 */
exports.update = function(req, res) {
	var projectStatus = req.projectStatus ;

	projectStatus = _.extend(projectStatus , req.body);

	projectStatus.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectStatus);
		}
	});
};

/**
 * Delete an Project status
 */
exports.delete = function(req, res) {
	var projectStatus = req.projectStatus ;

	projectStatus.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectStatus);
		}
	});
};

/**
 * List of Project statuses
 */
exports.list = function(req, res) { 
	ProjectStatus.find().sort('-created').populate('user', 'displayName').exec(function(err, projectStatuses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectStatuses);
		}
	});
};

/**
 * Project status middleware
 */
exports.projectStatusByID = function(req, res, next, id) { 
	ProjectStatus.findById(id).populate('user', 'displayName').exec(function(err, projectStatus) {
		if (err) return next(err);
		if (! projectStatus) return next(new Error('Failed to load Project status ' + id));
		req.projectStatus = projectStatus ;
		next();
	});
};

/**
 * Project status authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.projectStatus.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
