'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Risk impact
 */
exports.create = function(req, res) {
	var RiskImpact = mongoose.mtModel(req.user.tenantId + '.' + 'RiskImpact');
	var riskImpact = new RiskImpact(req.body);
	riskImpact.user = req.user;

	riskImpact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskImpact);
		}
	});
};

/**
 * Show the current Risk impact
 */
exports.read = function(req, res) {
	res.jsonp(req.riskImpact);
};

/**
 * Update a Risk impact
 */
exports.update = function(req, res) {
	var riskImpact = req.riskImpact ;
    riskImpact.user = req.user;
	riskImpact = _.extend(riskImpact , req.body);

	riskImpact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskImpact);
		}
	});
};

/**
 * Delete an Risk impact
 */
exports.delete = function(req, res) {
	var riskImpact = req.riskImpact ;

	riskImpact.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskImpact);
		}
	});
};

/**
 * List of Risk impacts
 */
exports.list = function(req, res) {
	var RiskImpact = mongoose.mtModel(req.user.tenantId + '.' + 'RiskImpact');
	RiskImpact.find().sort('-created').populate('user', 'displayName').exec(function(err, riskImpacts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskImpacts);
		}
	});
};

/**
 * Risk impact middleware
 */
exports.riskImpactByID = function(req, res, next, id) {
	var RiskImpact = mongoose.mtModel(req.user.tenantId + '.' + 'RiskImpact');
	RiskImpact.findById(id).populate('user', 'displayName').exec(function(err, riskImpact) {
		if (err) return next(err);
		if (! riskImpact) return next(new Error('Failed to load Risk impact ' + id));
		req.riskImpact = riskImpact ;
		next();
	});
};

/**
 * Risk impact authorization middleware
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
