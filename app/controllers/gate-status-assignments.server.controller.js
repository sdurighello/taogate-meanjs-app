'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Gate status assignment
 */
exports.create = function(req, res) {
	var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');
	var gateStatusAssignment = new GateStatusAssignment(req.body);

	gateStatusAssignment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateStatusAssignment);
		}
	});
};

/**
 * Show the current Gate status assignment
 */
exports.read = function(req, res) {
	res.jsonp(req.gateStatusAssignment);
};

/**
 * Update a Gate status assignment
 */
exports.update = function(req, res) {
	var gateStatusAssignment = req.gateStatusAssignment ;

	gateStatusAssignment = _.extend(gateStatusAssignment , req.body);

	gateStatusAssignment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateStatusAssignment);
		}
	});
};

/**
 * Delete an Gate status assignment
 */
exports.delete = function(req, res) {
	var gateStatusAssignment = req.gateStatusAssignment ;

	gateStatusAssignment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateStatusAssignment);
		}
	});
};

/**
 * List of Gate status assignments
 */
exports.list = function(req, res) {
    var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');
    GateStatusAssignment.find().populate('user', 'displayName').exec(function(err, gateStatusAssignments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateStatusAssignments);
		}
	});
};

/**
 * Gate status assignment middleware
 */
exports.gateStatusAssignmentByID = function(req, res, next, id) {
    var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');
    GateStatusAssignment.findById(id).populate('user', 'displayName').exec(function(err, gateStatusAssignment) {
		if (err) return next(err);
		if (! gateStatusAssignment) return next(new Error('Failed to load Gate status assignment ' + id));
		req.gateStatusAssignment = gateStatusAssignment ;
		next();
	});
};

/**
 * Gate status assignment authorization middleware
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
