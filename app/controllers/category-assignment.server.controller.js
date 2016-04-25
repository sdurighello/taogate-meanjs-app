'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


exports.categorizationOverviewPortfolio = function(req, res){
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
    var CategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryValue');

    async.waterfall([
        // Get totals for ratios
        function(callback){
            Project.find({'selection.active': true}, function(err, projects){

                var totals = {
                    all: {},
                    portfolios: [
                        // {
                        //     portfolio: portfolioId,
                        //     totals ...
                        // }
                    ]
                };

                if(err){
                    return callback(err);
                }
                if(!projects){
                    return callback(null, {
                        all: {totalNumberOfProjects: 0, totalFunds: 0},
                        portfolios: []
                    });
                }

                totals.all.totalNumberOfProjects = projects.length;
                totals.all.totalFunds = _.reduce(_.pluck(projects, 'identification'), function(sum, v){
                    return sum + v.earmarkedFunds;
                }, 0);
                totals.portfolios = _.chain(projects)
                    .groupBy('portfolio')// {'2015' : [{benefit}, ..], '2016' : [{benefit}, ..]}
                    .map(function(v, k){
                        return {
                            portfolio : k, // Unfortunately this _id is saved as "string", watch out!
                            totalFunds : _.reduce(v, function(sum, project){
                                return sum + project.identification.earmarkedFunds;
                            }, 0),
                            totalNumberOfProjects : v.length
                        };
                    })
                    .value();

                callback(null, totals);
                
            });
        },
        // Aggregate all
        function(totals, callback) {
            Project.aggregate([
                {'$match': {'selection.active': true}},
                {'$unwind': '$categorization'},
                {'$unwind' : '$categorization.categories'},
                {'$group' : {
                    _id : {
                        categoryValue : '$categorization.categories.categoryValue',
                        category :'$categorization.categories.category',
                        group : '$categorization.group'
                    },
                    projects : { '$push' : '$_id' },
                    countCategoryValue : {'$sum': 1},
                    fundsCategoryValue : {'$sum' : '$identification.earmarkedFunds'}
                }}
            ], function (err, aggregateArray) {
                if (err) {
                    return callback(err);
                } else {
                    var totalNumberOfProjects = totals.all.totalNumberOfProjects;
                    var totalFunds = totals.all.totalFunds;
                    var resultAll = _.map(aggregateArray, function(obj){
                        return {
                            all : true,
                            portfolio : null,
                            group : obj._id.group,
                            category : obj._id.category,
                            categoryValue : obj._id.categoryValue,
                            countCategoryValue : obj.countCategoryValue,
                            countCategoryValueRatio : obj.countCategoryValue/totalNumberOfProjects,
                            fundsCategoryValue : obj.fundsCategoryValue,
                            fundsCategoryValueRatio : obj.fundsCategoryValue/totalFunds,
                            projects : obj.projects
                        };
                    });
                    callback(null, resultAll, totals);
                }
            });
        },
        // Aggregate by portfolio
        function(resultAll, totals, callback) {
            Project.aggregate([
                {'$match': {'selection.active': true}},
                {'$unwind': '$categorization'},
                {'$unwind' : '$categorization.categories'},
                {'$group' : {
                    _id : {
                        portfolio : '$portfolio',
                        categoryValue : '$categorization.categories.categoryValue',
                        category :'$categorization.categories.category',
                        group : '$categorization.group'
                    },
                    projects : { '$push' : '$_id' },
                    countCategoryValue : {'$sum': 1},
                    fundsCategoryValue : {'$sum' : '$identification.earmarkedFunds'}
                }}
            ], function (err, aggregateArray) {
                if (err) {
                    return callback(err);
                } else {
                    var resultPortfolio = _.map(aggregateArray, function(obj){
                        var totalNumberOfProjects, totalFunds;
                        var portfolioInTotals = _.find(totals.portfolios, function(p){
                            if(!obj._id.portfolio){
                                return p.portfolio === 'null';
                            }
                            return p.portfolio === obj._id.portfolio.toString();
                        });

                        if(portfolioInTotals){
                            totalNumberOfProjects = portfolioInTotals.totalNumberOfProjects;
                            totalFunds = portfolioInTotals.totalFunds;
                        } else {
                            totalNumberOfProjects = 0;
                            totalFunds = 0;
                        }
                        return {
                            all : false,
                            portfolio : obj._id.portfolio,
                            group : obj._id.group,
                            category : obj._id.category,
                            categoryValue : obj._id.categoryValue,
                            countCategoryValue : obj.countCategoryValue,
                            countCategoryValueRatio : obj.countCategoryValue/totalNumberOfProjects,
                            fundsCategoryValue : obj.fundsCategoryValue,
                            fundsCategoryValueRatio : obj.fundsCategoryValue/totalFunds,
                            projects : obj.projects
                        };
                    });
                    callback(null, resultAll, resultPortfolio);
                }
            });
        },
        // Combine All + By Portfolio
        function(resultAll, resultPortfolio, callback) {
            var result = resultAll.concat(resultPortfolio);
            callback(null, result);
        },
        // Populate groups
        function(result, callback) {
            CategoryGroup.populate(result, {path: 'group'}, function(err, populatedGroups){
                if(err){
                    return callback(err);
                }
                callback(null, populatedGroups);
            });
        },
        // Populate categories
        function(populatedGroups, callback) {
            Category.populate(populatedGroups, {path: 'category'}, function(err, populatedCategories){
                if(err){
                    return callback(err);
                }
                callback(null, populatedCategories);
            });
        },
        // Populate values
        function(populatedCategories, callback) {
            CategoryValue.populate(populatedCategories, {path: 'categoryValue'}, function(err, populatedValues){
                if(err){
                    return callback(err);
                }
                callback(null, populatedValues);
            });
        },
        // Populate projects
        function(populatedValues, callback) {
            Project.populate(populatedValues, {path: 'projects', select:'identification.name'}, function(err, populatedProjects){
                if(err){
                    return callback(err);
                }
                callback(null, populatedProjects);
            });
        }
    ], function (err, populatedProjects) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(populatedProjects);
        }
    });

};

