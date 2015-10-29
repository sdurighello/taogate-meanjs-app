'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Priority type
 */
exports.create = function(req, res) {
	var PriorityType = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityType');
	var priorityType = new PriorityType(req.body);
	priorityType.user = req.user;

	priorityType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(priorityType);
		}
	});
};

/**
 * Show the current Priority type
 */
exports.read = function(req, res) {
	res.jsonp(req.priorityType);
};

/**
 * Update a Priority type
 */
exports.update = function(req, res) {
	var priorityType = req.priorityType ;
    priorityType.user = req.user;
	priorityType = _.extend(priorityType , req.body);

	priorityType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(priorityType);
		}
	});
};

/**
 * Delete an Priority type
 */
exports.delete = function(req, res) {
    var PriorityType = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityType');
    var Priority = mongoose.mtModel(req.user.tenantId + '.' + 'Priority');
    var priorityType = req.priorityType ;

    async.series([
        function(callback){
            // Delete all priorities (from "priorities" collection) belonging to this priority type
            async.each(priorityType.priorities, function(item, callback){
                Priority.findById(item._id).exec(function(err, priority){
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        priority.remove();
                    }
                });
                callback();
            });
            callback(null, 'one');
        },
        function(callback){
            // Delete type from its collection
            priorityType.remove();
            callback(null, 'two');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(priorityType);
        }
    });
};

/**
 * List of Priority types
 */
exports.list = function(req, res) {
    var PriorityType = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityType');
	PriorityType.find().deepPopulate(['priorities']).sort('-created').populate('user', 'displayName').exec(function(err, priorityTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(priorityTypes);
		}
	});
};

/**
 * Priority type middleware
 */
exports.priorityTypeByID = function(req, res, next, id) {
    var PriorityType = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityType');
	PriorityType.findById(id).deepPopulate(['priorities']).populate('user', 'displayName').exec(function(err, priorityType) {
		if (err) return next(err);
		if (! priorityType) return next(new Error('Failed to load Priority type ' + id));
		req.priorityType = priorityType ;
		next();
	});
};

/**
 * Priority type authorization middleware
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
