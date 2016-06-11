'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ProjectStatusReport = mongoose.model('ProjectStatusReport'),
	_ = require('lodash');

/**
 * Create a Project status report
 */
exports.create = function(req, res) {
	var projectStatusReport = new ProjectStatusReport(req.body);
	projectStatusReport.user = req.user;

	projectStatusReport.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectStatusReport);
		}
	});
};

/**
 * Show the current Project status report
 */
exports.read = function(req, res) {
	res.jsonp(req.projectStatusReport);
};

/**
 * Update a Project status report
 */
exports.update = function(req, res) {
	var projectStatusReport = req.projectStatusReport ;

	projectStatusReport = _.extend(projectStatusReport , req.body);

	projectStatusReport.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectStatusReport);
		}
	});
};

/**
 * Delete an Project status report
 */
exports.delete = function(req, res) {
	var projectStatusReport = req.projectStatusReport ;

	projectStatusReport.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectStatusReport);
		}
	});
};

/**
 * List of Project status reports
 */
exports.list = function(req, res) { 
	ProjectStatusReport.find().sort('-created').populate('user', 'displayName').exec(function(err, projectStatusReports) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectStatusReports);
		}
	});
};

/**
 * Project status report middleware
 */
exports.projectStatusReportByID = function(req, res, next, id) { 
	ProjectStatusReport.findById(id).populate('user', 'displayName').exec(function(err, projectStatusReport) {
		if (err) return next(err);
		if (! projectStatusReport) return next(new Error('Failed to load Project status report ' + id));
		req.projectStatusReport = projectStatusReport ;
		next();
	});
};

/**
 * Project status report authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.projectStatusReport.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
