'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	OverallRanking = mongoose.model('OverallRanking'),
	_ = require('lodash');

/**
 * Create a Overall ranking
 */
exports.create = function(req, res) {
	var overallRanking = new OverallRanking(req.body);
	overallRanking.user = req.user;

	overallRanking.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(overallRanking);
		}
	});
};

/**
 * Show the current Overall ranking
 */
exports.read = function(req, res) {
	res.jsonp(req.overallRanking);
};

/**
 * Update a Overall ranking
 */
exports.update = function(req, res) {
	var overallRanking = req.overallRanking ;

	overallRanking = _.extend(overallRanking , req.body);

	overallRanking.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(overallRanking);
		}
	});
};

/**
 * Delete an Overall ranking
 */
exports.delete = function(req, res) {
	var overallRanking = req.overallRanking ;

	overallRanking.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(overallRanking);
		}
	});
};

/**
 * List of Overall rankings
 */
exports.list = function(req, res) { 
	OverallRanking.find().sort('-created').populate('user', 'displayName').exec(function(err, overallRankings) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(overallRankings);
		}
	});
};

/**
 * Overall ranking middleware
 */
exports.overallRankingByID = function(req, res, next, id) { 
	OverallRanking.findById(id).populate('user', 'displayName').exec(function(err, overallRanking) {
		if (err) return next(err);
		if (! overallRanking) return next(new Error('Failed to load Overall ranking ' + id));
		req.overallRanking = overallRanking ;
		next();
	});
};

/**
 * Overall ranking authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.overallRanking.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
