'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	_ = require('lodash');

/**
 * Create a Person
 */
exports.create = function(req, res) {
	var Person = mongoose.mtModel(req.user.tenantId + '.' + 'Person');
	var person = new Person(req.body);
	person.user = req.user;

	person.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(person);
		}
	});
};

/**
 * Show the current Person
 */
exports.read = function(req, res) {
	res.jsonp(req.person);
};

/**
 * Update a Person
 */
exports.update = function(req, res) {
	var person = req.person ;

	person = _.extend(person , req.body);
	person.user = req.user;
	person.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(person);
		}
	});
};

/**
 * Delete an Person
 */
exports.delete = function(req, res) {
	var person = req.person ;

	person.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(person);
		}
	});
};

/**
 * List of People
 */
exports.list = function(req, res) {
	var Person = mongoose.mtModel(req.user.tenantId + '.' + 'Person');
	Person.find().sort('-created').populate('user', 'displayName').exec(function(err, people) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(people);
		}
	});
};

/**
 * Person middleware
 */
exports.personByID = function(req, res, next, id) {
	var Person = mongoose.mtModel(req.user.tenantId + '.' + 'Person');
	Person.findById(id).populate('user', 'displayName').exec(function(err, person) {
		if (err) return next(err);
		if (! person) return next(new Error('Failed to load Person ' + id));
		req.person = person ;
		next();
	});
};

/**
 * Person authorization middleware
 */
exports.hasCreateAuthorization = function(req, res, next) {
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

exports.hasEditAuthorization = function(req, res, next) {
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
