'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Log status indicator
 */
exports.create = function(req, res) {
	var LogStatusIndicator = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusIndicator');
	var logStatusIndicator = new LogStatusIndicator(req.body);
	logStatusIndicator.user = req.user;

	logStatusIndicator.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatusIndicator);
		}
	});
};

/**
 * Show the current Log status indicator
 */
exports.read = function(req, res) {
	res.jsonp(req.logStatusIndicator);
};

/**
 * Update a Log status indicator
 */
exports.update = function(req, res) {
	var logStatusIndicator = req.logStatusIndicator ;
	logStatusIndicator.user = req.user;
	logStatusIndicator.created = Date.now();
	logStatusIndicator = _.extend(logStatusIndicator , req.body);

	logStatusIndicator.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatusIndicator);
		}
	});
};

/**
 * Delete an Log status indicator
 */
exports.delete = function(req, res) {
	var logStatusIndicator = req.logStatusIndicator ;

	logStatusIndicator.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatusIndicator);
		}
	});
};

/**
 * List of Log status indicators
 */
exports.list = function(req, res) {
    var logStatusIndicator = mongoose.mtModel(req.user.tenantId + '.' + 'logStatusIndicator');
	logStatusIndicator.find().populate('user', 'displayName').exec(function(err, logStatusIndicators) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatusIndicators);
		}
	});
};

/**
 * Log status indicator middleware
 */
exports.logStatusIndicatorByID = function(req, res, next, id) {
    var logStatusIndicator = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusIndicator');
	LogStatusIndicator.findById(id).populate('user', 'displayName').exec(function(err, logStatusIndicator) {
		if (err) return next(err);
		if (! logStatusIndicator) return next(new Error('Failed to load Log status ' + id));
		req.logStatusIndicator = logStatusIndicator ;
		next();
	});
};

/**
 * Log status indicator authorization middleware
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
