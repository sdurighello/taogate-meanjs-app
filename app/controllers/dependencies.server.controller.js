'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Dependency
 */
exports.create = function(req, res) {
	var Dependency = mongoose.mtModel(req.user.tenantId + '.' + 'Dependency');
	var dependency = new Dependency(req.body);
	dependency.user = req.user;

	dependency.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependency);
		}
	});
};

/**
 * Show the current Dependency
 */
exports.read = function(req, res) {
	res.jsonp(req.dependency);
};

/**
 * Update a Dependency
 */
exports.update = function(req, res) {
	var dependency = req.dependency ;

	dependency = _.extend(dependency , req.body);

	dependency.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependency);
		}
	});
};

/**
 * Delete an Dependency
 */
exports.delete = function(req, res) {
	var dependency = req.dependency ;

	dependency.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependency);
		}
	});
};

/**
 * List of Dependencies
 */
exports.list = function(req, res) {
    var Dependency = mongoose.mtModel(req.user.tenantId + '.' + 'Dependency');
    Dependency.find(req.query).populate('user', 'displayName').exec(function(err, dependencies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependencies);
		}
	});
};

/**
 * Dependency middleware
 */
exports.dependencyByID = function(req, res, next, id) {

    var Dependency = mongoose.mtModel(req.user.tenantId + '.' + 'Dependency');

	Dependency.findById().populate('user', 'displayName').exec(function(err, dependency) {
		if (err) return next(err);
		if (! dependency) return next(new Error('Failed to load Dependency ' + id));
		req.dependency = dependency ;
		next();
	});
};

/**
 * Dependency authorization middleware
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
