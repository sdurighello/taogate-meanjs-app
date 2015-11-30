'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ActualCost = mongoose.model('ActualCost'),
	_ = require('lodash');

/**
 * Create a Actual cost
 */
exports.create = function(req, res) {
	var actualCost = new ActualCost(req.body);
	actualCost.user = req.user;

	actualCost.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualCost);
		}
	});
};

/**
 * Show the current Actual cost
 */
exports.read = function(req, res) {
	res.jsonp(req.actualCost);
};

/**
 * Update a Actual cost
 */
exports.update = function(req, res) {
	var actualCost = req.actualCost ;

	actualCost = _.extend(actualCost , req.body);

	actualCost.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualCost);
		}
	});
};

/**
 * Delete an Actual cost
 */
exports.delete = function(req, res) {
	var actualCost = req.actualCost ;

	actualCost.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualCost);
		}
	});
};

/**
 * List of Actual costs
 */
exports.list = function(req, res) { 
	ActualCost.find().sort('-created').populate('user', 'displayName').exec(function(err, actualCosts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualCosts);
		}
	});
};

/**
 * Actual cost middleware
 */
exports.actualCostByID = function(req, res, next, id) { 
	ActualCost.findById(id).populate('user', 'displayName').exec(function(err, actualCost) {
		if (err) return next(err);
		if (! actualCost) return next(new Error('Failed to load Actual cost ' + id));
		req.actualCost = actualCost ;
		next();
	});
};

/**
 * Actual cost authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.actualCost.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
