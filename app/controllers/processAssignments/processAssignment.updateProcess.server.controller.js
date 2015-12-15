'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');



/**
 *  Update Gate process assignment
 */

exports.updateProcess = function(req, res) {
    // req.body: {processId: gate process id}

    var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');

    var processAssignment = req.processAssignment ;
    processAssignment.user = req.user;
    processAssignment.created = Date.now();

    // If process NOT NULL
    if(req.body.processId){
        GateProcess.findOne({_id: req.body.processId})
            .deepPopulate(['gates'])
            .exec(function(err, process){
            if(err){
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else if(! process){
                return res.status(400).send({
                    message: 'Could not find processId ' + req.body.processId
                });
            } else {
                var assignedGates = [];
                _.each(process.gates, function(sourceGate){
                    var assignedGate = {
                        gate : sourceGate._id,
                        status : null,
                        overallScore : null,
                        completed : false,

                        outcomes : [],

                        baselineDurations : [],
                        estimateDurations : [],
                        actualDurations : [],

                        baselineCosts : [],
                        estimateCosts : [],
                        actualCosts : [],

                        baselineCompletions : [],
                        estimateCompletions : [],
                        actualCompletions : []
                    };
                    // Outcomes
                    _.each(sourceGate.gateOutcomes, function(outcome){
                        assignedGate.outcomes.push({ outcome : outcome, currentRecord: {user: req.user}, history:[] });
                    });
                    // Actual
                    assignedGate.actualCompletions.push({ targetGate:sourceGate._id, currentRecord: {user: req.user}, history:[] });
                    assignedGate.actualCosts.push({ targetGate:sourceGate._id, currentRecord: {user: req.user}, history:[] });
                    assignedGate.actualDurations.push({ targetGate:sourceGate._id, currentRecord: {user: req.user}, history:[] });
                    // Baseline & Estimate
                    _.each(process.gates, function(targetGate){
                        if(sourceGate.position <= targetGate.position){
                            assignedGate.baselineCompletions.push({ targetGate:targetGate._id, currentRecord: {user: req.user}, history:[] });
                            assignedGate.baselineCosts.push({ targetGate:targetGate._id, currentRecord: {user: req.user}, history:[] });
                            assignedGate.baselineDurations.push({ targetGate:targetGate._id, currentRecord: {user: req.user}, history:[] });
                            assignedGate.estimateCompletions.push({ targetGate:targetGate._id, currentRecord: {user: req.user}, history:[] });
                            assignedGate.estimateCosts.push({ targetGate:targetGate._id, currentRecord: {user: req.user}, history:[] });
                            assignedGate.estimateDurations.push({ targetGate:targetGate._id, currentRecord: {user: req.user}, history:[] });
                        }
                    });
                    // Save the performances to the gates array
                    assignedGates.push(assignedGate);
                });
                processAssignment.process = req.body.processId;
                processAssignment.gates = assignedGates;
                processAssignment.save(function(err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.jsonp(processAssignment);
                    }
                });
            }
        });
    }
    // If process is NULL
    else {
        processAssignment.process = null;
        processAssignment.gates = [];
        processAssignment.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(processAssignment);
            }
        });
    }

};

