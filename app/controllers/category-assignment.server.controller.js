'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

exports.categorizationOverview = function(req, res){
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
    var CategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryValue');

    async.waterfall([
        // Aggregate all
        function(callback) {
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
                console.log(aggregateArray);
                if (err) {
                    return callback(err);
                } else {
                    var totalNumberOfProjects = _.reduce(_.pluck(aggregateArray, 'countCategoryValue'), function(sum, v){
                        return sum + v;
                    }, 0);
                    var totalFunds = _.reduce(_.pluck(aggregateArray, 'fundsCategoryValue'), function(sum, v){
                        return sum + v;
                    }, 0);
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
                    callback(null, resultAll);
                }
            });
        },
        // Aggregate by portfolio
        function(resultAll, callback) {
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
                    var totalNumberOfProjects = _.reduce(_.pluck(aggregateArray, 'countCategoryValue'), function(sum, v){
                        return sum + v;
                    }, 0);
                    var totalFunds = _.reduce(_.pluck(aggregateArray, 'fundsCategoryValue'), function(sum, v){
                        return sum + v;
                    }, 0);
                    var resultPortfolio = _.map(aggregateArray, function(obj){
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

/**
 * Definition dashboard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

    next();
};
