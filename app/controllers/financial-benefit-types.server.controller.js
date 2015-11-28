'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Financial benefit type
 */
exports.create = function(req, res) {
    var FinancialBenefitGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefitGroup');
    var FinancialBenefitType = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefitType');
	var financialBenefitType = new FinancialBenefitType(req.body);
	financialBenefitType.user = req.user;

    async.series([
        // FINANCIAL BENEFIT TYPES: Save the new type to its collection
        function(callback){
            financialBenefitType.save(function(err){
                callback(err);
            });
        },
        // GROUP.BENEFIT-TYPES: Add the type to the group's "benefitTypes" array
        function(callback){
            FinancialBenefitGroup.findById(req.query.groupId).exec(function(err, group){
                if(err){
                    callback(err);
                } else {
                    group.benefitTypes.push(financialBenefitType._id);
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
            res.jsonp(financialBenefitType);
        }
    });
};

/**
 * Show the current Financial benefit type
 */
exports.read = function(req, res) {
	res.jsonp(req.financialBenefitType);
};

/**
 * Update a Financial benefit type
 */
exports.update = function(req, res) {
	var financialBenefitType = req.financialBenefitType ;
    financialBenefitType.user = req.user;
    financialBenefitType.created = Date.now();
    financialBenefitType = _.extend(financialBenefitType , req.body);

	financialBenefitType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialBenefitType);
		}
	});
};

/**
 * Delete an Financial benefit type
 */
exports.delete = function(req, res) {
	var financialBenefitType = req.financialBenefitType ;
    var FinancialBenefitGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefitGroup');

    async.series([
        // BENEFIT-TYPES: Delete benefit type from its collection
        function(callback){
            financialBenefitType.remove(function(err){
                callback(err);
            });
        },
        // GROUP.BENEFIT-TYPES: Delete type from group where assigned
        function(callback){
            FinancialBenefitGroup.findById(req.query.groupId).exec(function(err, group){
                if(err){
                    callback(err);
                } else {
                    group.benefitTypes.splice(group.benefitTypes.indexOf(financialBenefitType._id), 1);
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
            res.jsonp(financialBenefitType);
        }
    });
};

/**
 * List of Financial benefit types
 */
exports.list = function(req, res) {
    var FinancialBenefitType = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefitType');
	FinancialBenefitType.find().populate('user', 'displayName').exec(function(err, financialBenefitTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialBenefitTypes);
		}
	});
};

/**
 * Financial benefit type middleware
 */
exports.financialBenefitTypeByID = function(req, res, next, id) {
    var FinancialBenefitType = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefitType');
	FinancialBenefitType.findById(id).populate('user', 'displayName').exec(function(err, financialBenefitType) {
		if (err) return next(err);
		if (! financialBenefitType) return next(new Error('Failed to load Financial benefit type ' + id));
		req.financialBenefitType = financialBenefitType ;
		next();
	});
};

/**
 * Financial benefit type authorization middleware
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
