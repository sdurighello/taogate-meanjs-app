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
                return callback(new Error('Missing base year'));
            }
            if(!req.project.discountRate){
                return callback(new Error('Missing discount rate'));
            }
            if(!combinedFinancialData.length){
                return callback(new Error('No financial data'));
            }
            var baseYear = _.min(combinedFinancialData, function(yearlyItem) { return yearlyItem.year; }).year;
            var discountRate = req.project.discountRate;

            _.each(combinedFinancialData, function(yearlyItem){
                var n = yearlyItem.year - baseYear;
                yearlyItem.yearlyBenefitDiscounted = yearlyItem.yearlyBenefit * (1 / Math.pow(1 + (discountRate/100), n));
                yearlyItem.yearlyCostDiscounted = yearlyItem.yearlyCost * (1 / Math.pow(1 + (discountRate/100), n));
                yearlyItem.yearlyNetDiscounted = yearlyItem.yearlyBenefitDiscounted - yearlyItem.yearlyCostDiscounted;
            });

            var financialRatios = {
                totalCost : 0,
                totalCostDiscounted : 0,
                totalBenefit : 0,
                totalBenefitDiscounted : 0,
                totalNet : 0,
                totalNetDiscounted : 0, // NPV
                IRR : 0,
                benefitCostRatio : 0,
                paybackPeriod : 0
            };

            financialRatios.totalCost = _.reduce(combinedFinancialData, function(sum, yearItem){
                return sum + yearItem.yearlyCost;
            }, 0);
            financialRatios.totalCostDiscounted = _.reduce(combinedFinancialData, function(sum, yearItem){
                return sum + yearItem.yearlyCostDiscounted;
            }, 0);
            financialRatios.totalBenefit = _.reduce(combinedFinancialData, function(sum, yearItem){
                return sum + yearItem.yearlyBenefit;
            }, 0);
            financialRatios.totalBenefitDiscounted = _.reduce(combinedFinancialData, function(sum, yearItem){
                return sum + yearItem.yearlyBenefitDiscounted;
            }, 0);

            financialRatios.totalNet = _.reduce(combinedFinancialData, function(sum, yearItem){
                return sum + yearItem.yearlyNet;
            }, 0);
            financialRatios.totalNetDiscounted = _.reduce(combinedFinancialData, function(sum, yearItem){
                return sum + yearItem.yearlyNetDiscounted;
            }, 0);

            if(financialRatios.totalCostDiscounted !==0){
                financialRatios.benefitCostRatio = financialRatios.totalBenefitDiscounted / financialRatios.totalCostDiscounted;
            }

            var calculatePayback = function(paybackDataInput, paybackRatioInput){
                var paybackCounter = 0;
                var yearNet = 0;
                var cumulativeBenefits = 0;
                var cumulativeBenefitPrev = 0;
                for(var i = 0; i < paybackDataInput.length; i++){
                    paybackCounter++;
                    cumulativeBenefits = cumulativeBenefits + paybackDataInput[i].yearlyBenefitDiscounted;
                    if (cumulativeBenefits >= paybackRatioInput.totalBenefitDiscounted){
                        yearNet = paybackDataInput[i].yearlyNetDiscounted;
                        cumulativeBenefitPrev = cumulativeBenefits - paybackDataInput[i].yearlyBenefitDiscounted;
                        break;
                    }
                }
                return ((paybackCounter-1)+((paybackRatioInput.totalCostDiscounted-cumulativeBenefitPrev)/yearNet)).toFixed(1);
            };
            financialRatios.paybackPeriod = calculatePayback(combinedFinancialData, financialRatios);

            var calculateIRR = function(irrInputData){
                var min = 0.0;
                var max = 1.0;
                var guess = 0;
                var NPV = 0;
                var maxIterations = 100000;
                var iterationCounter = 0;
                do {
                    iterationCounter++;
                    if(iterationCounter === maxIterations){
                        guess = null;
                        return;
                    }
                    guess = (min + max) / 2;
                    NPV = 0;
                    for (var j=0; j<irrInputData.length; j++) {
                        NPV += irrInputData[j].yearlyNet/Math.pow((1+guess),j);
                    }
                    if (NPV > 0) {
                        min = guess;
                    }
                    else {
                        max = guess;
                    }
                } while(Math.abs(NPV) > 0.000001);

                return guess;
            };
            financialRatios.IRR = calculateIRR(combinedFinancialData);

            var result = {
                yearlyData : combinedFinancialData,
                financialRatios : financialRatios
            };

            callback(null, result);
        }
    ], function (err, result) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(result);
        }
    });


};

