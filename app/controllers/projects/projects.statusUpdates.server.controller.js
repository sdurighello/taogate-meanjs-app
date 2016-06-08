'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');



exports.createStatusUpdate = function(req, res){
    var project = req.project;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var newStatusUpdate = editedGate.projectStatusUpdates.create({
        updateDate : req.body.updateDate,
        title : req.body.title,
        approval : {
            currentRecord : {
                approvalState: 'draft',
                user: { _id: req.user._id, displayName: req.user.displayName }
            },
            history : []
        },
        outcomeStatusReviews : [],
        deliveryStatus : {
            overallStatusReview : {
                currentRecord: {
                    status: editedGate.deliveryStatus.overallStatus.currentRecord.status,
                    comment : editedGate.deliveryStatus.overallStatus.currentRecord.comment
                },
                newStatus: editedGate.deliveryStatus.overallStatus.currentRecord.status,
                newComment : editedGate.deliveryStatus.overallStatus.currentRecord.comment
            },
            durationStatusReview : {
                currentRecord: {
                    status: editedGate.deliveryStatus.durationStatus.currentRecord.status,
                    comment : editedGate.deliveryStatus.durationStatus.currentRecord.comment
                },
                newStatus: editedGate.deliveryStatus.durationStatus.currentRecord.status,
                newComment : editedGate.deliveryStatus.durationStatus.currentRecord.comment
            },
            costStatusReview : {
                currentRecord: {
                    status: editedGate.deliveryStatus.costStatus.currentRecord.status,
                    comment : editedGate.deliveryStatus.costStatus.currentRecord.comment
                },
                newStatus: editedGate.deliveryStatus.costStatus.currentRecord.status,
                newComment : editedGate.deliveryStatus.costStatus.currentRecord.comment
            },
            completionStatusReview : {
                currentRecord: {
                    status: editedGate.deliveryStatus.completionStatus.currentRecord.status,
                    comment : editedGate.deliveryStatus.completionStatus.currentRecord.comment
                },
                newStatus: editedGate.deliveryStatus.completionStatus.currentRecord.status,
                newComment : editedGate.deliveryStatus.completionStatus.currentRecord.comment
            },
            projectStatusAreaReviews : []
        },
        performances: {
            duration: {
                estimateDurationReviews: []
            },
            cost: {
                estimateCostReviews: []
            },
            completion: {
                estimateCompletionReviews: []
            }
        },
        user: req.user._id
    });

    // Create outcome status reviews
    _.each(editedGate.outcomes, function(outcome){
        newStatusUpdate.outcomeStatusReviews.push({
            outcome : {
                _id: outcome._id,
                name: outcome.name,
                status: {
                    currentRecord: {
                        status: outcome.status.currentRecord.status,
                        comment :outcome.status.currentRecord.comment
                    }
                }
            },
            newStatus:  outcome.status.currentRecord.status,
            newComment:  outcome.status.currentRecord.comment
        });
    });

    // Create project status areas reviews
    _.each(editedGate.deliveryStatus.projectStatusAreas, function(area){
        newStatusUpdate.deliveryStatus.projectStatusAreaReviews.push({
            projectStatusArea : {
                _id: area._id,
                statusArea: {
                    _id: area.statusArea._id,
                    name: area.statusArea.name
                },
                currentRecord: {
                    status: area.currentRecord.status,
                    comment : area.currentRecord.comment
                }
            },
            newStatus:  area.currentRecord.status,
            newComment:  area.currentRecord.comment
        });
    });

    // Create durations
    _.each(editedGate.performances.duration.estimateDurations, function(performance){
        newStatusUpdate.performances.duration.estimateDurationReviews.push({
            estimateDuration: {
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
    _.each(editedGate.performances.cost.estimateCosts, function(performance){
        newStatusUpdate.performances.cost.estimateCostReviews.push({
            estimateCost: {
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
    _.each(editedGate.performances.completion.estimateCompletions, function(performance){
        newStatusUpdate.performances.completion.estimateCompletionReviews.push({
            estimateCompletion: {
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

    editedGate.projectStatusUpdates.push(newStatusUpdate);

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(newStatusUpdate);
        }
    });

};

exports.deleteStatusUpdate = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var deletedDocument = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId).remove();

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

exports.updateStatusUpdateHeader = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedStatusUpdate = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId);

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    editedStatusUpdate.updateDate = req.body.updateDate;
    editedStatusUpdate.title = req.body.title;
    editedStatusUpdate.description = req.body.description;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });
};


// Delivery Status

exports.updateOverallDeliveryStatus = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedStatusUpdate = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId);

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    editedStatusUpdate.deliveryStatus.overallStatusReview.newStatus = req.body.deliveryStatus.overallStatusReview.newStatus;
    editedStatusUpdate.deliveryStatus.overallStatusReview.newComment = req.body.deliveryStatus.overallStatusReview.newComment;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });

};

exports.updateDurationDeliveryStatus = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedStatusUpdate = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId);

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    editedStatusUpdate.deliveryStatus.durationStatusReview.newStatus = req.body.deliveryStatus.durationStatusReview.newStatus;
    editedStatusUpdate.deliveryStatus.durationStatusReview.newComment = req.body.deliveryStatus.durationStatusReview.newComment;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });

};

