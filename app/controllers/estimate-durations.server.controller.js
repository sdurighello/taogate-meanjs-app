'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Estimate duration
 */
exports.create = function(req, res) {
	var EstimateDuration = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateDuration');
	var estimateDuration = new EstimateDuration(req.body);
	estimateDuration.user = req.user;

	estimateDuration.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estimateDuration);
		}
	});
};

/**
 * Show the current Estimate duration
 */
exports.read = function(req, res) {
	res.jsonp(req.estimateDuration);
};

/**
 * Update a Estimate duration
 */
exports.update = function(req, res) {
	var estimateDuration = req.estimateDuration ;

	estimateDuration = _.extend(estimateDuration , req.body);

	estimateDuration.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estimateDuration);
		}
	});
};

/**
 * Delete an Estimate duration
 */
exports.delete = function(req, res) {
	var estimateDuration = req.estimateDuration ;

	estimateDuration.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estimateDuration);
		}
	});
};

/**
 * List of Estimate durations
 */
exports.list = function(req, res) {
	var EstimateDuration = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateDuration');
	EstimateDuration.find().populate('user', 'displayName').exec(function(err, estimateDurations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estimateDurations);
		}
	});
};

/**
 * Estimate duration middleware
 */
exports.estimateDurationByID = function(req, res, next, id) {
	var EstimateDuration = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateDuration');
	EstimateDuration.findById(id).populate('user', 'displayName').exec(function(err, estimateDuration) {
		if (err) return next(err);
		if (! estimateDuration) return next(new Error('Failed to load Estimate duration ' + id));
		req.estimateDuration = estimateDuration ;
		next();
	});
};

/**
 * Estimate duration authorization middleware
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
