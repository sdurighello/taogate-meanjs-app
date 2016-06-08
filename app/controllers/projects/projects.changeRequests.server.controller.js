'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');



exports.createChangeRequest = function(req, res){
    var project = req.project;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var newChangeRequest = editedGate.projectChangeRequests.create({
        raisedOnDate : req.body.raisedOnDate,
        title : req.body.title,
        approval : {
            currentRecord : {
                approvalState: 'draft',
                user: { _id: req.user._id, displayName: req.user.displayName }
            },
            history : []
        },
        budgetReview : {
            currentAmount: editedGate.budget.currentRecord.amount,
            newAmount: editedGate.budget.currentRecord.amount
        },
        performances: {
            duration: {
                baselineDurationReviews: [],
                actualDurationReviews: []
            },
            cost: {
                baselineCostReviews: [],
                actualCostReviews: []
            },
            completion: {
                baselineCompletionReviews: [],
                actualCompletionReviews: []
            }
        },
        user: req.user._id
    });

    // Create durations
    _.each(editedGate.performances.duration.baselineDurations, function(performance){
        newChangeRequest.performances.duration.baselineDurationReviews.push({
            baselineDuration: {
                _id: performance._id,
                currentRecord: {
                    gateDate: performance.currentRecord.gateDate
                },
                targetGate:{
                    _id: performance.targetGate._id,
                    name: performance.targetGate.name,
                    position: performance.targetGate.position
                }
            },
            newDate: performance.currentRecord.gateDate
        });
    });
    _.each(editedGate.performances.duration.actualDurations, function(performance){
        newChangeRequest.performances.duration.actualDurationReviews.push({
            actualDuration: {
                _id: performance._id,
                currentRecord: {
                    gateDate: performance.currentRecord.gateDate
                },
                targetGate:{
                    _id: performance.targetGate._id,
                    name: performance.targetGate.name,
                    position: performance.targetGate.position
                }
            },
            newDate: performance.currentRecord.gateDate
        });
    });

    // Create costs
    _.each(editedGate.performances.cost.baselineCosts, function(performance){
        newChangeRequest.performances.cost.baselineCostReviews.push({
            baselineCost:{
                _id: performance._id,
                currentRecord: {
                    cost: performance.currentRecord.cost
                },
                targetGate:{
                    _id: performance.targetGate._id,
                    name: performance.targetGate.name,
                    position: performance.targetGate.position
                }
            },
            newCost: performance.currentRecord.cost
        });
    });
    _.each(editedGate.performances.cost.actualCosts, function(performance){
        newChangeRequest.performances.cost.actualCostReviews.push({
            actualCost: {
                _id: performance._id,
                currentRecord: {
                    cost: performance.currentRecord.cost
                },
                targetGate:{
                    _id: performance.targetGate._id,
                    name: performance.targetGate.name,
                    position: performance.targetGate.position
                }
            },
            newCost: performance.currentRecord.cost
        });
    });

    // Create completions
    _.each(editedGate.performances.completion.baselineCompletions, function(performance){
        newChangeRequest.performances.completion.baselineCompletionReviews.push({
            baselineCompletion: {
                _id: performance._id,
                currentRecord: {
                    completion: performance.currentRecord.completion
                },
                targetGate:{
                    _id: performance.targetGate._id,
                    name: performance.targetGate.name,
                    position: performance.targetGate.position
                }
            },
            newCompletion: performance.currentRecord.completion
        });
    });
    _.each(editedGate.performances.completion.actualCompletions, function(performance){
        newChangeRequest.performances.completion.actualCompletionReviews.push({
            actualCompletion: {
                _id: performance._id,
                currentRecord: {
                    completion: performance.currentRecord.completion
                },
                targetGate:{
                    _id: performance.targetGate._id,
                    name: performance.targetGate.name,
                    position: performance.targetGate.position
                }
            },
            newCompletion: performance.currentRecord.completion
        });
    });

    editedGate.projectChangeRequests.push(newChangeRequest);

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(newChangeRequest);
        }
    });

};

exports.deleteChangeRequest = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var deletedDocument = editedGate.projectChangeRequests.id(req.params.projectChangeRequestId).remove();

    project.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(deletedDocument);
        }
    });
};

// Header

