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
        // GATE-PROCESS: Save new process to its collection
        function(callback){
            gateProcess.save(function(err){
                callback(err);
            });
        },
        // STARTUP GATE: Create startup gate for the new process
        function(callback){
            var startupGate = new Gate({
                name: 'Startup',
                position: 1
            });
            startupGate.user = req.user;

            startupGate.save(function(err, gate) {
                if (err) {
                    callback(err);
                } else {
                    gateProcess.gates.push(gate._id);
                    gateProcess.startupGate = gate._id;
                    gateProcess.save(function(err){
                        callback(err);
                    });
                }
            });
        },
        // CLOSURE GATE: Create closure gate for the new process
        function(callback){
            var closureGate = new Gate({
                name: 'Closure',
                position: 2
            });
            closureGate.user = req.user;

            closureGate.save(function(err, gate) {
                if (err) {
                    callback(err);
                } else {
                    gateProcess.gates.push(gate._id);
                    gateProcess.closureGate = gate._id;
                    gateProcess.save(function(err){
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
    gateProcess.created = Date.now();
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
        // GATE-PROCESS: Delete process from its collection
        function(callback){
            gateProcess.remove(function(err){
                callback(err);
            });
        },
        // OUTCOMES: Delete all outcomes of the gates in the process
        function(callback){
            async.each(gateProcess.gates, function(item, callback){
                Gate.findById(item._id).exec(function(err, gate){
                    if (err) {
                        callback(err);
                    } else {
                        async.each(gate.gateOutcomes, function(item2, callback){
                            GateOutcome.findByIdAndRemove(item2, function(err){
                                if(err){callback(err);} else {callback();}
                            });
                        });
                    }
                });
                callback();
            });
            callback(null);
        },
        // GATES: Delete all gates (from "gates" collection) belonging to this process
        function(callback){
            async.each(gateProcess.gates, function(item, callback){
                Gate.findByIdAndRemove(item._id, function(err){
                    if(err){callback(err);} else {callback();}
                });
            });
            callback(null);
        }
    ],function(err){
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
	GateProcess.find().deepPopulate(['startupGate','closureGate','gates.gateOutcomes']).populate('user', 'displayName').exec(function(err, gateProcesses) {
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