exports.qualitativeProfiles = function(req, res){

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    async.waterfall([
        function(callback) {
            Project.find({'selection.selectedForEvaluation':true}, {'portfolio':1, 'parent':1, 'identification.name':1, 'identification.earmarkedFunds':1, 'qualitativeAnalysis':1}).deepPopulate([
                'qualitativeAnalysis.group', 'qualitativeAnalysis.impacts.impact', 'qualitativeAnalysis.impacts.score', 'portfolio','parent'
            ]).exec(function (err, projects) {
                if (err) {
                    return callback(err);
                }
                callback(null, projects);
            });
        },
        function(projects, callback) {
            var projectProfiles = [];

            _.each(projects, function(project){
                var profile = {
                    projectId : project._id,
                    projectName : project.identification.name,
                    earmarkedFunds : project.identification.earmarkedFunds,
                    portfolio : project.portfolio,
                    parent : project.parent,
                    qualitativeScore : 0,
                    qualitativeAnalysis : []
                };
                _.each(project.qualitativeAnalysis, function(groupObj){
                    var profileGroupObj = {
                        groupId : groupObj.group._id,
                        groupName : groupObj.group.name,
                        groupWeight : groupObj.group.weight,
                        sumImpactScores : 0,
                        weightedScore : 0,
                        impacts : []
                    };
                    _.each(groupObj.impacts, function(impactObj){
                        var profileImpactObj = {
                            impactId : impactObj.impact._id,
                            impactName : impactObj.impact.name,
                            impactWeight : impactObj.impact.weight,
                            score : impactObj.score,
                            weightedScore : impactObj.score.numericalValue * (impactObj.impact.weight/100)
                        };
                        profileGroupObj.impacts.push(profileImpactObj);
                        profileGroupObj.sumImpactScores = profileGroupObj.sumImpactScores + profileImpactObj.weightedScore;
                    });
                    profileGroupObj.weightedScore = profileGroupObj.sumImpactScores * (profileGroupObj.groupWeight/100);
                    profile.qualitativeAnalysis.push(profileGroupObj);
                    profile.qualitativeScore = profile.qualitativeScore + profileGroupObj.weightedScore;
                });
                projectProfiles.push(profile);
            });

            var portfolioProfiles = _.chain(projectProfiles)
                .groupBy(function(profile){
                    if(profile.portfolio){
                        return profile.portfolio._id;
                    }
                    return 'unassigned';
                })// {'2015' : [{aggBenefit}, {aggCost}], '2016' : [...]}
                .map(function(v, k){
                    var portfolioScore = _.reduce(v, function(sum, item){
                        return sum + item.qualitativeScore;
                    }, 0);
                    return {
                        portfolio : v[0].portfolio, // since they all the projectProfiles have the same 'portfolio' , I just pick the first
                        portfolioScore : portfolioScore
                    };
                })
                .value();

            var strategyProfiles = _.chain(projectProfiles)
                .groupBy(function(profile){
                    if(profile.parent){
                        return profile.parent._id;
                    }
                    return 'unassigned';
                })// {'2015' : [{aggBenefit}, {aggCost}], '2016' : [...]}
                .map(function(v, k){
                    var parentScore = _.reduce(v, function(sum, item){
                        return sum + item.qualitativeScore;
                    }, 0);
                    return {
                        parent : v[0].parent,
                        parentScore : parentScore
                    };
                })
                .value();

            var result = {
                projectProfiles : projectProfiles,
                portfolioProfiles : portfolioProfiles,
                strategyProfiles : strategyProfiles
            };

            callback(null, result);
        }
    ], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(result);
            /* Result = { projectProfiles : [ ], portfolioProfiles : [ ], strategyProfiles : [ ] }
             * projectProfile = { projectId, projectName, parent, portfolio, earmarkedFunds, score, qualitativeAnalysis : [ ] }
             *                  qualitativeAnalysisObj = { groupId, groupName, groupWeight, sumImpactScores, weightedScore, impacts : [ ] }
             * portfolioProfile = { portfolio : { }, portfolioScore }
             * strategyProfile = { parent : { }, parentScore }
             */
        }
    });

};