exports.categorizationOverviewStrategy = function(req, res){
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
    var CategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryValue');

    async.waterfall([
        // Get totals for ratios
        function(callback){
            Project.find({'selection.active': true}, function(err, projects){

                var totals = {
                    all: {},
                    parents: [
                        // {
                        //     parent: parentId,
                        //     totals ...
                        // }
                    ]
                };

                if(err){
                    return callback(err);
                }
                if(!projects){
                    return callback(null, {
                        all: {totalNumberOfProjects: 0, totalFunds: 0},
                        parents: []
                    });
                }

                totals.all.totalNumberOfProjects = projects.length;
                totals.all.totalFunds = _.reduce(_.pluck(projects, 'identification'), function(sum, v){
                    return sum + v.earmarkedFunds;
                }, 0);
                totals.parents = _.chain(projects)
                    .groupBy('parent')// {'2015' : [{benefit}, ..], '2016' : [{benefit}, ..]}
                    .map(function(v, k){
                        return {
                            parent : k, // Unfortunately this _id is saved as "string", watch out!
                            totalFunds : _.reduce(v, function(sum, project){
                                return sum + project.identification.earmarkedFunds;
                            }, 0),
                            totalNumberOfProjects : v.length
                        };
                    })
                    .value();

                callback(null, totals);

            });
        },
        // Aggregate all
        function(totals, callback) {
            Project.aggregate([
                {'$match': {'selection.active': true}},
                {'$unwind': '$categorization'},
                {'$unwind' : '$categorization.categories'},
                {'$group' : {
                    _id : {
                        categoryValue : '$categorization.categories.categoryValue',
                        category :'$categorization.categories.category',
                        group : '$categorization.group'
                    },
                    projects : { '$push' : '$_id' },
                    countCategoryValue : {'$sum': 1},
                    fundsCategoryValue : {'$sum' : '$identification.earmarkedFunds'}
                }}
            ], function (err, aggregateArray) {
                if (err) {
                    return callback(err);
                } else {
                    var totalNumberOfProjects = totals.all.totalNumberOfProjects;
                    var totalFunds = totals.all.totalFunds;
                    var resultAll = _.map(aggregateArray, function(obj){
                        return {
                            all : true,
                            parent : null,
                            group : obj._id.group,
                            category : obj._id.category,
                            categoryValue : obj._id.categoryValue,
                            countCategoryValue : obj.countCategoryValue,
                            countCategoryValueRatio : obj.countCategoryValue/totalNumberOfProjects,
                            fundsCategoryValue : obj.fundsCategoryValue,
                            fundsCategoryValueRatio : obj.fundsCategoryValue/totalFunds,
                            projects : obj.projects
                        };
                    });
                    callback(null, resultAll, totals);
                }
            });
        },
        // Aggregate by parent
        function(resultAll, totals, callback) {
            Project.aggregate([
                {'$match': {'selection.active': true}},
                {'$unwind': '$categorization'},
                {'$unwind' : '$categorization.categories'},
                {'$group' : {
                    _id : {
                        parent : '$parent',
                        categoryValue : '$categorization.categories.categoryValue',
                        category :'$categorization.categories.category',
                        group : '$categorization.group'
                    },
                    projects : { '$push' : '$_id' },
                    countCategoryValue : {'$sum': 1},
                    fundsCategoryValue : {'$sum' : '$identification.earmarkedFunds'}
                }}
            ], function (err, aggregateArray) {
                if (err) {
                    return callback(err);
                } else {
                    var resultPortfolio = _.map(aggregateArray, function(obj){
                        var totalNumberOfProjects, totalFunds;
                        var portfolioInTotals = _.find(totals.parents, function(p){
                            if(!obj._id.parent){
                                return p.parent === 'null';
                            }
                            return p.parent === obj._id.parent.toString();
                        });
                        if(portfolioInTotals){
                            totalNumberOfProjects = portfolioInTotals.totalNumberOfProjects;
                            totalFunds = portfolioInTotals.totalFunds;
                        } else {
                            totalNumberOfProjects = 0;
                            totalFunds = 0;
                        }
                        return {
                            all : false,
                            parent : obj._id.parent,
                            group : obj._id.group,
                            category : obj._id.category,
                            categoryValue : obj._id.categoryValue,
                            countCategoryValue : obj.countCategoryValue,
                            countCategoryValueRatio : obj.countCategoryValue/totalNumberOfProjects,
                            fundsCategoryValue : obj.fundsCategoryValue,
                            fundsCategoryValueRatio : obj.fundsCategoryValue/totalFunds,
                            projects : obj.projects
                        };
                    });
                    callback(null, resultAll, resultPortfolio);
                }
            });
        },
        // Combine All + By Portfolio
        function(resultAll, resultPortfolio, callback) {
            var result = resultAll.concat(resultPortfolio);
            callback(null, result);
        },
        // Populate groups
        function(result, callback) {
            CategoryGroup.populate(result, {path: 'group'}, function(err, populatedGroups){
                if(err){
                    return callback(err);
                }
                callback(null, populatedGroups);
            });
        },
        // Populate categories
        function(populatedGroups, callback) {
            Category.populate(populatedGroups, {path: 'category'}, function(err, populatedCategories){
                if(err){
                    return callback(err);
                }
                callback(null, populatedCategories);
            });
        },
        // Populate values
        function(populatedCategories, callback) {
            CategoryValue.populate(populatedCategories, {path: 'categoryValue'}, function(err, populatedValues){
                if(err){
                    return callback(err);
                }
                callback(null, populatedValues);
            });
        },
        // Populate projects
        function(populatedValues, callback) {
            Project.populate(populatedValues, {path: 'projects', select:'identification.name'}, function(err, populatedProjects){
                if(err){
                    return callback(err);
                }
                callback(null, populatedProjects);
            });
        }
    ], function (err, populatedProjects) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(populatedProjects);
        }
    });

};

/**
 * Definition dashboard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

    next();
};
