'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Improvement state
 */
exports.create = function(req, res) {
	var ImprovementState = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementState');
	var improvementState = new ImprovementState(req.body);
	improvementState.user = req.user;

	improvementState.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementState);
		}
	});
};

/**
 * Show the current Improvement state
 */
exports.read = function(req, res) {
	res.jsonp(req.improvementState);
};

/**
 * Update a Improvement state
 */
exports.update = function(req, res) {
	var improvementState = req.improvementState ;
    improvementState.user = req.user;
    improvementState.created = Date.now();
	improvementState = _.extend(improvementState , req.body);

	improvementState.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementState);
		}
	});
};

/**
 * Delete an Improvement state
 */
exports.delete = function(req, res) {
	var improvementState = req.improvementState ;

	improvementState.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementState);
		}
	});
};

/**
 * List of Improvement states
 */
exports.list = function(req, res) {
    var ImprovementState = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementState');
	ImprovementState.find().populate('user', 'displayName').exec(function(err, improvementStates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementStates);
		}
	});
};

/**
 * Improvement state middleware
 */
exports.improvementStateByID = function(req, res, next, id) {
    var ImprovementState = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementState');
    ImprovementState.findById(id).populate('user', 'displayName').exec(function(err, improvementState) {
		if (err) return next(err);
		if (! improvementState) return next(new Error('Failed to load Improvement state ' + id));
		req.improvementState = improvementState ;
		next();
	});
};

/**
 * Improvement state authorization middleware
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
