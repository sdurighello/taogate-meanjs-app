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
    var BaselineDuration = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineDuration');
    var BaselineCost = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCost');
    var BaselineCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCompletion');
    var EstimateDuration = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateDuration');
    var EstimateCost = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCost');
    var EstimateCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCompletion');
    var ActualDuration = mongoose.mtModel(req.user.tenantId + '.' + 'ActualDuration');
    var ActualCost = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCost');
    var ActualCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCompletion');

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
        },
        // PERFORMANCE RECORDS: Delete all existing performance records associated with the project
        function(callback){
            async.series([
                // Duration
                function(callback){
                    BaselineDuration.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    EstimateDuration.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    ActualDuration.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                // Cost
                function(callback){
                    BaselineCost.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    EstimateCost.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    ActualCost.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                // Completion
                function(callback){
                    BaselineCompletion.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    EstimateCompletion.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    ActualCompletion.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                }
            ], function(err){
                callback(err);
            });
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