exports.qualitativeSummary = function(req, res){

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var PortfolioRanking = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioRanking');
    var OverallRanking = mongoose.mtModel(req.user.tenantId + '.' + 'OverallRanking');

    async.waterfall([
        // Get all the projects
        function(callback) {
            Project.find({'selection.selectedForEvaluation':true}, {'portfolio':1, 'parent':1, 'identification.name':1, 'identification.earmarkedFunds':1, 'qualitativeAnalysis':1}).deepPopulate([
                'qualitativeAnalysis.group', 'qualitativeAnalysis.impacts.impact', 'qualitativeAnalysis.impacts.score', 'portfolio','parent'
            ]).exec(function (err, projects) {
                if (err) {
                    return callback(err);
                }
                callback(null, projects);
            });
        },
        // For each project, get its ranking (portfolio and overall)
        function(projects, callback){
            var projectsWithRankings = [];
            async.eachSeries(projects, function(project, callbackEach) {
                async.series([
                    // Add portfolio ranking
                    function(callback) {
                        if(project.portfolio){
                            PortfolioRanking.findOne({portfolio : project.portfolio._id}).exec(function (err, rankingObj) {
                                if (err) {
                                    return callback(err);
                                }
                                var projectRanking = _.findIndex(rankingObj.projects, function(p){
                                        return p.equals(project._id);
                                    }) + 1;
                                if(projectRanking){
                                    project.portfolioRanking = projectRanking;
                                } else {
                                    project.portfolioRanking = null;
                                }
                                callback(null);
                            });
                        } else {
                            project.portfolioRanking = null;
                            callback(null);
                        }
                    },
                    // Add overall ranking
                    function(callback) {
                        OverallRanking.find().exec(function (err, rankingArray) {
                            var rankingObj = rankingArray[0];
                            if (err) {
                                return callback(err);
                            }
                            var projectRanking = _.findIndex(rankingObj.projects, function(p){
                                    return p.equals(project._id);
                                }) + 1;
                            if(projectRanking){
                                project.overallRanking = projectRanking;
                            } else {
                                project.overallRanking = null;
                            }
                            callback(null);
                        });
                    }
                ], function (err, result) {
                    if(err){
                        return callbackEach(err);
                    }
                    projectsWithRankings.push(project);
                    callbackEach();
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, projectsWithRankings);
                }
            });
        },
        function(projects, callback) {
            var projectProfiles = [];
            _.each(projects, function(project){
                var profile = {
                    projectId : project._id,
                    projectName : project.identification.name,
                    earmarkedFunds : project.identification.earmarkedFunds,
                    portfolio : project.portfolio,
                    parent : project.parent,
                    qualitativeScore : 0,
                    qualitativeAnalysis : [],
                    portfolioRanking : project.portfolioRanking,
                    overallRanking : project.overallRanking
                };
                _.each(project.qualitativeAnalysis, function(groupObj){
                    var profileGroupObj = {
                        groupId : groupObj.group._id,
                        groupName : groupObj.group.name,
                        groupWeight : groupObj.group.weight,
                        sumImpactScores : 0,
                        weightedScore : 0,
                        impacts : []
                    };
                    _.each(groupObj.impacts, function(impactObj){
                        var profileImpactObj = {
                            impactId : impactObj.impact._id,
                            impactName : impactObj.impact.name,
                            impactWeight : impactObj.impact.weight,
                            score : impactObj.score,
                            weightedScore : impactObj.score.numericalValue * (impactObj.impact.weight/100)
                        };
                        profileGroupObj.impacts.push(profileImpactObj);
                        profileGroupObj.sumImpactScores = profileGroupObj.sumImpactScores + profileImpactObj.weightedScore;
                    });
                    profileGroupObj.weightedScore = profileGroupObj.sumImpactScores * (profileGroupObj.groupWeight/100);
                    profile.qualitativeAnalysis.push(profileGroupObj);
                    profile.qualitativeScore = profile.qualitativeScore + profileGroupObj.weightedScore;
                });
                projectProfiles.push(profile);
            });

            callback(null, projectProfiles);
        }
    ], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(result);
            /*
             * projectProfile = { projectId, projectName, parent, portfolio, earmarkedFunds, score, qualitativeAnalysis : [ ] }
             *                  qualitativeAnalysisObj = { groupId, groupName, groupWeight, sumImpactScores, weightedScore, impacts : [ ] }
             */
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
