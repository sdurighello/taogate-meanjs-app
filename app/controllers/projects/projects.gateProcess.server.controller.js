'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


// ------------------ UTILITIES ----------------

var createGatePerformances = function(req, gateArray){
    _.each(gateArray, function(sourceGate){
        // Reset the gate data to beginning
        sourceGate.performances.duration.baselineDurations = [];
        sourceGate.performances.duration.estimateDurations = [];
        sourceGate.performances.duration.actualDurations = [];
        sourceGate.performances.cost.baselineCosts = [];
        sourceGate.performances.cost.estimateCosts = [];
        sourceGate.performances.cost.actualCosts = [];
        sourceGate.performances.completion.baselineCompletions = [];
        sourceGate.performances.completion.estimateCompletions = [];
        sourceGate.performances.completion.actualCompletions = [];
        // Create new performance data based on gates
        _.each(gateArray, function(targetGate){
            // Baseline and Estimate
            if(sourceGate.position <= targetGate.position){
                // Duration
                sourceGate.performances.duration.baselineDurations.push({
                    targetGate:{ _id: targetGate._id, name: targetGate.name, position: targetGate.position },
                    currentRecord: { user: {_id: req.user._id, displayName: req.user.displayName} },
                    history:[]
                });
                sourceGate.performances.duration.estimateDurations.push({
                    targetGate:{ _id: targetGate._id, name: targetGate.name, position: targetGate.position },
                    currentRecord: { user: {_id: req.user._id, displayName: req.user.displayName} },
                    history:[]
                });
                // Cost
                sourceGate.performances.cost.baselineCosts.push({
                    targetGate:{ _id: targetGate._id, name: targetGate.name, position: targetGate.position },
                    currentRecord: { user: {_id: req.user._id, displayName: req.user.displayName} },
                    history:[]
                });
                sourceGate.performances.cost.estimateCosts.push({
                    targetGate:{ _id: targetGate._id, name: targetGate.name, position: targetGate.position },
                    currentRecord: { user: {_id: req.user._id, displayName: req.user.displayName} },
                    history:[]
                });
                // Completions
                sourceGate.performances.completion.baselineCompletions.push({
                    targetGate:{ _id: targetGate._id, name: targetGate.name, position: targetGate.position },
                    currentRecord: { user: {_id: req.user._id, displayName: req.user.displayName} },
                    history:[]
                });
                sourceGate.performances.completion.estimateCompletions.push({
                    targetGate:{ _id: targetGate._id, name: targetGate.name, position: targetGate.position },
                    currentRecord: { user: {_id: req.user._id, displayName: req.user.displayName} },
                    history:[]
                });
            }
            // Actual
            if(sourceGate.position === targetGate.position){
                sourceGate.performances.duration.actualDurations.push({
                    targetGate:{ _id: targetGate._id, name: targetGate.name, position: targetGate.position },
                    currentRecord: { user: {_id: req.user._id, displayName: req.user.displayName} },
                    history:[]
                });
                sourceGate.performances.cost.actualCosts.push({
                    targetGate:{ _id: targetGate._id, name: targetGate.name, position: targetGate.position },
                    currentRecord: { user: {_id: req.user._id, displayName: req.user.displayName} },
                    history:[]
                });
                sourceGate.performances.completion.actualCompletions.push({
                    targetGate:{ _id: targetGate._id, name: targetGate.name, position: targetGate.position },
                    currentRecord: { user: {_id: req.user._id, displayName: req.user.displayName} },
                    history:[]
                });
            }
        });
    });
};

