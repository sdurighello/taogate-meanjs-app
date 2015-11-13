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
	var PeopleProjectGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectGroup');
	var peopleProjectGroup = new PeopleProjectGroup(req.body);
	peopleProjectGroup.user = req.user;

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
	var PeopleProjectGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectGroup');
	var PeopleRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleRole');
	var peopleProjectGroup = req.peopleProjectGroup ;

	async.series([
		function(callback){
			// Delete roles in group from "people roles" collection
			async.each(peopleProjectGroup.roles, function(item, callback){
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
			peopleProjectGroup.remove();
			callback(null, 'two');
		}
	],function(err, results){
		// results is now equal to ['one', 'two']
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
	PeopleProjectGroup.find().deepPopulate(['roles']).sort('-created').populate('user', 'displayName').exec(function(err, peopleProjectGroups) {
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
	PeopleProjectGroup.findById(id).deepPopulate(['roles']).populate('user', 'displayName').exec(function(err, peopleProjectGroup) {
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
