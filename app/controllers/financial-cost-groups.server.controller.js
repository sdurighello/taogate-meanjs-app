'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Financial cost group
 */
exports.create = function(req, res) {
	var FinancialCostGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCostGroup');
	var financialCostGroup = new FinancialCostGroup(req.body);
	financialCostGroup.user = req.user;

	financialCostGroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialCostGroup);
		}
	});
};

/**
 * Show the current Financial cost group
 */
exports.read = function(req, res) {
	res.jsonp(req.financialCostGroup);
};

/**
 * Update a Financial cost group
 */
exports.update = function(req, res) {
	var financialCostGroup = req.financialCostGroup ;
    financialCostGroup.user = req.user;
    financialCostGroup.created = Date.now();
	financialCostGroup = _.extend(financialCostGroup , req.body);

	financialCostGroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialCostGroup);
		}
	});
};

/**
 * Delete an Financial cost group
 */
exports.delete = function(req, res) {
    var FinancialCostGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCostGroup');
    var FinancialCost = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCost');
    var financialCostGroup = req.financialCostGroup ;

    async.series([
        function(callback){
            // Delete all costs (from "costs" collection) belonging to this cost Group
            async.each(financialCostGroup.costs, function(item, callback){
                FinancialCost.findById(item._id).exec(function(err, cost){
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        cost.remove();
                    }
                });
                callback();
            });
            callback(null, 'one');
        },
        function(callback){
            // Delete Group from its collection
            financialCostGroup.remove();
            callback(null, 'two');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(financialCostGroup);
        }
    });
};

/**
 * List of Financial cost groups
 */
exports.list = function(req, res) {
    var FinancialCostGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCostGroup');
	FinancialCostGroup.find().sort('-created').deepPopulate(['costs']).populate('user', 'displayName').exec(function(err, financialCostGroups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialCostGroups);
		}
	});
};

/**
 * Financial cost group middleware
 */
exports.financialCostGroupByID = function(req, res, next, id) {
    var FinancialCostGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCostGroup');
	FinancialCostGroup.findById(id).deepPopulate(['costs']).populate('user', 'displayName').exec(function(err, financialCostGroup) {
		if (err) return next(err);
		if (! financialCostGroup) return next(new Error('Failed to load Financial cost group ' + id));
		req.financialCostGroup = financialCostGroup ;
		next();
	});
};

/**
 * Financial cost group authorization middleware
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
