'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Financial cost
 */
exports.create = function(req, res) {
	var FinancialCost = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCost');
	var financialCost = new FinancialCost(req.body);
	financialCost.user = req.user;

	financialCost.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialCost);
		}
	});
};

/**
 * Show the current Financial cost
 */
exports.read = function(req, res) {
	res.jsonp(req.financialCost);
};

/**
 * Update a Financial cost
 */
exports.update = function(req, res) {
	var financialCost = req.financialCost ;
    financialCost.user = req.user;
	financialCost = _.extend(financialCost , req.body);

	financialCost.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialCost);
		}
	});
};

/**
 * Delete an Financial cost
 */
exports.delete = function(req, res) {
    var financialCost = req.financialCost ;
    var FinancialCostGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCostGroup');

    async.series([
        function(callback){
            // Delete cost from its collection
            financialCost.remove();
            callback(null, 'one');
        },
        function(callback){
            // Delete cost from groups where assigned
            FinancialCostGroup.find({costs: {$in: [financialCost._id]}}).exec(function(err, groups){
                async.each(groups, function(item, callback){
                    item.costs.splice(item.costs.indexOf(financialCost._id), 1);
                    item.save();
                    callback();
                });
            });
            callback(null, 'three');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(financialCost);
        }
    });
};

/**
 * List of Financial costs
 */
exports.list = function(req, res) {
    var FinancialCost = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCost');
	FinancialCost.find().sort('-created').populate('user', 'displayName').exec(function(err, financialCosts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialCosts);
		}
	});
};

/**
 * Financial cost middleware
 */
exports.financialCostByID = function(req, res, next, id) {
    var FinancialCost = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCost');
	FinancialCost.findById(id).populate('user', 'displayName').exec(function(err, financialCost) {
		if (err) return next(err);
		if (! financialCost) return next(new Error('Failed to load Financial cost ' + id));
		req.financialCost = financialCost ;
		next();
	});
};

/**
 * Financial cost authorization middleware
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
