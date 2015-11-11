'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	IssueState = mongoose.model('IssueState'),
	_ = require('lodash');

/**
 * Create a Issue state
 */
exports.create = function(req, res) {
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
	IssueState.find().sort('-created').populate('user', 'displayName').exec(function(err, issueStates) {
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
	if (req.issueState.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
