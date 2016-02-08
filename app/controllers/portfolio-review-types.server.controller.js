'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Portfolio review type
 */
exports.create = function(req, res) {
	var PortfolioReviewType = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReviewType');
	var portfolioReviewType = new PortfolioReviewType(req.body);
	portfolioReviewType.user = req.user;

	portfolioReviewType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReviewType);
		}
	});
};

/**
 * Show the current Portfolio review type
 */
exports.read = function(req, res) {
	res.jsonp(req.portfolioReviewType);
};

/**
 * Update a Portfolio review type
 */
exports.update = function(req, res) {
	var portfolioReviewType = req.portfolioReviewType ;
    portfolioReviewType.user = req.user;
    portfolioReviewType.created = Date.now();
	portfolioReviewType = _.extend(portfolioReviewType , req.body);

	portfolioReviewType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReviewType);
		}
	});
};

/**
 * Delete an Portfolio review type
 */
exports.delete = function(req, res) {
	var portfolioReviewType = req.portfolioReviewType ;

	portfolioReviewType.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReviewType);
		}
	});
};

/**
 * List of Portfolio review types
 */
exports.list = function(req, res) {
    var PortfolioReviewType = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReviewType');
	PortfolioReviewType.find().populate('user', 'displayName').exec(function(err, portfolioReviewTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReviewTypes);
		}
	});
};

/**
 * Portfolio review type middleware
 */
exports.portfolioReviewTypeByID = function(req, res, next, id) {
    var PortfolioReviewType = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReviewType');
	PortfolioReviewType.findById(id).populate('user', 'displayName').exec(function(err, portfolioReviewType) {
		if (err) return next(err);
		if (! portfolioReviewType) return next(new Error('Failed to load Portfolio review type ' + id));
		req.portfolioReviewType = portfolioReviewType ;
		next();
	});
};

/**
 * Portfolio review type authorization middleware
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
