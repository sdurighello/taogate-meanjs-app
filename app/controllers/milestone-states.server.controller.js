'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Milestone state
 */
exports.create = function(req, res) {
	var MilestoneState = mongoose.mtModel(req.user.tenantId + '.' + 'MilestoneState');
	var milestoneState = new MilestoneState(req.body);
	milestoneState.user = req.user;

	milestoneState.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(milestoneState);
		}
	});
};

/**
 * Show the current Milestone state
 */
exports.read = function(req, res) {
	res.jsonp(req.milestoneState);
};

/**
 * Update a Milestone state
 */
exports.update = function(req, res) {
	var milestoneState = req.milestoneState ;
    milestoneState.user = req.user;
    milestoneState.created = Date.now();
	milestoneState = _.extend(milestoneState , req.body);

	milestoneState.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(milestoneState);
		}
	});
};

/**
 * Delete an Milestone state
 */
exports.delete = function(req, res) {
	var milestoneState = req.milestoneState ;

	milestoneState.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(milestoneState);
		}
	});
};

/**
 * List of Milestone states
 */
exports.list = function(req, res) {
	var MilestoneState = mongoose.mtModel(req.user.tenantId + '.' + 'MilestoneState');
	MilestoneState.find().populate('user', 'displayName').exec(function(err, milestoneStates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(milestoneStates);
		}
	});
};

/**
 * Milestone state middleware
 */
exports.milestoneStateByID = function(req, res, next, id) {
	var MilestoneState = mongoose.mtModel(req.user.tenantId + '.' + 'MilestoneState');
	MilestoneState.findById(id).populate('user', 'displayName').exec(function(err, milestoneState) {
		if (err) return next(err);
		if (! milestoneState) return next(new Error('Failed to load Milestone state ' + id));
		req.milestoneState = milestoneState ;
		next();
	});
};

/**
 * Milestone state authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// User role check
	if(!_.find(req.user.roles, function(role){
			return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
		})
	){
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
