'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	BaselineCost = mongoose.model('BaselineCost'),
	_ = require('lodash');

/**
 * Create a Baseline cost
 */
exports.create = function(req, res) {
	var baselineCost = new BaselineCost(req.body);
	baselineCost.user = req.user;

	baselineCost.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(baselineCost);
		}
	});
};

/**
 * Show the current Baseline cost
 */
exports.read = function(req, res) {
	res.jsonp(req.baselineCost);
};

/**
 * Update a Baseline cost
 */
exports.update = function(req, res) {
	var baselineCost = req.baselineCost ;

	baselineCost = _.extend(baselineCost , req.body);

	baselineCost.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(baselineCost);
		}
	});
};

/**
 * Delete an Baseline cost
 */
exports.delete = function(req, res) {
	var baselineCost = req.baselineCost ;

	baselineCost.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(baselineCost);
		}
	});
};

/**
 * List of Baseline costs
 */
exports.list = function(req, res) { 
	BaselineCost.find().sort('-created').populate('user', 'displayName').exec(function(err, baselineCosts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(baselineCosts);
		}
	});
};

/**
 * Baseline cost middleware
 */
exports.baselineCostByID = function(req, res, next, id) { 
	BaselineCost.findById(id).populate('user', 'displayName').exec(function(err, baselineCost) {
		if (err) return next(err);
		if (! baselineCost) return next(new Error('Failed to load Baseline cost ' + id));
		req.baselineCost = baselineCost ;
		next();
	});
};

/**
 * Baseline cost authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.baselineCost.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