var createBlueprintedProcess = function(req, res, assignmentType, callback){

    var GateProcessTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcessTemplate');
    var LogStatusArea = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusArea');

    // Catch req errors
    if(!req.body.processId){
        return res.status(400).send({message: 'Process id is required for standard assignment'});
    }

    var getStandardProcess = function(processId){
        if(assignmentType === 'standard'){
            return processId;
        }
        return null;
    };

    var getStandardGate = function(gateId){
        if(assignmentType === 'standard'){
            return gateId;
        }
        return null;
    };

    var getStandardOutcome = function(outcomeId){
        if(assignmentType === 'standard'){
            return outcomeId;
        }
        return null;
    };

    async.waterfall([
        // Get Log Status Areas
        function(callback){
            LogStatusArea.find().exec(function(err, areas){
                if(err){
                    return callback(err);
                }
                callback(null, areas);
            });
        },
        // Get process
        function(areas, callback) {
            GateProcessTemplate.findById(req.body.processId).exec(function(err, process){
                if(err){
                    return callback(err);
                }
                if(!process){
                    return callback({message: 'Cannot find process '+ req.body.processId});
                }
                if(process.approval.currentRecord.approvalState !== 'approved'){
                    return callback({message: 'Only approved processes can be used as a template'});
                }
                callback(null, areas, process);
            });
        },
        function(areas, process, callback){

            var project = req.project ;

            // Create header project's process

            project.process = {
                standardProcess: getStandardProcess(process._id),
                assignmentType: req.body.assignmentType,
                assignmentConfirmed: false,
                name: process.name,
                description: process.description,
                gates: [],
                approval : {
                    currentRecord : {
                        approvalState: 'draft',
                        user:{_id: req.user._id, displayName: req.user.displayName},
                        created: Date.now()
                    },
                    history : []
                }
            };

            // Create gates, outcomes, status areas, (performances created at confirmation)

            _.each(process.gates, function(gate){
                var projectGate = project.process.gates.create({
                    standardGate: getStandardGate(gate._id),
                    name: gate.name,
                    description: gate.description,
                    position: gate.position,
                    outcomes : [],
                    gateState: {
                        currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                        history:[]
                    },
                    budget : {
                        currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                        history:[]
                    },
                    performances: {
                        duration: {
                            baselineDurations: [],
                            estimateDurations: [],
                            actualDurations: []
                        },
                        cost: {
                            baselineCosts: [],
                            estimateCosts: [],
                            actualCosts: []
                        },
                        completion: {
                            baselineCompletions: [],
                            estimateCompletions: [],
                            actualCompletions: []
                        }
                    },
                    deliveryStatus: {
                        overallStatus : {
                            currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                            history:[]
                        },
                        durationStatus : {
                            currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                            history:[]
                        },
                        costStatus : {
                            currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                            history:[]
                        },
                        completionStatus : {
                            currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                            history:[]
                        },
                        projectStatusAreas : []
                    },
                    gateReviews : [],
                    projectChangeRequests : [],
                    projectStatusUpdates : []
                });

                _.each(areas, function(area){
                    projectGate.deliveryStatus.projectStatusAreas.push({
                        statusArea:{
                            _id: area._id,
                            name: area.name
                        },
                        currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                        history:[]
                    });
                });

                _.each(gate.outcomes, function(outcome){
                    projectGate.outcomes.push({
                        standardOutcome: getStandardOutcome(outcome._id),
                        name: outcome.name,
                        description: outcome.description,
                        score: {
                            currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                            history:[]
                        },
                        status: {
                            currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                            historyStatus:[]
                        }
                    });
                });

                if(gate._id.equals(process.startGate)){
                    project.process.startGate = projectGate._id;
                }
                if(gate._id.equals(process.endGate)){
                    project.process.endGate = projectGate._id;
                }

                project.process.gates.push(projectGate);

            });

            // Sort by position
            project.process.gates = _.sortBy(project.process.gates, 'position');

            project.save(function(err) {
                if(err){
                    return callback(err);
                }
                callback(null, project);
            });

        }
    ], function (err, project) {
        if (err) {
            callback(err);
        } else {
            callback(null, project);
        }
    });

};

