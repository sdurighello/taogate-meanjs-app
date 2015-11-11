'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Gate status
 */
exports.create = function(req, res) {
	var GateStatus = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatus');
	var gateStatus = new GateStatus(req.body);
	gateStatus.user = req.user;

	gateStatus.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateStatus);
		}
	});
};

/**
 * Show the current Gate status
 */
exports.read = function(req, res) {
	res.jsonp(req.gateStatus);
};

/**
 * Update a Gate status
 */
exports.update = function(req, res) {
	var gateStatus = req.gateStatus ;
	gateStatus.user = req.user;
    gateStatus.created = Date.now();
	gateStatus = _.extend(gateStatus , req.body);

	gateStatus.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateStatus);
		}
	});
};

/**
 * Delete an Gate status
 */
exports.delete = function(req, res) {
	var gateStatus = req.gateStatus ;

	gateStatus.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateStatus);
		}
	});
};

/**
 * List of Gate statuses
 */
exports.list = function(req, res) {
	var GateStatus = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatus');
	GateStatus.find().sort('-created').populate('user', 'displayName').exec(function(err, gateStatuses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateStatuses);
		}
	});
};

/**
 * Gate status middleware
 */
exports.gateStatusByID = function(req, res, next, id) {
	var GateStatus = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatus');
	GateStatus.findById(id).populate('user', 'displayName').exec(function(err, gateStatus) {
		if (err) return next(err);
		if (! gateStatus) return next(new Error('Failed to load Gate status ' + id));
		req.gateStatus = gateStatus ;
		next();
	});
};

/**
 * Gate status authorization middleware
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
