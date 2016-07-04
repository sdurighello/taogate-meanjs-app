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
        gateStateReview: {
            gateState :{
                currentRecord:{
                    completed: editedGate.gateState.currentRecord.completed,
                    state : {
                        _id : editedGate.gateState.currentRecord.state._id,
                        name: editedGate.gateState.currentRecord.state.name
                    },
                    overallScore : {
                        _id : editedGate.gateState.currentRecord.overallScore._id,
                        name: editedGate.gateState.currentRecord.overallScore.name
                    }
                }
            },
            newCompleted: editedGate.gateState.currentRecord.completed,
            newState : {
                _id : editedGate.gateState.currentRecord.state._id,
                name : editedGate.gateState.currentRecord.state.name
            },
            newOverallScore : {
                _id : editedGate.gateState.currentRecord.overallScore._id,
                name : editedGate.gateState.currentRecord.overallScore.name
            }
        },

        budgetReview : {
            currentAmount: editedGate.budget.currentRecord.amount,
            newAmount: editedGate.budget.currentRecord.amount
        },
        outcomeScoreReviews : [],
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
        newGateReview.outcomeScoreReviews.push({
            outcome : {
                _id: outcome._id,
                name: outcome.name,
                score: {
                    currentRecord: {
                        score: {
                            _id : outcome.score.currentRecord.score._id,
                            name : outcome.score.currentRecord.score.name
                        },
                        comment :outcome.score.currentRecord.comment
                    }
                }
            },
            newScore:  {
                _id : outcome.score.currentRecord.score._id,
                name : outcome.score.currentRecord.score.name
            },
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

exports.updateGateStateReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

    editedGateReview.gateStateReview.newState = req.body.gateStateReview.newState;
    editedGateReview.gateStateReview.newOverallScore = req.body.gateStateReview.newOverallScore;
    editedGateReview.gateStateReview.newCompleted = req.body.gateStateReview.newCompleted;

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

exports.updateOutcomeScoreReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);
    var editedOutcomeScoreReview = editedGateReview.outcomeScoreReviews.id(req.params.outcomeScoreReviewId);

    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

    editedOutcomeScoreReview.newScore = req.body.newScore;
    editedOutcomeScoreReview.newComment = req.body.newComment;

    project.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedOutcomeScoreReview);
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

exports.updateBaselineDurationReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);
    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

    var performanceName = 'baselineDuration';

    var performanceReviewsArray = editedGateReview.performances.duration.baselineDurationReviews;

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

exports.updateEstimateDurationReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);
    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

    var performanceName = 'estimateDuration';

    var performanceReviewsArray = editedGateReview.performances.duration.estimateDurationReviews;

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

