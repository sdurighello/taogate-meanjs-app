'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Dependency impact
 */
exports.create = function(req, res) {
	var DependencyImpact = mongoose.mtModel(req.user.tenantId + '.' + 'DependencyImpact');
	var dependencyImpact = new DependencyImpact(req.body);
	dependencyImpact.user = req.user;

	dependencyImpact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependencyImpact);
		}
	});
};

/**
 * Show the current Dependency impact
 */
exports.read = function(req, res) {
	res.jsonp(req.dependencyImpact);
};

/**
 * Update a Dependency impact
 */
exports.update = function(req, res) {
	var dependencyImpact = req.dependencyImpact ;
    dependencyImpact.user = req.user;
    dependencyImpact.created = Date.now();
	dependencyImpact = _.extend(dependencyImpact , req.body);

	dependencyImpact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependencyImpact);
		}
	});
};

/**
 * Delete an Dependency impact
 */
exports.delete = function(req, res) {
	var dependencyImpact = req.dependencyImpact ;

	dependencyImpact.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependencyImpact);
		}
	});
};

/**
 * List of Dependency impacts
 */
exports.list = function(req, res) {
    var DependencyImpact = mongoose.mtModel(req.user.tenantId + '.' + 'DependencyImpact');
	DependencyImpact.find().sort('position').populate('user', 'displayName').exec(function(err, dependencyImpacts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependencyImpacts);
		}
	});
};

/**
 * Dependency impact middleware
 */
exports.dependencyImpactByID = function(req, res, next, id) {
    var DependencyImpact = mongoose.mtModel(req.user.tenantId + '.' + 'DependencyImpact');
	DependencyImpact.findById(id).populate('user', 'displayName').exec(function(err, dependencyImpact) {
		if (err) return next(err);
		if (! dependencyImpact) return next(new Error('Failed to load Dependency impact ' + id));
		req.dependencyImpact = dependencyImpact ;
		next();
	});
};

/**
 * Dependency impact authorization middleware
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
