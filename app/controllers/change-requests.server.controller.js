'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Change request
 */
exports.create = function(req, res) {
	var ChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'ChangeRequest');
	var changeRequest = new ChangeRequest(req.body);
	changeRequest.user = req.user;

	changeRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(changeRequest);
		}
	});
};

/**
 * Show the current Change request
 */
exports.read = function(req, res) {
	res.jsonp(req.changeRequest);
};

/**
 * Update a Change request
 */
exports.update = function(req, res) {
	var changeRequest = req.changeRequest ;
    changeRequest.user = req.user;
    changeRequest.created = Date.now();
    changeRequest = _.extend(changeRequest , req.body);

	changeRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(changeRequest);
		}
	});
};

/**
 * Delete an Change request
 */
exports.delete = function(req, res) {
	var changeRequest = req.changeRequest ;

	changeRequest.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(changeRequest);
		}
	});
};

/**
 * List of Change requests
 */
exports.list = function(req, res) {
	var ChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'ChangeRequest');
	ChangeRequest.find().sort('-created').populate('user', 'displayName').exec(function(err, changeRequests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(changeRequests);
		}
	});
};

/**
 * Change request middleware
 */
exports.changeRequestByID = function(req, res, next, id) {
	var ChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'ChangeRequest');
	ChangeRequest.findById(id).populate('user', 'displayName').exec(function(err, changeRequest) {
		if (err) return next(err);
		if (! changeRequest) return next(new Error('Failed to load Change request ' + id));
		req.changeRequest = changeRequest ;
		next();
	});
};

/**
 * Change request authorization middleware
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
