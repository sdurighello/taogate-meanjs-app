'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Dependency state
 */
exports.create = function(req, res) {
	var DependencyState = mongoose.mtModel(req.user.tenantId + '.' + 'DependencyState');
	var dependencyState = new DependencyState(req.body);
	dependencyState.user = req.user;

	dependencyState.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependencyState);
		}
	});
};

/**
 * Show the current Dependency state
 */
exports.read = function(req, res) {
	res.jsonp(req.dependencyState);
};

/**
 * Update a Dependency state
 */
exports.update = function(req, res) {
	var dependencyState = req.dependencyState ;
    dependencyState.user = req.user;
    dependencyState.created = Date.now();
	dependencyState = _.extend(dependencyState , req.body);

	dependencyState.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependencyState);
		}
	});
};

/**
 * Delete an Dependency state
 */
exports.delete = function(req, res) {
	var dependencyState = req.dependencyState ;

	dependencyState.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependencyState);
		}
	});
};

/**
 * List of Dependency states
 */
exports.list = function(req, res) {
    var DependencyState = mongoose.mtModel(req.user.tenantId + '.' + 'DependencyState');
    DependencyState.find().populate('user', 'displayName').exec(function(err, dependencyStates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependencyStates);
		}
	});
};

/**
 * Dependency state middleware
 */
exports.dependencyStateByID = function(req, res, next, id) {
    var DependencyState = mongoose.mtModel(req.user.tenantId + '.' + 'DependencyState');
	DependencyState.findById(id).populate('user', 'displayName').exec(function(err, dependencyState) {
		if (err) return next(err);
		if (! dependencyState) return next(new Error('Failed to load Dependency state ' + id));
		req.dependencyState = dependencyState ;
		next();
	});
};

/**
 * Dependency state authorization middleware
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