exports.updateCostDeliveryStatus = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedStatusUpdate = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId);

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    editedStatusUpdate.deliveryStatus.costStatusReview.newStatus = req.body.deliveryStatus.costStatusReview.newStatus;
    editedStatusUpdate.deliveryStatus.costStatusReview.newComment = req.body.deliveryStatus.costStatusReview.newComment;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });

};

exports.updateCompletionDeliveryStatus = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedStatusUpdate = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId);

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    editedStatusUpdate.deliveryStatus.completionStatusReview.newStatus = req.body.deliveryStatus.completionStatusReview.newStatus;
    editedStatusUpdate.deliveryStatus.completionStatusReview.newComment = req.body.deliveryStatus.completionStatusReview.newComment;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });

};


// Log Status Areas

exports.updateStatusAreaReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedStatusUpdate = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId);
    var editedStatusAreaReview = editedStatusUpdate.deliveryStatus.projectStatusAreaReviews.id(req.params.statusAreaReviewId);

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    editedStatusAreaReview.newStatus = req.body.newStatus;
    editedStatusAreaReview.newComment = req.body.newComment;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusAreaReview);
        }
    });

};


// Outcomes

exports.updateOutcomeStatusReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedStatusUpdate = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId);
    var editedOutcomeStatusReview = editedStatusUpdate.outcomeStatusReviews.id(req.params.outcomeStatusReviewId);

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    editedOutcomeStatusReview.newStatus = req.body.newStatus;
    editedOutcomeStatusReview.newComment = req.body.newComment;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedOutcomeStatusReview);
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

exports.updateEstimateDurationReviewForSU = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedStatusUpdate = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId);
    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    var performanceName = 'estimateDuration';

    var performanceReviewsArray = editedStatusUpdate.performances.duration.estimateDurationReviews;

    var editedPerformanceReview = performanceReviewsArray.id(req.params.estimateDurationReviewId);

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

exports.updateEstimateCostReviewForSU = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedStatusUpdate = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId);

    var editedPerformanceReview = editedStatusUpdate.performances.cost.estimateCostReviews.id(req.params.estimateCostReviewId);

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

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

exports.updateEstimateCompletionReviewForSU = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedStatusUpdate = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId);

    var editedPerformanceReview = editedStatusUpdate.performances.completion.estimateCompletionReviews.id(req.params.estimateCompletionReviewId);

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

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

var setSubmitMissingFields = function(gateReview){

    var missingFields = [];

    _.each(gateReview.performances.duration.estimateDurationReviews, function(performanceReview){
        if(!performanceReview.newDate){
            missingFields.push('Estimate date for ' + performanceReview.estimateDuration.targetGate.name);
        }
    });

    _.each(gateReview.performances.cost.estimateCostReviews, function(performanceReview){
        if(!performanceReview.newCost){
            missingFields.push('Estimate cost for ' + performanceReview.estimateCost.targetGate.name);
        }
    });

    _.each(gateReview.performances.completion.estimateCompletionReviews, function(performanceReview){
        if(!performanceReview.newCompletion){
            missingFields.push('Estimate completion for ' + performanceReview.estimateCompletion.targetGate.name);
        }
    });

    return missingFields;
};

