'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Category group
 */
exports.create = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
	var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
	var categoryGroup = new CategoryGroup(req.body);
	categoryGroup.user = req.user;

    async.series([
        // GROUP: Save Group in its collection
        function(callback){
            categoryGroup.save(function(err){
                callback(err);
            });
        },
        // PROJECTS: Add new group to all projects
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    callback(err);
                } else {
                    async.each(projects, function(project, callback){
                        project.categorization.push({
                            group: categoryGroup._id,
                            categories: []
                        });
                        project.save(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    });
                    callback(null);
                }
            });
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(categoryGroup);
        }
    });

};

/**
 * Show the current Category group
 */
exports.read = function(req, res) {
	res.jsonp(req.categoryGroup);
};

/**
 * Update a Category group
 */
exports.update = function(req, res) {
	var categoryGroup = req.categoryGroup ;
    categoryGroup.user = req.user;
    categoryGroup.created = Date.now();
	categoryGroup = _.extend(categoryGroup , req.body);

	categoryGroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categoryGroup);
		}
	});

};

/**
 * Delete a Category Group
 */
exports.delete = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
    var CategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryValue');
    var categoryGroup = req.categoryGroup ;

    async.series([
        // CATEGORY-GROUP: Delete Group from its collection
        function(callback){
            categoryGroup.remove(function(err){
                callback(err);
            });
        },
        // CATEGORY-VALUES: Delete all values of the categories in the group
        function(callback){
            async.each(categoryGroup.categories, function(item, callback){
                Category.findById(item._id).exec(function(err, category){
                    if (err) {
                        callback(err);
                    } else {
                        async.each(category.categoryValues, function(item2, callback){
                            CategoryValue.findByIdAndRemove(item2, function(err){
                                if(err){callback(err);} else {callback();}
                            });
                        });
                        callback();
                    }
                });
            });
            callback(null);
        },
        // CATEGORIES: Delete all categories (from "categories" collection) belonging to this category Group
        function(callback){
            async.each(categoryGroup.categories, function(item, callback){
                Category.findByIdAndRemove(item._id, function(err){
                    if(err){callback(err);} else {callback();}
                });
            });
            callback(null);
        },
        // PROJECTS: Delete group object from project.categorization
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    callback(err);
                } else {
                    async.each(projects, function(project, callback){
                        async.each(project.categorization, function(assignedGroup, callback){
                            if(assignedGroup.group.equals(categoryGroup._id)){
                                assignedGroup.remove(function(err){
                                    if(err){callback(err);}
                                });
                            }
                            callback();
                        });
                        project.save(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    });
                    callback(null);
                }
            });
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(categoryGroup);
        }
    });
};

/**
 * List of Category groups
 */
exports.list = function(req, res) {
	var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
	CategoryGroup.find().deepPopulate(['categories.categoryValues']).populate('user', 'displayName').exec(function(err, categoryGroups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categoryGroups);
		}
	});
};

/**
 * Category group middleware
 */
exports.categoryGroupByID = function(req, res, next, id) {
	var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
	CategoryGroup.findById(id).deepPopulate(['categories.categoryValues']).populate('user', 'displayName').exec(function(err, categoryGroup) {
		if (err) return next(err);
		if (! categoryGroup) return next(new Error('Failed to load Category group ' + id));
		req.categoryGroup = categoryGroup ;
		next();
	});
};

/**
 * Category group authorization middleware
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
