'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Gate outcome
 */

exports.create = function(req, res) {
	var GateOutcome = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcome');
    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');
    var gateOutcome = new GateOutcome(req.body);
	gateOutcome.user = req.user;

	async.series([
		function(callback){
			// Save the new value to its collection
			gateOutcome.save(function(err){
				callback(err);
			});
		},
		function(callback){
			// Add the value to the gate's "gateOutcomes" array
			Gate.findById(req.query.gateId).exec(function(err, gate){
				if(err){
					callback(err);
				} else {
					gate.gateOutcomes.push(gateOutcome._id);
					gate.save(function(err){
						callback(err);
					});
				}
			});
		}
	],function(err){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateOutcome);
		}
	});
};

/**
 * Show the current Gate outcome
 */
exports.read = function(req, res) {
	res.jsonp(req.gateOutcome);
};

/**
 * Update a Gate outcome
 */
exports.update = function(req, res) {
	var gateOutcome = req.gateOutcome ;
    gateOutcome.user = req.user;
    gateOutcome.created = Date.now();
	gateOutcome = _.extend(gateOutcome , req.body);

	gateOutcome.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateOutcome);
		}
	});
};

/**
 * Delete an Gate outcome
 */
exports.delete = function(req, res) {
	var gateOutcome = req.gateOutcome ;
    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');

    async.series([
		// GATE-OUTCOMES: Delete outcome from its collection
		function(callback){
            gateOutcome.remove(function(err){
                callback(err);
            });
        },
        // GATES.GATE-OUTCOMES: Delete outcome from gates where assigned
        function(callback){
            Gate.find({gateOutcomes: {$in: [gateOutcome._id]}}).exec(function(err, gates){
                if(err){
                    return callback(err);
                }
                async.each(gates, function(item, callbackEach){
                    item.gateOutcomes.splice(item.gateOutcomes.indexOf(gateOutcome._id), 1);
                    item.save(function(err){
                        if(err){
                            callbackEach(err);
                        } else {
                            callbackEach();
                        }
                    });
                }, function(err){
                    if(err){
                        return callback(err);
                    }
                    callback(null);
                });
            });
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateOutcome);
        }
    });
};

/**
 * List of Gate outcomes
 */
exports.list = function(req, res) {
	var GateOutcome = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcome');
	GateOutcome.find().populate('user', 'displayName').exec(function(err, gateOutcomes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateOutcomes);
		}
	});
};

/**
 * Gate outcome middleware
 */
exports.gateOutcomeByID = function(req, res, next, id) {
	var GateOutcome = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcome');
	GateOutcome.findById(id).populate('user', 'displayName').exec(function(err, gateOutcome) {
		if (err) return next(err);
		if (! gateOutcome) return next(new Error('Failed to load Gate outcome ' + id));
		req.gateOutcome = gateOutcome ;
		next();
	});
};

/**
 * Gate outcome authorization middleware
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
