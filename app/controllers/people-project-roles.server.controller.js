'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a People project role
 */
exports.create = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');
    var PeopleProjectGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectGroup');
    var PeopleProjectRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectRole');
	var peopleProjectRole = new PeopleProjectRole(req.body);
	peopleProjectRole.user = req.user;

    async.series([
        // ROLES: Save the new role to its collection
        function(callback){
            peopleProjectRole.save(function(err){
                callback(err);
            });
        },
        // GROUP.ROLES: Add the role to the group's "roles" array
        function(callback){
            PeopleProjectGroup.findById(req.query.groupId).exec(function(err, group){
                    if (err) {
                        callback(err);
                    } else {
                        group.roles.push(peopleProjectRole._id);
                        group.save(function(err){
                            callback(err);
                        });
                    }
            });
        },
        // PROJECTS.STAKEHOLDERS: Add the role to all existing projects (requires the "categorization" array built from existing people-categories)
        function(callback){
            async.waterfall([
                // Create the "categorization" array [{category:<objectId>, categoryValue:null}] from all existing people-categories
                function(callback){
                    PeopleCategory.find().exec(function(err, categories) {
                        if (err) {
                            callback(err);
                        } else {
                            var retArray = [];
                            async.each(categories, function(category, callback){
                                retArray.push({
                                    category: category._id,
                                    categoryValue: null
                                });
                                callback();
                            });
                            callback(null, retArray);
                        }
                    });
                },
                // Add to all existing projects the new role with the "categorization" array (to the correct people-group)
                function(retArray, callback){
                    Project.find().exec(function(err, projects){
                        if (err) {
                            callback(err);
                        } else {
                            async.each(projects, function(project, callback){
                                async.each(project.stakeholders, function(assignedGroup, callback){
                                    if(assignedGroup.group.equals(req.query.groupId)){
                                        assignedGroup.roles.push({
                                            role: peopleProjectRole._id,
                                            person: null,
                                            categorization: retArray
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
                    callback(err);
                } else {
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
            res.jsonp(peopleProjectRole);
        }
    });
};

/**
 * Show the current People project role
 */
exports.read = function(req, res) {
	res.jsonp(req.peopleProjectRole);
};

/**
 * Update a People project role
 */
exports.update = function(req, res) {
	var peopleProjectRole = req.peopleProjectRole ;

	peopleProjectRole = _.extend(peopleProjectRole , req.body);

	peopleProjectRole.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleProjectRole);
		}
	});
};

/**
 * Delete an People project role
 */
exports.delete = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var PeopleProjectGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectGroup');
    var peopleProjectRole = req.peopleProjectRole ;

    async.series([
        // ROLES: Delete role from its collection
        function(callback){
            peopleProjectRole.remove(function(err){
                callback(err);
            });
        },
        // GROUP.ROLES: Delete role from group where assigned
        function(callback){
            PeopleProjectGroup.findById(req.query.groupId).exec(function(err, group){
                if(err){
                    callback(err);
                } else {
                    group.roles.splice(group.roles.indexOf(peopleProjectRole._id), 1);
                    group.save(function(err){
                        if(err){
                            callback(err);
                        } else {
                            callback(null);
                        }
                    });
                }
            });
        },
        // PROJECTS.STAKEHOLDERS: Remove the role from all existing projects
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    callback(err);
                } else {
                    async.each(projects, function(project, callback){
                        async.each(project.stakeholders, function(assignedGroup, callback){
                            if(assignedGroup.group.equals(req.query.groupId)){
                                async.each(assignedGroup.roles, function(assignedRole, callback){
                                    if(assignedRole.role.equals(peopleProjectRole._id)){
                                        assignedRole.remove();
                                    }
                                    callback();
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
                }
            });
            callback(null);
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(peopleProjectRole);
        }
    });
};

/**
 * List of People project roles
 */
exports.list = function(req, res) {
    var PeopleProjectRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectRole');
	PeopleProjectRole.find().populate('user', 'displayName').exec(function(err, peopleProjectRoles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleProjectRoles);
		}
	});
};

/**
 * People project role middleware
 */
exports.peopleProjectRoleByID = function(req, res, next, id) {
    var PeopleProjectRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectRole');
	PeopleProjectRole.findById(id).populate('user', 'displayName').exec(function(err, peopleProjectRole) {
		if (err) return next(err);
		if (! peopleProjectRole) return next(new Error('Failed to load People project role ' + id));
		req.peopleProjectRole = peopleProjectRole ;
		next();
	});
};

/**
 * People project role authorization middleware
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
