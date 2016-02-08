'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Project review score
 */
exports.create = function(req, res) {
	var ProjectReviewScore = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReviewScore');
	var projectReviewScore = new ProjectReviewScore(req.body);
	projectReviewScore.user = req.user;

	projectReviewScore.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReviewScore);
		}
	});
};

/**
 * Show the current Project review score
 */
exports.read = function(req, res) {
	res.jsonp(req.projectReviewScore);
};

/**
 * Update a Project review score
 */
exports.update = function(req, res) {
	var projectReviewScore = req.projectReviewScore ;
	projectReviewScore.user = req.user;
	projectReviewScore.created = Date.now();
	projectReviewScore = _.extend(projectReviewScore , req.body);

	projectReviewScore.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReviewScore);
		}
	});
};

/**
 * Delete an Project review score
 */
exports.delete = function(req, res) {
	var projectReviewScore = req.projectReviewScore ;

	projectReviewScore.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReviewScore);
		}
	});
};

/**
 * List of Project review scores
 */
exports.list = function(req, res) {
	var ProjectReviewScore = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReviewScore');
	ProjectReviewScore.find().populate('user', 'displayName').exec(function(err, projectReviewScores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReviewScores);
		}
	});
};

/**
 * Project review score middleware
 */
exports.projectReviewScoreByID = function(req, res, next, id) {
	var ProjectReviewScore = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReviewScore');
	ProjectReviewScore.findById(id).populate('user', 'displayName').exec(function(err, projectReviewScore) {
		if (err) return next(err);
		if (! projectReviewScore) return next(new Error('Failed to load Project review score ' + id));
		req.projectReviewScore = projectReviewScore ;
		next();
	});
};

/**
 * Project review score authorization middleware
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
