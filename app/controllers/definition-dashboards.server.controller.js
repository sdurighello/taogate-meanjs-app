'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	DefinitionDashboard = mongoose.model('DefinitionDashboard'),
	_ = require('lodash');

/**
 * Create a Definition dashboard
 */
exports.create = function(req, res) {
	var definitionDashboard = new DefinitionDashboard(req.body);
	definitionDashboard.user = req.user;

	definitionDashboard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(definitionDashboard);
		}
	});
};

/**
 * Show the current Definition dashboard
 */
exports.read = function(req, res) {
	res.jsonp(req.definitionDashboard);
};

/**
 * Update a Definition dashboard
 */
exports.update = function(req, res) {
	var definitionDashboard = req.definitionDashboard ;

	definitionDashboard = _.extend(definitionDashboard , req.body);

	definitionDashboard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(definitionDashboard);
		}
	});
};

/**
 * Delete an Definition dashboard
 */
exports.delete = function(req, res) {
	var definitionDashboard = req.definitionDashboard ;

	definitionDashboard.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(definitionDashboard);
		}
	});
};

/**
 * List of Definition dashboards
 */
exports.list = function(req, res) { 
	DefinitionDashboard.find().sort('-created').populate('user', 'displayName').exec(function(err, definitionDashboards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(definitionDashboards);
		}
	});
};

/**
 * Definition dashboard middleware
 */
exports.definitionDashboardByID = function(req, res, next, id) { 
	DefinitionDashboard.findById(id).populate('user', 'displayName').exec(function(err, definitionDashboard) {
		if (err) return next(err);
		if (! definitionDashboard) return next(new Error('Failed to load Definition dashboard ' + id));
		req.definitionDashboard = definitionDashboard ;
		next();
	});
};

/**
 * Definition dashboard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.definitionDashboard.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
