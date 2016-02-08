'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Portfolio review template
 */
exports.create = function(req, res) {
	var PortfolioReviewTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReviewTemplate');
	var portfolioReviewTemplate = new PortfolioReviewTemplate(req.body);
	portfolioReviewTemplate.user = req.user;

	portfolioReviewTemplate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReviewTemplate);
		}
	});
};

/**
 * Show the current Portfolio review template
 */
exports.read = function(req, res) {
	res.jsonp(req.portfolioReviewTemplate);
};

/**
 * Update a Portfolio review template
 */
exports.update = function(req, res) {
	var portfolioReviewTemplate = req.portfolioReviewTemplate ;
	portfolioReviewTemplate.user = req.user;
	portfolioReviewTemplate.created = Date.now();
	portfolioReviewTemplate = _.extend(portfolioReviewTemplate , req.body);

	portfolioReviewTemplate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReviewTemplate);
		}
	});
};

/**
 * Delete an Portfolio review template
 */
exports.delete = function(req, res) {
	var portfolioReviewTemplate = req.portfolioReviewTemplate ;

	portfolioReviewTemplate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReviewTemplate);
		}
	});
};

/**
 * List of Portfolio review templates
 */
exports.list = function(req, res) {
	var PortfolioReviewTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReviewTemplate');
	PortfolioReviewTemplate.find().populate('user', 'displayName').exec(function(err, portfolioReviewTemplates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReviewTemplates);
		}
	});
};

/**
 * Portfolio review template middleware
 */
exports.portfolioReviewTemplateByID = function(req, res, next, id) {
	var PortfolioReviewTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReviewTemplate');
	PortfolioReviewTemplate.findById(id).populate('user', 'displayName').exec(function(err, portfolioReviewTemplate) {
		if (err) return next(err);
		if (! portfolioReviewTemplate) return next(new Error('Failed to load Portfolio review template ' + id));
		req.portfolioReviewTemplate = portfolioReviewTemplate ;
		next();
	});
};

/**
 * Portfolio review template authorization middleware
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
