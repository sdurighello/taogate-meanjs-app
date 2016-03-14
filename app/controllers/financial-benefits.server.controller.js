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
	var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
	var FinancialBenefit = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefit');
	var financialBenefit = new FinancialBenefit(req.body);
	financialBenefit.user = req.user;

    async.series([
        // FINANCIAL BENEFIT: Save the new benefit to its collection
        function(callback){
            financialBenefit.save(function(err){
                callback(err);
            });
        },
        // PROJECT.BENEFITS: Add the benefit to the project's "benefits" array
        function(callback){
            Project.findById(req.query.projectId).exec(function(err, project){
                if(err){
                    callback(err);
                } else {
                    project.benefits.push(financialBenefit._id);
                    project.save(function(err){
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
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
	var financialBenefit = req.financialBenefit ;

    async.series([
        // BENEFITS: Delete the financial benefit
        function(callback){
            financialBenefit.remove(function(err){
                callback(err);
            });
        },
        // PROJECT.BENEFITS: Delete benefit from project's benefits array
        function(callback){
            Project.findById(req.query.projectId).exec(function(err, project){
                if(err){
                    callback(err);
                } else {
                    project.benefits.splice(project.benefits.indexOf(financialBenefit._id), 1);
                    project.save(function(err){
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
            res.jsonp(financialBenefit);
        }
    });
};

/**
 * List of Financial benefits
 */
exports.list = function(req, res) {
    var FinancialBenefit = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefit');
	FinancialBenefit.find().sort('year').populate('user', 'displayName').exec(function(err, financialBenefits) {
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

    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    var authArray = [];

    async.waterfall([
        // Set flag if "project manager" or "backup project manager" of this project
        function(callback) {
            Project.findById(req.query.projectId).exec(function(err, project){
                if(err){
                    callback(err);
                } else {
                    authArray.push(!!project.projectManager && project.projectManager.equals(req.user._id));
                    authArray.push(!!project.backupProjectManager && project.backupProjectManager.equals(req.user._id));
                    callback(null, project);
                }
            });
        },
        function(project, callback) {
            // Set flag if "portfolio manager" or "backup portfolio manager" of the project's portfolio
            if(project.portfolio){
                Portfolio.findById(project.portfolio).exec(function(err, portfolio) {
                    if(err){
                        return callback(err);
                    }
                    authArray.push(!!portfolio.portfolioManager && portfolio.portfolioManager.equals(req.user._id));
                    authArray.push(!!portfolio.backupPortfolioManager && portfolio.backupPortfolioManager.equals(req.user._id));
                    callback(null);
                });
            } else {
                callback(null);
            }
        },
        // Set flag if user role is "super-hero"
        function(callback) {
            authArray.push(!!_.find(req.user.roles, function(role){
                return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
            }));
            callback(null);
        }
    ], function (err) {
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if(
            !_.some(authArray, function(elem){
                return elem === true;
            })
        ){
            return res.status(403).send({
                message: 'User is not authorized'
            });
        }
        next();
    });
};
