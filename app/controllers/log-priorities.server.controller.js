'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Log priority
 */
exports.create = function(req, res) {
	var LogPriority = mongoose.mtModel(req.user.tenantId + '.' + 'LogPriority');
	var logPriority = new LogPriority(req.body);
	logPriority.user = req.user;

	logPriority.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logPriority);
		}
	});
};

/**
 * Show the current Log priority
 */
exports.read = function(req, res) {
	res.jsonp(req.logPriority);
};

/**
 * Update a Log priority
 */
exports.update = function(req, res) {
	var logPriority = req.logPriority ;
	logPriority.user = req.user;
	logPriority.created = Date.now();
	logPriority = _.extend(logPriority , req.body);

	logPriority.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logPriority);
		}
	});
};

/**
 * Delete an Log priority
 */
exports.delete = function(req, res) {
	var logPriority = req.logPriority ;

	logPriority.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logPriority);
		}
	});
};

/**
 * List of Log priorities
 */
exports.list = function(req, res) {
	var LogPriority = mongoose.mtModel(req.user.tenantId + '.' + 'LogPriority');
	LogPriority.find().sort('position').populate('user', 'displayName').exec(function(err, logPriorities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logPriorities);
		}
	});
};

/**
 * Log priority middleware
 */
exports.logPriorityByID = function(req, res, next, id) {
	var LogPriority = mongoose.mtModel(req.user.tenantId + '.' + 'LogPriority');
	LogPriority.findById(id).populate('user', 'displayName').exec(function(err, logPriority) {
		if (err) return next(err);
		if (! logPriority) return next(new Error('Failed to load Log priority ' + id));
		req.logPriority = logPriority ;
		next();
	});
};

/**
 * Log priority authorization middleware
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
