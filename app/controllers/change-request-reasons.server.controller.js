'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Change request reason
 */
exports.create = function(req, res) {
	var ChangeRequestReason = mongoose.mtModel(req.user.tenantId + '.' + 'ChangeRequestReason');
	var changeRequestReason = new ChangeRequestReason(req.body);
	changeRequestReason.user = req.user;

	changeRequestReason.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(changeRequestReason);
		}
	});
};

/**
 * Show the current Change request reason
 */
exports.read = function(req, res) {
	res.jsonp(req.changeRequestReason);
};

/**
 * Update a Change request reason
 */
exports.update = function(req, res) {
	var changeRequestReason = req.changeRequestReason ;
    changeRequestReason.user = req.user;
    changeRequestReason.created = Date.now();
    changeRequestReason = _.extend(changeRequestReason , req.body);

	changeRequestReason.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(changeRequestReason);
		}
	});
};

/**
 * Delete an Change request reason
 */
exports.delete = function(req, res) {
	var changeRequestReason = req.changeRequestReason ;

	changeRequestReason.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(changeRequestReason);
		}
	});
};

/**
 * List of Change request reasons
 */
exports.list = function(req, res) {
    var ChangeRequestReason = mongoose.mtModel(req.user.tenantId + '.' + 'ChangeRequestReason');
	ChangeRequestReason.find().sort('-created').populate('user', 'displayName').exec(function(err, changeRequestReasons) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(changeRequestReasons);
		}
	});
};

/**
 * Change request reason middleware
 */
exports.changeRequestReasonByID = function(req, res, next, id) {
    var ChangeRequestReason = mongoose.mtModel(req.user.tenantId + '.' + 'ChangeRequestReason');
	ChangeRequestReason.findById(id).populate('user', 'displayName').exec(function(err, changeRequestReason) {
		if (err) return next(err);
		if (! changeRequestReason) return next(new Error('Failed to load Change request reason ' + id));
		req.changeRequestReason = changeRequestReason ;
		next();
	});
};

/**
 * Change request reason authorization middleware
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
