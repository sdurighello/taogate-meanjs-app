'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Qualitative impact score
 */
exports.create = function(req, res) {
    var QualitativeImpactScore = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactScore');
	var qualitativeImpactScore = new QualitativeImpactScore(req.body);
	qualitativeImpactScore.user = req.user;

	qualitativeImpactScore.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(qualitativeImpactScore);
		}
	});
};

/**
 * Show the current Qualitative impact score
 */
exports.read = function(req, res) {
	res.jsonp(req.qualitativeImpactScore);
};

/**
 * Update a Qualitative impact score
 */
exports.update = function(req, res) {
	var qualitativeImpactScore = req.qualitativeImpactScore ;
    qualitativeImpactScore.user = req.user;
	qualitativeImpactScore = _.extend(qualitativeImpactScore , req.body);

	qualitativeImpactScore.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(qualitativeImpactScore);
		}
	});
};

/**
 * Delete an Qualitative impact score
 */
exports.delete = function(req, res) {
	var qualitativeImpactScore = req.qualitativeImpactScore ;

	qualitativeImpactScore.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(qualitativeImpactScore);
		}
	});
};

/**
 * List of Qualitative impact scores
 */
exports.list = function(req, res) {
    var QualitativeImpactScore = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactScore');
	QualitativeImpactScore.find().sort('numericalValue').populate('user', 'displayName').exec(function(err, qualitativeImpactScores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(qualitativeImpactScores);
		}
	});
};

/**
 * Qualitative impact score middleware
 */
exports.qualitativeImpactScoreByID = function(req, res, next, id) {
    var QualitativeImpactScore = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactScore');
	QualitativeImpactScore.findById(id).populate('user', 'displayName').exec(function(err, qualitativeImpactScore) {
		if (err) return next(err);
		if (! qualitativeImpactScore) return next(new Error('Failed to load Qualitative impact score ' + id));
		req.qualitativeImpactScore = qualitativeImpactScore ;
		next();
	});
};

/**
 * Qualitative impact score authorization middleware
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
