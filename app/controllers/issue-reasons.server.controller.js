'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	IssueReason = mongoose.model('IssueReason'),
	_ = require('lodash');

/**
 * Create a Issue reason
 */
exports.create = function(req, res) {
	var issueReason = new IssueReason(req.body);
	issueReason.user = req.user;

	issueReason.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(issueReason);
		}
	});
};

/**
 * Show the current Issue reason
 */
exports.read = function(req, res) {
	res.jsonp(req.issueReason);
};

/**
 * Update a Issue reason
 */
exports.update = function(req, res) {
	var issueReason = req.issueReason ;

	issueReason = _.extend(issueReason , req.body);

	issueReason.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(issueReason);
		}
	});
};

/**
 * Delete an Issue reason
 */
exports.delete = function(req, res) {
	var issueReason = req.issueReason ;

	issueReason.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(issueReason);
		}
	});
};

/**
 * List of Issue reasons
 */
exports.list = function(req, res) { 
	IssueReason.find().sort('-created').populate('user', 'displayName').exec(function(err, issueReasons) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(issueReasons);
		}
	});
};

/**
 * Issue reason middleware
 */
exports.issueReasonByID = function(req, res, next, id) { 
	IssueReason.findById(id).populate('user', 'displayName').exec(function(err, issueReason) {
		if (err) return next(err);
		if (! issueReason) return next(new Error('Failed to load Issue reason ' + id));
		req.issueReason = issueReason ;
		next();
	});
};

/**
 * Issue reason authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.issueReason.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
