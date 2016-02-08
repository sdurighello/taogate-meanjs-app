'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Portfolio review
 */
exports.create = function(req, res) {
	var PortfolioReview = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReview');
	var portfolioReview = new PortfolioReview(req.body);
	portfolioReview.user = req.user;

	portfolioReview.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReview);
		}
	});
};

/**
 * Show the current Portfolio review
 */
exports.read = function(req, res) {
	res.jsonp(req.portfolioReview);
};

/**
 * Update a Portfolio review
 */
exports.update = function(req, res) {
	var portfolioReview = req.portfolioReview ;
	portfolioReview.user = req.user;
	portfolioReview.created = Date.now();
	portfolioReview = _.extend(portfolioReview , req.body);

	portfolioReview.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReview);
		}
	});
};

/**
 * Delete an Portfolio review
 */
exports.delete = function(req, res) {
	var portfolioReview = req.portfolioReview ;

	portfolioReview.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReview);
		}
	});
};

/**
 * List of Portfolio reviews
 */
exports.list = function(req, res) {
	var PortfolioReview = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReview');
	PortfolioReview.find().populate('user', 'displayName').exec(function(err, portfolioReviews) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReviews);
		}
	});
};

/**
 * Portfolio review middleware
 */
exports.portfolioReviewByID = function(req, res, next, id) {
	var PortfolioReview = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReview');
	PortfolioReview.findById(id).populate('user', 'displayName').exec(function(err, portfolioReview) {
		if (err) return next(err);
		if (! portfolioReview) return next(new Error('Failed to load Portfolio review ' + id));
		req.portfolioReview = portfolioReview ;
		next();
	});
};

/**
 * Portfolio review authorization middleware
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