exports.updateChangeRequestHeader = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedChangeRequest = editedGate.projectChangeRequests.id(req.params.projectChangeRequestId);

    editedChangeRequest.user = req.user;
    editedChangeRequest.created = Date.now();

    editedChangeRequest.raisedOnDate = req.body.raisedOnDate;
    editedChangeRequest.title = req.body.title;
    editedChangeRequest.description = req.body.description;
    editedChangeRequest.reason = req.body.reason;
    editedChangeRequest.state = req.body.state;
    editedChangeRequest.priority = req.body.priority;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedChangeRequest);
        }
    });
};

// Change Status

exports.updateChangeRequestStatus = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedChangeRequest = editedGate.projectChangeRequests.id(req.params.projectChangeRequestId);

    editedChangeRequest.changeStatus.history.push({
        baselineDeliveryDate : editedChangeRequest.changeStatus.currentRecord.baselineDeliveryDate,
        estimateDeliveryDate : editedChangeRequest.changeStatus.currentRecord.estimateDeliveryDate,
        actualDeliveryDate : editedChangeRequest.changeStatus.currentRecord.actualDeliveryDate,
        completed : editedChangeRequest.changeStatus.currentRecord.completed,
        status : editedChangeRequest.changeStatus.currentRecord.status,
        comment : editedChangeRequest.changeStatus.currentRecord.comment,

        user : {
            _id: editedChangeRequest.changeStatus.currentRecord.user._id,
            displayName: editedChangeRequest.changeStatus.currentRecord.user.displayName
        },
        created : editedChangeRequest.changeStatus.currentRecord.created
    });

    editedChangeRequest.changeStatus.currentRecord.baselineDeliveryDate = req.body.changeStatus.currentRecord.baselineDeliveryDate;
    editedChangeRequest.changeStatus.currentRecord.estimateDeliveryDate = req.body.changeStatus.currentRecord.estimateDeliveryDate;
    editedChangeRequest.changeStatus.currentRecord.actualDeliveryDate = req.body.changeStatus.currentRecord.actualDeliveryDate;
    editedChangeRequest.changeStatus.currentRecord.completed = req.body.changeStatus.currentRecord.completed;
    editedChangeRequest.changeStatus.currentRecord.status = req.body.changeStatus.currentRecord.status;
    editedChangeRequest.changeStatus.currentRecord.comment = req.body.changeStatus.currentRecord.comment;

    editedChangeRequest.changeStatus.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedChangeRequest.changeStatus.currentRecord.created = Date.now();

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedChangeRequest);
        }
    });

};

// Budget

exports.updateGateBudgetReviewForCR = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedChangeRequest = editedGate.projectChangeRequests.id(req.params.projectChangeRequestId);

    editedChangeRequest.user = req.user;
    editedChangeRequest.created = Date.now();

    editedChangeRequest.budgetReview.newAmount = req.body.budgetReview.newAmount;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedChangeRequest);
        }
    });

};

// Performances

var gateDateCheck = function(performanceName, performanceReviewsArray, editedPerformanceReview, newDate){

    var errDateCheck = null;

    // Skip check if newDate is null ( new Date(null) is today!)
    if(newDate){
        _.each(performanceReviewsArray, function(performanceReview){

            // Skip if checked date is null
            if(performanceReview.newDate){

                // Date from any gate BEFORE must be <= of NewDate (all dates refer to gateReview newDates and not current)
                if(performanceReview[performanceName].targetGate.position < editedPerformanceReview[performanceName].targetGate.position){
                    if(performanceReview.newDate > new Date(newDate)){
                        errDateCheck = new Error('New date cannot be earlier than previous gates');
                    }
                }

                // Date from any gate AFTER must be >= of NewDate
                if(performanceReview[performanceName].targetGate.position > editedPerformanceReview[performanceName].targetGate.position){
                    if(performanceReview.newDate < new Date(newDate)){
                        errDateCheck = new Error('New date cannot be later than later gates');
                    }
                }

            }
        });
    }

    return errDateCheck;

};

exports.updateBaselineDurationReviewForCR = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedChangeRequest = editedGate.projectChangeRequests.id(req.params.projectChangeRequestId);
    editedChangeRequest.user = req.user;
    editedChangeRequest.created = Date.now();

    var performanceName = 'baselineDuration';

    var performanceReviewsArray = editedChangeRequest.performances.duration.baselineDurationReviews;

    var editedPerformanceReview = performanceReviewsArray.id(req.params.baselineDurationReviewId);

    var newDate = req.body.newDate;

    editedPerformanceReview.newDate = newDate;

    var errDateCheck = gateDateCheck(performanceName, performanceReviewsArray, editedPerformanceReview, newDate);

    if(errDateCheck){
        return res.status(400).send({
            message: errorHandler.getErrorMessage(errDateCheck)
        });
    }

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedPerformanceReview);
        }
    });

};

