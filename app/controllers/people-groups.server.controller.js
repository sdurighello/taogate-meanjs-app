'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a People group
 */
exports.create = function(req, res) {
	var PeopleGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleGroup');
	var peopleGroup = new PeopleGroup(req.body);
	peopleGroup.user = req.user;

	peopleGroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleGroup);
		}
	});
};

/**
 * Show the current People group
 */
exports.read = function(req, res) {
	res.jsonp(req.peopleGroup);
};

/**
 * Update a People group
 */
exports.update = function(req, res) {
	var peopleGroup = req.peopleGroup ;
    peopleGroup.user = req.user;
	peopleGroup = _.extend(peopleGroup , req.body);

	peopleGroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleGroup);
		}
	});
};

/**
 * Delete an People group
 */
exports.delete = function(req, res) {
	var PeopleGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleGroup');
	var PeopleRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleRole');
	var peopleGroup = req.peopleGroup ;

	async.series([
		function(callback){
			// Delete roles in group from "people roles" collection
			async.each(peopleGroup.roles, function(item, callback){
				PeopleRole.findById(item._id).exec(function(err, role){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						role.remove();
					}
				});
				callback();
			});
			callback(null, 'one');
		},
		function(callback){
			// Delete group from groups
			peopleGroup.remove();
			callback(null, 'two');
		}
	],function(err, results){
		// results is now equal to ['one', 'two']
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleGroup);
		}
	});

};

/**
 * List of People groups
 */
exports.list = function(req, res) {
	var PeopleGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleGroup');
	PeopleGroup.find().deepPopulate(['roles']).sort('-created').populate('user', 'displayName').exec(function(err, peopleGroups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleGroups);
		}
	});
};

/**
 * People group middleware
 */
exports.peopleGroupByID = function(req, res, next, id) {
	var PeopleGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleGroup');
	PeopleGroup.findById(id).deepPopulate(['roles']).populate('user', 'displayName').exec(function(err, peopleGroup) {
		if (err) return next(err);
		if (! peopleGroup) return next(new Error('Failed to load People group ' + id));
		req.peopleGroup = peopleGroup ;
		next();
	});
};

/**
 * People group authorization middleware
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
