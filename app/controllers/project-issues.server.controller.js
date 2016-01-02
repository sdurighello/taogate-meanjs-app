'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Project issue
 */
exports.create = function(req, res) {
    var Counter = mongoose.mtModel(req.user.tenantId + '.' + 'Counter');
	var ProjectIssue = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectIssue');

	var projectIssue = new ProjectIssue(req.body);

    projectIssue.user = req.user;
    projectIssue.statusReview = {
        currentRecord : { user : req.user, completed : false},
        history : []
    };

    async.series([
        // Add the sequential number
        function(callback){
            Counter.findByIdAndUpdate({_id: 'projectIssueSequence'}, {$inc: { seq: 1} }, function(error, counter)   {
                if(error){
                    return callback(error);
                }
                // Must create the the document in 'counter' collection for our entity the first time we create an entity document
                if(!counter){
                    var newCounter = new Counter({
                        _id : 'projectIssueSequence'
                    });
                    newCounter.save(function(err){
                        if(err){
                            return callback( new Error('Failed to create sequence counter for Project issue'));
                        }
                        projectIssue.idNumber = 1;
                        callback(null);
                    });
                }
                if(counter) {
                    projectIssue.idNumber = counter.seq;
                    callback(null);
                }
            });
        },
        function(callback){
            projectIssue.save(function(err) {
                callback(err);
            });
        }
    ], function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectIssue);
        }
    });
};

/**
 * Show the current Project issue
 */
exports.read = function(req, res) {
	res.jsonp(req.projectIssue);
};

/**
 * Update a Project issue
 */
exports.update = function(req, res) {
	var projectIssue = req.projectIssue ;
	projectIssue.user = req.user;
	projectIssue.created = Date.now();
	projectIssue = _.extend(projectIssue , req.body);

	projectIssue.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectIssue);
		}
	});
};

/**
 * Delete an Project issue
 */
exports.delete = function(req, res) {
	var projectIssue = req.projectIssue ;

	projectIssue.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectIssue);
		}
	});
};

/**
 * List of Project issues
 */
exports.list = function(req, res) {
	var ProjectIssue = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectIssue');
	ProjectIssue.find().populate('user', 'displayName').exec(function(err, projectIssues) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectIssues);
		}
	});
};

/**
 * Project issue middleware
 */
exports.projectIssueByID = function(req, res, next, id) {
	var ProjectIssue = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectIssue');
	ProjectIssue.findById(id).deepPopulate([
        'gate', 'reason', 'state', 'priority', 'statusReview.currentRecord.status'
    ]).populate('user', 'displayName').exec(function(err, projectIssue) {
		if (err) return next(err);
		if (! projectIssue) return next(new Error('Failed to load Project issue ' + id));
		req.projectIssue = projectIssue ;
		next();
	});
};

/**
 * Project issue authorization middleware
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
