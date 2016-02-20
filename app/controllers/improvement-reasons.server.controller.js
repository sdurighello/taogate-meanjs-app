'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Improvement reason
 */
exports.create = function(req, res) {
	var ImprovementReason = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementReason');
	var improvementReason = new ImprovementReason(req.body);
	improvementReason.user = req.user;

	improvementReason.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementReason);
		}
	});
};

/**
 * Show the current Improvement reason
 */
exports.read = function(req, res) {
	res.jsonp(req.improvementReason);
};

/**
 * Update a Improvement reason
 */
exports.update = function(req, res) {
	var improvementReason = req.improvementReason ;
    improvementReason.user = req.user;
    improvementReason.created = Date.now();
	improvementReason = _.extend(improvementReason , req.body);

	improvementReason.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementReason);
		}
	});
};

/**
 * Delete an Improvement reason
 */
exports.delete = function(req, res) {
	var improvementReason = req.improvementReason ;

	improvementReason.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementReason);
		}
	});
};

/**
 * List of Improvement reasons
 */
exports.list = function(req, res) {
    var ImprovementReason = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementReason');
    ImprovementReason.find().populate('user', 'displayName').exec(function(err, improvementReasons) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementReasons);
		}
	});
};

/**
 * Improvement reason middleware
 */
exports.improvementReasonByID = function(req, res, next, id) {
    var ImprovementReason = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementReason');
    ImprovementReason.findById(id).populate('user', 'displayName').exec(function(err, improvementReason) {
		if (err) return next(err);
		if (! improvementReason) return next(new Error('Failed to load Improvement reason ' + id));
		req.improvementReason = improvementReason ;
		next();
	});
};

/**
 * Improvement reason authorization middleware
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
