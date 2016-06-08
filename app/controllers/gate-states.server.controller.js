'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Gate state
 */
exports.create = function(req, res) {
	var GateState = mongoose.mtModel(req.user.tenantId + '.' + 'GateState');
	var gateState = new GateState(req.body);
	gateState.user = req.user;

	gateState.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateState);
		}
	});
};

/**
 * Show the current Gate State
 */
exports.read = function(req, res) {
	res.jsonp(req.gateState);
};

/**
 * Update a Gate State
 */
exports.update = function(req, res) {
	var gateState = req.gateState ;
	gateState.user = req.user;
    gateState.created = Date.now();
	gateState = _.extend(gateState , req.body);

	gateState.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateState);
		}
	});
};

/**
 * Delete an Gate State
 */
exports.delete = function(req, res) {
	var gateState = req.gateState ;

	gateState.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateState);
		}
	});
};

/**
 * List of Gate States
 */
exports.list = function(req, res) {
	var GateState = mongoose.mtModel(req.user.tenantId + '.' + 'GateState');
	GateState.find().populate('user', 'displayName').exec(function(err, gateStates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateStates);
		}
	});
};

/**
 * Gate State middleware
 */
exports.gateStateByID = function(req, res, next, id) {
	var GateState = mongoose.mtModel(req.user.tenantId + '.' + 'GateState');
	GateState.findById(id).populate('user', 'displayName').exec(function(err, gateState) {
		if (err) return next(err);
		if (! gateState) return next(new Error('Failed to load Gate State ' + id));
		req.gateState = gateState ;
		next();
	});
};

/**
 * Gate State authorization middleware
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
