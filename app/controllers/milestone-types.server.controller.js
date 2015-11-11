'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	MilestoneType = mongoose.model('MilestoneType'),
	_ = require('lodash');

/**
 * Create a Milestone type
 */
exports.create = function(req, res) {
	var milestoneType = new MilestoneType(req.body);
	milestoneType.user = req.user;

	milestoneType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(milestoneType);
		}
	});
};

/**
 * Show the current Milestone type
 */
exports.read = function(req, res) {
	res.jsonp(req.milestoneType);
};

/**
 * Update a Milestone type
 */
exports.update = function(req, res) {
	var milestoneType = req.milestoneType ;

	milestoneType = _.extend(milestoneType , req.body);

	milestoneType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(milestoneType);
		}
	});
};

/**
 * Delete an Milestone type
 */
exports.delete = function(req, res) {
	var milestoneType = req.milestoneType ;

	milestoneType.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(milestoneType);
		}
	});
};

/**
 * List of Milestone types
 */
exports.list = function(req, res) { 
	MilestoneType.find().sort('-created').populate('user', 'displayName').exec(function(err, milestoneTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(milestoneTypes);
		}
	});
};

/**
 * Milestone type middleware
 */
exports.milestoneTypeByID = function(req, res, next, id) { 
	MilestoneType.findById(id).populate('user', 'displayName').exec(function(err, milestoneType) {
		if (err) return next(err);
		if (! milestoneType) return next(new Error('Failed to load Milestone type ' + id));
		req.milestoneType = milestoneType ;
		next();
	});
};

/**
 * Milestone type authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.milestoneType.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
