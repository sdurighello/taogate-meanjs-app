'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Baseline duration
 */
exports.create = function(req, res) {
	var BaselineDuration = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineDuration');
	var baselineDuration = new BaselineDuration(req.body);

	baselineDuration.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(baselineDuration);
		}
	});
};

/**
 * Show the current Baseline duration
 */
exports.read = function(req, res) {
	res.jsonp(req.baselineDuration);
};

/**
 * Update a Baseline duration
 */
exports.update = function(req, res) {
	var baselineDuration = req.baselineDuration ;

	baselineDuration = _.extend(baselineDuration , req.body);

	baselineDuration.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(baselineDuration);
		}
	});
};

/**
 * Delete an Baseline duration
 */
exports.delete = function(req, res) {
	var baselineDuration = req.baselineDuration ;

	baselineDuration.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(baselineDuration);
		}
	});
};

/**
 * List of Baseline durations
 */
exports.list = function(req, res) {
	var BaselineDuration = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineDuration');

    var queryObject = {};
    var deepPopulateArray = [];

    if(req.query.queryObject){
        queryObject = req.query.queryObject;
    }
    if(req.query.deepPopulateArray){
        deepPopulateArray = req.query.deepPopulateArray;
    }

	BaselineDuration.find(queryObject).deepPopulate(deepPopulateArray).populate('user', 'displayName').exec(function(err, baselineDurations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(baselineDurations);
		}
	});
};

/**
 * Baseline duration middleware
 */
exports.baselineDurationByID = function(req, res, next, id) {
	var BaselineDuration = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineDuration');
	BaselineDuration.findById(id).populate('user', 'displayName').exec(function(err, baselineDuration) {
		if (err) return next(err);
		if (! baselineDuration) return next(new Error('Failed to load Baseline duration ' + id));
		req.baselineDuration = baselineDuration ;
		next();
	});
};

/**
 * Baseline duration authorization middleware
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
