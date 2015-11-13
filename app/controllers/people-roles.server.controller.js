'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a People role
 */
exports.create = function(req, res) {
	var PeopleRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleRole');
	var peopleRole = new PeopleRole(req.body);
	peopleRole.user = req.user;

	peopleRole.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleRole);
		}
	});
};

/**
 * Show the current People role
 */
exports.read = function(req, res) {
	res.jsonp(req.peopleRole);
};

/**
 * Update a People role
 */
exports.update = function(req, res) {
	var peopleRole = req.peopleRole ;
	peopleRole.user = req.user;
	peopleRole.created = Date.now();
	peopleRole = _.extend(peopleRole , req.body);

	peopleRole.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleRole);
		}
	});
};

/**
 * Delete an People role
 */
exports.delete = function(req, res) {
	var peopleRole = req.peopleRole ;
	var PeopleProjectGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectGroup');
	var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');

	async.series([
		function(callback){
			// Delete role from roles
			peopleRole.remove();
			callback(null, 'one');
		},
		function(callback){
			// Delete role from PROJECT groups where assigned
			PeopleProjectGroup.find({roles: {$in: [peopleRole._id]}}).exec(function(err, groups){
				async.each(groups, function(item, callback){
					item.roles.splice(item.roles.indexOf(peopleRole._id), 1);
					item.save();
					callback();
				});
			});
			callback(null, 'three');
		},
		function(callback){
			// Delete role from PORTFOLIO groups where assigned
			PeoplePortfolioGroup.find({roles: {$in: [peopleRole._id]}}).exec(function(err, groups){
				async.each(groups, function(item, callback){
					item.roles.splice(item.roles.indexOf(peopleRole._id), 1);
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
			res.jsonp(peopleRole);
		}
	});
};

/**
 * List of People roles
 */
exports.list = function(req, res) {
	var PeopleRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleRole');
	PeopleRole.find().sort('-created').populate('user', 'displayName').exec(function(err, peopleRoles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleRoles);
		}
	});
};

/**
 * People role middleware
 */
exports.peopleRoleByID = function(req, res, next, id) {
	var PeopleRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleRole');
	PeopleRole.findById(id).populate('user', 'displayName').exec(function(err, peopleRole) {
		if (err) return next(err);
		if (! peopleRole) return next(new Error('Failed to load People role ' + id));
		req.peopleRole = peopleRole ;
		next();
	});
};

/**
 * People role authorization middleware
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
