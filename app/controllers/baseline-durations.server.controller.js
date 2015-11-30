'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	BaselineDuration = mongoose.model('BaselineDuration'),
	_ = require('lodash');

/**
 * Create a Baseline duration
 */
exports.create = function(req, res) {
	var baselineDuration = new BaselineDuration(req.body);
	baselineDuration.user = req.user;

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
	BaselineDuration.find().sort('-created').populate('user', 'displayName').exec(function(err, baselineDurations) {
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
	if (req.baselineDuration.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