exports.updateActualDurationReviewForCR = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedChangeRequest = editedGate.projectChangeRequests.id(req.params.projectChangeRequestId);
    editedChangeRequest.user = req.user;
    editedChangeRequest.created = Date.now();

    var performanceName = 'actualDuration';

    var performanceReviewsArray = editedChangeRequest.performances.duration.actualDurationReviews;

    var editedPerformanceReview = performanceReviewsArray.id(req.params.actualDurationReviewId);

    var newDate = req.body.newDate;

    editedPerformanceReview.newDate = newDate;

    var errDateCheck = gateDateCheck(performanceName, performanceReviewsArray, editedPerformanceReview, newDate);

    if(errDateCheck){
        return res.status(400).send({
            message: errorHandler.getErrorMessage(errDateCheck)
        });
    }

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedPerformanceReview);
        }
    });

};


exports.updateBaselineCostReviewForCR = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedChangeRequest = editedGate.projectChangeRequests.id(req.params.projectChangeRequestId);

    var editedPerformanceReview = editedChangeRequest.performances.cost.baselineCostReviews.id(req.params.baselineCostReviewId);

    editedChangeRequest.user = req.user;
    editedChangeRequest.created = Date.now();

    editedPerformanceReview.newCost = req.body.newCost;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedPerformanceReview);
        }
    });

};

exports.updateActualCostReviewForCR = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedChangeRequest = editedGate.projectChangeRequests.id(req.params.projectChangeRequestId);

    var editedPerformanceReview = editedChangeRequest.performances.cost.actualCostReviews.id(req.params.actualCostReviewId);

    editedChangeRequest.user = req.user;
    editedChangeRequest.created = Date.now();

    editedPerformanceReview.newCost = req.body.newCost;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedPerformanceReview);
        }
    });

};


exports.updateBaselineCompletionReviewForCR = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedChangeRequest = editedGate.projectChangeRequests.id(req.params.projectChangeRequestId);

    var editedPerformanceReview = editedChangeRequest.performances.completion.baselineCompletionReviews.id(req.params.baselineCompletionReviewId);

    editedChangeRequest.user = req.user;
    editedChangeRequest.created = Date.now();

    editedPerformanceReview.newCompletion = req.body.newCompletion;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedPerformanceReview);
        }
    });

};

exports.updateActualCompletionReviewForCR = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedChangeRequest = editedGate.projectChangeRequests.id(req.params.projectChangeRequestId);

    var editedPerformanceReview = editedChangeRequest.performances.completion.actualCompletionReviews.id(req.params.actualCompletionReviewId);

    editedChangeRequest.user = req.user;
    editedChangeRequest.created = Date.now();

    editedPerformanceReview.newCompletion = req.body.newCompletion;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedPerformanceReview);
        }
    });

};

// Approval

var setSubmitMissingFields = function(changeRequest, gate){

    var missingFields = [];

    if(!changeRequest.budgetReview.newAmount){
        missingFields.push('Budget amount');
    }

    _.each(changeRequest.performances.duration.baselineDurationReviews, function(performanceReview){
        if(!performanceReview.newDate){
            missingFields.push('Baseline date for ' + performanceReview.baselineDuration.targetGate.name);
        }
    });
    _.each(changeRequest.performances.duration.actualDurationReviews, function(performanceReview){
        if(!performanceReview.newDate && gate.gateState.currentRecord.completed){
            missingFields.push('Actual date for ' + performanceReview.baselineDuration.targetGate.name);
        }
    });

    _.each(changeRequest.performances.cost.baselineCostReviews, function(performanceReview){
        if(!performanceReview.newCost){
            missingFields.push('Baseline cost for ' + performanceReview.baselineCost.targetGate.name);
        }
    });
    _.each(changeRequest.performances.cost.actualCostReviews, function(performanceReview){
        if(!performanceReview.newCost && gate.gateState.currentRecord.completed){
            missingFields.push('Actual cost for ' + performanceReview.baselineCost.targetGate.name);
        }
    });

    _.each(changeRequest.performances.completion.baselineCompletionReviews, function(performanceReview){
        if(!performanceReview.newCompletion){
            missingFields.push('Baseline completion for ' + performanceReview.baselineCompletion.targetGate.name);
        }
    });
    _.each(changeRequest.performances.completion.actualCompletionReviews, function(performanceReview){
        if(!performanceReview.newCompletion && gate.gateState.currentRecord.completed){
            missingFields.push('Actual completion for ' + performanceReview.baselineCompletion.targetGate.name);
        }
    });

    return missingFields;
};

