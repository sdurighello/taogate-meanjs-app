'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Issue state
 */
exports.create = function(req, res) {
	var IssueState = mongoose.mtModel(req.user.tenantId + '.' + 'IssueState');
	var issueState = new IssueState(req.body);
	issueState.user = req.user;

	issueState.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(issueState);
		}
	});
};

/**
 * Show the current Issue state
 */
exports.read = function(req, res) {
	res.jsonp(req.issueState);
};

/**
 * Update a Issue state
 */
exports.update = function(req, res) {
	var issueState = req.issueState ;
    issueState.user = req.user;
    issueState.created = Date.now();
	issueState = _.extend(issueState , req.body);

	issueState.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(issueState);
		}
	});
};

/**
 * Delete an Issue state
 */
exports.delete = function(req, res) {
	var issueState = req.issueState ;

	issueState.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(issueState);
		}
	});
};

/**
 * List of Issue states
 */
exports.list = function(req, res) {
    var IssueState = mongoose.mtModel(req.user.tenantId + '.' + 'IssueState');
	IssueState.find().populate('user', 'displayName').exec(function(err, issueStates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(issueStates);
		}
	});
};

/**
 * Issue state middleware
 */
exports.issueStateByID = function(req, res, next, id) {
    var IssueState = mongoose.mtModel(req.user.tenantId + '.' + 'IssueState');
	IssueState.findById(id).populate('user', 'displayName').exec(function(err, issueState) {
		if (err) return next(err);
		if (! issueState) return next(new Error('Failed to load Issue state ' + id));
		req.issueState = issueState ;
		next();
	});
};

/**
 * Issue state authorization middleware
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
