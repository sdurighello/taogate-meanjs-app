'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Portfoliotype
 */
exports.create = function(req, res) {
	var Portfoliotype = mongoose.mtModel(req.user.tenantId + '.' + 'Portfoliotype');
	var portfoliotype = new Portfoliotype(req.body);
	portfoliotype.user = req.user;

	portfoliotype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfoliotype);
		}
	});
};

/**
 * Show the current Portfoliotype
 */
exports.read = function(req, res) {
	res.jsonp(req.portfoliotype);
};

/**
 * Update a Portfoliotype
 */
exports.update = function(req, res) {
	var portfoliotype = req.portfoliotype ;

	portfoliotype = _.extend(portfoliotype , req.body);
	portfoliotype.user = req.user;

	portfoliotype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfoliotype);
		}
	});
};

/**
 * Delete an Portfoliotype
 */
exports.delete = function(req, res) {

	var Portfoliotype = mongoose.mtModel(req.user.tenantId + '.' + 'Portfoliotype');
	var portfoliotype = req.portfoliotype;

	var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

	async.series([
		function(callback){
			// Delete portfolio type from portfolio types
			portfoliotype.remove();
			callback(null, 'one');
		},
		function(callback){
			// Remove portfolio type assignment from portfolios
			Portfolio.find({type: portfoliotype._id}).exec(function(err, portfolios){
				async.each(portfolios, function(item, callback){
					item.type = null;
					item.save();
					callback();
				});
			});
			callback(null, 'two');
		}
	],function(err, results){
		// results is now equal to ['one', 'two']
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfoliotype);
		}
	});
};

/**
 * List of Portfoliotypes
 */
exports.list = function(req, res) {
	var Portfoliotype = mongoose.mtModel(req.user.tenantId + '.' + 'Portfoliotype');
	Portfoliotype.find().sort('-created').populate('user', 'displayName').exec(function(err, portfoliotypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfoliotypes);
		}
	});
};

/**
 * Portfoliotype middleware
 */
exports.portfoliotypeByID = function(req, res, next, id) {
	var Portfoliotype = mongoose.mtModel(req.user.tenantId + '.' + 'Portfoliotype');
	Portfoliotype.findById(id).populate('user', 'displayName').exec(function(err, portfoliotype) {
		if (err) return next(err);
		if (! portfoliotype) return next(new Error('Failed to load Portfoliotype ' + id));
		req.portfoliotype = portfoliotype ;
		next();
	});
};

/**
 * Portfoliotype authorization middleware
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