exports.updateActualDurationReview = function(req, res){

    var project = req.project ;

    var editedGate = _.find(project.process.gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);
    editedGateReview.user = req.user;
    editedGateReview.created = Date.now();

    var performanceName = 'actualDuration';

    var performanceReviewsArray = editedGateReview.performances.duration.actualDurationReviews;

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

var setSubmitMissingFields = function(gateReview){

    var missingFields = [];

    if(!gateReview.budgetReview.newAmount){
        missingFields.push('Budget amount');
    }

    _.each(gateReview.performances.duration.baselineDurationReviews, function(performanceReview){
        if(!performanceReview.newDate){
            missingFields.push('Baseline date for ' + performanceReview.baselineDuration.targetGate.name);
        }
    });
    _.each(gateReview.performances.duration.estimateDurationReviews, function(performanceReview){
        if(!performanceReview.newDate){
            missingFields.push('Estimate date for ' + performanceReview.estimateDuration.targetGate.name);
        }
    });
    _.each(gateReview.performances.duration.actualDurationReviews, function(performanceReview){
        if(!performanceReview.newDate && gateReview.gateStateReview.newCompleted){
            missingFields.push('Actual date for ' + performanceReview.baselineDuration.targetGate.name);
        }
    });

    _.each(gateReview.performances.cost.baselineCostReviews, function(performanceReview){
        if(!performanceReview.newCost){
            missingFields.push('Baseline cost for ' + performanceReview.baselineCost.targetGate.name);
        }
    });
    _.each(gateReview.performances.cost.estimateCostReviews, function(performanceReview){
        if(!performanceReview.newCost){
            missingFields.push('Estimate cost for ' + performanceReview.estimateCost.targetGate.name);
        }
    });
    _.each(gateReview.performances.cost.actualCostReviews, function(performanceReview){
        if(!performanceReview.newCost && gateReview.gateStateReview.newCompleted){
            missingFields.push('Actual cost for ' + performanceReview.baselineCost.targetGate.name);
        }
    });

    _.each(gateReview.performances.completion.baselineCompletionReviews, function(performanceReview){
        if(!performanceReview.newCompletion){
            missingFields.push('Baseline completion for ' + performanceReview.baselineCompletion.targetGate.name);
        }
    });
    _.each(gateReview.performances.completion.estimateCompletionReviews, function(performanceReview){
        if(!performanceReview.newCompletion){
            missingFields.push('Estimate completion for ' + performanceReview.estimateCompletion.targetGate.name);
        }
    });
    _.each(gateReview.performances.completion.actualCompletionReviews, function(performanceReview){
        if(!performanceReview.newCompletion && gateReview.gateStateReview.newCompleted){
            missingFields.push('Actual completion for ' + performanceReview.baselineCompletion.targetGate.name);
        }
    });

    return missingFields;
};

var checkDateConsistency = function(editedGateReview, editedGate, project){
    // Check that this gate baseline/estimate/actual are not earlier than previous gate or later than next gate

    var gates = project.process.gates;

    var dateConsistencyErrors = [];

    // Gate Review new dates

    var thisGate_BaselineDurationReview_NewDate = _.find(editedGateReview.performances.duration.baselineDurationReviews, function(performanceReview){
        return performanceReview.baselineDuration.targetGate._id.equals(editedGate._id);
    }).newDate;
    // thisGate_BaselineDurationReview_NewDate = thisGate_BaselineDurationReview_NewDate && new Date(thisGate_BaselineDurationReview_NewDate);

    var thisGate_EstimateDurationReview_NewDate = _.find(editedGateReview.performances.duration.estimateDurationReviews, function(performanceReview){
        return performanceReview.estimateDuration.targetGate._id.equals(editedGate._id);
    }).newDate;
    // thisGate_EstimateDurationReview_NewDate = thisGate_EstimateDurationReview_NewDate && new Date(thisGate_EstimateDurationReview_NewDate);

    var thisGate_ActualDurationReview_NewDate = _.find(editedGateReview.performances.duration.actualDurationReviews, function(performanceReview){
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

            var previousGate_EstimateDuration_CurrentDate = _.find(gate.performances.duration.estimateDurations, function(performance){
                return performance.targetGate._id.equals(gate._id);
            }).currentRecord.gateDate;
            // previousGate_EstimateDuration_CurrentDate = previousGate_EstimateDuration_CurrentDate && new Date(previousGate_EstimateDuration_CurrentDate);

            var previousGate_ActualDuration_CurrentDate = _.find(gate.performances.duration.actualDurations, function(performance){
                return performance.targetGate._id.equals(gate._id);
            }).currentRecord.gateDate;
            // previousGate_ActualDuration_CurrentDate = previousGate_ActualDuration_CurrentDate && new Date(previousGate_ActualDuration_CurrentDate);

            if(previousGate_BaselineDuration_CurrentDate && thisGate_BaselineDurationReview_NewDate && (previousGate_BaselineDuration_CurrentDate > thisGate_BaselineDurationReview_NewDate)){
                dateConsistencyErrors.push(editedGate.name + ' Baseline date ' + thisGate_BaselineDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_BaselineDuration_CurrentDate.toDateString());
            }

            if(previousGate_EstimateDuration_CurrentDate && thisGate_EstimateDurationReview_NewDate && (previousGate_EstimateDuration_CurrentDate > thisGate_EstimateDurationReview_NewDate)){
                dateConsistencyErrors.push(editedGate.name + ' Estimate date ' + thisGate_EstimateDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_EstimateDuration_CurrentDate.toDateString());
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

            var nextGate_EstimateDuration_CurrentDate = _.find(gate.performances.duration.estimateDurations, function(performance){
                return performance.targetGate._id.equals(gate._id);
            }).currentRecord.gateDate;
            // nextGate_EstimateDuration_CurrentDate = nextGate_EstimateDuration_CurrentDate && new Date(nextGate_EstimateDuration_CurrentDate);

            var nextGate_ActualDuration_CurrentDate = _.find(gate.performances.duration.actualDurations, function(performance){
                return performance.targetGate._id.equals(gate._id);
            }).currentRecord.gateDate;
            // nextGate_ActualDuration_CurrentDate = nextGate_ActualDuration_CurrentDate && new Date(nextGate_ActualDuration_CurrentDate);

            if(nextGate_BaselineDuration_CurrentDate && thisGate_BaselineDurationReview_NewDate && (nextGate_BaselineDuration_CurrentDate < thisGate_BaselineDurationReview_NewDate)){
                dateConsistencyErrors.push(editedGate.name + ' Baseline date ' + thisGate_BaselineDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_BaselineDuration_CurrentDate.toDateString());
            }

            if(nextGate_EstimateDuration_CurrentDate && thisGate_EstimateDurationReview_NewDate && (nextGate_EstimateDuration_CurrentDate < thisGate_EstimateDurationReview_NewDate)){
                dateConsistencyErrors.push(editedGate.name + ' Estimate date ' + thisGate_EstimateDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_EstimateDuration_CurrentDate.toDateString());
            }

            if(nextGate_ActualDuration_CurrentDate && thisGate_ActualDurationReview_NewDate && (nextGate_ActualDuration_CurrentDate < thisGate_ActualDurationReview_NewDate)){
                dateConsistencyErrors.push(editedGate.name + ' Actual date ' + thisGate_ActualDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_ActualDuration_CurrentDate.toDateString());
            }
        }

    });

    return dateConsistencyErrors;
};

// -----

exports.submitGateReview = function(req, res) {

    var project = req.project ;

    var gates = project.process.gates;

    var editedGate = _.find(gates, function(gate){
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

    // Checks

    var missingFields = setSubmitMissingFields(editedGateReview);
    var dateConsistencyErrors = checkDateConsistency(editedGateReview, editedGate, project);
    
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
            res.jsonp(editedGateReview);
        }
    });

};

