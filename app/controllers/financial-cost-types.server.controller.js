'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Financial cost type
 */
exports.create = function(req, res) {
    var FinancialCostGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCostGroup');
	var FinancialCostType = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCostType');
	var financialCostType = new FinancialCostType(req.body);
	financialCostType.user = req.user;

    async.series([
        // FINANCIAL COST TYPES: Save the new type to its collection
        function(callback){
            financialCostType.save(function(err){
                callback(err);
            });
        },
        // GROUP.COST-TYPES: Add the type to the group's "costTypes" array
        function(callback){
            FinancialCostGroup.findById(req.query.groupId).exec(function(err, group){
                if(err){
                    callback(err);
                } else {
                    group.costTypes.push(financialCostType._id);
                    group.save(function(err){
                        callback(err);
                    });
                }
            });
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(financialCostType);
        }
    });
};

/**
 * Show the current Financial cost type
 */
exports.read = function(req, res) {
	res.jsonp(req.financialCostType);
};

/**
 * Update a Financial cost type
 */
exports.update = function(req, res) {
	var financialCostType = req.financialCostType ;
    financialCostType.user = req.user;
    financialCostType.created = Date.now();
	financialCostType = _.extend(financialCostType , req.body);

	financialCostType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialCostType);
		}
	});
};

/**
 * Delete an Financial cost type
 */
exports.delete = function(req, res) {
	var financialCostType = req.financialCostType ;
    var FinancialCostGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCostGroup');

    async.series([
        // COST-TYPES: Delete cost-type from its collection
        function(callback){
            financialCostType.remove(function(err){
                callback(err);
            });
        },
        // GROUP.COST-TYPES: Delete type from group where assigned
        function(callback){
            FinancialCostGroup.findById(req.query.groupId).exec(function(err, group){
                if(err){
                    callback(err);
                } else {
                    group.costTypes.splice(group.costTypes.indexOf(financialCostType._id), 1);
                    group.save(function(err){
                        callback(err);
                    });
                }
            });
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(financialCostType);
        }
    });
};

/**
 * List of Financial cost types
 */
exports.list = function(req, res) {
    var FinancialCostType = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCostType');
	FinancialCostType.find().populate('user', 'displayName').exec(function(err, financialCostTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialCostTypes);
		}
	});
};

/**
 * Financial cost type middleware
 */
exports.financialCostTypeByID = function(req, res, next, id) {
    var FinancialCostType = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCostType');
	FinancialCostType.findById(id).populate('user', 'displayName').exec(function(err, financialCostType) {
		if (err) return next(err);
		if (! financialCostType) return next(new Error('Failed to load Financial cost type ' + id));
		req.financialCostType = financialCostType ;
		next();
	});
};

/**
 * Financial cost type authorization middleware
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
