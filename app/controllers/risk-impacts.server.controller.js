'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Risk impact
 */
exports.create = function(req, res) {
    var RiskSeverityAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverityAssignment');
    var RiskProbability = mongoose.mtModel(req.user.tenantId + '.' + 'RiskProbability');
	var RiskImpact = mongoose.mtModel(req.user.tenantId + '.' + 'RiskImpact');
    var riskImpact = new RiskImpact(req.body);
	riskImpact.user = req.user;

    async.series([
        // RISK-IMPACTS: Save new impact to its collection
        function(callback) {
            riskImpact.save(function(err){
                callback(err);
            });
        },
        // RISK-SEVERITY-ASSIGNMENT: create empty severity assignment for each existing probability
        function(callback) {
            RiskProbability.find().exec(function(err, probabilities){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    async.each(probabilities, function(probability, callback){
                        var severityAssignment = new RiskSeverityAssignment({
                            impact : riskImpact._id,
                            probability : probability._id,
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
            res.jsonp(riskImpact);
        }
    });
};

/**
 * Show the current Risk impact
 */
exports.read = function(req, res) {
	res.jsonp(req.riskImpact);
};

/**
 * Update a Risk impact
 */
exports.update = function(req, res) {
    var riskImpact = req.riskImpact ;
    riskImpact.user = req.user;
    riskImpact.created = Date.now();
	riskImpact = _.extend(riskImpact , req.body);

	riskImpact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskImpact);
		}
	});
};

/**
 * Delete an Risk impact
 */
exports.delete = function(req, res) {
    var RiskSeverityAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverityAssignment');
    var riskImpact = req.riskImpact ;
    async.series([
        // RISK-IMPACTS: Remove impact
        function(callback) {
            riskImpact.remove(function(err){
                callback(err);
            });
        },
        // RISK-SEVERITY-ASSIGNMENTS: Remove all assignments belonging to that impact
        function(callback) {
            RiskSeverityAssignment.find({impact: riskImpact._id}).exec(function(err, assignments){
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
            res.jsonp(riskImpact);
        }
    });
};

/**
 * List of Risk impacts
 */
exports.list = function(req, res) {
	var RiskImpact = mongoose.mtModel(req.user.tenantId + '.' + 'RiskImpact');
	RiskImpact.find().sort('impactValue').populate('user', 'displayName').exec(function(err, riskImpacts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskImpacts);
		}
	});
};

/**
 * Risk impact middleware
 */
exports.riskImpactByID = function(req, res, next, id) {
	var RiskImpact = mongoose.mtModel(req.user.tenantId + '.' + 'RiskImpact');
	RiskImpact.findById(id).populate('user', 'displayName').exec(function(err, riskImpact) {
		if (err) return next(err);
		if (! riskImpact) return next(new Error('Failed to load Risk impact ' + id));
		req.riskImpact = riskImpact ;
		next();
	});
};

/**
 * Risk impact authorization middleware
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
