'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');



exports.availableProjectIssues = function(req, res) {

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var ProjectIssue = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectIssue');

    // for each project extract the issues
    // if the issue isn't already associated to the portfolio issue, than put it in the "available" array
    async.waterfall([
        // Find all projects belonging to that portfolio
        function(callback){
            var projectIds = [];
            Project.find({portfolio: req.params.portfolioId}).exec(function(err, projects){
                if(err){ return callback(err); }
                async.each(projects, function(project, callback){
                    projectIds.push(project._id);
                    callback();
                });
                callback(null, projectIds);
            });
        },
        // For all projects, extract all the issues that: are "not completed", and aren't already associated
        function(projectIds, callback){
            ProjectIssue.find({
                _id: {$nin: req.portfolioIssue.associatedProjectIssues},
                project: {$in: projectIds},
                'statusReview.currentRecord.completed': false
            }).exec(function(err, availableProjectIssues){
                if(err){
                    return callback(err);
                }
                callback(null, availableProjectIssues);
            });
        }
    ], function(err, availableProjectIssues){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(availableProjectIssues);
        }
    });


};


exports.addProjectIssue = function(req, res) {
    var portfolioIssue = req.portfolioIssue;
    portfolioIssue.associatedProjectIssues.push(req.params.projectIssueId);
    portfolioIssue.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioIssue);
        }
    });

};

exports.removeProjectIssue = function(req, res) {
    var portfolioIssue = req.portfolioIssue;
    portfolioIssue.associatedProjectIssues.splice(portfolioIssue.associatedProjectIssues.indexOf(req.params.projectIssueId), 1);
    portfolioIssue.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioIssue);
        }
    });

};

