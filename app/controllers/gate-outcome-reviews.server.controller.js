'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Gate outcome review
 */
exports.create = function(req, res) {
	var GateOutcomeReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeReview');
	var gateOutcomeReview = new GateOutcomeReview(req.body);
	gateOutcomeReview.user = req.user;

	gateOutcomeReview.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateOutcomeReview);
		}
	});
};

/**
 * Show the current Gate outcome review
 */
exports.read = function(req, res) {
	res.jsonp(req.gateOutcomeReview);
};

/**
 * Update a Gate outcome review
 */
exports.update = function(req, res) {
	var gateOutcomeReview = req.gateOutcomeReview ;

	gateOutcomeReview = _.extend(gateOutcomeReview , req.body);

	gateOutcomeReview.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateOutcomeReview);
		}
	});
};

/**
 * Delete an Gate outcome review
 */
exports.delete = function(req, res) {
	var gateOutcomeReview = req.gateOutcomeReview ;

	gateOutcomeReview.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateOutcomeReview);
		}
	});
};

/**
 * List of Gate outcome reviews
 */
exports.list = function(req, res) {
    var GateOutcomeReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeReview');
	GateOutcomeReview.find().populate('user', 'displayName').exec(function(err, gateOutcomeReviews) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateOutcomeReviews);
		}
	});
};

/**
 * Gate outcome review middleware
 */
exports.gateOutcomeReviewByID = function(req, res, next, id) {
    var GateOutcomeReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeReview');
	GateOutcomeReview.findById(id).populate('user', 'displayName').exec(function(err, gateOutcomeReview) {
		if (err) return next(err);
		if (! gateOutcomeReview) return next(new Error('Failed to load Gate outcome review ' + id));
		req.gateOutcomeReview = gateOutcomeReview ;
		next();
	});
};

/**
 * Gate outcome review authorization middleware
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
