'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


exports.prioritizationOverviewPortfolio = function(req, res){
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var PriorityGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityGroup');
    var Priority = mongoose.mtModel(req.user.tenantId + '.' + 'Priority');
    var PriorityValue = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityValue');

    async.waterfall([
        // Get totals for ratios
        function(callback){
            Project.find({'selection.active': true, 'selection.selectedForPrioritization': true}, function(err, projects){

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
                {'$match': {'selection.selectedForPrioritization': true}},
                {'$unwind': '$prioritization'},
                {'$unwind' : '$prioritization.priorities'},
                {'$group' : {
                    _id : {
                        priorityValue : '$prioritization.priorities.priorityValue',
                        priority :'$prioritization.priorities.priority',
                        group : '$prioritization.group'
                    },
                    projects : { '$push' : '$_id' },
                    countPriorityValue : {'$sum': 1},
                    fundsPriorityValue : {'$sum' : '$identification.earmarkedFunds'}
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
                            priority : obj._id.priority,
                            priorityValue : obj._id.priorityValue,
                            countPriorityValue : obj.countPriorityValue,
                            countPriorityValueRatio : obj.countPriorityValue/totalNumberOfProjects,
                            fundsPriorityValue : obj.fundsPriorityValue,
                            fundsPriorityValueRatio : obj.fundsPriorityValue/totalFunds,
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
                {'$match': {'selection.selectedForPrioritization': true}},
                {'$unwind': '$prioritization'},
                {'$unwind' : '$prioritization.priorities'},
                {'$group' : {
                    _id : {
                        portfolio : '$portfolio',
                        priorityValue : '$prioritization.priorities.priorityValue',
                        priority :'$prioritization.priorities.priority',
                        group : '$prioritization.group'
                    },
                    projects : { '$push' : '$_id' },
                    countPriorityValue : {'$sum': 1},
                    fundsPriorityValue : {'$sum' : '$identification.earmarkedFunds'}
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
                            priority : obj._id.priority,
                            priorityValue : obj._id.priorityValue,
                            countPriorityValue : obj.countPriorityValue,
                            countPriorityValueRatio : obj.countPriorityValue/totalNumberOfProjects,
                            fundsPriorityValue : obj.fundsPriorityValue,
                            fundsPriorityValueRatio : obj.fundsPriorityValue/totalFunds,
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
            PriorityGroup.populate(result, {path: 'group'}, function(err, populatedGroups){
                if(err){
                    return callback(err);
                }
                callback(null, populatedGroups);
            });
        },
        // Populate priorities
        function(populatedGroups, callback) {
            Priority.populate(populatedGroups, {path: 'priority'}, function(err, populatedCategories){
                if(err){
                    return callback(err);
                }
                callback(null, populatedCategories);
            });
        },
        // Populate values
        function(populatedCategories, callback) {
            PriorityValue.populate(populatedCategories, {path: 'priorityValue'}, function(err, populatedValues){
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

exports.prioritizationOverviewStrategy = function(req, res){
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var PriorityGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityGroup');
    var Priority = mongoose.mtModel(req.user.tenantId + '.' + 'Priority');
    var PriorityValue = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityValue');

    async.waterfall([
        // Get totals for ratios
        function(callback){
            Project.find({'selection.active': true, 'selection.selectedForPrioritization': true}, function(err, projects){

                var totals = {
                    all: {},
                    parents: [
                        // {
                        //     parents: parentId, (string!)
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
                {'$match': {'selection.selectedForPrioritization': true}},
                {'$unwind': '$prioritization'},
                {'$unwind' : '$prioritization.priorities'},
                {'$group' : {
                    _id : {
                        priorityValue : '$prioritization.priorities.priorityValue',
                        priority :'$prioritization.priorities.priority',
                        group : '$prioritization.group'
                    },
                    projects : { '$push' : '$_id' },
                    countPriorityValue : {'$sum': 1},
                    fundsPriorityValue : {'$sum' : '$identification.earmarkedFunds'}
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
                            priority : obj._id.priority,
                            priorityValue : obj._id.priorityValue,
                            countPriorityValue : obj.countPriorityValue,
                            countPriorityValueRatio : obj.countPriorityValue/totalNumberOfProjects,
                            fundsPriorityValue : obj.fundsPriorityValue,
                            fundsPriorityValueRatio : obj.fundsPriorityValue/totalFunds,
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
                {'$match': {'selection.selectedForPrioritization': true}},
                {'$unwind': '$prioritization'},
                {'$unwind' : '$prioritization.priorities'},
                {'$group' : {
                    _id : {
                        parent : '$parent',
                        priorityValue : '$prioritization.priorities.priorityValue',
                        priority :'$prioritization.priorities.priority',
                        group : '$prioritization.group'
                    },
                    projects : { '$push' : '$_id' },
                    countPriorityValue : {'$sum': 1},
                    fundsPriorityValue : {'$sum' : '$identification.earmarkedFunds'}
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
                            priority : obj._id.priority,
                            priorityValue : obj._id.priorityValue,
                            countPriorityValue : obj.countPriorityValue,
                            countPriorityValueRatio : obj.countPriorityValue/totalNumberOfProjects,
                            fundsPriorityValue : obj.fundsPriorityValue,
                            fundsPriorityValueRatio : obj.fundsPriorityValue/totalFunds,
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
            PriorityGroup.populate(result, {path: 'group'}, function(err, populatedGroups){
                if(err){
                    return callback(err);
                }
                callback(null, populatedGroups);
            });
        },
        // Populate priorities
        function(populatedGroups, callback) {
            Priority.populate(populatedGroups, {path: 'priority'}, function(err, populatedCategories){
                if(err){
                    return callback(err);
                }
                callback(null, populatedCategories);
            });
        },
        // Populate values
        function(populatedCategories, callback) {
            PriorityValue.populate(populatedCategories, {path: 'priorityValue'}, function(err, populatedValues){
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
