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
    var FinancialCostType = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCostType');
    var financialCostGroup = req.financialCostGroup ;

    async.series([
        // COST-GROUPS: Delete group from its collection
        function(callback){
            financialCostGroup.remove(function(err){
                callback(err);
            });
        },
        // GROUP.COST-TYPES: Delete all costs (from "costs" collection) belonging to this cost Group
        function(callback){
            async.each(financialCostGroup.costTypes, function(item, callback){
                FinancialCostType.findById(item._id).exec(function(err, costType){
                    if (err) {
                        callback(err);
                    } else {
                        costType.remove(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    }
                });
            });
            callback(null);
        }
    ],function(err){
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
	FinancialCostGroup.find().deepPopulate(['costTypes']).populate('user', 'displayName').exec(function(err, financialCostGroups) {
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
	FinancialCostGroup.findById(id).deepPopulate(['costTypes']).populate('user', 'displayName').exec(function(err, financialCostGroup) {
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
