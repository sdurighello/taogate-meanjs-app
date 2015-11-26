'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Risk probability
 */
exports.create = function(req, res) {
    var RiskSeverityAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverityAssignment');
    var RiskImpact = mongoose.mtModel(req.user.tenantId + '.' + 'RiskImpact');
	var RiskProbability = mongoose.mtModel(req.user.tenantId + '.' + 'RiskProbability');
	var riskProbability = new RiskProbability(req.body);
	riskProbability.user = req.user;

    async.series([
        // RISK-PROBABILITIES: Save new probability
        function(callback) {
            riskProbability.save(function(err){
                callback(err);
            });
        },
        // RISK-SEVERITY-ASSIGNMENTS: Create an entry for each impact in severity matrix
        function(callback) {
            RiskImpact.find().exec(function(err, impacts){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    async.each(impacts, function(impact, callback){
                        var severityAssignment = new RiskSeverityAssignment({
                            impact : impact._id,
                            probability : riskProbability._id,
                            severity : null
                        });
                        severityAssignment.save();
                        callback();
                    });
                }
            });
            callback(null);
        }
    ], function (err, results) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(riskProbability);
        }
    });
};

/**
 * Show the current Risk probability
 */
exports.read = function(req, res) {
	res.jsonp(req.riskProbability);
};

/**
 * Update a Risk probability
 */
exports.update = function(req, res) {
	var riskProbability = req.riskProbability ;
    riskProbability.user = req.user;
    riskProbability.created = Date.now();
	riskProbability = _.extend(riskProbability , req.body);

	riskProbability.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskProbability);
		}
	});
};

/**
 * Delete an Risk probability
 */
exports.delete = function(req, res) {
    var RiskSeverityAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverityAssignment');
    var riskProbability = req.riskProbability ;
    async.series([
        // RISK-PROBABILITIES: Remove riskProbability
        function(callback) {
            riskProbability.remove(function(err){
                callback(err);
            });
        },
        // RISK-SEVERITY-ASSIGNMENTS: Remove all assignments belonging to that probability
        function(callback) {
            RiskSeverityAssignment.find({probability: riskProbability._id}).exec(function(err, assignments){
                if(err){
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    async.each(assignments, function(assignment, callback){
                        assignment.remove();
                        callback();
                    });
                }
            });
            callback(null);
        }
    ], function (err, results) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(riskProbability);
        }
    });
};

/**
 * List of Risk probabilities
 */
exports.list = function(req, res) {
	var RiskProbability = mongoose.mtModel(req.user.tenantId + '.' + 'RiskProbability');
	RiskProbability.find().sort('probabilityValue').populate('user', 'displayName').exec(function(err, riskProbabilities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskProbabilities);
		}
	});
};

/**
 * Risk probability middleware
 */
exports.riskProbabilityByID = function(req, res, next, id) {
	var RiskProbability = mongoose.mtModel(req.user.tenantId + '.' + 'RiskProbability');
	RiskProbability.findById(id).populate('user', 'displayName').exec(function(err, riskProbability) {
		if (err) return next(err);
		if (! riskProbability) return next(new Error('Failed to load Risk probability ' + id));
		req.riskProbability = riskProbability ;
		next();
	});
};

/**
 * Risk probability authorization middleware
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