var checkDateConsistency = function(editedStatusUpdate, editedGate, project){
    // Check that this gate baseline/estimate/actual are not earlier than previous gate or later than next gate

    var gates = project.process.gates;

    var dateConsistencyErrors = [];

    // Gate Review new dates


    var thisGate_EstimateDurationReview_NewDate = _.find(editedStatusUpdate.performances.duration.estimateDurationReviews, function(performanceReview){
        return performanceReview.estimateDuration.targetGate._id.equals(editedGate._id);
    }).newDate;
    // thisGate_EstimateDurationReview_NewDate = thisGate_EstimateDurationReview_NewDate && new Date(thisGate_EstimateDurationReview_NewDate);

    _.each(gates, function(gate){

        // PREVIOUS gates dates (for itself as a target). Skip if editedGate is START
        if((gate.position < editedGate.position) && (!editedGate._id.equals(project.process.startGate))){

            var previousGate_EstimateDuration_CurrentDate = _.find(gate.performances.duration.estimateDurations, function(performance){
                return performance.targetGate._id.equals(gate._id);
            }).currentRecord.gateDate;
            // previousGate_EstimateDuration_CurrentDate = previousGate_EstimateDuration_CurrentDate && new Date(previousGate_EstimateDuration_CurrentDate);

            if(previousGate_EstimateDuration_CurrentDate && thisGate_EstimateDurationReview_NewDate && (previousGate_EstimateDuration_CurrentDate > thisGate_EstimateDurationReview_NewDate)){
                dateConsistencyErrors.push(editedGate.name + ' Estimate date ' + thisGate_EstimateDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_EstimateDuration_CurrentDate.toDateString());
            }

        }

        // NEXT gates dates (for next gate as a target). Skip is editedGate is END
        if((gate.position > editedGate.position) && (!editedGate._id.equals(project.process.endGate))){

            var nextGate_EstimateDuration_CurrentDate = _.find(gate.performances.duration.estimateDurations, function(performance){
                return performance.targetGate._id.equals(gate._id);
            }).currentRecord.gateDate;
            // nextGate_EstimateDuration_CurrentDate = nextGate_EstimateDuration_CurrentDate && new Date(nextGate_EstimateDuration_CurrentDate);

            if(nextGate_EstimateDuration_CurrentDate && thisGate_EstimateDurationReview_NewDate && (nextGate_EstimateDuration_CurrentDate < thisGate_EstimateDurationReview_NewDate)){
                dateConsistencyErrors.push(editedGate.name + ' Estimate date ' + thisGate_EstimateDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_EstimateDuration_CurrentDate.toDateString());
            }

        }

    });

    return dateConsistencyErrors;
};

// -----

exports.submitStatusUpdate = function(req, res) {

    var project = req.project ;

    var gates = project.process.gates;

    var editedGate = _.find(gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedStatusUpdate = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId);

    editedStatusUpdate.approval.history.push({
        approvalState : editedStatusUpdate.approval.currentRecord.approvalState,
        user : {
            _id: editedStatusUpdate.approval.currentRecord.user._id,
            displayName: editedStatusUpdate.approval.currentRecord.user.displayName
        },
        created : editedStatusUpdate.approval.currentRecord.created
    });

    editedStatusUpdate.approval.currentRecord.approvalState = 'submitted';
    editedStatusUpdate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedStatusUpdate.approval.currentRecord.created = Date.now();

    // Checks

    var missingFields = setSubmitMissingFields(editedStatusUpdate);
    var dateConsistencyErrors = checkDateConsistency(editedStatusUpdate, editedGate, project);

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
            res.jsonp(editedStatusUpdate);
        }
    });

};

