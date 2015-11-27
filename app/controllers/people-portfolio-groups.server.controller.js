'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a People portfolio group
 */
exports.create = function(req, res) {
	var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');
	var peoplePortfolioGroup = new PeoplePortfolioGroup(req.body);
	peoplePortfolioGroup.user = req.user;

	peoplePortfolioGroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peoplePortfolioGroup);
		}
	});
};

/**
 * Show the current People Portfolio group
 */
exports.read = function(req, res) {
	res.jsonp(req.peoplePortfolioGroup);
};

/**
 * Update a People Portfolio group
 */
exports.update = function(req, res) {
	var peoplePortfolioGroup = req.peoplePortfolioGroup ;
	peoplePortfolioGroup.user = req.user;
	peoplePortfolioGroup.created = Date.now();
	peoplePortfolioGroup = _.extend(peoplePortfolioGroup , req.body);

	peoplePortfolioGroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peoplePortfolioGroup);
		}
	});
};

/**
 * Delete an People Portfolio group
 */
exports.delete = function(req, res) {
	var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');
	var PeoplePortfolioRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioRole');
	var peoplePortfolioGroup = req.peoplePortfolioGroup ;

	async.series([
		function(callback){
			// Delete roles in group from "people roles" collection
			async.each(peoplePortfolioGroup.roles, function(item, callback){
				PeoplePortfolioRole.findById(item._id).exec(function(err, role){
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
			peoplePortfolioGroup.remove();
			callback(null, 'two');
		}
	],function(err, results){
		// results is now equal to ['one', 'two']
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peoplePortfolioGroup);
		}
	});
};

/**
 * List of People Portfolio groups
 */
exports.list = function(req, res) {
	var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');
	PeoplePortfolioGroup.find().deepPopulate(['roles']).sort('-created').populate('user', 'displayName').exec(function(err, peoplePortfolioGroups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peoplePortfolioGroups);
		}
	});
};

/**
 * People Portfolio group middleware
 */
exports.peoplePortfolioGroupByID = function(req, res, next, id) {
	var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');
	PeoplePortfolioGroup.findById(id).deepPopulate(['roles']).populate('user', 'displayName').exec(function(err, peoplePortfolioGroup) {
		if (err) return next(err);
		if (! peoplePortfolioGroup) return next(new Error('Failed to load People Portfolio group ' + id));
		req.peoplePortfolioGroup = peoplePortfolioGroup ;
		next();
	});
};

/**
 * People Portfolio group authorization middleware
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
