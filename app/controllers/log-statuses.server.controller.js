'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Log status
 */
exports.create = function(req, res) {
	var LogStatus = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatus');
	var logStatus = new LogStatus(req.body);
	logStatus.user = req.user;

	logStatus.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatus);
		}
	});
};

/**
 * Show the current Log status
 */
exports.read = function(req, res) {
	res.jsonp(req.logStatus);
};

/**
 * Update a Log status
 */
exports.update = function(req, res) {
	var logStatus = req.logStatus ;
    logStatus.user = req.user;
    logStatus.created = Date.now();
	logStatus = _.extend(logStatus , req.body);

	logStatus.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatus);
		}
	});
};

/**
 * Delete an Log status
 */
exports.delete = function(req, res) {
	var logStatus = req.logStatus ;

	logStatus.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatus);
		}
	});
};

/**
 * List of Log statuses
 */
exports.list = function(req, res) {
    var LogStatus = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatus');
    LogStatus.find().populate('user', 'displayName').exec(function(err, logStatuses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatuses);
		}
	});
};

/**
 * Log status middleware
 */
exports.logStatusByID = function(req, res, next, id) {
    var LogStatus = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatus');
    LogStatus.findById(id).populate('user', 'displayName').exec(function(err, logStatus) {
		if (err) return next(err);
		if (! logStatus) return next(new Error('Failed to load Log status ' + id));
		req.logStatus = logStatus ;
		next();
	});
};

/**
 * Log status authorization middleware
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
