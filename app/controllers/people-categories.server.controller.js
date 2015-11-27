'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a People category
 */
exports.create = function(req, res) {
	var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
	var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');
	var peopleCategory = new PeopleCategory(req.body);
	peopleCategory.user = req.user;

    async.series([
        // PEOPLE-CATEGORY: Save category in its collection
        function(callback){
            peopleCategory.save(function(err){
                callback(err);
            });
        },
        // PROJECTS: Add new people-category to all roles in projects-stakeholders
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    callback(err);
                } else {
                    async.each(projects, function(project, callback){
                        async.each(project.stakeholders, function(assignedGroup, callback){
                            async.each(assignedGroup.roles, function(assignedRole, callback){
                                assignedRole.categorization.push({
                                    category: peopleCategory._id,
                                    categoryValue: null
                                });
                                callback();
                            });
                            callback();
                        });
                        project.save();
                        callback();
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
            res.jsonp(peopleCategory);
        }
    });
};

/**
 * Show the current People category
 */
exports.read = function(req, res) {
	res.jsonp(req.peopleCategory);
};

/**
 * Update a People category
 */
exports.update = function(req, res) {
	var peopleCategory = req.peopleCategory ;
    peopleCategory.user = req.user;
    peopleCategory.created = Date.now();
	peopleCategory = _.extend(peopleCategory , req.body);

	peopleCategory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleCategory);
		}
	});
};

/**
 * Delete an People category
 */
exports.delete = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var PeopleCategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategoryValue');
    var peopleCategory = req.peopleCategory ;

    async.series([
        // PEOPLE-CATEGORY: Delete Category from its collection
        function(callback){
            peopleCategory.remove(function(err){
                callback(err);
            });
        },
        // CATEGORY-VALUES: Delete all category values (from "categoryValues" collection) belonging to this Category
        function(callback){
            async.each(peopleCategory.categoryValues, function(item, callback){
                PeopleCategoryValue.findByIdAndRemove(item._id, callback);
            });
            callback(null, 'three');
        },
        // PROJECTS: Delete category from each role's categorization in project.stakeholders
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    async.each(projects, function(project, callback){
                        async.each(project.stakeholders, function(assignedGroup, callback){
                            async.each(assignedGroup.roles, function(assignedRole, callback){
                                async.each(assignedRole.categorization, function(assignedCategory, callback){
                                    if(assignedCategory.category.equals(peopleCategory._id)){
                                        assignedCategory.remove();
                                    }
                                    callback();
                                });
                                callback();
                            });
                            callback();
                        });
                        project.save();
                        callback();
                    });
                }
            });
            callback(null, 'three');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(peopleCategory);
        }
    });

};

/**
 * List of People categories
 */
exports.list = function(req, res) {
    var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');
	PeopleCategory.find().deepPopulate(['categoryValues']).populate('user', 'displayName').exec(function(err, peopleCategories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleCategories);
		}
	});
};

/**
 * People category middleware
 */
exports.peopleCategoryByID = function(req, res, next, id) {
    var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');
	PeopleCategory.findById(id).deepPopulate(['categoryValues']).populate('user', 'displayName').exec(function(err, peopleCategory) {
		if (err) return next(err);
		if (! peopleCategory) return next(new Error('Failed to load People category ' + id));
		req.peopleCategory = peopleCategory ;
		next();
	});
};

/**
 * People category authorization middleware
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
