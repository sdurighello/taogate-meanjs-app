'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

exports.prioritizationOverview = function(req, res){
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var PriorityGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityGroup');
    var Priority = mongoose.mtModel(req.user.tenantId + '.' + 'Priority');
    var PriorityValue = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityValue');

    async.waterfall([
        // Aggregate all
        function(callback) {
            Project.aggregate([
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
                    var totalNumberOfProjects = _.reduce(_.pluck(aggregateArray, 'countPriorityValue'), function(sum, v){
                        return sum + v;
                    }, 0);
                    var totalFunds = _.reduce(_.pluck(aggregateArray, 'fundsPriorityValue'), function(sum, v){
                        return sum + v;
                    }, 0);
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
                    callback(null, resultAll);
                }
            });
        },
        // Aggregate by portfolio
        function(resultAll, callback) {
            Project.aggregate([
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
                    var totalNumberOfProjects = _.reduce(_.pluck(aggregateArray, 'countPriorityValue'), function(sum, v){
                        return sum + v;
                    }, 0);
                    var totalFunds = _.reduce(_.pluck(aggregateArray, 'fundsPriorityValue'), function(sum, v){
                        return sum + v;
                    }, 0);
                    var resultPortfolio = _.map(aggregateArray, function(obj){
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
