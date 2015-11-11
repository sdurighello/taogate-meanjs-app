'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Financial benefit
 */
exports.create = function(req, res) {
	var FinancialBenefit = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefit');
	var financialBenefit = new FinancialBenefit(req.body);
	financialBenefit.user = req.user;

	financialBenefit.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialBenefit);
		}
	});
};

/**
 * Show the current Financial benefit
 */
exports.read = function(req, res) {
	res.jsonp(req.financialBenefit);
};

/**
 * Update a Financial benefit
 */
exports.update = function(req, res) {
	var financialBenefit = req.financialBenefit ;
    financialBenefit.user = req.user;
    financialBenefit.created = Date.now();
	financialBenefit = _.extend(financialBenefit , req.body);

	financialBenefit.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialBenefit);
		}
	});
};

/**
 * Delete an Financial benefit
 */
exports.delete = function(req, res) {
    var financialBenefit = req.financialBenefit ;
    var FinancialBenefitGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefitGroup');

    async.series([
        function(callback){
            // Delete benefit from its collection
            financialBenefit.remove();
            callback(null, 'one');
        },
        function(callback){
            // Delete benefit from groups where assigned
            FinancialBenefitGroup.find({benefits: {$in: [financialBenefit._id]}}).exec(function(err, groups){
                async.each(groups, function(item, callback){
                    item.benefits.splice(item.benefits.indexOf(financialBenefit._id), 1);
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
            res.jsonp(financialBenefit);
        }
    });
};

/**
 * List of Financial benefits
 */
exports.list = function(req, res) {
    var FinancialBenefit = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefit');
	FinancialBenefit.find().sort('-created').populate('user', 'displayName').exec(function(err, financialBenefits) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(financialBenefits);
		}
	});
};

/**
 * Financial benefit middleware
 */
exports.financialBenefitByID = function(req, res, next, id) {
    var FinancialBenefit = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefit');
	FinancialBenefit.findById(id).populate('user', 'displayName').exec(function(err, financialBenefit) {
		if (err) return next(err);
		if (! financialBenefit) return next(new Error('Failed to load Financial benefit ' + id));
		req.financialBenefit = financialBenefit ;
		next();
	});
};

/**
 * Financial benefit authorization middleware
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
