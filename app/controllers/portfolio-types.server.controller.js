'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a portfolio type
 */
exports.create = function(req, res) {
	var PortfolioType = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioType');
	var portfolioType = new PortfolioType(req.body);
	portfolioType.user = req.user;

	portfolioType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioType);
		}
	});
};

/**
 * Show the current portfolioType
 */
exports.read = function(req, res) {
	res.jsonp(req.portfolioType);
};

/**
 * Update a portfolioType
 */
exports.update = function(req, res) {
	var portfolioType = req.portfolioType ;
	portfolioType.user = req.user;
	portfolioType.created = Date.now();
	portfolioType = _.extend(portfolioType , req.body);

	portfolioType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioType);
		}
	});
};

/**
 * Delete an portfolioType
 */
exports.delete = function(req, res) {
	var PortfolioType = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioType');
	var portfolioType = req.portfolioType;

    portfolioType.remove(function(err, portfolioType){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioType);
        }
    });

};

/**
 * List of portfolioTypes
 */
exports.list = function(req, res) {
	var PortfolioType = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioType');
	PortfolioType.find().populate('user', 'displayName').exec(function(err, portfolioTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioTypes);
		}
	});
};

/**
 * portfolioType middleware
 */
exports.portfolioTypeByID = function(req, res, next, id) {
	var PortfolioType = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioType');
	PortfolioType.findById(id).populate('user', 'displayName').exec(function(err, portfolioType) {
		if (err) return next(err);
		if (! portfolioType) return next(new Error('Failed to load portfolioType ' + id));
		req.portfolioType = portfolioType ;
		next();
	});
};

/**
 * portfolioType authorization middleware
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
