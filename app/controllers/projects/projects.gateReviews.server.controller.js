'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');



exports.createGateReview = function(req, res){
    var project = req.project;
    
    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });
    
    var newGateReview = editedGate.gateReviews.create({
        reviewDate : req.body.reviewDate,
        title : req.body.title,
        approval : {
            currentRecord : {
                approvalState: 'draft',
                user: { _id: req.user._id, displayName: req.user.displayName }
            },
            history : []
        },
        gateStatusReview: {
            gateStatus :{
                currentRecord:{
                    completed: editedGate.gateStatus.currentRecord.completed,
                    status : editedGate.gateStatus.currentRecord.status,
                    overallScore : editedGate.gateStatus.currentRecord.overallScore
                }
            },
            newCompleted: editedGate.gateStatus.currentRecord.completed,
            newStatus : editedGate.gateStatus.currentRecord.status,
            newOverallScore : editedGate.gateStatus.currentRecord.overallScore
        },

        budgetReview : {
            currentAmount: editedGate.budget.amount,
            newAmount: editedGate.budget.amount
        },
        outcomeReviews : [],
        performances: {
            duration: {
                baselineDurationReviews: [],
                estimateDurationReviews: [],
                actualDurationReviews: []
            },
            cost: {
                baselineCostReviews: [],
                estimateCostReviews: [],
                actualCostReviews: []
            },
            completion: {
                baselineCompletionReviews: [],
                estimateCompletionReviews: [],
                actualCompletionReviews: []
            }
        },
        user: req.user._id
    });

    // Create outcome reviews
    _.each(editedGate.outcomes, function(outcome){
        newGateReview.outcomeReviews.push({
            outcome : {
                _id: outcome._id,
                name: outcome.name,
                score: {
                    currentRecord: {
                        score: outcome.score.currentRecord.score,
                        comment :outcome.score.currentRecord.comment
                    }
                }
            },
            newScore:  outcome.score.currentRecord.score,
            newComment:  outcome.score.currentRecord.comment
        });
    });

    // Create durations
    _.each(editedGate.performances.duration.baselineDurations, function(performance){
        newGateReview.performances.duration.baselineDurationReviews.push({
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
    _.each(editedGate.performances.duration.estimateDurations, function(performance){
        newGateReview.performances.duration.estimateDurationReviews.push({
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
    _.each(editedGate.performances.duration.actualDurations, function(performance){
        newGateReview.performances.duration.actualDurationReviews.push({
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
        newGateReview.performances.cost.baselineCostReviews.push({
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
    _.each(editedGate.performances.cost.estimateCosts, function(performance){
        newGateReview.performances.cost.estimateCostReviews.push({
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
    _.each(editedGate.performances.cost.actualCosts, function(performance){
        newGateReview.performances.cost.actualCostReviews.push({
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
        newGateReview.performances.completion.baselineCompletionReviews.push({
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
    _.each(editedGate.performances.completion.estimateCompletions, function(performance){
        newGateReview.performances.completion.estimateCompletionReviews.push({
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
    _.each(editedGate.performances.completion.actualCompletions, function(performance){
        newGateReview.performances.completion.actualCompletionReviews.push({
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

    editedGate.gateReviews.push(newGateReview);

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(newGateReview);
        }
    });

};

exports.deleteGateReview = function(req, res){
    
    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var deletedGateReview = editedGate.gateReviews.id(req.params.gateReviewId).remove();

    project.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(deletedGateReview);
        }
    });
};

// Header, Gate Status, Budget

exports.updateGateReviewHeader = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

    editedGateReview.reviewDate = req.body.reviewDate;
    editedGateReview.title = req.body.title;
    editedGateReview.overallComment = req.body.overallComment;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedGateReview);
        }
    });
};

exports.updateGateStatusReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

    editedGateReview.gateStatusReview.newStatus = req.body.gateStatusReview.newStatus;
    editedGateReview.gateStatusReview.newOverallScore = req.body.gateStatusReview.newOverallScore;
    editedGateReview.gateStatusReview.newCompleted = req.body.gateStatusReview.newCompleted;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedGateReview);
        }
    });

};

exports.updateGateBudgetReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

    editedGateReview.budgetReview.newAmount = req.body.budgetReview.newAmount;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedGateReview);
        }
    });

};

// Outcomes

exports.updateOutcomeReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);
    var editedOutcomeReview = editedGateReview.outcomeReviews.id(req.params.outcomeReviewId);

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

    editedOutcomeReview.newScore = req.body.newScore;
    editedOutcomeReview.newComment = req.body.newComment;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedOutcomeReview);
        }
    });

};

// Performances

var gateDateCheck = function(performanceName, performanceReviewsArray, editedPerformanceReview, newDate){
    /* 
    * DURATION ONLY
    * For each type of performance (baseline, estimate, actual):
    * - This gate cannot be AFTER of NEXT gate
    * - This gate cannot be BEFORE of PREVIOUS gate
    */

    var errorMsg = null;
    
    _.each(performanceReviewsArray, function(p){
        // NewDate must be >= of date from gate BEFORE
        if((p[performanceName].targetGate.position === (editedPerformanceReview[performanceName].targetGate.position - 1)) && (new Date(newDate) < new Date(editedPerformanceReview.newDate))){
            errorMsg = {message: 'New date cannot be less than previous gate'};
        }
        // NewDate must be <= of date from gate AFTER
        if((p[performanceName].targetGate.position === (editedPerformanceReview[performanceName].targetGate.position + 1)) && (new Date(newDate) > new Date(editedPerformanceReview.newDate))){
            errorMsg = {message: 'New date cannot be greater than next gate'};
        }
    });

    return errorMsg;
    
};

exports.updateBaselineDurationReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);
    
    var performanceReviewsArray = editedGateReview.performances.duration.baselineDurationReviews;

    var editedPerformanceReview = performanceReviewsArray.id(req.params.baselineDurationReviewId);
    
    var newDate = req.body.newDate;

    var gateDateCheckErrorMsg = gateDateCheck('baselineDuration', performanceReviewsArray, editedPerformanceReview, newDate);

    if(gateDateCheckErrorMsg){
        return res.status(400).send(gateDateCheckErrorMsg);
    }

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

    editedPerformanceReview.newDate = newDate;

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

exports.updateEstimateDurationReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    var editedPerformanceReview = editedGateReview.performances.duration.estimateDurationReviews.id(req.params.estimateDurationReviewId);

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

    editedPerformanceReview.newDate = req.body.newDate;

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

exports.updateActualDurationReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    var editedPerformanceReview = editedGateReview.performances.duration.actualDurationReviews.id(req.params.actualDurationReviewId);

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

    editedPerformanceReview.newDate = req.body.newDate;

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


exports.updateBaselineCostReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    var editedPerformanceReview = editedGateReview.performances.cost.baselineCostReviews.id(req.params.baselineCostReviewId);

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

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

exports.updateEstimateCostReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    var editedPerformanceReview = editedGateReview.performances.cost.estimateCostReviews.id(req.params.estimateCostReviewId);

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

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

exports.updateActualCostReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    var editedPerformanceReview = editedGateReview.performances.cost.actualCostReviews.id(req.params.actualCostReviewId);

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

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


exports.updateBaselineCompletionReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    var editedPerformanceReview = editedGateReview.performances.completion.baselineCompletionReviews.id(req.params.baselineCompletionReviewId);

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

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

exports.updateEstimateCompletionReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    var editedPerformanceReview = editedGateReview.performances.completion.estimateCompletionReviews.id(req.params.estimateCompletionReviewId);

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

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

exports.updateActualCompletionReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    var editedPerformanceReview = editedGateReview.performances.completion.actualCompletionReviews.id(req.params.actualCompletionReviewId);

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

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

exports.submitGateReview = function(req, res) {

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    editedGateReview.approval.history.push({
        approvalState : editedGateReview.approval.currentRecord.approvalState,
        user : {
            _id: editedGateReview.approval.currentRecord.user._id,
            displayName: editedGateReview.approval.currentRecord.user.displayName
        },
        created : editedGateReview.approval.currentRecord.created
    });

    editedGateReview.approval.currentRecord.approvalState = 'submitted';
    editedGateReview.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedGateReview.approval.currentRecord.created = Date.now();

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedGateReview);
        }
    });

};

