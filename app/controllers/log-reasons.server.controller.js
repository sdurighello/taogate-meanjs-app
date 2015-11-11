'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Log reason
 */
exports.create = function(req, res) {
	var LogReason = mongoose.mtModel(req.user.tenantId + '.' + 'LogReason');
	var logReason = new LogReason(req.body);
	logReason.user = req.user;

	logReason.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logReason);
		}
	});
};

/**
 * Show the current Log reason
 */
exports.read = function(req, res) {
	res.jsonp(req.logReason);
};

/**
 * Update a Log reason
 */
exports.update = function(req, res) {
	var logReason = req.logReason ;

	logReason = _.extend(logReason , req.body);

	logReason.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logReason);
		}
	});
};

/**
 * Delete an Log reason
 */
exports.delete = function(req, res) {
	var logReason = req.logReason ;
    logReason.user = req.user;
    logReason.created = Date.now();
	logReason.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logReason);
		}
	});
};

/**
 * List of Log reasons
 */
exports.list = function(req, res) {
	var LogReason = mongoose.mtModel(req.user.tenantId + '.' + 'LogReason');
	LogReason.find().sort('-created').populate('user', 'displayName').exec(function(err, logReasons) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logReasons);
		}
	});
};

/**
 * Log reason middleware
 */
exports.logReasonByID = function(req, res, next, id) {
	var LogReason = mongoose.mtModel(req.user.tenantId + '.' + 'LogReason');
	LogReason.findById(id).populate('user', 'displayName').exec(function(err, logReason) {
		if (err) return next(err);
		if (! logReason) return next(new Error('Failed to load Log reason ' + id));
		req.logReason = logReason ;
		next();
	});
};

/**
 * Log reason authorization middleware
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
