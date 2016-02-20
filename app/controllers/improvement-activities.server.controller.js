'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Improvement activity
 */
exports.create = function(req, res) {
	var ImprovementActivity = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementActivity');
	var improvementActivity = new ImprovementActivity(req.body);
	improvementActivity.user = req.user;

	improvementActivity.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementActivity);
		}
	});
};

/**
 * Show the current Improvement activity
 */
exports.read = function(req, res) {
	res.jsonp(req.improvementActivity);
};

/**
 * Update a Improvement activity
 */
exports.update = function(req, res) {
	var improvementActivity = req.improvementActivity ;
    improvementActivity.user = req.user;
    improvementActivity.created = Date.now();
	improvementActivity = _.extend(improvementActivity , req.body);

	improvementActivity.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementActivity);
		}
	});
};

/**
 * Delete an Improvement activity
 */
exports.delete = function(req, res) {
	var improvementActivity = req.improvementActivity ;

	improvementActivity.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementActivity);
		}
	});
};

/**
 * List of Improvement activities
 */
exports.list = function(req, res) {
    var ImprovementActivity = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementActivity');
    ImprovementActivity.find().populate('user', 'displayName').exec(function(err, improvementActivities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementActivities);
		}
	});
};

/**
 * Improvement activity middleware
 */
exports.improvementActivityByID = function(req, res, next, id) {
    var ImprovementActivity = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementActivity');
    ImprovementActivity.findById(id).populate('user', 'displayName').exec(function(err, improvementActivity) {
		if (err) return next(err);
		if (! improvementActivity) return next(new Error('Failed to load Improvement activity ' + id));
		req.improvementActivity = improvementActivity ;
		next();
	});
};

/**
 * Improvement activity authorization middleware
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
