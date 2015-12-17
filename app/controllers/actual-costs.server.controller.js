'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Actual cost
 */
exports.create = function(req, res) {
	var ActualCost = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCost');
	var actualCost = new ActualCost(req.body);

	actualCost.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualCost);
		}
	});
};

/**
 * Show the current Actual cost
 */
exports.read = function(req, res) {
	res.jsonp(req.actualCost);
};

/**
 * Update a Actual cost
 */
exports.update = function(req, res) {
	var actualCost = req.actualCost ;

	actualCost = _.extend(actualCost , req.body);

	actualCost.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualCost);
		}
	});
};

/**
 * Delete an Actual cost
 */
exports.delete = function(req, res) {
	var actualCost = req.actualCost ;

	actualCost.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualCost);
		}
	});
};

/**
 * List of Actual costs
 */
exports.list = function(req, res) {
    var ActualCost = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCost');

	var queryObject = {};
	var deepPopulateArray = [];

	if(req.query.queryObject){
		queryObject = req.query.queryObject;
	}
	if(req.query.deepPopulateArray){
		deepPopulateArray = req.query.deepPopulateArray;
	}

	ActualCost.find(queryObject).deepPopulate(deepPopulateArray).populate('user', 'displayName').exec(function(err, actualCosts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(actualCosts);
		}
	});
};

/**
 * Actual cost middleware
 */
exports.actualCostByID = function(req, res, next, id) {
    var ActualCost = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCost');
	ActualCost.findById(id).populate('user', 'displayName').exec(function(err, actualCost) {
		if (err) return next(err);
		if (! actualCost) return next(new Error('Failed to load Actual cost ' + id));
		req.actualCost = actualCost ;
		next();
	});
};

/**
 * Actual cost authorization middleware
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
