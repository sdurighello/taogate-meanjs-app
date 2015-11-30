'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	EstimateCost = mongoose.model('EstimateCost'),
	_ = require('lodash');

/**
 * Create a Estimate cost
 */
exports.create = function(req, res) {
	var estimateCost = new EstimateCost(req.body);
	estimateCost.user = req.user;

	estimateCost.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estimateCost);
		}
	});
};

/**
 * Show the current Estimate cost
 */
exports.read = function(req, res) {
	res.jsonp(req.estimateCost);
};

/**
 * Update a Estimate cost
 */
exports.update = function(req, res) {
	var estimateCost = req.estimateCost ;

	estimateCost = _.extend(estimateCost , req.body);

	estimateCost.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estimateCost);
		}
	});
};

/**
 * Delete an Estimate cost
 */
exports.delete = function(req, res) {
	var estimateCost = req.estimateCost ;

	estimateCost.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estimateCost);
		}
	});
};

/**
 * List of Estimate costs
 */
exports.list = function(req, res) { 
	EstimateCost.find().sort('-created').populate('user', 'displayName').exec(function(err, estimateCosts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estimateCosts);
		}
	});
};

/**
 * Estimate cost middleware
 */
exports.estimateCostByID = function(req, res, next, id) { 
	EstimateCost.findById(id).populate('user', 'displayName').exec(function(err, estimateCost) {
		if (err) return next(err);
		if (! estimateCost) return next(new Error('Failed to load Estimate cost ' + id));
		req.estimateCost = estimateCost ;
		next();
	});
};

/**
 * Estimate cost authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.estimateCost.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};