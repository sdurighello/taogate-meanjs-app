'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ActualDuration = mongoose.model('ActualDuration'),
	_ = require('lodash');

/**
 * Create a Actual duration
 */
exports.create = function(req, res) {
	var actualDuration = new ActualDuration(req.body);
	actualDuration.user = req.user;

	actualDuration.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualDuration);
		}
	});
};

/**
 * Show the current Actual duration
 */
exports.read = function(req, res) {
	res.jsonp(req.actualDuration);
};

/**
 * Update a Actual duration
 */
exports.update = function(req, res) {
	var actualDuration = req.actualDuration ;

	actualDuration = _.extend(actualDuration , req.body);

	actualDuration.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualDuration);
		}
	});
};

/**
 * Delete an Actual duration
 */
exports.delete = function(req, res) {
	var actualDuration = req.actualDuration ;

	actualDuration.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualDuration);
		}
	});
};

/**
 * List of Actual durations
 */
exports.list = function(req, res) { 
	ActualDuration.find().sort('-created').populate('user', 'displayName').exec(function(err, actualDurations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualDurations);
		}
	});
};

/**
 * Actual duration middleware
 */
exports.actualDurationByID = function(req, res, next, id) { 
	ActualDuration.findById(id).populate('user', 'displayName').exec(function(err, actualDuration) {
		if (err) return next(err);
		if (! actualDuration) return next(new Error('Failed to load Actual duration ' + id));
		req.actualDuration = actualDuration ;
		next();
	});
};

/**
 * Actual duration authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.actualDuration.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
