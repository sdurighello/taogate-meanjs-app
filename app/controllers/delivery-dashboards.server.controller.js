'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

exports.gatePerformances = function(req, res){

	var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');

    var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');
    var GateOutcomeReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeReview');

    var BaselineDuration = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineDuration');
    var BaselineCost = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCost');
    var BaselineCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCompletion');
    var EstimateDuration = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateDuration');
    var EstimateCost = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCost');
    var EstimateCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCompletion');
    var ActualDuration = mongoose.mtModel(req.user.tenantId + '.' + 'ActualDuration');
    var ActualCost = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCost');
    var ActualCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCompletion');

	async.waterfall([
		// Get the process with its gates from the project
		function(callback) {
            GateProcess.findById(req.project.process).exec( function(err, process){
                if(err){
                    return callback(err);
                }
                if(!process){
                    return (new Error({message: 'Cannot find process ' + req.project.process}));
                }
                if(!process.gates.length){
                    return (new Error({message: 'There are no gates assigned to process ' + req.project.process}));
                }
                callback(null, process);
            });
		},
        // Get gateStatusAssignments and lastCompleted/current gate
		function(process, callback) {
            var retObj = {
                process : process,
                gateAssignments : [],
                lastCompleted : {},
                current : {}
            };
            async.waterfall([
                function(callback){
                    GateStatusAssignment.find({project: req.params.projectId, gate: {$in:process.gates}}).populate('gate').exec(function(err, assignments){
                        if(err){
                            return callback(err);
                        }
                        if(!assignments){
                            return callback(new Error ({message: 'Cannot find assignments for process' + process._id}));
                        }
                        callback(null, assignments);
                    });
                },
                function(assignments, callback){

                    retObj.lastCompleted = _.max(_.filter(assignments, function(assignment){
                        return assignment.currentRecord.completed;
                    }),function(completedAssignment){
                        return completedAssignment.gate.position;
                    });

                    retObj.gateAssignments = assignments;
                    if(!retObj.lastCompleted){
                        retObj.current = _.find(assignments, function(assignment){
                            return assignment.gate.position === 1;
                        });
                    } else if(retObj.lastCompleted.gate._id.equals(process.closureGate)){
                        retObj.current = retObj.lastCompleted;
                    } else {
                        retObj.current = _.find(assignments, function(assignment){
                            return assignment.gate.position === retObj.lastCompleted.gate.position + 1;
                        });
                    }

                    callback(null, retObj);
                }
            ], function(err, retObj){
                if(err){
                    return callback(err);
                }
                callback(null, retObj);
            });
		},
        // Get all raw performances
        function(retObj, callback){
            async.parallel([
                function(callback){
                    BaselineDuration.find({project: req.params.projectId}).exec(function(err, performances){
                        if(err){
                            return callback(err);
                        }
                        if(!performances){
                            return callback(new Error ({message: 'Cannot find baseline duration for project' + req.params.projectId}));
                        }
                        retObj.baselineDurations = performances;
                        callback(null);
                    });
                },
                function(callback){
                    BaselineCost.find({project: req.params.projectId}).exec(function(err, performances){
                        if(err){
                            return callback(err);
                        }
                        if(!performances){
                            return callback(new Error ({message: 'Cannot find baseline cost for project' + req.params.projectId}));
                        }
                        retObj.baselineCosts = performances;
                        callback(null);
                    });
                }
            ], function(err){
                if(err){
                    return callback(err);
                }

                callback(null, retObj);
            });
        },
        // Create result array
        function(retObj, callback){
            /*
            result = [
                {
                    gate : object,
                    completed : true/false,
                    current : true/false
                    currentStage : {
                        duration : {
                                baselineDate : date,
                                baselineDays : days,
                                estimateDate : date,
                                estimateDays : ...,
                                actualDate : ...,
                                actualDays : ...
                            }
                    },
                    cumulative : {
                        duration : {
                                 baselineDays : days,
                                 estimateDays : ...,
                                 actualDays : ...
                            }
                    }
                }
            ]
             */
            var result = [];

            // VARIABLES
            var currentPosition = retObj.current.gate.position;
            var closureGatePosition = _.find(retObj.gateAssignments, function(assignment){
                return assignment.gate._id.equals(retObj.process.closureGate);
            }).gate.position;

            // STARTUP GATE
            if(retObj.current.gate.position === 1){

            }

            // CLOSURE GATE
            if(retObj.current.gate._id === retObj.process.closureGate){

            }

            // INTERIM GATES
            if(retObj.current.gate.position !== 1 && retObj.current.gate._id !== retObj.process.closureGate){
                var cumulativeBaselineDays = 0;
                var cumulativeBaselineCost = 0;
                var previousGateBaselineDate = _.find(retObj.baselineDurations, function(performance){
                    return performance.sourceGate.equals(retObj.process.startupGate) && performance.targetGate.equals(retObj.process.startupGate);
                }).currentRecord.gateDate;

                // For all gates before current (treat as completed) (but not Startup)
                for(var lastPositionSeenBefore = 1; lastPositionSeenBefore < currentPosition; lastPositionSeenBefore++){

                }

                // For current gate

                // For all gates after current (but not Closure)
                for(var lastPositionSeenAfter = currentPosition; lastPositionSeenAfter < closureGatePosition; lastPositionSeenAfter++){

                }

            }
        }
	], function (err, result) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(result);
		}
	});

};


/**
 * Delivery dashboard authorization middleware
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