exports.approveStatusUpdate = function(req, res) {

    var project = req.project ;

    var gates = project.process.gates;

    var editedGate = _.find(gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedStatusUpdate = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId);

    // Checks

    var missingFields = setSubmitMissingFields(editedStatusUpdate);
    var dateConsistencyErrors = checkDateConsistency(editedStatusUpdate, editedGate, project);

    if((missingFields.length > 0) || (dateConsistencyErrors.length > 0)){
        console.log(missingFields);
        console.log(dateConsistencyErrors);
        return res.status(400).send({
            message: 'Missing fields: ' + missingFields.join(', * ') +' ---- '+ ' Date consistency check: ' + dateConsistencyErrors.join(', - ')
        });
    }

    // Update editedStatusUpdate with req.body information

    editedStatusUpdate.approval.history.push({
        approvalState : editedStatusUpdate.approval.currentRecord.approvalState,
        user : {
            _id: editedStatusUpdate.approval.currentRecord.user._id,
            displayName: editedStatusUpdate.approval.currentRecord.user.displayName
        },
        created : editedStatusUpdate.approval.currentRecord.created
    });

    editedStatusUpdate.approval.currentRecord.approvalState = 'approved';
    editedStatusUpdate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedStatusUpdate.approval.currentRecord.created = Date.now();

    // Apply changes to GATE OUTCOMES

    _.each(editedStatusUpdate.outcomeStatusReviews, function(outcomeStatusReview){
        var editedOutcome = editedGate.outcomes.id(outcomeStatusReview.outcome._id);
        editedOutcome.status.history.push({
            sourceStatusUpdate : editedOutcome.status.currentRecord.sourceStatusUpdate,
            status: editedOutcome.status.currentRecord.status,
            comment: editedOutcome.status.currentRecord.comment,
            created: editedOutcome.status.currentRecord.created,
            user: editedOutcome.status.currentRecord.user
        });
        editedOutcome.status.currentRecord.sourceStatusUpdate = editedStatusUpdate._id;
        editedOutcome.status.currentRecord.status = outcomeStatusReview.newStatus;
        editedOutcome.status.currentRecord.comment = outcomeStatusReview.newComment;
        editedOutcome.status.currentRecord.created = Date.now();
        editedOutcome.status.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });


    // Apply changes to DELIVERY STATUS - Overall

    editedGate.deliveryStatus.overallStatus.history.push({
        sourceStatusUpdate : editedGate.deliveryStatus.overallStatus.currentRecord.sourceStatusUpdate,
        status: editedGate.deliveryStatus.overallStatus.currentRecord.status,
        comment: editedGate.deliveryStatus.overallStatus.currentRecord.comment,
        created: editedGate.deliveryStatus.overallStatus.currentRecord.created,
        user: editedGate.deliveryStatus.overallStatus.currentRecord.user
    });
    editedGate.deliveryStatus.overallStatus.currentRecord.sourceStatusUpdate = editedStatusUpdate._id;
    editedGate.deliveryStatus.overallStatus.currentRecord.status = editedStatusUpdate.deliveryStatus.overallStatusReview.newStatus;
    editedGate.deliveryStatus.overallStatus.currentRecord.comment = editedStatusUpdate.deliveryStatus.overallStatusReview.newComment;
    editedGate.deliveryStatus.overallStatus.currentRecord.created = Date.now();
    editedGate.deliveryStatus.overallStatus.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};

    // Apply changes to DELIVERY STATUS - Duration

    editedGate.deliveryStatus.durationStatus.history.push({
        sourceStatusUpdate : editedGate.deliveryStatus.durationStatus.currentRecord.sourceStatusUpdate,
        status: editedGate.deliveryStatus.durationStatus.currentRecord.status,
        comment: editedGate.deliveryStatus.durationStatus.currentRecord.comment,
        created: editedGate.deliveryStatus.durationStatus.currentRecord.created,
        user: editedGate.deliveryStatus.durationStatus.currentRecord.user
    });
    editedGate.deliveryStatus.durationStatus.currentRecord.sourceStatusUpdate = editedStatusUpdate._id;
    editedGate.deliveryStatus.durationStatus.currentRecord.status = editedStatusUpdate.deliveryStatus.durationStatusReview.newStatus;
    editedGate.deliveryStatus.durationStatus.currentRecord.comment = editedStatusUpdate.deliveryStatus.durationStatusReview.newComment;
    editedGate.deliveryStatus.durationStatus.currentRecord.created = Date.now();
    editedGate.deliveryStatus.durationStatus.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};

    // Apply changes to DELIVERY STATUS - Cost

    editedGate.deliveryStatus.costStatus.history.push({
        sourceStatusUpdate : editedGate.deliveryStatus.costStatus.currentRecord.sourceStatusUpdate,
        status: editedGate.deliveryStatus.costStatus.currentRecord.status,
        comment: editedGate.deliveryStatus.costStatus.currentRecord.comment,
        created: editedGate.deliveryStatus.costStatus.currentRecord.created,
        user: editedGate.deliveryStatus.costStatus.currentRecord.user
    });
    editedGate.deliveryStatus.costStatus.currentRecord.sourceStatusUpdate = editedStatusUpdate._id;
    editedGate.deliveryStatus.costStatus.currentRecord.status = editedStatusUpdate.deliveryStatus.costStatusReview.newStatus;
    editedGate.deliveryStatus.costStatus.currentRecord.comment = editedStatusUpdate.deliveryStatus.costStatusReview.newComment;
    editedGate.deliveryStatus.costStatus.currentRecord.created = Date.now();
    editedGate.deliveryStatus.costStatus.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};

    // Apply changes to DELIVERY STATUS - Completion

    editedGate.deliveryStatus.completionStatus.history.push({
        sourceStatusUpdate : editedGate.deliveryStatus.completionStatus.currentRecord.sourceStatusUpdate,
        status: editedGate.deliveryStatus.completionStatus.currentRecord.status,
        comment: editedGate.deliveryStatus.completionStatus.currentRecord.comment,
        created: editedGate.deliveryStatus.completionStatus.currentRecord.created,
        user: editedGate.deliveryStatus.completionStatus.currentRecord.user
    });
    editedGate.deliveryStatus.completionStatus.currentRecord.sourceStatusUpdate = editedStatusUpdate._id;
    editedGate.deliveryStatus.completionStatus.currentRecord.status = editedStatusUpdate.deliveryStatus.completionStatusReview.newStatus;
    editedGate.deliveryStatus.completionStatus.currentRecord.comment = editedStatusUpdate.deliveryStatus.completionStatusReview.newComment;
    editedGate.deliveryStatus.completionStatus.currentRecord.created = Date.now();
    editedGate.deliveryStatus.completionStatus.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};


    // Apply changes to DELIVERY STATUS - Status Areas

    _.each(editedStatusUpdate.deliveryStatus.projectStatusAreaReviews, function(statusAreaReview){
        var editedProjectStatusArea = editedGate.deliveryStatus.projectStatusAreas.id(statusAreaReview.projectStatusArea._id);
        editedProjectStatusArea.history.push({
            sourceStatusUpdate : editedProjectStatusArea.currentRecord.sourceStatusUpdate,
            status: editedProjectStatusArea.currentRecord.status,
            comment: editedProjectStatusArea.currentRecord.comment,
            created: editedProjectStatusArea.currentRecord.created,
            user: editedProjectStatusArea.currentRecord.user
        });
        editedProjectStatusArea.currentRecord.sourceStatusUpdate = editedStatusUpdate._id;
        editedProjectStatusArea.currentRecord.status = statusAreaReview.newStatus;
        editedProjectStatusArea.currentRecord.comment = statusAreaReview.newComment;
        editedProjectStatusArea.currentRecord.created = Date.now();
        editedProjectStatusArea.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });


    // Apply changes to DURATION

    _.each(editedStatusUpdate.performances.duration.estimateDurationReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.duration.estimateDurations.id(performanceReview.estimateDuration._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceStatusUpdate : editedPerformance.currentRecord.sourceStatusUpdate,
            gateDate: editedPerformance.currentRecord.gateDate,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = null;
        editedPerformance.currentRecord.sourceChangeRequest = editedStatusUpdate._id;
        editedPerformance.currentRecord.gateDate = performanceReview.newDate;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });

    // Apply changes to COST

    _.each(editedStatusUpdate.performances.cost.estimateCostReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.cost.estimateCosts.id(performanceReview.estimateCost._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceStatusUpdate : editedPerformance.currentRecord.sourceStatusUpdate,
            cost: editedPerformance.currentRecord.cost,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = null;
        editedPerformance.currentRecord.sourceStatusUpdate = editedStatusUpdate._id;
        editedPerformance.currentRecord.cost = performanceReview.newCost;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });

    // Apply changes to COMPLETION

    _.each(editedStatusUpdate.performances.completion.estimateCompletionReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.completion.estimateCompletions.id(performanceReview.estimateCompletion._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceStatusUpdate : editedPerformance.currentRecord.sourceStatusUpdate,
            completion: editedPerformance.currentRecord.completion,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = null;
        editedPerformance.currentRecord.sourceStatusUpdate = editedStatusUpdate._id;
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
            res.jsonp(editedStatusUpdate);
        }
    });
};

