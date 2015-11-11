'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Change request state
 */
exports.create = function(req, res) {
	var ChangeRequestState = mongoose.mtModel(req.user.tenantId + '.' + 'ChangeRequestState');
	var changeRequestState = new ChangeRequestState(req.body);
	changeRequestState.user = req.user;

	changeRequestState.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(changeRequestState);
		}
	});
};

/**
 * Show the current Change request state
 */
exports.read = function(req, res) {
	res.jsonp(req.changeRequestState);
};

/**
 * Update a Change request state
 */
exports.update = function(req, res) {
	var changeRequestState = req.changeRequestState;
    changeRequestState.user = req.user;
    changeRequestState.created = Date.now();
	changeRequestState = _.extend(changeRequestState , req.body);

	changeRequestState.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(changeRequestState);
		}
	});
};

/**
 * Delete an Change request state
 */
exports.delete = function(req, res) {
	var changeRequestState = req.changeRequestState ;

	changeRequestState.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(changeRequestState);
		}
	});
};

/**
 * List of Change request states
 */
exports.list = function(req, res) {
	var ChangeRequestState = mongoose.mtModel(req.user.tenantId + '.' + 'ChangeRequestState');
	ChangeRequestState.find().sort('-created').populate('user', 'displayName').exec(function(err, changeRequestStates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(changeRequestStates);
		}
	});
};

/**
 * Change request state middleware
 */
exports.changeRequestStateByID = function(req, res, next, id) {
	var ChangeRequestState = mongoose.mtModel(req.user.tenantId + '.' + 'ChangeRequestState');
	ChangeRequestState.findById(id).populate('user', 'displayName').exec(function(err, changeRequestState) {
		if (err) return next(err);
		if (! changeRequestState) return next(new Error('Failed to load Change request state ' + id));
		req.changeRequestState = changeRequestState ;
		next();
	});
};

/**
 * Change request state authorization middleware
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
