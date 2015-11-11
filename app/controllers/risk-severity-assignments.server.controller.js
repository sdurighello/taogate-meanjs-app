'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Risk severity assignment
 */
exports.create = function(req, res) {
	var RiskSeverityAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverityAssignment');
	var riskSeverityAssignment = new RiskSeverityAssignment(req.body);
	riskSeverityAssignment.user = req.user;

	riskSeverityAssignment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskSeverityAssignment);
		}
	});
};

/**
 * Show the current Risk severity assignment
 */
exports.read = function(req, res) {
	res.jsonp(req.riskSeverityAssignment);
};

/**
 * Update a Risk severity assignment
 */
exports.update = function(req, res) {
	var riskSeverityAssignment = req.riskSeverityAssignment ;
    riskSeverityAssignment.user = req.user;
    riskSeverityAssignment.created = Date.now();
	riskSeverityAssignment = _.extend(riskSeverityAssignment , req.body);

	riskSeverityAssignment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskSeverityAssignment);
		}
	});
};

/**
 * Delete an Risk severity assignment
 */
exports.delete = function(req, res) {
	var riskSeverityAssignment = req.riskSeverityAssignment ;

	riskSeverityAssignment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskSeverityAssignment);
		}
	});
};

/**
 * List of Risk severity assignments
 */
exports.list = function(req, res) {
	var RiskSeverityAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverityAssignment');
	RiskSeverityAssignment.find().deepPopulate([
        'impact', 'riskCombinations.probability','riskCombinations.severity'
    ]).populate('user', 'displayName').exec(function(err, riskSeverityAssignments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskSeverityAssignments);
		}
	});
};

/**
 * Risk severity assignment middleware
 */
exports.riskSeverityAssignmentByID = function(req, res, next, id) {
	var RiskSeverityAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverityAssignment');
	RiskSeverityAssignment.findById(id).deepPopulate([
        'impact', 'riskCombinations.probability','riskCombinations.severity'
    ]).populate('user', 'displayName').exec(function(err, riskSeverityAssignment) {
		if (err) return next(err);
		if (! riskSeverityAssignment) return next(new Error('Failed to load Risk severity assignment ' + id));
		req.riskSeverityAssignment = riskSeverityAssignment ;
		next();
	});
};

/**
 * Risk severity assignment authorization middleware
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