exports.rejectStatusUpdate = function(req, res) {

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedStatusUpdate = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId);

    editedStatusUpdate.approval.history.push({
        approvalState : editedStatusUpdate.approval.currentRecord.approvalState,
        user : {
            _id: editedStatusUpdate.approval.currentRecord.user._id,
            displayName: editedStatusUpdate.approval.currentRecord.user.displayName
        },
        created : editedStatusUpdate.approval.currentRecord.created
    });

    editedStatusUpdate.approval.currentRecord.approvalState = 'rejected';
    editedStatusUpdate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedStatusUpdate.approval.currentRecord.created = Date.now();

    // No missing fields check

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });

};

exports.draftStatusUpdate = function(req, res) {

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedStatusUpdate = editedGate.projectStatusUpdates.id(req.params.projectStatusUpdateId);

    editedStatusUpdate.approval.history.push({
        approvalState : editedStatusUpdate.approval.currentRecord.approvalState,
        user : {
            _id: editedStatusUpdate.approval.currentRecord.user._id,
            displayName: editedStatusUpdate.approval.currentRecord.user.displayName
        },
        created : editedStatusUpdate.approval.currentRecord.created
    });

    editedStatusUpdate.approval.currentRecord.approvalState = 'draft';
    editedStatusUpdate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedStatusUpdate.approval.currentRecord.created = Date.now();

    // No missing fields check

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });

};