var checkDateConsistency = function(editedChangeRequest, editedGate, project){
    // Check that this gate baseline/estimate/actual are not earlier than previous gate or later than next gate

    var gates = project.process.gates;

    var dateConsistencyErrors = [];

    // Gate Review new dates

    var thisGate_BaselineDurationReview_NewDate = _.find(editedChangeRequest.performances.duration.baselineDurationReviews, function(performanceReview){
        return performanceReview.baselineDuration.targetGate._id.equals(editedGate._id);
    }).newDate;
    // thisGate_BaselineDurationReview_NewDate = thisGate_BaselineDurationReview_NewDate && new Date(thisGate_BaselineDurationReview_NewDate);

    var thisGate_ActualDurationReview_NewDate = _.find(editedChangeRequest.performances.duration.actualDurationReviews, function(performanceReview){
        return performanceReview.actualDuration.targetGate._id.equals(editedGate._id);
    }).newDate;
    // thisGate_ActualDurationReview_NewDate = thisGate_ActualDurationReview_NewDate && new Date(thisGate_ActualDurationReview_NewDate);

    _.each(gates, function(gate){

        // PREVIOUS gates dates (for itself as a target). Skip if editedGate is START
        if((gate.position < editedGate.position) && (!editedGate._id.equals(project.process.startGate))){

            var previousGate_BaselineDuration_CurrentDate = _.find(gate.performances.duration.baselineDurations, function(performance){
                return performance.targetGate._id.equals(gate._id);
            }).currentRecord.gateDate;
            // previousGate_BaselineDuration_CurrentDate = previousGate_BaselineDuration_CurrentDate && new Date(previousGate_BaselineDuration_CurrentDate);

            var previousGate_ActualDuration_CurrentDate = _.find(gate.performances.duration.actualDurations, function(performance){
                return performance.targetGate._id.equals(gate._id);
            }).currentRecord.gateDate;
            // previousGate_ActualDuration_CurrentDate = previousGate_ActualDuration_CurrentDate && new Date(previousGate_ActualDuration_CurrentDate);

            if(previousGate_BaselineDuration_CurrentDate && thisGate_BaselineDurationReview_NewDate && (previousGate_BaselineDuration_CurrentDate > thisGate_BaselineDurationReview_NewDate)){
                dateConsistencyErrors.push(editedGate.name + ' Baseline date ' + thisGate_BaselineDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_BaselineDuration_CurrentDate.toDateString());
            }

            if(previousGate_ActualDuration_CurrentDate && thisGate_ActualDurationReview_NewDate && (previousGate_ActualDuration_CurrentDate > thisGate_ActualDurationReview_NewDate)){
                dateConsistencyErrors.push(editedGate.name + ' Actual date ' + thisGate_ActualDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_ActualDuration_CurrentDate.toDateString());
            }
        }

        // NEXT gates dates (for next gate as a target). Skip is editedGate is END
        if((gate.position > editedGate.position) && (!editedGate._id.equals(project.process.endGate))){

            var nextGate_BaselineDuration_CurrentDate = _.find(gate.performances.duration.baselineDurations, function(performance){
                return performance.targetGate._id.equals(gate._id);
            }).currentRecord.gateDate;
            // nextGate_BaselineDuration_CurrentDate = nextGate_BaselineDuration_CurrentDate && new Date(nextGate_BaselineDuration_CurrentDate);

            var nextGate_ActualDuration_CurrentDate = _.find(gate.performances.duration.actualDurations, function(performance){
                return performance.targetGate._id.equals(gate._id);
            }).currentRecord.gateDate;
            // nextGate_ActualDuration_CurrentDate = nextGate_ActualDuration_CurrentDate && new Date(nextGate_ActualDuration_CurrentDate);

            if(nextGate_BaselineDuration_CurrentDate && thisGate_BaselineDurationReview_NewDate && (nextGate_BaselineDuration_CurrentDate < thisGate_BaselineDurationReview_NewDate)){
                dateConsistencyErrors.push(editedGate.name + ' Baseline date ' + thisGate_BaselineDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_BaselineDuration_CurrentDate.toDateString());
            }

            if(nextGate_ActualDuration_CurrentDate && thisGate_ActualDurationReview_NewDate && (nextGate_ActualDuration_CurrentDate < thisGate_ActualDurationReview_NewDate)){
                dateConsistencyErrors.push(editedGate.name + ' Actual date ' + thisGate_ActualDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_ActualDuration_CurrentDate.toDateString());
            }
        }

    });

    return dateConsistencyErrors;
};

