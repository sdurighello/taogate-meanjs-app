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

exports.updateGateReview = function(req, res){

};

exports.deleteGateReview = function(req, res){

};
