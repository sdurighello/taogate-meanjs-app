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
            return require('./setup/seed-data.counter.server.controller.js').seedCounters(user, callback);
        },
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
            return require('./projects/project1/seed-data.load-project.server.controller.js').loadProject(user, callback);
        }
        // function(callback){
        //     return require('./projects/project2/seed-data.load-project.server.controller.js').loadProject(user, callback);
        // }
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

exports.seedAtSignup = function(user, callback) {
    async.series([
        // 1) Create all seed setup data straight into the database
        function(callback){
            return loadSetupData(user, callback);
        },
        // 2) Create portfolio and strategy structure
        function(callback){
            return loadTrees(user, callback);
        }
        // 3) Create projects
        // function(callback){
        //     return loadProjects(req.user, callback);
        // }
    ], function(err, results){
        if (err) {
            callback(err);
        } else {
            callback(null, results);
        }
    });

};

// Seed from myTao button just for test after the user was created (and so here it can be called with req, res)
exports.seed = function(req, res) {
    async.series([
        // 1) Create all seed setup data straight into the database
        function(callback){
            return loadSetupData(req.user, callback);
        },
        // 2) Create portfolio and strategy structure
        function(callback){
            return loadTrees(req.user, callback);
        }
        // 3) Create projects
        // function(callback){
        //     return loadProjects(req.user, callback);
        // }
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
