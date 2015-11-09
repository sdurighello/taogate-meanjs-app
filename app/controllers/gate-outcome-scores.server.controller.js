'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Gate outcome score
 */
exports.create = function(req, res) {
	var GateOutcomeScore = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeScore');
	var gateOutcomeScore = new GateOutcomeScore(req.body);
	gateOutcomeScore.user = req.user;

	gateOutcomeScore.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateOutcomeScore);
		}
	});
};

/**
 * Show the current Gate outcome score
 */
exports.read = function(req, res) {
	res.jsonp(req.gateOutcomeScore);
};

/**
 * Update a Gate outcome score
 */
exports.update = function(req, res) {
	var gateOutcomeScore = req.gateOutcomeScore ;
    gateOutcomeScore.user = req.user;
	gateOutcomeScore = _.extend(gateOutcomeScore , req.body);

	gateOutcomeScore.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateOutcomeScore);
		}
	});
};

/**
 * Delete an Gate outcome score
 */
exports.delete = function(req, res) {
	var gateOutcomeScore = req.gateOutcomeScore ;

	gateOutcomeScore.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateOutcomeScore);
		}
	});
};

/**
 * List of Gate outcome scores
 */
exports.list = function(req, res) {
	var GateOutcomeScore = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeScore');
	GateOutcomeScore.find().sort('-created').populate('user', 'displayName').exec(function(err, gateOutcomeScores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateOutcomeScores);
		}
	});
};

/**
 * Gate outcome score middleware
 */
exports.gateOutcomeScoreByID = function(req, res, next, id) {
	var GateOutcomeScore = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeScore');
	GateOutcomeScore.findById(id).populate('user', 'displayName').exec(function(err, gateOutcomeScore) {
		if (err) return next(err);
		if (! gateOutcomeScore) return next(new Error('Failed to load Gate outcome score ' + id));
		req.gateOutcomeScore = gateOutcomeScore ;
		next();
	});
};

/**
 * Gate outcome score authorization middleware
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
