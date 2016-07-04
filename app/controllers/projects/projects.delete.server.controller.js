'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


/**
 * Delete an Project
 */
exports.delete = function(req, res) {
    var project = req.project ;
    var PortfolioRanking = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioRanking');
    var FinancialCost = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCost');
    var FinancialBenefit = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefit');

    async.series([
        // PROJECT: Delete project in its collection
        function(callback){
            project.remove(function(err){
                callback(err);
            });
        },
        // PORTFOLIO RANKINGS: Delete project from the "projects" array if project assigned to a portfolio
        function(callback){
            if(project.portfolio){ // IF to check that it is assigned to a portfolio otherwise this field id null
                PortfolioRanking.findOne({portfolio: project.portfolio}).exec(function(err, portfolioRanking){
                    if(err){
                        callback(err);
                    } else {
                        portfolioRanking.projects.splice(portfolioRanking.projects.indexOf(project._id), 1);
                        portfolioRanking.save(function(err){
                            if(err){callback(err);}
                        });
                    }
                });
            }
            callback(null);
        },
        // FINANCIAL COSTS: Delete all costs belonging to the project
        function(callback){
            async.each(project.costs, function(item, callback){
                FinancialCost.findByIdAndRemove(item, function(err){
                    if(err){callback(err);} else {callback();}
                });
            });
            callback(null);
        },
        // FINANCIAL BENEFITS: Delete all benefits belonging to the project
        function(callback){
            async.each(project.benefits, function(item, callback){
                FinancialBenefit.findByIdAndRemove(item, function(err){
                    if(err){callback(err);} else {callback();}
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
            res.jsonp(project);
        }
    });
};
