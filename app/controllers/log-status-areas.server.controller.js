'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	LogStatusArea = mongoose.model('LogStatusArea'),
	_ = require('lodash');

/**
 * Create a Log status area
 */
exports.create = function(req, res) {
	var logStatusArea = new LogStatusArea(req.body);
	logStatusArea.user = req.user;

	logStatusArea.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatusArea);
		}
	});
};

/**
 * Show the current Log status area
 */
exports.read = function(req, res) {
	res.jsonp(req.logStatusArea);
};

/**
 * Update a Log status area
 */
exports.update = function(req, res) {
	var logStatusArea = req.logStatusArea ;

	logStatusArea = _.extend(logStatusArea , req.body);

	logStatusArea.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatusArea);
		}
	});
};

/**
 * Delete an Log status area
 */
exports.delete = function(req, res) {
	var logStatusArea = req.logStatusArea ;

	logStatusArea.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatusArea);
		}
	});
};

/**
 * List of Log status areas
 */
exports.list = function(req, res) { 
	LogStatusArea.find().sort('-created').populate('user', 'displayName').exec(function(err, logStatusAreas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatusAreas);
		}
	});
};

/**
 * Log status area middleware
 */
exports.logStatusAreaByID = function(req, res, next, id) { 
	LogStatusArea.findById(id).populate('user', 'displayName').exec(function(err, logStatusArea) {
		if (err) return next(err);
		if (! logStatusArea) return next(new Error('Failed to load Log status area ' + id));
		req.logStatusArea = logStatusArea ;
		next();
	});
};

/**
 * Log status area authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.logStatusArea.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
