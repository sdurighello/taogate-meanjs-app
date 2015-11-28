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
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
	var FinancialCost = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCost');
	var financialCost = new FinancialCost(req.body);
	financialCost.user = req.user;

    async.series([
        // FINANCIAL COST: Save the new cost to its collection
        function(callback){
            financialCost.save(function(err){
                callback(err);
            });
        },
        // PROJECT.COSTS: Add the cost to the project's "costs" array
        function(callback){
            Project.findById(req.query.projectId).exec(function(err, project){
                if(err){
                    callback(err);
                } else {
                    project.costs.push(financialCost._id);
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
    financialCost.created = Date.now();
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
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
	var financialCost = req.financialCost ;

    async.series([
        // COSTS: Delete cost from financial costs collection
        function(callback){
            financialCost.remove(function(err){
                callback(err);
            });
        },
        // PROJECT.COSTS: Delete cost from project's cost array
        function(callback){
            Project.findById(req.query.projectId).exec(function(err, project){
                if(err){
                    callback(err);
                } else {
                    project.costs.splice(project.costs.indexOf(financialCost._id), 1);
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
            res.jsonp(financialCost);
        }
    });
};

/**
 * List of Financial costs
 */
exports.list = function(req, res) {
    var FinancialCost = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCost');
	FinancialCost.find().sort('year').populate('user', 'displayName').exec(function(err, financialCosts) {
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
	FinancialCost.findById(id).deepPopulate(['group','type']).populate('user', 'displayName').exec(function(err, financialCost) {
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
