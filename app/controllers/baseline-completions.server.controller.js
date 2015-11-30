'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	BaselineCompletion = mongoose.model('BaselineCompletion'),
	_ = require('lodash');

/**
 * Create a Baseline completion
 */
exports.create = function(req, res) {
	var baselineCompletion = new BaselineCompletion(req.body);
	baselineCompletion.user = req.user;

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
	BaselineCompletion.find().sort('-created').populate('user', 'displayName').exec(function(err, baselineCompletions) {
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
	if (req.baselineCompletion.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
