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
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    var gateProcess = req.gateProcess ;

    async.series([
        // Check that process hasn't been assigned yet
        function(callback){
            Project.find({process : gateProcess._id}).exec(function(err, projects){
                if(err){
                    return callback(err);
                }
                if(projects.length !== 0){
                    return callback(new Error('Cannot delete process assigned to projects'));
                }
                callback(null);
            });
        },
        // GATE-PROCESS: Delete process from its collection
        function(callback){
            gateProcess.remove(function(err){
                callback(err);
            });
        },
        // OUTCOMES: Delete all outcomes of the gates in the process
        function(callback){
            async.each(gateProcess.gates, function(item, callbackEach){
                Gate.findById(item._id).exec(function(err, gate){
                    if (err) {
                        return callbackEach(err);
                    }
                    async.each(gate.gateOutcomes, function(item2, callbackEach2){
                        GateOutcome.findByIdAndRemove(item2, function(err){
                            if(err){
                                return callbackEach2(err);
                            }
                            callbackEach2();
                        });
                    }, function(err){
                        if(err){
                            return callbackEach(err);
                        }
                        callbackEach();
                    });
                });
            }, function(err){
                if(err){
                    return callback(err);
                }
                callback(null);
            });
        },
        // GATES: Delete all gates (from "gates" collection) belonging to this process
        function(callback){
            async.each(gateProcess.gates, function(item, callbackEach){
                Gate.findByIdAndRemove(item._id, function(err){
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
            res.jsonp(gateProcess);
        }
    });
};

/**
 * List of Gate processes
 */
exports.list = function(req, res) {
	var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    async.waterfall([
        // Get all the gate processes
        function(callback) {
            GateProcess.find().deepPopulate([
                'startupGate','closureGate','gates.gateOutcomes'
            ]).populate('user', 'displayName').exec(function(err, gateProcesses) {
                if(err){
                    return callback(err);
                }
                callback(null, gateProcesses);
            });
        },
        // Check if each process is assigned to at least one project and set its isAssigned flag
        function(gateProcesses, callback) {
            async.eachSeries(gateProcesses, function(process, callback) {
                Project.findOne({process : process._id}, function(err, project){
                    if(err){
                        return callback(err);
                    }
                    if(project){
                        process.isAssigned = true;
                    }
                    if(!project){
                        process.isAssigned = false;
                    }
                    callback();
                });
            }, function(err){
                if( err ) {
                    return callback(err);
                }
                callback(null, gateProcesses);
            });

        }
    ], function (err, gateProcesses) {
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
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    async.waterfall([
        // Get the gate process object by Id
        function(callback) {
            GateProcess.findById(id).deepPopulate([
                'startupGate','closureGate','gates.gateOutcomes'
            ]).populate('user', 'displayName').exec(function(err, gateProcess) {
                if (err){
                    return callback(err);
                }
                if (! gateProcess){
                    return callback(new Error('Failed to load Gate process ' + id));
                }
                callback(null, gateProcess);
            });
        },
        // Check if it is assigned to at least a project and set the isAssigned flag
        function(gateProcess, callback) {
            Project.findOne({process : gateProcess._id}, function(err, project){
                if(err){
                    return callback(err);
                }
                if(project){
                    gateProcess.isAssigned = true;
                }
                if(!project){
                    gateProcess.isAssigned = false;
                }
                callback(null, gateProcess);
            });
        }
    ], function (err, gateProcess) {
        if (err) {
            return next(err);
        } else {
            req.gateProcess = gateProcess ;
            next();
        }
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
