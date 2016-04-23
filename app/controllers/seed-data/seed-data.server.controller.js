'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    errorHandler = require('./../errors.server.controller.js'),
    async = require('async'),
    _ = require('lodash'),
    seedIDsController = require('./seed-data.ids.server.controller.js');

// -------------------------


var loadSetupData = function(user, callback){
    async.parallel([
        function(callback){
            return require('./setup/seed-data.category-setup.server.controller.js').seedCategories(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.priority-setup.server.controller.js').seedPriorities(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.financial-setup.server.controller.js').seedFinancials(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.risk-setup.server.controller.js').seedRisks(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.qualitative-setup.server.controller.js').seedQualitativeImpacts(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.dependency-setup.server.controller.js').seedDependencies(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.stakeholders-setup.server.controller.js').seedStakeholders(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.portfolio-people.server.controller.js').seedPortfolioPeople(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.project-people.server.controller.js').seedProjectPeople(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.review-setup.server.controller.js').seedReviewScores(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.project-review.server.controller.js').seedProjectReviews(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.portfolio-review.server.controller.js').seedPortfolioReviews(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.maturity-setup.server.controller.js').seedMaturityModels(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.improvement-setup.server.controller.js').seedImprovements(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.log-setup.server.controller.js').seedLogs(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.milestone-setup.server.controller.js').seedMilestones(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.status-setup.server.controller.js').seedStatuses(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.process-setup.server.controller.js').seedProcesses(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.portfolio-setup.server.controller.js').seedPortfolioSetup(user, callback);
        },
        function(callback){
            return require('./setup/seed-data.strategy-setup.server.controller.js').seedStrategySetup(user, callback);
        }
    ], function(err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null, results);
        }
    });
};

var loadTrees = function (user, callback) {
    async.parallel([
        function(callback){
            return require('./trees/seed-data.strategy-tree.server.controller.js').seedStrategyTree(user, callback);
        },
        function(callback){
            return require('./trees/seed-data.portfolio-tree.server.controller.js').seedPortfolioTree(user, callback);
        }
    ], function(err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null, results);
        }
    });
};

var loadProjects = function (user, callback) {
    async.parallel([
        function(callback){
            return require('./projects/seed-data.financial-costs.server.controller.js').seedFinancialCosts(user, callback);
        },
        function(callback){
            return require('./projects/seed-data.financial-benefits.server.controller.js').seedFinancialBenefits(user, callback);
        },
        // --- Project's Gate Management data ----
        function(callback){
            return require('./projects/seed-data.gate-reviews.server.controller.js').seedGateReviews(user, callback);
        },
        function(callback){
            return require('./projects/seed-data.project-status-updates.server.controller.js').seedProjectStatusUpdates(user, callback);
        },
        function(callback){
            return require('./projects/seed-data.gate-status-assignments.server.controller.js').seedGateStatusAssignments(user, callback);
        },
        function(callback){
            return require('./projects/seed-data.gate-outcome-reviews.server.controller.js').seedGateOutcomeReviews(user, callback);
        },
        function(callback){
            return require('./projects/seed-data.project-area-reviews.server.controller.js').seedProjectAreaReviews(user, callback);
        },
        function(callback){
            return require('./projects/seed-data.baseline-durations.server.controller.js').seedBaselineDurations(user, callback);
        },
        function(callback){
            return require('./projects/seed-data.baseline-costs.server.controller.js').seedBaselineCosts(user, callback);
        },
        function(callback){
            return require('./projects/seed-data.baseline-completions.server.controller.js').seedBaselineCompletions(user, callback);
        },
        function(callback){
            return require('./projects/seed-data.estimate-durations.server.controller.js').seedEstimateDurations(user, callback);
        },
        function(callback){
            return require('./projects/seed-data.estimate-costs.server.controller.js').seedEstimateCosts(user, callback);
        },
        function(callback){
            return require('./projects/seed-data.estimate-completions.server.controller.js').seedEstimateCompletions(user, callback);
        },
        function(callback){
            return require('./projects/seed-data.actual-durations.server.controller.js').seedActualDurations(user, callback);
        },
        function(callback){
            return require('./projects/seed-data.actual-costs.server.controller.js').seedActualCosts(user, callback);
        },
        function(callback){
            return require('./projects/seed-data.actual-completions.server.controller.js').seedActualCompletions(user, callback);
        },
        // ----------------------
        function(callback){
            return require('./projects/seed-data.project-identification.server.controller.js').seedProjects(user, callback);
        }
    ], function(err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null, results);
        }
    });
};

exports.loadSetupData = loadSetupData;

exports.loadTrees = loadTrees;

exports.loadProjects = loadProjects;

exports.seed = function(req, res) {
    async.series([
        // 1) Create all seed setup data straight into the database
        function(callback){
            return loadSetupData(req.user, callback);
        },
        // 2) Create portfolio and strategy structure
        function(callback){
            return loadTrees(req.user, callback);
        },
        // 3) Create projects
        function(callback){
            return loadProjects(req.user, callback);
        }
    ], function(err, results){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(results);
        }
    });

};
