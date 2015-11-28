'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Gate
 */
exports.create = function(req, res) {
	var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');
	var gate = new Gate(req.body);
	gate.user = req.user;

	gate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gate);
		}
	});

};

/**
 * Show the current Gate
 */
exports.read = function(req, res) {
	res.jsonp(req.gate);
};

/**
 * Update a Gate
 */
exports.update = function(req, res) {
	var gate = req.gate ;
    gate.user = req.user;
    gate.created = Date.now();
	gate = _.extend(gate , req.body);

	gate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gate);
		}
	});
};

/**
 * Delete an Gate
 */
exports.delete = function(req, res) {
    var gate = req.gate ;
    var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
    var GateOutcome = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcome');

    async.series([
        // GATES: Delete gate from its collection
        function(callback){
            gate.remove(function(err){
                callback(err);
            });
        },
        // OUTCOMES: Delete its outcomes from the outcomes collection
        function(callback){
            async.each(gate.gateOutcomes, function(item, callback){
                GateOutcome.findByIdAndRemove(item._id, function(err){
                    if(err){callback(err);} else {callback();}
                });
            });
            callback(null);
        },
        // PROCESS-GATES: Delete gate from processes where assigned
        function(callback){
            GateProcess.find({gates: {$in: [gate._id]}}).exec(function(err, processes){
                if(err){
                    callback(err);
                } else {
                    async.each(processes, function(item, callback){
                        item.gates.splice(item.gates.indexOf(gate._id), 1);
                        item.save(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    });
                    callback(null);
                }
            });
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gate);
        }
    });
};

/**
 * List of Gates
 */
exports.list = function(req, res) {
    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');
	Gate.find().populate('user', 'displayName').exec(function(err, gates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gates);
		}
	});
};

/**
 * Gate middleware
 */
exports.gateByID = function(req, res, next, id) {
    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');
	Gate.findById(id).populate('user', 'displayName').exec(function(err, gate) {
		if (err) return next(err);
		if (! gate) return next(new Error('Failed to load Gate ' + id));
		req.gate = gate ;
		next();
	});
};

/**
 * Gate authorization middleware
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
