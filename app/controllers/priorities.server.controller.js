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
	var Priority = mongoose.mtModel(req.user.tenantId + '.' + 'Priority');
	var priority = new Priority(req.body);
	priority.user = req.user;

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
    var priority = req.priority ;
    var PriorityGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityGroup');

    async.series([
        function(callback){
            // Delete priority from its collection
            priority.remove();
            callback(null, 'one');
        },
        function(callback){
            // Delete priority from groups where assigned
            PriorityGroup.find({priorities: {$in: [priority._id]}}).exec(function(err, groups){
                async.each(groups, function(item, callback){
                    item.priorities.splice(item.priorities.indexOf(priority._id), 1);
                    item.save();
                    callback();
                });
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
