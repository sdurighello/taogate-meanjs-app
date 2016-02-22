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
    var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');

    var gate = new Gate(req.body);
    gate.user = req.user;

    async.waterfall([
        // Get process
        function(callback){
            GateProcess.findById(req.query.processId).deepPopulate([
                'startupGate', 'closureGate', 'gates'
            ]).exec(function(err, process){
                if(err){
                    callback(err);
                } else {
                    callback(null, process);
                }
            });
        },
        // Create the new gate and make sure the position is same as closure
        function(process, callback){
            if(!process.closureGate){
                return callback(new Error('process is missing closure gate'));
            }
            gate.position = process.closureGate.position;
            gate.save(function(err){
                if(err){
                    return callback(err);
                }
                callback(null, process);
            });
        },
        // Add + 1 to the Closure position
        function(process, callback){
            Gate.findById(process.closureGate._id).exec(function(err, closureGate){
                if(err){
                    return callback(err);
                }
                closureGate.position = closureGate.position + 1;
                closureGate.save(function(err){
                    if(err){
                        return callback(err);
                    }
                    callback(null);
                });

            });
        },
        // Add the value to the process's "gates" array
        function(callback){
            GateProcess.findById(req.query.processId).exec(function(err, process){
                if(err){
                    callback(err);
                } else {
                    process.gates.push(gate._id);
                    process.save(function(err){
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
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    async.waterfall([
        // PROCESS-GATES: check that process has not been already assigned to a project
        function(callback){
            GateProcess.find({gates: {$in: [gate._id]}}).exec(function(err, processes){
                if(err){
                    callback(err);
                } else {
                    async.each(processes, function(process, callbackEach){
                        Project.find({process : process._id}).exec(function(err, projects){
                            if(err){
                                return callbackEach(err);
                            }
                            if(projects.length !== 0){
                                return callbackEach(new Error('Cannot delete gates of process assigned to projects'));
                            }
                            callbackEach();
                        });
                    }, function(err){
                        if(err){
                            return callback(err);
                        }
                        callback(null, processes);
                    });
                }
            });
        },
        // PROCESS-GATES: Delete gate from processes where assigned
        function(processes, callback){
            async.each(processes, function(process, callbackEach){
                process.gates.splice(process.gates.indexOf(gate._id), 1);
                process.save(function(err){
                    if(err){
                        return callbackEach(err);
                    }
                    callbackEach();
                });
            }, function(err){
                if(err){
                    return callback(err);
                }
                callback(null);
            });
        },
        // GATES: Delete gate from its collection
        function(callback){
            gate.remove(function(err){
                callback(err);
            });
        },
        // OUTCOMES: Delete its outcomes from the outcomes collection
        function(callback){
            async.each(gate.gateOutcomes, function(item, callbackEach){
                GateOutcome.findByIdAndRemove(item._id, function(err){
                    if(err){
                        return callbackEach(err);
                    }
                    callbackEach();
                });
            }, function(err){
                if(err){
                    return callback(err);
                }
                callback(null);
            });
        }
    ],function(err){
        if (err) {
            console.log(err);
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
	Gate.find().populate('gateOutcomes').populate('user', 'displayName').exec(function(err, gates) {
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
	Gate.findById(id).populate('gateOutcomes').populate('user', 'displayName').exec(function(err, gate) {
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
