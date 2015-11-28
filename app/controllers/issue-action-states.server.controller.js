'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Issue action state
 */
exports.create = function(req, res) {
	var IssueActionState = mongoose.mtModel(req.user.tenantId + '.' + 'IssueActionState');
	var issueActionState = new IssueActionState(req.body);
	issueActionState.user = req.user;

	issueActionState.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(issueActionState);
		}
	});
};

/**
 * Show the current Issue action state
 */
exports.read = function(req, res) {
	res.jsonp(req.issueActionState);
};

/**
 * Update a Issue action state
 */
exports.update = function(req, res) {
	var issueActionState = req.issueActionState ;
    issueActionState.user = req.user;
    issueActionState.created = Date.now();
	issueActionState = _.extend(issueActionState , req.body);

	issueActionState.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(issueActionState);
		}
	});
};

/**
 * Delete an Issue action state
 */
exports.delete = function(req, res) {
	var issueActionState = req.issueActionState ;

	issueActionState.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(issueActionState);
		}
	});
};

/**
 * List of Issue action states
 */
exports.list = function(req, res) {
	var IssueActionState = mongoose.mtModel(req.user.tenantId + '.' + 'IssueActionState');
	IssueActionState.find().populate('user', 'displayName').exec(function(err, issueActionStates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(issueActionStates);
		}
	});
};

/**
 * Issue action state middleware
 */
exports.issueActionStateByID = function(req, res, next, id) {
	var IssueActionState = mongoose.mtModel(req.user.tenantId + '.' + 'IssueActionState');
	IssueActionState.findById(id).populate('user', 'displayName').exec(function(err, issueActionState) {
		if (err) return next(err);
		if (! issueActionState) return next(new Error('Failed to load Issue action state ' + id));
		req.issueActionState = issueActionState ;
		next();
	});
};

/**
 * Issue action state authorization middleware
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
