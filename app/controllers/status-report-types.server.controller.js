'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * Create a Status report type
 */
exports.create = function(req, res) {

    var StatusReportType = mongoose.mtModel(req.user.tenantId + '.' + 'StatusReportType');

    var statusReportType = new StatusReportType(req.body);
	statusReportType.user = req.user;

	statusReportType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(statusReportType);
		}
	});
};

/**
 * Show the current Status report type
 */
exports.read = function(req, res) {
	res.jsonp(req.statusReportType);
};

/**
 * Update a Status report type
 */
exports.update = function(req, res) {
	var statusReportType = req.statusReportType ;

	statusReportType = _.extend(statusReportType , req.body);

	statusReportType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(statusReportType);
		}
	});
};

/**
 * Delete an Status report type
 */
exports.delete = function(req, res) {
	var statusReportType = req.statusReportType ;

	statusReportType.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(statusReportType);
		}
	});
};

/**
 * List of Status report types
 */
exports.list = function(req, res) {

    var StatusReportType = mongoose.mtModel(req.user.tenantId + '.' + 'StatusReportType');

    StatusReportType.find().populate('user', 'displayName').exec(function(err, statusReportTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(statusReportTypes);
		}
	});
};

/**
 * Status report type middleware
 */
exports.statusReportTypeByID = function(req, res, next, id) {

    var StatusReportType = mongoose.mtModel(req.user.tenantId + '.' + 'StatusReportType');

    StatusReportType.findById(id).populate('user', 'displayName').exec(function(err, statusReportType) {
		if (err) return next(err);
		if (! statusReportType) return next(new Error('Failed to load Status report type ' + id));
		req.statusReportType = statusReportType ;
		next();
	});
};

/**
 * Status report type authorization middleware
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
