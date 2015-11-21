'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Priority value
 */
exports.create = function(req, res) {
	var PriorityValue = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityValue');
	var priorityValue = new PriorityValue(req.body);
	priorityValue.user = req.user;

	priorityValue.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(priorityValue);
		}
	});
};

/**
 * Show the current Priority value
 */
exports.read = function(req, res) {
	res.jsonp(req.priorityValue);
};

/**
 * Update a Priority value
 */
exports.update = function(req, res) {
	var priorityValue = req.priorityValue ;
    priorityValue.user = req.user;
    priorityValue.created = Date.now();
	priorityValue = _.extend(priorityValue , req.body);

	priorityValue.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(priorityValue);
		}
	});
};

/**
 * Delete an Priority value
 */
exports.delete = function(req, res) {

	var priorityValue = req.priorityValue ;

	priorityValue.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(priorityValue);
		}
	});
};

/**
 * List of Priority values
 */
exports.list = function(req, res) {
	var PriorityValue = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityValue');
	PriorityValue.find().sort('position').populate('user', 'displayName').exec(function(err, priorityValues) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(priorityValues);
		}
	});
};

/**
 * Priority value middleware
 */
exports.priorityValueByID = function(req, res, next, id) {
	var PriorityValue = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityValue');
	PriorityValue.findById(id).populate('user', 'displayName').exec(function(err, priorityValue) {
		if (err) return next(err);
		if (! priorityValue) return next(new Error('Failed to load Priority value ' + id));
		req.priorityValue = priorityValue ;
		next();
	});
};

/**
 * Priority value authorization middleware
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
