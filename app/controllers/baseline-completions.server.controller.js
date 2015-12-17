'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Baseline completion
 */
exports.create = function(req, res) {
	var BaselineCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCompletion');
	var baselineCompletion = new BaselineCompletion(req.body);

	baselineCompletion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(baselineCompletion);
		}
	});
};

/**
 * Show the current Baseline completion
 */
exports.read = function(req, res) {
	res.jsonp(req.baselineCompletion);
};

/**
 * Update a Baseline completion
 */
exports.update = function(req, res) {
	var baselineCompletion = req.baselineCompletion ;

	baselineCompletion = _.extend(baselineCompletion , req.body);

	baselineCompletion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(baselineCompletion);
		}
	});
};

/**
 * Delete an Baseline completion
 */
exports.delete = function(req, res) {
	var baselineCompletion = req.baselineCompletion ;

	baselineCompletion.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(baselineCompletion);
		}
	});
};

/**
 * List of Baseline completions
 */
exports.list = function(req, res) {
	var BaselineCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCompletion');

	var queryObject = {};
	var deepPopulateArray = [];

	if(req.query.queryObject){
		queryObject = req.query.queryObject;
	}
	if(req.query.deepPopulateArray){
		deepPopulateArray = req.query.deepPopulateArray;
	}

	BaselineCompletion.find(queryObject).deepPopulate(deepPopulateArray).populate('user', 'displayName').exec(function(err, baselineCompletions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(baselineCompletions);
		}
	});
};

/**
 * Baseline completion middleware
 */
exports.baselineCompletionByID = function(req, res, next, id) {
	var BaselineCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCompletion');
	BaselineCompletion.findById(id).populate('user', 'displayName').exec(function(err, baselineCompletion) {
		if (err) return next(err);
		if (! baselineCompletion) return next(new Error('Failed to load Baseline completion ' + id));
		req.baselineCompletion = baselineCompletion ;
		next();
	});
};

/**
 * Baseline completion authorization middleware
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
