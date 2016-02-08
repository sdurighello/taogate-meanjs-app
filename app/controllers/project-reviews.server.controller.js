'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Project review
 */
exports.create = function(req, res) {
	var ProjectReview = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReview');
	var projectReview = new ProjectReview(req.body);
	projectReview.user = req.user;

	projectReview.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReview);
		}
	});
};

/**
 * Show the current Project review
 */
exports.read = function(req, res) {
	res.jsonp(req.projectReview);
};

/**
 * Update a Project review
 */
exports.update = function(req, res) {
	var projectReview = req.projectReview ;
	projectReview.user = req.user;
	projectReview.created = Date.now();
	projectReview = _.extend(projectReview , req.body);

	projectReview.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReview);
		}
	});
};

/**
 * Delete an Project review
 */
exports.delete = function(req, res) {
	var projectReview = req.projectReview ;

	projectReview.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReview);
		}
	});
};

/**
 * List of Project reviews
 */
exports.list = function(req, res) {
	var ProjectReview = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReview');
	ProjectReview.find().populate('user', 'displayName').exec(function(err, projectReviews) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReviews);
		}
	});
};

/**
 * Project review middleware
 */
exports.projectReviewByID = function(req, res, next, id) {
	var ProjectReview = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReview');
	ProjectReview.findById(id).populate('user', 'displayName').exec(function(err, projectReview) {
		if (err) return next(err);
		if (! projectReview) return next(new Error('Failed to load Project review ' + id));
		req.projectReview = projectReview ;
		next();
	});
};

/**
 * Project review authorization middleware
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