// -----

exports.submitChangeRequest = function(req, res) {

    var project = req.project ;

    var gates = project.process.gates;

    var editedGate = _.find(gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedChangeRequest = editedGate.projectChangeRequests.id(req.params.projectChangeRequestId);

    editedChangeRequest.approval.history.push({
        approvalState : editedChangeRequest.approval.currentRecord.approvalState,
        user : {
            _id: editedChangeRequest.approval.currentRecord.user._id,
            displayName: editedChangeRequest.approval.currentRecord.user.displayName
        },
        created : editedChangeRequest.approval.currentRecord.created
    });

    editedChangeRequest.approval.currentRecord.approvalState = 'submitted';
    editedChangeRequest.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedChangeRequest.approval.currentRecord.created = Date.now();

    // Checks

    var missingFields = setSubmitMissingFields(editedChangeRequest, editedGate);
    var dateConsistencyErrors = checkDateConsistency(editedChangeRequest, editedGate, project);

    if((missingFields.length > 0) || (dateConsistencyErrors.length > 0)){
        console.log(missingFields);
        console.log(dateConsistencyErrors);
        return res.status(400).send({
            message: 'Missing fields: ' + missingFields.join(', * ') +' ---- '+ ' Date consistency check: ' + dateConsistencyErrors.join(', - ')
        });
    }

    // Save project

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedChangeRequest);
        }
    });

};