var createBasicProcess = function(req, res, callback){

    var LogStatusArea = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusArea');

    async.waterfall([
        // Get Log Status Areas
        function(callback){
            LogStatusArea.find().exec(function(err, areas){
                if(err){
                    return callback(err);
                }
                callback(null, areas);
            });
        },
        function(areas, callback) {

            var project = req.project;

            // Create process header
            project.process = {
                assignmentType: req.body.assignmentType,
                assignmentConfirmed: false,
                name: 'Custom process',
                description: '',
                gates: [],
                approval : {
                    currentRecord : {
                        approvalState: 'draft',
                        user:{_id: req.user._id, displayName: req.user.displayName},
                        created: Date.now()
                    },
                    history : []
                }
            };

            // Create new gates and outcomes
            var startGate = project.process.gates.create({
                name: 'Start',
                position:1,
                outcomes : [],
                gateState: {
                    currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                    history:[]
                },
                budget : {
                    currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                    history:[]
                },
                performances: {
                    duration: {
                        baselineDurations: [],
                        estimateDurations: [],
                        actualDurations: []
                    },
                    cost: {
                        baselineCosts: [],
                        estimateCosts: [],
                        actualCosts: []
                    },
                    completion: {
                        baselineCompletions: [],
                        estimateCompletions: [],
                        actualCompletions: []
                    }
                },
                deliveryStatus: {
                    overallStatus : {
                        currentRecord: { user: req.user._id },
                        history:[]
                    },
                    durationStatus : {
                        currentRecord: { user: req.user._id },
                        history:[]
                    },
                    costStatus : {
                        currentRecord: { user: req.user._id },
                        history:[]
                    },
                    completionStatus : {
                        currentRecord: { user: req.user._id },
                        history:[]
                    },
                    projectStatusAreas : []
                },
                gateReviews : [],
                projectChangeRequests : [],
                projectStatusUpdates : []
            });
            var endGate = project.process.gates.create({
                _id: mongoose.Types.ObjectId(),
                name: 'End',
                position:2,
                outcomes : [],
                gateState: {
                    currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                    history:[]
                },
                budget : {
                    currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                    history:[]
                },
                performances: {
                    duration: {
                        baselineDurations: [],
                        estimateDurations: [],
                        actualDurations: []
                    },
                    cost: {
                        baselineCosts: [],
                        estimateCosts: [],
                        actualCosts: []
                    },
                    completion: {
                        baselineCompletions: [],
                        estimateCompletions: [],
                        actualCompletions: []
                    }
                },
                deliveryStatus: {
                    overallStatus : {
                        currentRecord: { user: req.user._id },
                        history:[]
                    },
                    durationStatus : {
                        currentRecord: { user: req.user._id },
                        history:[]
                    },
                    costStatus : {
                        currentRecord: { user: req.user._id },
                        history:[]
                    },
                    completionStatus : {
                        currentRecord: { user: req.user._id },
                        history:[]
                    },
                    projectStatusAreas : []
                },
                gateReviews : [],
                projectChangeRequests : [],
                projectStatusUpdates : []
            });

            _.each(areas, function(area){
                startGate.deliveryStatus.projectStatusAreas.push({
                    statusArea:{
                        _id: area._id,
                        name: area.name
                    },
                    currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                    history:[]
                });
                endGate.deliveryStatus.projectStatusAreas.push({
                    statusArea:{
                        _id: area._id,
                        name: area.name
                    },
                    currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                    history:[]
                });
            });

            project.process.startGate = startGate._id;
            project.process.endGate = endGate._id;

            project.process.gates.push(endGate);
            project.process.gates.push(startGate);

            // Sort by position
            project.process.gates = _.sortBy(project.process.gates, 'position');

            project.save(function(err){
                if (err) {
                    callback(err);
                } else {
                    callback(null, project);
                }
            });
        }
    ], function (err, project) {
        if (err) {
            callback(err);
        } else {
            callback(null, project);
        }
    });

};


// -------------- ASSIGNMENT ROUTES ------------


exports.confirmAssignment = function(req, res){
    
    var project = req.project;

    if((project.process.assignmentType !== 'standard') && (req.project.process.assignmentType !== 'custom')){
        return res.status(400).send({message: 'Process assignment must be either custom or standard'});
    }
    if(project.process.assignmentConfirmed !== false){
        return res.status(400).send({message: 'Process assignment is already confirmed'});
    }
    if(project.process.approval.currentRecord.approvalState !== 'approved'){
        return res.status(400).send({message: 'Process assignment must be approved before confirmation'});
    }

    // Create the performances
    createGatePerformances(req, project.process.gates);
    
    project.process.assignmentConfirmed = true;
    
    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });

};

