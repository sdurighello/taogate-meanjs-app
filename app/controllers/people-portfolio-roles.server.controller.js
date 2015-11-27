'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a People portfolio role
 */
exports.create = function(req, res) {
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
    var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');
	var PeoplePortfolioRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioRole');
	var peoplePortfolioRole = new PeoplePortfolioRole(req.body);
	peoplePortfolioRole.user = req.user;

	peoplePortfolioRole.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peoplePortfolioRole);
		}
	});
};

/**
 * Show the current People portfolio role
 */
exports.read = function(req, res) {
	res.jsonp(req.peoplePortfolioRole);
};

/**
 * Update a People portfolio role
 */
exports.update = function(req, res) {
	var peoplePortfolioRole = req.peoplePortfolioRole ;
    peoplePortfolioRole.user = req.user;
    peoplePortfolioRole.created = Date.now();
	peoplePortfolioRole = _.extend(peoplePortfolioRole , req.body);

	peoplePortfolioRole.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peoplePortfolioRole);
		}
	});
};

/**
 * Delete an People portfolio role
 */
exports.delete = function(req, res) {
	var peoplePortfolioRole = req.peoplePortfolioRole ;

	peoplePortfolioRole.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peoplePortfolioRole);
		}
	});
};

/**
 * List of People portfolio roles
 */
exports.list = function(req, res) {
    var PeoplePortfolioRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioRole');
	PeoplePortfolioRole.find().populate('user', 'displayName').exec(function(err, peoplePortfolioRoles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peoplePortfolioRoles);
		}
	});
};

/**
 * People portfolio role middleware
 */
exports.peoplePortfolioRoleByID = function(req, res, next, id) {
    var PeoplePortfolioRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioRole');
	PeoplePortfolioRole.findById(id).populate('user', 'displayName').exec(function(err, peoplePortfolioRole) {
		if (err) return next(err);
		if (! peoplePortfolioRole) return next(new Error('Failed to load People portfolio role ' + id));
		req.peoplePortfolioRole = peoplePortfolioRole ;
		next();
	});
};

/**
 * People portfolio role authorization middleware
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
