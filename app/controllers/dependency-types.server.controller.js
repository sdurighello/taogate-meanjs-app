'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Dependency type
 */
exports.create = function(req, res) {
	var DependencyType = mongoose.mtModel(req.user.tenantId + '.' + 'DependencyType');
	var dependencyType = new DependencyType(req.body);
	dependencyType.user = req.user;

	dependencyType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependencyType);
		}
	});
};

/**
 * Show the current Dependency type
 */
exports.read = function(req, res) {
	res.jsonp(req.dependencyType);
};

/**
 * Update a Dependency type
 */
exports.update = function(req, res) {
	var dependencyType = req.dependencyType ;
    dependencyType.user = req.user;
    dependencyType.created = Date.now();
	dependencyType = _.extend(dependencyType , req.body);

	dependencyType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependencyType);
		}
	});
};

/**
 * Delete an Dependency type
 */
exports.delete = function(req, res) {
	var dependencyType = req.dependencyType ;

	dependencyType.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependencyType);
		}
	});
};

/**
 * List of Dependency types
 */
exports.list = function(req, res) {
    var DependencyType = mongoose.mtModel(req.user.tenantId + '.' + 'DependencyType');
	DependencyType.find().sort('-created').populate('user', 'displayName').exec(function(err, dependencyTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependencyTypes);
		}
	});
};

/**
 * Dependency type middleware
 */
exports.dependencyTypeByID = function(req, res, next, id) {
    var DependencyType = mongoose.mtModel(req.user.tenantId + '.' + 'DependencyType');
	DependencyType.findById(id).populate('user', 'displayName').exec(function(err, dependencyType) {
		if (err) return next(err);
		if (! dependencyType) return next(new Error('Failed to load Dependency type ' + id));
		req.dependencyType = dependencyType ;
		next();
	});
};

/**
 * Dependency type authorization middleware
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