exports.customAssignment = function(req, res){

    // Catch req errors
    if(req.project.process.assignmentType !== 'unassigned'){
        return res.status(400).send({message: 'Project must be first unassigned to be assigned to a process'});
    }
    if(req.body.assignmentType !== 'custom'){
        return res.status(400).send({message: 'Assignment type must be custom'});
    }

    if(req.body.processId){
        createBlueprintedProcess(req, res, 'custom', function(err, project){
            if (err) {
                console.log(err);
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(project);
            }
        });
    } else {
        createBasicProcess(req, res, function(err, project){
            if (err) {
                console.log(err);
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(project);
            }
        });
    }

};

exports.standardAssignment = function(req, res){

    // Catch req errors
    if(req.project.process.assignmentType !== 'unassigned'){
        return res.status(400).send({message: 'Project must be first unassigned to be assigned to a process'});
    }
    if(req.body.assignmentType !== 'standard'){
        return res.status(400).send({message: 'Assignment type must be standard'});
    }
    if(!req.body.processId){
        return res.status(400).send({message: 'Process id is required for standard assignment'});
    }

    createBlueprintedProcess(req, res, 'standard', function(err, project){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });

};

exports.removeAssignment = function(req, res){

    var project = req.project ;

    // Reset project.process properties + delete old documents

    project.process = {
        standardProcess: null,
        assignmentType: 'unassigned',
        assignmentConfirmed: false
    };

    project.save(function(err) {
        if(err){
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.jsonp(project);
    });

};


// -------------- PROCESS ------------

exports.updateProcess = function(req, res){
    
    var project = req.project;
    
    project.process.name = req.body.name;
    project.process.description = req.body.description;
    
    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });

};

// Gates

exports.createGate = function(req, res){

    var LogStatusArea = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusArea');

    async.waterfall([
        // Get Log Status Areas
        function(callback){
            LogStatusArea.find().exec(function(err, areas){
                if(err){
                    return callback(err);
                }
                callback(null, areas);
            });
        },
        function(areas, callback) {

            var project = req.project;

            var endGate = _.find(project.process.gates, function(gate){
                return gate._id.equals(project.process.endGate);
            });

            var newGate = project.process.gates.create({
                name: 'New gate',
                description: '',
                position: endGate.position,
                outcomes : [],
                gateState: {
                    currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                    history:[]
                },
                budget : {
                    currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                    history:[]
                },
                deliveryStatus: {
                    overallStatus : {
                        currentRecord: { user: req.user._id },
                        history:[]
                    },
                    durationStatus : {
                        currentRecord: { user: req.user._id },
                        history:[]
                    },
                    costStatus : {
                        currentRecord: { user: req.user._id },
                        history:[]
                    },
                    completionStatus : {
                        currentRecord: { user: req.user._id },
                        history:[]
                    },
                    projectStatusAreas : []
                },
                gateReviews : [],
                projectChangeRequests : [],
                projectStatusUpdates : []
            });

            endGate.position = endGate.position + 1;

            _.each(areas, function(area){
                newGate.deliveryStatus.projectStatusAreas.push({
                    statusArea:{
                        _id: area._id,
                        name: area.name
                    },
                    currentRecord: {user:{_id:req.user._id, displayName: req.user.displayName}},
                    history:[]
                });
            });

            project.process.gates.push(newGate);

            project.process.gates = _.sortBy(project.process.gates, 'position');

            project.save(function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, project);
                }
            });
        }
    ], function (err, project) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });
};

exports.updateGateHeader = function(req, res){
    
    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    editedGate.name = req.body.name;
    editedGate.description = req.body.description;

    project.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });
};

exports.updateGatePosition = function(req, res){
    
    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var oldPosition = editedGate.position;
    var newPosition = req.body.position;

    if(newPosition === 1){
        return res.status(400).send(
            new Error('Gate new position cannot be 1')
        );
    }
    if(newPosition === project.process.gates.length){
        return res.status(400).send(
            new Error('Gate new position cannot be' + project.process.gates.length)
        );
    }
    if(editedGate._id.equals(project.process.endGate) || editedGate._id.equals(project.process.startGate)){
        return res.status(400).send(
            new Error('Start and End gates cannot change position')
        );
    }

    if(oldPosition < newPosition){
        _.each(project.process.gates, function(gate){
            if((oldPosition < gate.position) && (gate.position <= newPosition) && (!gate._id.equals(editedGate._id))){
                gate.position = gate.position - 1;
            }
        });
    }

    if(oldPosition > newPosition){
        _.each(project.process.gates, function(gate){
            if((newPosition <= gate.position) && (gate.position < oldPosition) && (!gate._id.equals(editedGate._id))){
                gate.position = gate.position + 1;
            }
        });
    }

    editedGate.position = newPosition;

    project.process.gates = _.sortBy(project.process.gates, 'position');
    project.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });
    
};

