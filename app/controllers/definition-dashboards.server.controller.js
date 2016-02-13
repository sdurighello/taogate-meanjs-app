'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

exports.projectCategorization = function(req, res){
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
    var CategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryValue');

    async.waterfall([
        // Aggregate
        function(callback) {
            Project.aggregate([
                {'$unwind': '$categorization'},
                {'$unwind' : '$categorization.categories'},
                {'$group' : {
                    _id : {
                        categoryValue : '$categorization.categories.categoryValue',
                        category :'$categorization.categories.category',
                        group : '$categorization.group'
                    },
                    countCategoryValue : {'$sum': 1},
                    fundsCategoryValue : {'$sum' : '$identification.earmarkedFunds'}
                }},
                {'$group' : {
                    _id : {
                        category :'$_id.category',
                        group : '$_id.group'
                    },
                    categoryValues : {'$push' : {categoryValue : '$_id.categoryValue', countCategoryValue : '$countCategoryValue', fundsCategoryValue : '$fundsCategoryValue'}},
                    countCategory : {'$sum': 1}
                }},
                {'$group' : {
                    _id : {
                        group : '$_id.group'
                    },
                    categories : {'$push' : {category : '$_id.category', countCategory : '$countCategory', categoryValues : '$categoryValues'}},
                    countGroup : {'$sum': 1}
                }},
                {'$project' : {
                    group : '$_id.group',
                    categories : '$categories',
                    countGroup : '$countGroup'
                }}
            ], function (err, result) {
                if (err) {
                    return callback(err);
                } else {
                    callback(null, result);
                }
            });
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
            Category.populate(populatedGroups, {path: 'categories.category'}, function(err, populatedCategories){
                if(err){
                    return callback(err);
                }
                callback(null, populatedCategories);
            });
        },
        // Populate values
        function(populatedCategories, callback) {
            CategoryValue.populate(populatedCategories, {path: 'categories.categoryValues.categoryValue'}, function(err, populatedValues){
                if(err){
                    return callback(err);
                }
                callback(null, populatedValues);
            });
        }
    ], function (err, populatedValues) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(populatedValues);
        }
    });

};


exports.projectPrioritization = function(req, res){
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var PriorityGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityGroup');
    var Priority = mongoose.mtModel(req.user.tenantId + '.' + 'Priority');
    var PriorityValue = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityValue');

    async.waterfall([
        // Aggregate
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
                    countPriorityValue : {'$sum': 1},
                    fundsPriorityValue : {'$sum' : '$identification.earmarkedFunds'}
                }},
                {'$group' : {
                    _id : {
                        priority :'$_id.priority',
                        group : '$_id.group'
                    },
                    priorityValues : {'$push' : {priorityValue : '$_id.priorityValue', countPriorityValue : '$countPriorityValue', fundsPriorityValue : '$fundsPriorityValue'}},
                    countPriority : {'$sum': 1}
                }},
                {'$group' : {
                    _id : {
                        group : '$_id.group'
                    },
                    priorities : {'$push' : {priority : '$_id.priority', countPriority : '$countPriority', priorityValues : '$priorityValues'}},
                    countGroup : {'$sum': 1}
                }},
                {'$project' : {
                    group : '$_id.group',
                    priorities : '$priorities',
                    countGroup : '$countGroup'
                }}
            ], function (err, result) {
                if (err) {
                    return callback(err);
                } else {
                    callback(null, result);
                }
            });
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
            Priority.populate(populatedGroups, {path: 'priorities.priority'}, function(err, populatedCategories){
                if(err){
                    return callback(err);
                }
                callback(null, populatedCategories);
            });
        },
        // Populate values
        function(populatedCategories, callback) {
            PriorityValue.populate(populatedCategories, {path: 'priorities.priorityValues.priorityValue'}, function(err, populatedValues){
                if(err){
                    return callback(err);
                }
                callback(null, populatedValues);
            });
        }
    ], function (err, populatedValues) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(populatedValues);
        }
    });

};


exports.projectCategorization2 = function(req, res){
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
    var CategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryValue');

    async.waterfall([
        // Aggregate
        function(callback) {
            Project.aggregate([
                {'$unwind': '$categorization'},
                {'$unwind' : '$categorization.categories'},
                {'$group' : {
                    _id : {
                        categoryValue : '$categorization.categories.categoryValue',
                        category :'$categorization.categories.category',
                        group : '$categorization.group'
                    },
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
                    var result = _.map(aggregateArray, function(obj){
                        return {
                            group : obj._id.group,
                            category : obj._id.category,
                            categoryValue : obj._id.categoryValue,
                            countCategoryValue : obj.countCategoryValue,
                            countCategoryValueRatio : obj.countCategoryValue/totalNumberOfProjects,
                            fundsCategoryValue : obj.fundsCategoryValue,
                            fundsCategoryValueRatio : obj.fundsCategoryValue/totalFunds
                        };
                    });
                    callback(null, result);
                }
            });
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
        }
    ], function (err, populatedValues) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(populatedValues);
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
