'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Category
 */
exports.create = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
	var category = new Category(req.body);
	category.user = req.user;

    async.series([
        // CATEGORIES: Save the new category to its collection
        function(callback){
            category.save(function(err){
                callback(err);
            });
        },
        // GROUP.CATEGORIES: Add the category to the group's "categories" array
        function(callback){
            CategoryGroup.findById(req.query.groupId).exec(function(err, group){
                if(err){
                    callback(err);
                } else {
                    group.categories.push(category._id);
                    group.save(function(err){
                        callback(err);
                    });
                }
            });
        },
        // PROJECTS.CATEGORIZATION: Add the category to all existing projects
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    callback(err);
                } else {
                    async.each(projects, function(project, callback){
                        async.each(project.categorization, function(assignedGroup, callback){
                            if(assignedGroup.group.equals(req.query.groupId)){
                                assignedGroup.categories.push({
                                    category: category._id,
                                    categoryValue: null
                                });
                            }
                            callback();
                        });
                        project.save(function(err){
                            if(err){
                                callback(err);
                            } else {
                                callback();
                            }
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
            res.jsonp(category);
        }
    });

};

/**
 * Show the current Category
 */
exports.read = function(req, res) {
	res.jsonp(req.category);
};

/**
 * Update a Category
 */
exports.update = function(req, res) {
	var category = req.category ;
    category.user = req.user;
    category.created = Date.now();
	category = _.extend(category , req.body);

	category.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * Delete a Category
 */
exports.delete = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var category = req.category ;
    var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
    var CategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryValue');

    async.series([
        // CATEGORIES: Delete category from its collection
        function(callback){
            category.remove(function(err){
                callback(err);
            });
        },
        // VALUES: Delete its values from the values collection
        function(callback){
            async.each(category.categoryValues, function(item, callback){
                CategoryValue.findByIdAndRemove(item._id, function(err){
                    if(err){callback(err);} else {callback();}
                });
            });
            callback(null);
        },
        // GROUP.CATEGORIES: Delete category from group where assigned
        function(callback){
            CategoryGroup.findById(req.query.groupId).exec(function(err, group){
                group.categories.splice(group.categories.indexOf(category._id), 1);
                group.save(function(err){
                    callback(err);
                });
            });
        },
        // PROJECTS.CATEGORIZATION: Remove the category to all existing projects
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    callback(err);
                } else {
                    async.each(projects, function(project, callback){
                        async.each(project.categorization, function(assignedGroup, callback){
                            if(assignedGroup.group.equals(req.query.groupId)){
                                async.each(assignedGroup.categories, function(assignedCategory, callback){
                                    if(assignedCategory.category.equals(category._id)){
                                        assignedCategory.remove(function(err){
                                            if(err) callback(err);
                                        });
                                    }
                                    callback();
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
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(category);
        }
    });
};

/**
 * List of Categories
 */
exports.list = function(req, res) {
    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
	Category.find().populate('user', 'displayName').exec(function(err, categories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categories);
		}
	});
};

/**
 * Category middleware
 */
exports.categoryByID = function(req, res, next, id) {
    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
	Category.findById(id).populate('user', 'displayName').exec(function(err, category) {
		if (err) return next(err);
		if (! category) return next(new Error('Failed to load Category ' + id));
		req.category = category ;
		next();
	});
};

/**
 * Category authorization middleware
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
