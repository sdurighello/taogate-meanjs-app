'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');


exports.financialProfile = function(req, res){

    var FinancialBenefit = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefit');
    var FinancialCost = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCost');
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    async.waterfall([
        // Get Benefits and Costs for the project
        function(callback) {
            async.series([
                function(callback){
                    FinancialBenefit.find({_id : {$in: req.project.benefits}}).exec(function(err, benefits) {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, benefits);
                    });
                },
                function(callback){
                    FinancialCost.find({_id : {$in: req.project.costs}}).exec(function(err, costs) {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, costs);
                    });
                }
            ], function(err, financialData){
                // financialData = [ [benefits], [costs] ]
                if(err){
                    callback(err);
                } else {
                    callback(null, financialData);
                }
            });
        },
        // Create yearly aggregation
        function(financialData, callback) {
            var aggregatedBenefits = _.chain(financialData[0])
                .sortBy('year')
                .groupBy('year')// {'2015' : [{benefit}, ..], '2016' : [{benefit}, ..]}
                .map(function(v, k){
                    return {
                        year : k,
                        yearlyBenefit : _.reduce(v, function(sum, benefit){
                            return sum + benefit.amount;
                        }, 0),
                        yearlyCost : 0
                    };
                })
                .value();

            var aggregatedCosts = _.chain(financialData[1])
                .sortBy('year')
                .groupBy('year')// {'2015' : [{benefit}, ..], '2016' : [{benefit}, ..]}
                .map(function(v, k){
                    return {
                        year : k,
                        yearlyCost : _.reduce(v, function(sum, benefit){
                            return sum + benefit.amount;
                        }, 0),
                        yearlyBenefit : 0
                    };
                })
                .value();

            var combinedFinancialDataToBeReduced = []; // [ {year, yearlyBenefit}, {year, yearlyCost} ]
            _.each(aggregatedBenefits, function(obj){
                combinedFinancialDataToBeReduced.push(obj);
            });
            _.each(aggregatedCosts, function(obj){
                combinedFinancialDataToBeReduced.push(obj);
            });

            var combinedFinancialData = _.chain(combinedFinancialDataToBeReduced)
                .sortBy('year')
                .groupBy('year')// {'2015' : [{aggBenefit}, {aggCost}], '2016' : [...]}
                .map(function(v, k){
                    var yearlyBenefit = _.reduce(v, function(sum, item){
                        return sum + item.yearlyBenefit;
                    }, 0);
                    var yearlyCost = _.reduce(v, function(sum, item){
                        return sum + item.yearlyCost;
                    }, 0);
                    var yearlyNet = yearlyBenefit - yearlyCost;
                    return {
                        year : k,
                        yearlyBenefit : yearlyBenefit,
                        yearlyCost : yearlyCost,
                        yearlyNet : yearlyNet
                    };
                })
                .value();

            // Discounting
            if(!req.project.baseYear){
                return callback(new Error({message : 'Missing base year'}));
            }
            if(!req.project.discountRate){
                return callback(new Error({message : 'Missing discount rate'}));
            }
            if(!combinedFinancialData.length){
                return callback(new Error({message : 'No financial data'}));
            }
            var baseYear = req.project.baseYear;
            var discountRate = req.project.discountRate;

            _.each(combinedFinancialData, function(yearlyItem){
                var n = yearlyItem.year - baseYear;
                yearlyItem.yearlyBenefitDiscounted = yearlyItem.yearlyBenefit * (1 / Math.pow(1 + (discountRate/100), n));
                yearlyItem.yearlyCostDiscounted = yearlyItem.yearlyCost * (1 / Math.pow(1 + (discountRate/100), n));
                yearlyItem.yearlyNetDiscounted = yearlyItem.yearlyBenefitDiscounted - yearlyItem.yearlyCostDiscounted;
            });

            callback(null, combinedFinancialData);
        }
    ], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(result);
        }
    });


};



/**
 * Definition dashboard authorization middleware
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