exports.deleteGate = function(req, res){
    
    var project = req.project ;

    var deletedGate = project.process.gates.id(req.params.projectGateId).remove();

    if(deletedGate._id.equals(project.process.endGate) || deletedGate._id.equals(project.process.startGate)){
        return res.status(400).send(
            new Error('Start and End gates cannot be deleted')
        );
    }

    var oldPosition = deletedGate.position;

    _.each(project.process.gates, function(gate){
        if(gate.position > oldPosition){
            gate.position = gate.position - 1;
        }
    });

    project.process.gates = _.sortBy(project.process.gates, 'position');

    project.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });
};

// Outcomes


exports.createOutcome = function(req, res) {

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var newOutcome = editedGate.outcomes.create({_id: mongoose.Types.ObjectId(), name: 'New Outcome' });

    editedGate.outcomes.push(newOutcome);

    project.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(newOutcome);
        }
    });
};

exports.updateOutcome = function(req, res) {

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedOutcome = _.find(editedGate.outcomes, function(outcome){
        return outcome._id.equals(req.params.projectOutcomeId);
    });

    editedOutcome.name = req.body.name;
    editedOutcome.description = req.body.description;

    project.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedOutcome);
        }
    });
};

exports.deleteOutcome = function(req, res) {

    var project = req.project ;

    var editedGate = project.process.gates.id(req.params.projectGateId);

    var deletedOutcome = editedGate.outcomes.id(req.params.projectOutcomeId).remove();

    project.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedGate);
        }
    });
};


// Approval

exports.submitProcess = function(req, res) {
    
    var project = req.project;

    project.user = req.user;
    project.created = Date.now();

    project.process.approval.history.push({
        approvalState : project.process.approval.currentRecord.approvalState,
        user : {
            _id: project.process.approval.currentRecord.user._id,
            displayName: project.process.approval.currentRecord.user.displayName
        },
        created : project.process.approval.currentRecord.created
    });

    project.process.approval.currentRecord.approvalState = 'submitted';
    project.process.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    project.process.approval.currentRecord.created = Date.now();

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });

};

exports.approveProcess = function(req, res) {
    
    var project = req.project;

    project.user = req.user;
    project.created = Date.now();

    project.process.approval.history.push({
        approvalState : project.process.approval.currentRecord.approvalState,
        user : {
            _id: project.process.approval.currentRecord.user._id,
            displayName: project.process.approval.currentRecord.user.displayName
        },
        created : project.process.approval.currentRecord.created
    });

    project.process.approval.currentRecord.approvalState = 'approved';
    project.process.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    project.process.approval.currentRecord.created = Date.now();

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });
};

exports.rejectProcess = function(req, res) {
    
    var project = req.project;

    project.user = req.user;
    project.created = Date.now();

    project.process.approval.history.push({
        approvalState : project.process.approval.currentRecord.approvalState,
        user : {
            _id: project.process.approval.currentRecord.user._id,
            displayName: project.process.approval.currentRecord.user.displayName
        },
        created : project.process.approval.currentRecord.created
    });

    project.process.approval.currentRecord.approvalState = 'rejected';
    project.process.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    project.process.approval.currentRecord.created = Date.now();

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });

};

exports.draftProcess = function(req, res) {
    
    var project = req.project;

    project.user = req.user;
    project.created = Date.now();

    project.process.approval.history.push({
        approvalState : project.process.approval.currentRecord.approvalState,
        user : {
            _id: project.process.approval.currentRecord.user._id,
            displayName: project.process.approval.currentRecord.user.displayName
        },
        created : project.process.approval.currentRecord.created
    });

    project.process.approval.currentRecord.approvalState = 'draft';
    project.process.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    project.process.approval.currentRecord.created = Date.now();

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });

};
