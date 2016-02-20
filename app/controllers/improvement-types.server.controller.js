'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Improvement type
 */
exports.create = function(req, res) {
	var ImprovementType = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementType');
	var improvementType = new ImprovementType(req.body);
	improvementType.user = req.user;

	improvementType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementType);
		}
	});
};

/**
 * Show the current Improvement type
 */
exports.read = function(req, res) {
	res.jsonp(req.improvementType);
};

/**
 * Update a Improvement type
 */
exports.update = function(req, res) {
	var improvementType = req.improvementType ;
    improvementType.user = req.user;
    improvementType.created = Date.now();
	improvementType = _.extend(improvementType , req.body);

	improvementType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementType);
		}
	});
};

/**
 * Delete an Improvement type
 */
exports.delete = function(req, res) {
	var improvementType = req.improvementType ;

	improvementType.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementType);
		}
	});
};

/**
 * List of Improvement types
 */
exports.list = function(req, res) {
    var ImprovementType = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementType');
    ImprovementType.find().populate('user', 'displayName').exec(function(err, improvementTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementTypes);
		}
	});
};

/**
 * Improvement type middleware
 */
exports.improvementTypeByID = function(req, res, next, id) {
    var ImprovementType = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementType');
    ImprovementType.findById(id).populate('user', 'displayName').exec(function(err, improvementType) {
		if (err) return next(err);
		if (! improvementType) return next(new Error('Failed to load Improvement type ' + id));
		req.improvementType = improvementType ;
		next();
	});
};

/**
 * Improvement type authorization middleware
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
