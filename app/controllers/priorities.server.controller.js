'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Priority
 */
exports.create = function(req, res) {
	var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

	var PriorityGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityGroup');
	var Priority = mongoose.mtModel(req.user.tenantId + '.' + 'Priority');
	var priority = new Priority(req.body);
	priority.user = req.user;

	async.series([
		// PRIORITIES: Save the new priority to its collection
		function(callback){
			priority.save();
			callback(null, 'one');
		},
		// GROUP.PRIORITIES: Add the priority to the group's "priorities" array
		function(callback){
			PriorityGroup.findById(req.query.groupId).exec(function(err, group){
				group.priorities.push(priority._id);
				group.save();
			});
			callback(null, 'two');
		},
		// PROJECTS.CATEGORIZATION: Add the category to all existing projects
		function(callback){
			Project.find().exec(function(err, projects){
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					async.each(projects, function(project, callback){
						async.each(project.prioritization, function(assignedGroup, callback){
							if(assignedGroup.group.equals(req.query.groupId)){
								assignedGroup.priorities.push({
									priority: priority._id,
									priorityValue: null
								});
							}
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
		// results is now equal to ['one', 'two', 'three']
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(priority);
		}
	});
};

/**
 * Show the current Priority
 */
exports.read = function(req, res) {
	res.jsonp(req.priority);
};

/**
 * Update a Priority
 */
exports.update = function(req, res) {
	var priority = req.priority ;
    priority.user = req.user;
	priority.created = Date.now();
	priority = _.extend(priority , req.body);

	priority.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(priority);
		}
	});
};

/**
 * Delete an Priority
 */
exports.delete = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var priority = req.priority ;
    var PriorityGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityGroup');

    async.series([
        // PRIORITIES: Delete priority from its collection
        function(callback){
            priority.remove();
            callback(null, 'one');
        },
        // GROUP.PRIORITIES: Delete priority from group where assigned
        function(callback){
            PriorityGroup.findById(req.query.groupId).exec(function(err, group){
                group.priorities.splice(group.priorities.indexOf(priority._id), 1);
                group.save();
            });
            callback(null, 'three');
        },
        // PROJECTS.PRIORITIZATION: Remove the priority to all existing projects
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    async.each(projects, function(project, callback){
                        async.each(project.prioritization, function(assignedGroup, callback){
                            if(assignedGroup.group.equals(req.query.groupId)){
                                async.each(assignedGroup.priorities, function(assignedPriority, callback){
                                    if(assignedPriority.priority.equals(priority._id)){
                                        assignedPriority.remove();
                                    }
                                    callback();
                                });
                            }
                            callback();
                        });
                        project.save();
                        callback();
                    });
                }
            });
            callback(null, 'four');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(priority);
        }
    });
};

/**
 * List of Priorities
 */
exports.list = function(req, res) {
    var Priority = mongoose.mtModel(req.user.tenantId + '.' + 'Priority');
	Priority.find().sort('-created').populate('user', 'displayName').exec(function(err, priorities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(priorities);
		}
	});
};

/**
 * Priority middleware
 */
exports.priorityByID = function(req, res, next, id) {
    var Priority = mongoose.mtModel(req.user.tenantId + '.' + 'Priority');
	Priority.findById(id).populate('user', 'displayName').exec(function(err, priority) {
		if (err) return next(err);
		if (! priority) return next(new Error('Failed to load Priority ' + id));
		req.priority = priority ;
		next();
	});
};

/**
 * Priority authorization middleware
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
