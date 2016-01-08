'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');



exports.createAction = function(req, res) {

    var Counter = mongoose.mtModel(req.user.tenantId + '.' + 'Counter');
    var PortfolioIssue = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioIssue');

    var newAction = req.body;
    newAction.user = req.user;
    newAction.statusReview = {
        history : [],
        currentRecord : {
            user: req.user
        }
    };

    async.series([
        // Add the sequential number
        function(callback){
            Counter.findByIdAndUpdate({_id: 'escalationActionSequence_' + req.params.portfolioIssueId}, {$inc: { seq: 1} }, function(error, counter)   {
                if(error){
                    return callback(error);
                }
                // Must create the the document in 'counter' collection for our entity the first time we create an entity document
                if(!counter){
                    var newCounter = new Counter({
                        _id : 'escalationActionSequence_' + req.params.portfolioIssueId
                    });
                    newCounter.save(function(err){
                        if(err){
                            return callback( new Error('Failed to create sequence counter for escalation action'));
                        }
                        newAction.idNumber = 1;
                        callback(null);
                    });
                }
                if(counter) {
                    newAction.idNumber = counter.seq;
                    callback(null);
                }
            });
        },
        // Add the new action to the portfolioIssue.escalatedActions array
        function(callback){
            PortfolioIssue.findById(req.params.portfolioIssueId).exec(function(err, issue){
                if(err){
                    return callback(err);
                }
                if(!issue){
                    return callback(new Error('Failed to portfolio issue ' + req.params.portfolioIssueId));
                }
                newAction = issue.escalationActions.create(newAction);
                issue.escalationActions.push(newAction);
                issue.save(function(err){
                    callback(err);
                });
            });
        }
    ], function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(newAction);
        }
    });
};


exports.updateActionHeader = function(req, res) {

    var portfolioIssue = req.portfolioIssue;
    var action = portfolioIssue.escalationActions.id(req.params.escalationActionId);

    action.user = req.user;
    action.created = Date.now();

    action.raisedOnDate = req.body.raisedOnDate;
    action.escalatedTo = req.body.escalatedTo;
    action.title = req.body.title;
    action.description = req.body.description;
    action.priority = req.body.priority;
    action.state = req.body.state;

    portfolioIssue.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            console.log(portfolioIssue);
            res.jsonp(action);
        }
    });

};

exports.updateActionStatus = function(req, res) {

    var portfolioIssue = req.portfolioIssue;
    var action = portfolioIssue.escalationActions.id(req.params.escalationActionId);

    action.statusReview.history.push({
        baselineDeliveryDate : action.statusReview.currentRecord.baselineDeliveryDate,
        estimateDeliveryDate : action.statusReview.currentRecord.estimateDeliveryDate,
        actualDeliveryDate : action.statusReview.currentRecord.actualDeliveryDate,
        status : action.statusReview.currentRecord.status,
        completed : action.statusReview.currentRecord.completed,
        statusComment : action.statusReview.currentRecord.statusComment,
        user : action.statusReview.currentRecord.user,
        created : action.statusReview.currentRecord.created
    });
    action.statusReview.currentRecord.user = req.user;
    action.statusReview.currentRecord.created = Date.now();
    action.statusReview.currentRecord.baselineDeliveryDate = req.body.statusReview.currentRecord.baselineDeliveryDate;
    action.statusReview.currentRecord.estimateDeliveryDate = req.body.statusReview.currentRecord.estimateDeliveryDate;
    action.statusReview.currentRecord.actualDeliveryDate = req.body.statusReview.currentRecord.actualDeliveryDate;
    action.statusReview.currentRecord.status = req.body.statusReview.currentRecord.status;
    action.statusReview.currentRecord.completed = req.body.statusReview.currentRecord.completed;
    action.statusReview.currentRecord.statusComment = req.body.statusReview.currentRecord.statusComment;

    portfolioIssue.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioIssue);
        }
    });

};

exports.deleteAction = function(req, res) {

    var portfolioIssue = req.portfolioIssue;
    var removedAction = portfolioIssue.escalationActions.id(req.params.escalationActionId).remove();

    portfolioIssue.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(removedAction);
        }
    });

};

