'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a People Project group
 */
exports.create = function(req, res) {
	var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
	var PeopleProjectGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectGroup');
	var peopleProjectGroup = new PeopleProjectGroup(req.body);
	peopleProjectGroup.user = req.user;

    async.series([
        // GROUP: Save Group in its collection
        function(callback){
            peopleProjectGroup.save(function(err){
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
                        project.stakeholders.push({
                            group: peopleProjectGroup._id,
                            roles: []
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
            res.jsonp(peopleProjectGroup);
        }
    });
};

/**
 * Show the current People Project group
 */
exports.read = function(req, res) {
	res.jsonp(req.peopleProjectGroup);
};

/**
 * Update a People Project group
 */
exports.update = function(req, res) {
	var peopleProjectGroup = req.peopleProjectGroup ;
	peopleProjectGroup.user = req.user;
	peopleProjectGroup.created = Date.now();
	peopleProjectGroup = _.extend(peopleProjectGroup , req.body);

	peopleProjectGroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleProjectGroup);
		}
	});
};

/**
 * Delete an People Project group
 */
exports.delete = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
	var PeopleProjectGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectGroup');
	var peopleProjectGroup = req.peopleProjectGroup ;

    async.series([
        // PEOPLE-PROJECT-GROUP: Delete Group from its collection
        function(callback){
            peopleProjectGroup.remove(function(err){
                callback(err);
            });
        },
        // PROJECTS: Delete group object from project.stakeholders
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    callback(err);
                } else {
                    async.each(projects, function(project, callback){
                        async.each(project.stakeholders, function(assignedGroup, callback){
                            if(assignedGroup.group.equals(peopleProjectGroup._id)){
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
            res.jsonp(peopleProjectGroup);
        }
    });
};

/**
 * List of People Project groups
 */
exports.list = function(req, res) {
	var PeopleProjectGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectGroup');
	PeopleProjectGroup.find().populate('user', 'displayName').exec(function(err, peopleProjectGroups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleProjectGroups);
		}
	});
};

/**
 * People Project group middleware
 */
exports.peopleProjectGroupByID = function(req, res, next, id) {
	var PeopleProjectGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectGroup');
	PeopleProjectGroup.findById(id).populate('user', 'displayName').exec(function(err, peopleProjectGroup) {
		if (err) return next(err);
		if (! peopleProjectGroup) return next(new Error('Failed to load People Project group ' + id));
		req.peopleProjectGroup = peopleProjectGroup ;
		next();
	});
};

/**
 * People Project group authorization middleware
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
