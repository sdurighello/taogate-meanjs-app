'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	EstimateCompletion = mongoose.model('EstimateCompletion'),
	_ = require('lodash');

/**
 * Create a Estimate completion
 */
exports.create = function(req, res) {
	var estimateCompletion = new EstimateCompletion(req.body);
	estimateCompletion.user = req.user;

	estimateCompletion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estimateCompletion);
		}
	});
};

/**
 * Show the current Estimate completion
 */
exports.read = function(req, res) {
	res.jsonp(req.estimateCompletion);
};

/**
 * Update a Estimate completion
 */
exports.update = function(req, res) {
	var estimateCompletion = req.estimateCompletion ;

	estimateCompletion = _.extend(estimateCompletion , req.body);

	estimateCompletion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estimateCompletion);
		}
	});
};

/**
 * Delete an Estimate completion
 */
exports.delete = function(req, res) {
	var estimateCompletion = req.estimateCompletion ;

	estimateCompletion.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estimateCompletion);
		}
	});
};

/**
 * List of Estimate completions
 */
exports.list = function(req, res) { 
	EstimateCompletion.find().sort('-created').populate('user', 'displayName').exec(function(err, estimateCompletions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estimateCompletions);
		}
	});
};

/**
 * Estimate completion middleware
 */
exports.estimateCompletionByID = function(req, res, next, id) { 
	EstimateCompletion.findById(id).populate('user', 'displayName').exec(function(err, estimateCompletion) {
		if (err) return next(err);
		if (! estimateCompletion) return next(new Error('Failed to load Estimate completion ' + id));
		req.estimateCompletion = estimateCompletion ;
		next();
	});
};

/**
 * Estimate completion authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.estimateCompletion.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
