'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Risk probability
 */
exports.create = function(req, res) {
	var RiskProbability = mongoose.mtModel(req.user.tenantId + '.' + 'RiskProbability');
	var riskProbability = new RiskProbability(req.body);
	riskProbability.user = req.user;

	riskProbability.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskProbability);
		}
	});
};

/**
 * Show the current Risk probability
 */
exports.read = function(req, res) {
	res.jsonp(req.riskProbability);
};

/**
 * Update a Risk probability
 */
exports.update = function(req, res) {
	var riskProbability = req.riskProbability ;
    riskProbability.user = req.user;
	riskProbability = _.extend(riskProbability , req.body);

	riskProbability.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskProbability);
		}
	});
};

/**
 * Delete an Risk probability
 */
exports.delete = function(req, res) {
	var riskProbability = req.riskProbability ;

	riskProbability.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskProbability);
		}
	});
};

/**
 * List of Risk probabilities
 */
exports.list = function(req, res) {
	var RiskProbability = mongoose.mtModel(req.user.tenantId + '.' + 'RiskProbability');
	RiskProbability.find().sort('-created').populate('user', 'displayName').exec(function(err, riskProbabilities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskProbabilities);
		}
	});
};

/**
 * Risk probability middleware
 */
exports.riskProbabilityByID = function(req, res, next, id) {
	var RiskProbability = mongoose.mtModel(req.user.tenantId + '.' + 'RiskProbability');
	RiskProbability.findById(id).populate('user', 'displayName').exec(function(err, riskProbability) {
		if (err) return next(err);
		if (! riskProbability) return next(new Error('Failed to load Risk probability ' + id));
		req.riskProbability = riskProbability ;
		next();
	});
};

/**
 * Risk probability authorization middleware
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
