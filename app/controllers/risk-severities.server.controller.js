'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Risk severity
 */
exports.create = function(req, res) {
	var RiskSeverity = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverity');
	var riskSeverity = new RiskSeverity(req.body);
	riskSeverity.user = req.user;

	riskSeverity.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskSeverity);
		}
	});
};

/**
 * Show the current Risk severity
 */
exports.read = function(req, res) {
	res.jsonp(req.riskSeverity);
};

/**
 * Update a Risk severity
 */
exports.update = function(req, res) {
	var riskSeverity = req.riskSeverity ;
    riskSeverity.user = req.user;
	riskSeverity.created = Date.now();
	riskSeverity = _.extend(riskSeverity , req.body);

	riskSeverity.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskSeverity);
		}
	});
};

/**
 * Delete an Risk severity
 */
exports.delete = function(req, res) {
	var riskSeverity = req.riskSeverity ;

	riskSeverity.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskSeverity);
		}
	});
};

/**
 * List of Risk severities
 */
exports.list = function(req, res) {
	var RiskSeverity = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverity');
	RiskSeverity.find().sort('position').populate('user', 'displayName').exec(function(err, riskSeverities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskSeverities);
		}
	});
};

/**
 * Risk severity middleware
 */
exports.riskSeverityByID = function(req, res, next, id) {
	var RiskSeverity = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverity');
	RiskSeverity.findById(id).populate('user', 'displayName').exec(function(err, riskSeverity) {
		if (err) return next(err);
		if (! riskSeverity) return next(new Error('Failed to load Risk severity ' + id));
		req.riskSeverity = riskSeverity ;
		next();
	});
};

/**
 * Risk severity authorization middleware
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