exports.approveGateReview = function(req, res) {

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    editedGateReview.approval.history.push({
        approvalState : editedGateReview.approval.currentRecord.approvalState,
        user : {
            _id: editedGateReview.approval.currentRecord.user._id,
            displayName: editedGateReview.approval.currentRecord.user.displayName
        },
        created : editedGateReview.approval.currentRecord.created
    });

    editedGateReview.approval.currentRecord.approvalState = 'approved';
    editedGateReview.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedGateReview.approval.currentRecord.created = Date.now();

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedGateReview);
        }
    });
};

exports.rejectGateReview = function(req, res) {

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    editedGateReview.approval.history.push({
        approvalState : editedGateReview.approval.currentRecord.approvalState,
        user : {
            _id: editedGateReview.approval.currentRecord.user._id,
            displayName: editedGateReview.approval.currentRecord.user.displayName
        },
        created : editedGateReview.approval.currentRecord.created
    });

    editedGateReview.approval.currentRecord.approvalState = 'rejected';
    editedGateReview.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedGateReview.approval.currentRecord.created = Date.now();

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedGateReview);
        }
    });

};

exports.draftGateReview = function(req, res) {

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    editedGateReview.approval.history.push({
        approvalState : editedGateReview.approval.currentRecord.approvalState,
        user : {
            _id: editedGateReview.approval.currentRecord.user._id,
            displayName: editedGateReview.approval.currentRecord.user.displayName
        },
        created : editedGateReview.approval.currentRecord.created
    });

    editedGateReview.approval.currentRecord.approvalState = 'draft';
    editedGateReview.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedGateReview.approval.currentRecord.created = Date.now();

    project.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedGateReview);
        }
    });

};

