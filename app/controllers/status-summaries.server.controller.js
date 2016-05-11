'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

exports.portfolioSummary = function(req, res){

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var PortfolioRanking = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioRanking');
    var OverallRanking = mongoose.mtModel(req.user.tenantId + '.' + 'OverallRanking');
    var FinancialBenefit = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefit');
    var FinancialCost = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCost');

    var QualitativeImpactGroup = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');
    var QualitativeImpact = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpact');
    var QualitativeImpactScore = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactScore');
    var Risk = mongoose.mtModel(req.user.tenantId + '.' + 'Risk');
    var RiskSeverity = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverity');

    async.waterfall([
        // Get all the projects in evaluation
        function(callback) {
            Project.find({'selection.active':true, 'selection.selectedForEvaluation':true})
                .deepPopulate(['portfolio','parent',
                    'qualitativeAnalysis.group', 'qualitativeAnalysis.impacts.impact', 'qualitativeAnalysis.impacts.score',
                    'riskAnalysis.category', 'riskAnalysis.risks.risk', 'riskAnalysis.risks.severityAssignment.severity',
                    'costs', 'benefits'
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
        // Min, Max Scores
        function(projectsWithRankings, callback){

            var minMaxObj = {
                qualitativeWeight: null,
                minQualitativeScore: null,
                maxQualitativeScore: null,
                minWeightedQualitativeScore: null,
                maxWeightedQualitativeScore: null,
                qualitativeScoreInterval : null,

                minRiskScore: null,
                maxRiskScore: null,
                numberOfRisks: null,
                minTotalRiskScore: null,
                maxTotalRiskScore: null,
                riskScoreInterval: null
            };

            async.parallel([
                function (callback) {
                    QualitativeImpactGroup.find().populate('impacts').exec(function (err, groups) {
                        if(err){
                            return callback(err);
                        }
                        if(!groups){
                            return callback(null);
                        }

                        minMaxObj.qualitativeWeight = _.reduce(groups, function(sum, group){
                            return sum + group.weight/100 * (_.reduce(group.impacts, function(sum, impact){
                                    return sum + impact.weight/100;
                                }, 0));
                        }, 0);

                        callback(null);
                    });
                },
                function(callback) {
                    QualitativeImpactScore.find().exec(function (err, scores) {
                        if(err){
                            return callback(err);
                        }
                        if(scores.length >= 0){
                            minMaxObj.minQualitativeScore = _.min(scores, function(score){
                                return score.numericalValue;
                            }).numericalValue;
                            minMaxObj.maxQualitativeScore = _.max(scores, function(score){
                                return score.numericalValue;
                            }).numericalValue;
                        }
                        callback(null);
                    });
                },
                function(callback) {
                    RiskSeverity.find().exec(function (err, severities) {
                        if(err){
                            return callback(err);
                        }
                        if(severities.length >= 0){
                            minMaxObj.minRiskScore = _.min(severities, function(sev){
                                return sev.severityValue;
                            }).severityValue;
                            minMaxObj.maxRiskScore = _.max(severities, function(sev){
                                return sev.severityValue;
                            }).severityValue;
                        }
                        callback(null);
                    });
                },
                function(callback) {
                    Risk.count({}, function(err, number){
                        if(err){
                            return callback(err);
                        }
                        if(number){
                            minMaxObj.numberOfRisks = number;
                        }
                        callback(null);
                    });
                }
            ], function (err) {
                if(err){
                    callback(err);
                } else {
                    // Apply weight to min/max qualitative since you cannot assume that it will always sum up to 100%
                    minMaxObj.minWeightedQualitativeScore = minMaxObj.minQualitativeScore * minMaxObj.qualitativeWeight;
                    minMaxObj.maxWeightedQualitativeScore = minMaxObj.maxQualitativeScore * minMaxObj.qualitativeWeight;
                    minMaxObj.qualitativeScoreInterval = minMaxObj.maxWeightedQualitativeScore - minMaxObj.minWeightedQualitativeScore;

                    minMaxObj.minTotalRiskScore = minMaxObj.minRiskScore * minMaxObj.numberOfRisks;
                    minMaxObj.maxTotalRiskScore = minMaxObj.maxRiskScore * minMaxObj.numberOfRisks;
                    minMaxObj.riskScoreInterval = minMaxObj.maxTotalRiskScore - minMaxObj.minTotalRiskScore;

                    callback(null, projectsWithRankings, minMaxObj);
                }
            });
        },
        // Create project profiles
        function(projects, minMaxObj, callback) {
            var projectProfiles = [];
            _.each(projects, function(project){
                var profile = {
                    projectId : project._id,
                    projectName : project.identification.name,
                    earmarkedFunds : project.identification.earmarkedFunds,
                    portfolio : project.portfolio,
                    parent : project.parent,
                    qualitativeScore : 0,
                    qualitativeScorePercentile: null,
                    qualitativeAnalysis : [],
                    riskScore : 0,
                    riskScorePercentile: null,
                    riskAnalysis : [],
                    portfolioRanking : project.portfolioRanking,
                    overallRanking : project.overallRanking,
                    financialYearlyData : [],
                    financialRatios : {
                        totalCost : null,
                        totalCostDiscounted : null,
                        totalBenefit : null,
                        totalBenefitDiscounted : null,
                        totalNet : null,
                        totalNetDiscounted : null, // NPV
                        IRR : null,
                        benefitCostRatio : null,
                        paybackPeriod : null
                    }
                };
                // Add qualitative analysis
                _.each(project.qualitativeAnalysis, function(groupObj){
                    var profileGroupObj = {
                        groupId : groupObj.group._id,
                        groupName : groupObj.group.name,
                        groupWeight : groupObj.group.weight,
                        sumImpactScores : 0,
                        sumImpactWeights : 0,
                        weightedScore : 0,
                        impacts : []
                    };
                    _.each(groupObj.impacts, function(impactObj){
                        var allowNullScore = function(obj){
                            if(!obj){
                                return 0;
                            }
                            return obj.numericalValue;
                        };
                        var profileImpactObj = {
                            impactId : impactObj.impact._id,
                            impactName : impactObj.impact.name,
                            impactWeight : impactObj.impact.weight,
                            score : impactObj.score,
                            weightedScore : allowNullScore(impactObj.score) * (impactObj.impact.weight/100)
                        };
                        profileGroupObj.impacts.push(profileImpactObj);
                        profileGroupObj.sumImpactScores = profileGroupObj.sumImpactScores + profileImpactObj.weightedScore;

                        profileGroupObj.sumImpactWeights = profileGroupObj.sumImpactWeights + profileImpactObj.impactWeight;
                    });
                    profileGroupObj.weightedScore = profileGroupObj.sumImpactScores * (profileGroupObj.groupWeight/100);

                    // For the percentile at group level
                    profileGroupObj.qualitativeWeight = (profileGroupObj.groupWeight/100) * (profileGroupObj.sumImpactWeights/100);
                    profileGroupObj.minWeightedQualitativeScore = minMaxObj.minQualitativeScore * profileGroupObj.qualitativeWeight;
                    profileGroupObj.maxWeightedQualitativeScore = minMaxObj.maxQualitativeScore * profileGroupObj.qualitativeWeight;
                    profileGroupObj.qualitativeScoreInterval = profileGroupObj.maxWeightedQualitativeScore - profileGroupObj.minWeightedQualitativeScore;
                    profileGroupObj.qualitativeScorePercentile = profileGroupObj.weightedScore / profileGroupObj.qualitativeScoreInterval;

                    profile.qualitativeAnalysis.push(profileGroupObj);
                    profile.qualitativeScore = profile.qualitativeScore + profileGroupObj.weightedScore;

                    // Percentile at project profile level
                    profile.qualitativeScorePercentile = profile.qualitativeScore / minMaxObj.qualitativeScoreInterval;
                });
                // Add risk analysis
                _.each(project.riskAnalysis, function(categoryObj){
                    var profileCategoryObj = {
                        categoryId : categoryObj.category._id,
                        categoryName : categoryObj.category.name,
                        sumSeverityValues : 0,
                        risks : []
                    };
                    _.each(categoryObj.risks, function(riskObj){
                        var profileRiskObj = {
                            riskId : riskObj.risk._id,
                            riskName : riskObj.risk.name,
                            severityValue : riskObj.severityAssignment ? riskObj.severityAssignment.severity.severityValue : null
                        };
                        profileCategoryObj.risks.push(profileRiskObj);
                        profileCategoryObj.sumSeverityValues = profileCategoryObj.sumSeverityValues + profileRiskObj.severityValue;
                    });
                    profile.riskAnalysis.push(profileCategoryObj);
                    profile.riskScore = profile.riskScore + profileCategoryObj.sumSeverityValues;
                    profile.riskScorePercentile = profile.riskScore / minMaxObj.riskScoreInterval;
                });

                // Add financial analysis
                var aggregatedBenefits = _.chain(project.benefits)
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

                var aggregatedCosts = _.chain(project.costs)
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
                if(project.discountRate && combinedFinancialData.length){
                    var baseYear = _.min(combinedFinancialData, function(yearlyItem) { return yearlyItem.year; }).year;
                    var discountRate = project.discountRate;

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
                        return Math.round(((paybackCounter-1)+((paybackRatioInput.totalCostDiscounted-cumulativeBenefitPrev)/yearNet)) * 1e1) / 1e1;
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

                    profile.financialYearlyData = combinedFinancialData;
                    profile.financialRatios = financialRatios;
                }

                // Push the profile with all the data in the array to be returned
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
            /* result = [ ]
             *  resultObj = {
             *      projectId, projectName, parent, portfolio, earmarkedFunds, portfolioRanking, overallRanking,
             *          qualitativeScore, qualitativeAnalysis : [ ],
             *          riskScore, riskAnalysis : [ ],
             *          financialRatios : { }, financialYearlyData : [ ]
             *	    }
             *          qualitativeAnalysisObj = { groupId, groupName, groupWeight, sumImpactScores, weightedScore, impacts : [ ] }
             *		    riskAnalysisObj = { categoryId, categoryName, sumSeverityValues, risks : [{severityValue} ] },
             *		    financialRatios = { IRR, costBenefitRatio, paybackPeriod, totalBenefit, totalBenefitDsicounted (same for cost and net), },
             *		    financialYearlyDataObj = { year, yearlyBenefit(discounted), yearlyCost(discounted), yearlyNet(discounted)}
             */
        }
    });

};

/**
 * Definition dashboard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

    next();
};
