'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Gate process
 */
exports.create = function(req, res) {
	var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
	var gateProcess = new GateProcess(req.body);
	gateProcess.user = req.user;

    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');

    async.series([
        function(callback){
            // Create process
            gateProcess.save();
            callback(null, 'one');
        },
        function(callback){
            // Create "startup" gate
            var startupGate = new Gate({
                name: 'Startup',
                position: 1
            });
            startupGate.user = req.user;

            startupGate.save(function(err, gate) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    gateProcess.gates.push(gate._id);
                    gateProcess.startupGate = gate._id;
                    gateProcess.save();
                }
            });
            callback(null, 'two');
        },
        function(callback){
            // Create "closure" gate
            var closureGate = new Gate({
                name: 'Closure',
                position: 2
            });
            closureGate.user = req.user;

            closureGate.save(function(err, gate) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    gateProcess.gates.push(gate._id);
                    gateProcess.closureGate = gate._id;
                    gateProcess.save();
                }
            });
            callback(null, 'three');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateProcess);
        }
    });

};

/**
 * Show the current Gate process
 */
exports.read = function(req, res) {
	res.jsonp(req.gateProcess);
};

/**
 * Update a Gate process
 */
exports.update = function(req, res) {
	var gateProcess = req.gateProcess ;
    gateProcess.user = req.user;
	gateProcess = _.extend(gateProcess , req.body);

	gateProcess.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateProcess);
		}
	});
};

/**
 * Delete a Gate process
 */
exports.delete = function(req, res) {
    var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');
    var GateOutcome = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcome');
    var gateProcess = req.gateProcess ;

    async.series([
        function(callback){
            // Delete process from its collection
            gateProcess.remove();
            callback(null, 'one');
        },
        function(callback){
            // Delete all outcomes of the gates in the process
            async.each(gateProcess.gates, function(item, callback){
                Gate.findById(item._id).exec(function(err, gate){
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        async.each(gate.gateOutcomes, function(item2, callback){
                            GateOutcome.findByIdAndRemove(item2, callback);
                        });
                    }
                });
                callback();
            });
            callback(null, 'two');
        },
        function(callback){
            // Delete all gates (from "gates" collection) belonging to this process
            async.each(gateProcess.gates, function(item, callback){
                Gate.findByIdAndRemove(item._id, callback);
            });
            callback(null, 'three');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateProcess);
        }
    });
};

/**
 * List of Gate processes
 */
exports.list = function(req, res) {
	var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
	GateProcess.find().sort('-created').deepPopulate(['startupGate','closureGate','gates.gateOutcomes']).populate('user', 'displayName').exec(function(err, gateProcesses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateProcesses);
		}
	});
};

/**
 * Gate process middleware
 */
exports.gateProcessByID = function(req, res, next, id) {
	var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
	GateProcess.findById(id).deepPopulate(['gates.gateOutcomes']).populate('user', 'displayName').exec(function(err, gateProcess) {
		if (err) return next(err);
		if (! gateProcess) return next(new Error('Failed to load Gate process ' + id));
		req.gateProcess = gateProcess ;
		next();
	});
};

/**
 * Gate process authorization middleware
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
