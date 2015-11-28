'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Portfolio milestone type
 */
exports.create = function(req, res) {
	var PortfolioMilestoneType = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioMilestoneType');
	var portfolioMilestoneType = new PortfolioMilestoneType(req.body);
	portfolioMilestoneType.user = req.user;

	portfolioMilestoneType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioMilestoneType);
		}
	});
};

/**
 * Show the current Portfolio milestone type
 */
exports.read = function(req, res) {
	res.jsonp(req.portfolioMilestoneType);
};

/**
 * Update a Portfolio milestone type
 */
exports.update = function(req, res) {
	var portfolioMilestoneType = req.portfolioMilestoneType ;
    portfolioMilestoneType.user = req.user;
    portfolioMilestoneType.created = Date.now();
	portfolioMilestoneType = _.extend(portfolioMilestoneType , req.body);

	portfolioMilestoneType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioMilestoneType);
		}
	});
};

/**
 * Delete an Portfolio milestone type
 */
exports.delete = function(req, res) {
	var portfolioMilestoneType = req.portfolioMilestoneType ;

	portfolioMilestoneType.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioMilestoneType);
		}
	});
};

/**
 * List of Portfolio milestone types
 */
exports.list = function(req, res) {
	var PortfolioMilestoneType = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioMilestoneType');
	PortfolioMilestoneType.find().populate('user', 'displayName').exec(function(err, portfolioMilestoneTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioMilestoneTypes);
		}
	});
};

/**
 * Portfolio milestone type middleware
 */
exports.portfolioMilestoneTypeByID = function(req, res, next, id) {
	var PortfolioMilestoneType = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioMilestoneType');
	PortfolioMilestoneType.findById(id).populate('user', 'displayName').exec(function(err, portfolioMilestoneType) {
		if (err) return next(err);
		if (! portfolioMilestoneType) return next(new Error('Failed to load Portfolio milestone type ' + id));
		req.portfolioMilestoneType = portfolioMilestoneType ;
		next();
	});
};

/**
 * Portfolio milestone type authorization middleware
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
