'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    async = require('async'),
	_ = require('lodash');

/**
 * Create a Portfolio status report
 */
exports.create = function(req, res) {
    
    var PortfolioStatusReport = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioStatusReport');

    var portfolioStatusReport = new PortfolioStatusReport(req.body);
	portfolioStatusReport.user = req.user;

	portfolioStatusReport.save(function(err) {
		if (err) {
            console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioStatusReport);
		}
	});
};

/**
 * Show the current Portfolio status report
 */
exports.read = function(req, res) {
	res.jsonp(req.portfolioStatusReport);
};

/**
 * Update a Portfolio status report
 */
exports.update = function(req, res) {
	var portfolioStatusReport = req.portfolioStatusReport ;

	portfolioStatusReport = _.extend(portfolioStatusReport , req.body);

	portfolioStatusReport.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioStatusReport);
		}
	});
};

/**
 * Delete an Portfolio status report
 */
exports.delete = function(req, res) {
	var portfolioStatusReport = req.portfolioStatusReport ;

	portfolioStatusReport.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioStatusReport);
		}
	});
};

/**
 * List of Portfolio status reports
 */
exports.list = function(req, res) {

    var PortfolioStatusReport = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioStatusReport');

    PortfolioStatusReport.find(req.query).populate('user', 'displayName').exec(function(err, portfolioStatusReports) {
		if (err) {
            console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioStatusReports);
		}
	});
};

/**
 * Portfolio status report middleware
 */
exports.portfolioStatusReportByID = function(req, res, next, id) {

    var PortfolioStatusReport = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioStatusReport');

    PortfolioStatusReport.findById(id).populate('user', 'displayName').exec(function(err, portfolioStatusReport) {
		if (err) return next(err);
		if (! portfolioStatusReport) return next(new Error('Failed to load Portfolio status report ' + id));
		req.portfolioStatusReport = portfolioStatusReport ;
		next();
	});
};

/**
 * Portfolio status report authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

	next();
};
