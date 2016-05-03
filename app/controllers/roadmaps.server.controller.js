'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * Get a Roadmap
 */

exports.getDefinitionRoadmap = function(req, res) {

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');

    var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');

    var EstimateDuration = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateDuration');
    var EstimateCost = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCost');
    var EstimateCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCompletion');


    async.waterfall([
        // Get the projects
        function(callback) {
            Project.find({'selection.active': true}, {'idNumber':1, 'parent':1, 'portfolio':1, 'identification':1, 'selection':1, 'process':1})
                .populate('process')
                .exec(function(err, projects){
                if (err) {
                    callback(err);
                } else {
                    callback(null, projects);
                }
            });
        },
        function(projects, callback) {
            
            var retArray = [
                // {
                //      idNumber, parent, portfolio, identification, selection, process,
                //      gateData: { start: date, end: date , status: color}
                //  }
            ];

            async.eachSeries(projects, function(project, callbackEach) {

                var projectCopy = {
                    _id: project._id,
                    idNumber: project.idNumber,
                    parent: project.parent,
                    portfolio: project.portfolio,
                    identification: project.identification,
                    selection: project.selection,
                    process: project.process && project.process._id,
                    gateData : {
                        start: null,
                        end: null,
                        status: null
                    }
                };

                if(project.process){

                    async.waterfall([
                        // Get status color
                        function(callback) {
                            GateStatusAssignment.findOne({'project': project._id, gate:{$in:project.process.gates}, 'currentRecord.currentGate':true})
                                .populate('overallStatus.currentRecord.status')
                                .exec(function(err, assignment){
                                    if(err){
                                        return callback(err);
                                    }
                                    var currentGateId = { id: null};
                                    if(assignment){
                                        // guard against null status
                                        projectCopy.gateData.status = assignment.overallStatus && assignment.overallStatus.currentRecord.status && assignment.overallStatus.currentRecord.status.color;
                                        currentGateId.id = assignment.gate;
                                    }
                                    callback(null, currentGateId);
                                });
                        },
                        // Get end date based on current gate
                        function(currentGateId, callback) {
                            if(currentGateId.id){
                                EstimateDuration.findOne({'project': project._id, 'sourceGate': currentGateId.id, 'targetGate': project.process.closureGate})
                                    .exec(function(err, estimation){
                                        if(err){
                                            return callback(err);
                                        }
                                        if(estimation){
                                            projectCopy.gateData.end = estimation.currentRecord.gateDate;
                                        }
                                        callback(null);
                                    });
                            } else {
                                callback(null);
                            }
                        },
                        // Get start date
                        function(callback) {
                            EstimateDuration.findOne({'project': project._id, 'sourceGate': project.process.startupGate, 'targetGate': project.process.startupGate})
                                .exec(function(err, estimation){
                                    if(err){
                                        return callback(err);
                                    }
                                    if(estimation){
                                        projectCopy.gateData.start = estimation.currentRecord.gateDate;
                                    }
                                    callback(null);
                                });
                        }
                    ], function (err) {
                        if(err){
                            return callbackEach(err);
                        }
                        retArray.push(projectCopy);
                        callbackEach();
                    });

                } else {
                    retArray.push(projectCopy);
                    callbackEach();
                }

            }, function(err){
                if(err){
                    return callback(err);
                }
                callback(null, retArray);
            });
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
 * Roadmap authorization middleware
 */

exports.hasAuthorization = function(req, res, next) {

	next();
};
