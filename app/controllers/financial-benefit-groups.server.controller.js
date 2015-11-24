'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Financial benefit group
 */
exports.create = function(req, res) {
	var FinancialBenefitGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefitGroup');
	var financialBenefitGroup = new FinancialBenefitGroup(req.body);
	financialBenefitGroup.user = req.user;

	financialBenefitGroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialBenefitGroup);
		}
	});
};

/**
 * Show the current Financial benefit group
 */
exports.read = function(req, res) {
	res.jsonp(req.financialBenefitGroup);
};

/**
 * Update a Financial benefit group
 */
exports.update = function(req, res) {
	var financialBenefitGroup = req.financialBenefitGroup ;
    financialBenefitGroup.user = req.user;
    financialBenefitGroup.created = Date.now();
	financialBenefitGroup = _.extend(financialBenefitGroup , req.body);

	financialBenefitGroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialBenefitGroup);
		}
	});
};

/**
 * Delete an Financial benefit group
 */
exports.delete = function(req, res) {
    var FinancialBenefitGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefitGroup');
    var FinancialBenefitType = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefitType');
    var financialBenefitGroup = req.financialBenefitGroup ;

    async.series([
        function(callback){
            // Delete all benefits (from "benefits" collection) belonging to this benefit Group
            async.each(financialBenefitGroup.benefitTypes, function(item, callback){
                FinancialBenefitType.findById(item._id).exec(function(err, benefitType){
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        benefitType.remove();
                    }
                });
                callback();
            });
            callback(null, 'one');
        },
        function(callback){
            // Delete Group from its collection
            financialBenefitGroup.remove();
            callback(null, 'two');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(financialBenefitGroup);
        }
    });
};

/**
 * List of Financial benefit groups
 */
exports.list = function(req, res) {
    var FinancialBenefitGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefitGroup');
	FinancialBenefitGroup.find().sort('-created').deepPopulate(['benefitTypes']).populate('user', 'displayName').exec(function(err, financialBenefitGroups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialBenefitGroups);
		}
	});
};

/**
 * Financial benefit group middleware
 */
exports.financialBenefitGroupByID = function(req, res, next, id) {
    var FinancialBenefitGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefitGroup');
	FinancialBenefitGroup.findById(id).deepPopulate(['benefitTypes']).populate('user', 'displayName').exec(function(err, financialBenefitGroup) {
		if (err) return next(err);
		if (! financialBenefitGroup) return next(new Error('Failed to load Financial benefit group ' + id));
		req.financialBenefitGroup = financialBenefitGroup ;
		next();
	});
};

/**
 * Financial benefit group authorization middleware
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
