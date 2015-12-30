'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Log status area
 */
exports.create = function(req, res) {
	var LogStatusArea = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusArea');
	var logStatusArea = new LogStatusArea(req.body);
	logStatusArea.user = req.user;

	logStatusArea.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatusArea);
		}
	});
};

/**
 * Show the current Log status area
 */
exports.read = function(req, res) {
	res.jsonp(req.logStatusArea);
};

/**
 * Update a Log status area
 */
exports.update = function(req, res) {
	var logStatusArea = req.logStatusArea ;
	logStatusArea.user = req.user;
	logStatusArea.created = Date.now();
	logStatusArea = _.extend(logStatusArea , req.body);

	logStatusArea.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatusArea);
		}
	});
};

/**
 * Delete an Log status area
 */
exports.delete = function(req, res) {
	var logStatusArea = req.logStatusArea ;

	logStatusArea.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatusArea);
		}
	});
};

/**
 * List of Log status areas
 */
exports.list = function(req, res) {
	var LogStatusArea = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusArea');
	LogStatusArea.find().populate('user', 'displayName').exec(function(err, logStatusAreas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatusAreas);
		}
	});
};

/**
 * Log status area middleware
 */
exports.logStatusAreaByID = function(req, res, next, id) {
	var LogStatusArea = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusArea');
	LogStatusArea.findById(id).populate('user', 'displayName').exec(function(err, logStatusArea) {
		if (err) return next(err);
		if (! logStatusArea) return next(new Error('Failed to load Log status area ' + id));
		req.logStatusArea = logStatusArea ;
		next();
	});
};

/**
 * Log status area authorization middleware
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
