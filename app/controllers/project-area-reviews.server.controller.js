'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Project area review
 */
exports.create = function(req, res) {
	var ProjectAreaReview = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectAreaReview');
	var projectAreaReview = new ProjectAreaReview(req.body);
	projectAreaReview.user = req.user;

	projectAreaReview.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectAreaReview);
		}
	});
};

/**
 * Show the current Project area review
 */
exports.read = function(req, res) {
	res.jsonp(req.projectAreaReview);
};

/**
 * Update a Project area review
 */
exports.update = function(req, res) {
	var projectAreaReview = req.projectAreaReview ;

	projectAreaReview = _.extend(projectAreaReview , req.body);

	projectAreaReview.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectAreaReview);
		}
	});
};

/**
 * Delete an Project area review
 */
exports.delete = function(req, res) {
	var projectAreaReview = req.projectAreaReview ;

	projectAreaReview.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectAreaReview);
		}
	});
};

/**
 * List of Project area reviews
 */
exports.list = function(req, res) {
    var ProjectAreaReview = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectAreaReview');
    ProjectAreaReview.find().populate('user', 'displayName').exec(function(err, projectAreaReviews) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectAreaReviews);
		}
	});
};

/**
 * Project area review middleware
 */
exports.projectAreaReviewByID = function(req, res, next, id) {
    var ProjectAreaReview = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectAreaReview');
    ProjectAreaReview.findById(id).populate('user', 'displayName').exec(function(err, projectAreaReview) {
		if (err) return next(err);
		if (! projectAreaReview) return next(new Error('Failed to load Project area review ' + id));
		req.projectAreaReview = projectAreaReview ;
		next();
	});
};

/**
 * Project area review authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    var roleIsAuthorized = _.some(req.user.roles, function(role){
        return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
    });
    if(!roleIsAuthorized){
        return res.status(403).send({
            message: 'Role is not authorized'
        });
    }

    next();
};