exports.approveGateReview = function(req, res) {

    var project = req.project ;

    var gates = project.process.gates;

    var editedGate = _.find(gates, function(gate){
        return gate._id.equals(req.params.projectGateId);
    });

    var editedGateReview = editedGate.gateReviews.id(req.params.gateReviewId);

    // Checks

    var missingFields = setSubmitMissingFields(editedGateReview);
    var dateConsistencyErrors = checkDateConsistency(editedGateReview, editedGate, project);

    if((missingFields.length > 0) || (dateConsistencyErrors.length > 0)){
        console.log(missingFields);
        console.log(dateConsistencyErrors);
        return res.status(400).send({
            message: 'Missing fields: ' + missingFields.join(', * ') +' ---- '+ ' Date consistency check: ' + dateConsistencyErrors.join(', - ')
        });
    }

    // Update editedGateReview with req.body information

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

    // Apply changes to OUTCOMES

    _.each(editedGateReview.outcomeScoreReviews, function(outcomeScoreReview){
        var editedOutcome = editedGate.outcomes.id(outcomeScoreReview.outcome._id);
        editedOutcome.score.history.push({
            sourceGateReview : editedOutcome.score.currentRecord.sourceGateReview,
            score: editedOutcome.score.currentRecord.score,
            comment: editedOutcome.score.currentRecord.comment,
            created: editedOutcome.score.currentRecord.created,
            user: editedOutcome.score.currentRecord.user
        });
        editedOutcome.score.currentRecord.sourceGateReview = editedGateReview._id;
        editedOutcome.score.currentRecord.score = outcomeScoreReview.newScore;
        editedOutcome.score.currentRecord.comment = outcomeScoreReview.newComment;
        editedOutcome.score.currentRecord.created = Date.now();
        editedOutcome.score.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });

    // Apply changes to GATE STATE

    editedGate.gateState.history.push({
        sourceGateReview : editedGate.gateState.currentRecord.sourceGateReview,
        completed : editedGate.gateState.currentRecord.completed,
        currentGate : editedGate.gateState.currentRecord.currentGate,
        state: editedGate.gateState.currentRecord.state,
        overallScore : editedGate.gateState.currentRecord.overallScore,
        created: editedGate.gateState.currentRecord.created,
        user: editedGate.gateState.currentRecord.user
    });
    editedGate.gateState.currentRecord.sourceGateReview = editedGateReview._id;
    editedGate.gateState.currentRecord.completed = editedGateReview.gateStateReview.newCompleted;
    //editedGate.gateState.currentRecord.currentGate = ... ;
    editedGate.gateState.currentRecord.state = editedGateReview.gateStateReview.newState;
    editedGate.gateState.currentRecord.overallScore = editedGateReview.gateStateReview.newOverallScore;
    editedGate.gateState.currentRecord.created = Date.now();
    editedGate.gateState.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};

    // Set the CURRENT GATE flag

    // Reset the current gate flag for all the others
    _.each(gates, function(gate){
        gate.gateState.currentRecord.currentGate = false;
    });
    // Get all the completed gates. No one may be completed.
    var completedGates = _.filter(gates, function(gate){
        return gate.gateState.currentRecord.completed;
    });
    // If none is completed, set the START as current
    if(_.isEmpty(completedGates)){
        gates.id(project.process.startGate).gateState.currentRecord.currentGate = true;
    } else {
        // Else required because _.max is funny with null array
        // Get the max position among the completed
        var lastCompletedGate = _.max(completedGates, function(gate){
            return gate.position;
        });
        // If the last completed is END, set it as current
        if(lastCompletedGate._id.equals(project.process.endGate)){
            gates.id(project.process.endGate).gateState.currentRecord.currentGate = true;
        } else {
            // Otherwise, the next one in position will be set as completed.
            _.find(gates, function(gate){
                return gate.position === (lastCompletedGate.position + 1);
            }).gateState.currentRecord.currentGate = true;
        }

    }

    // Apply changes to BUDGET

    editedGate.budget.history.push({
        sourceGateReview : editedGate.budget.currentRecord.sourceGateReview,
        sourceChangeRequest : editedGate.budget.currentRecord.sourceChangeRequest,
        amount : editedGate.budget.currentRecord.amount,
        created: editedGate.budget.currentRecord.created,
        user: editedGate.budget.currentRecord.user
    });
    editedGate.budget.currentRecord.sourceGateReview = editedGateReview._id;
    editedGate.budget.currentRecord.sourceChangeRequest = null;
    editedGate.budget.currentRecord.amount = editedGateReview.budgetReview.newAmount;
    editedGate.budget.currentRecord.created = Date.now();
    editedGate.budget.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};

    // Apply changes to DURATION

    _.each(editedGateReview.performances.duration.baselineDurationReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.duration.baselineDurations.id(performanceReview.baselineDuration._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceChangeRequest : editedPerformance.currentRecord.sourceChangeRequest,
            gateDate: editedPerformance.currentRecord.gateDate,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = editedGateReview._id;
        editedPerformance.currentRecord.sourceChangeRequest = null;
        editedPerformance.currentRecord.gateDate = performanceReview.newDate;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });
    _.each(editedGateReview.performances.duration.estimateDurationReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.duration.estimateDurations.id(performanceReview.estimateDuration._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceStatusUpdate : editedPerformance.currentRecord.sourceStatusUpdate,
            gateDate: editedPerformance.currentRecord.gateDate,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = editedGateReview._id;
        editedPerformance.currentRecord.sourceStatusUpdate = null;
        editedPerformance.currentRecord.gateDate = performanceReview.newDate;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });
    _.each(editedGateReview.performances.duration.actualDurationReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.duration.actualDurations.id(performanceReview.actualDuration._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceChangeRequest : editedPerformance.currentRecord.sourceChangeRequest,
            gateDate: editedPerformance.currentRecord.gateDate,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = editedGateReview._id;
        editedPerformance.currentRecord.sourceChangeRequest = null;
        editedPerformance.currentRecord.gateDate = performanceReview.newDate;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });

    // Apply changes to COST

    _.each(editedGateReview.performances.cost.baselineCostReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.cost.baselineCosts.id(performanceReview.baselineCost._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceChangeRequest : editedPerformance.currentRecord.sourceChangeRequest,
            cost: editedPerformance.currentRecord.cost,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = editedGateReview._id;
        editedPerformance.currentRecord.sourceChangeRequest = null;
        editedPerformance.currentRecord.cost = performanceReview.newCost;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });
    _.each(editedGateReview.performances.cost.estimateCostReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.cost.estimateCosts.id(performanceReview.estimateCost._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceStatusUpdate : editedPerformance.currentRecord.sourceStatusUpdate,
            cost: editedPerformance.currentRecord.cost,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = editedGateReview._id;
        editedPerformance.currentRecord.sourceStatusUpdate = null;
        editedPerformance.currentRecord.cost = performanceReview.newCost;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });
    _.each(editedGateReview.performances.cost.actualCostReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.cost.actualCosts.id(performanceReview.actualCost._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceChangeRequest : editedPerformance.currentRecord.sourceChangeRequest,
            cost: editedPerformance.currentRecord.cost,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = editedGateReview._id;
        editedPerformance.currentRecord.sourceChangeRequest = null;
        editedPerformance.currentRecord.cost = performanceReview.newCost;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });

    // Apply changes to COMPLETION

    _.each(editedGateReview.performances.completion.baselineCompletionReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.completion.baselineCompletions.id(performanceReview.baselineCompletion._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceChangeRequest : editedPerformance.currentRecord.sourceChangeRequest,
            completion: editedPerformance.currentRecord.completion,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = editedGateReview._id;
        editedPerformance.currentRecord.sourceChangeRequest = null;
        editedPerformance.currentRecord.completion = performanceReview.newCompletion;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });
    _.each(editedGateReview.performances.completion.estimateCompletionReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.completion.estimateCompletions.id(performanceReview.estimateCompletion._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceStatusUpdate : editedPerformance.currentRecord.sourceStatusUpdate,
            completion: editedPerformance.currentRecord.completion,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = editedGateReview._id;
        editedPerformance.currentRecord.sourceStatusUpdate = null;
        editedPerformance.currentRecord.completion = performanceReview.newCompletion;
        editedPerformance.currentRecord.created = Date.now();
        editedPerformance.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });
    _.each(editedGateReview.performances.completion.actualCompletionReviews, function(performanceReview){
        var editedPerformance = editedGate.performances.completion.actualCompletions.id(performanceReview.actualCompletion._id);
        editedPerformance.history.push({
            sourceGateReview : editedPerformance.currentRecord.sourceGateReview,
            sourceChangeRequest : editedPerformance.currentRecord.sourceChangeRequest,
            completion: editedPerformance.currentRecord.completion,
            created: editedPerformance.currentRecord.created,
            user: editedPerformance.currentRecord.user
        });
        editedPerformance.currentRecord.sourceGateReview = editedGateReview._id;
        editedPerformance.currentRecord.sourceChangeRequest = null;
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
    
    // No missing fields check

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

    // No missing fields check

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

