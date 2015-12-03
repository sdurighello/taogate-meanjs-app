'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Actual completion
 */
exports.create = function(req, res) {
    var ActualCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCompletion');
	var actualCompletion = new ActualCompletion(req.body);
	actualCompletion.user = req.user;

	actualCompletion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualCompletion);
		}
	});
};

/**
 * Show the current Actual completion
 */
exports.read = function(req, res) {
	res.jsonp(req.actualCompletion);
};

/**
 * Update a Actual completion
 */
exports.update = function(req, res) {
	var actualCompletion = req.actualCompletion ;

	actualCompletion = _.extend(actualCompletion , req.body);

	actualCompletion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualCompletion);
		}
	});
};

/**
 * Delete an Actual completion
 */
exports.delete = function(req, res) {
	var actualCompletion = req.actualCompletion ;

	actualCompletion.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualCompletion);
		}
	});
};

/**
 * List of Actual completions
 */
exports.list = function(req, res) {
    var ActualCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCompletion');
    ActualCompletion.find().populate('user', 'displayName').exec(function(err, actualCompletions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualCompletions);
		}
	});
};

/**
 * Actual completion middleware
 */
exports.actualCompletionByID = function(req, res, next, id) {
    var ActualCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCompletion');
	ActualCompletion.findById(id).populate('user', 'displayName').exec(function(err, actualCompletion) {
		if (err) return next(err);
		if (! actualCompletion) return next(new Error('Failed to load Actual completion ' + id));
		req.actualCompletion = actualCompletion ;
		next();
	});
};

/**
 * Actual completion authorization middleware
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