exports.approveChangeRequest = function(req, res) {

    var project = req.project ;

    var gates = project.process.gates;

    var editedGate = _.find(gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedChangeRequest = editedGate.projectChangeRequests.id(req.params.projectChangeRequestId);

    // Checks

    var missingFields = setSubmitMissingFields(editedChangeRequest, editedGate);
    var dateConsistencyErrors = checkDateConsistency(editedChangeRequest, editedGate, project);

    if((missingFields.length > 0) || (dateConsistencyErrors.length > 0)){
        console.log(missingFields);
        console.log(dateConsistencyErrors);
        return res.status(400).send({
            message: 'Missing fields: ' + missingFields.join(', * ') +' ---- '+ ' Date consistency check: ' + dateConsistencyErrors.join(', - ')
        });
    }

    // Update editedChangeRequest with req.body information

    editedChangeRequest.approval.history.push({
        approvalState : editedChangeRequest.approval.currentRecord.approvalState,
        user : {
            _id: editedChangeRequest.approval.currentRecord.user._id,
            displayName: editedChangeRequest.approval.currentRecord.user.displayName
        },
        created : editedChangeRequest.approval.currentRecord.created
    });

    editedChangeRequest.approval.currentRecord.approvalState = 'approved';
    editedChangeRequest.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedChangeRequest.approval.currentRecord.created = Date.now();

    // Apply changes to BUDGET

    editedGate.budget.history.push({
        sourceGateReview : editedGate.budget.currentRecord.sourceGateReview,
        sourceChangeRequest : editedGate.budget.currentRecord.sourceChangeRequest,
        amount : editedGate.budget.currentRecord.amount,
        created: editedGate.budget.currentRecord.created,
        user: editedGate.budget.currentRecord.user
    });
    editedGate.budget.currentRecord.sourceGateReview = null;
    editedGate.budget.currentRecord.sourceChangeRequest = editedChangeRequest._id;
    editedGate.budget.currentRecord.amount = editedChangeRequest.budgetReview.newAmount;
    editedGate.budget.currentRecord.created = Date.now();
    editedGate.budget.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};

    // Apply changes to DURATION

    _.each(editedChangeRequest.performances.duration.baselineDurationReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.duration.baselineDurations.id(performanceReview.baselineDuration._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceChangeRequest : editedPerformance.currentRecord.sourceChangeRequest,
            gateDate: editedPerformance.currentRecord.gateDate,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = null;
        editedPerformance.currentRecord.sourceChangeRequest = editedChangeRequest._id;
        editedPerformance.currentRecord.gateDate = performanceReview.newDate;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });

    _.each(editedChangeRequest.performances.duration.actualDurationReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.duration.actualDurations.id(performanceReview.actualDuration._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceChangeRequest : editedPerformance.currentRecord.sourceChangeRequest,
            gateDate: editedPerformance.currentRecord.gateDate,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = null;
        editedPerformance.currentRecord.sourceChangeRequest = editedChangeRequest._id;
        editedPerformance.currentRecord.gateDate = performanceReview.newDate;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });

    // Apply changes to COST

    _.each(editedChangeRequest.performances.cost.baselineCostReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.cost.baselineCosts.id(performanceReview.baselineCost._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceChangeRequest : editedPerformance.currentRecord.sourceChangeRequest,
            cost: editedPerformance.currentRecord.cost,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = null;
        editedPerformance.currentRecord.sourceChangeRequest = editedChangeRequest._id;
        editedPerformance.currentRecord.cost = performanceReview.newCost;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });

    _.each(editedChangeRequest.performances.cost.actualCostReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.cost.actualCosts.id(performanceReview.actualCost._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceChangeRequest : editedPerformance.currentRecord.sourceChangeRequest,
            cost: editedPerformance.currentRecord.cost,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = null;
        editedPerformance.currentRecord.sourceChangeRequest = editedChangeRequest._id;
        editedPerformance.currentRecord.cost = performanceReview.newCost;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });

    // Apply changes to COMPLETION

    _.each(editedChangeRequest.performances.completion.baselineCompletionReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.completion.baselineCompletions.id(performanceReview.baselineCompletion._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceChangeRequest : editedPerformance.currentRecord.sourceChangeRequest,
            completion: editedPerformance.currentRecord.completion,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = null;
        editedPerformance.currentRecord.sourceChangeRequest = editedChangeRequest._id;
        editedPerformance.currentRecord.completion = performanceReview.newCompletion;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });

    _.each(editedChangeRequest.performances.completion.actualCompletionReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.completion.actualCompletions.id(performanceReview.actualCompletion._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceChangeRequest : editedPerformance.currentRecord.sourceChangeRequest,
            completion: editedPerformance.currentRecord.completion,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = null;
        editedPerformance.currentRecord.sourceChangeRequest = editedChangeRequest._id;
        editedPerformance.currentRecord.completion = performanceReview.newCompletion;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });

    // Save project

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedChangeRequest);
        }
    });
};

exports.rejectChangeRequest = function(req, res) {

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedChangeRequest = editedGate.projectChangeRequests.id(req.params.projectChangeRequestId);

    editedChangeRequest.approval.history.push({
        approvalState : editedChangeRequest.approval.currentRecord.approvalState,
        user : {
            _id: editedChangeRequest.approval.currentRecord.user._id,
            displayName: editedChangeRequest.approval.currentRecord.user.displayName
        },
        created : editedChangeRequest.approval.currentRecord.created
    });

    editedChangeRequest.approval.currentRecord.approvalState = 'rejected';
    editedChangeRequest.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedChangeRequest.approval.currentRecord.created = Date.now();

    // No missing fields check

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedChangeRequest);
        }
    });

};

exports.draftChangeRequest = function(req, res) {

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedChangeRequest = editedGate.projectChangeRequests.id(req.params.projectChangeRequestId);

    editedChangeRequest.approval.history.push({
        approvalState : editedChangeRequest.approval.currentRecord.approvalState,
        user : {
            _id: editedChangeRequest.approval.currentRecord.user._id,
            displayName: editedChangeRequest.approval.currentRecord.user.displayName
        },
        created : editedChangeRequest.approval.currentRecord.created
    });

    editedChangeRequest.approval.currentRecord.approvalState = 'draft';
    editedChangeRequest.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedChangeRequest.approval.currentRecord.created = Date.now();

    // No missing fields check

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedChangeRequest);
        }
    });

};

