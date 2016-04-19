'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

// -------------------------


exports.seed = function(req, res) {
// Seeding strategy: 
// 1) first create all setup data directly in the database, 
// 2) then crate projects, portfolios and similar by calling the 'route' so the create routines are also run
    async.series([
        // 1) Create all seed setup data straight into the database
        function(callback){
            async.parallel([
                function(callback){
                    return require('./seed-data/seed-data.portfolio-setup.server.controller.js').seedPortfolioTypes(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.strategy-setup.server.controller.js').seedStrategyNodes(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.category-setup.server.controller.js').seedCategories(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.priority-setup.server.controller.js').seedPriorities(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.financial-setup.server.controller.js').seedFinancials(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.risk-setup.server.controller.js').seedRisks(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.qualitative-setup.server.controller.js').seedQualitativeImpacts(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.dependency-setup.server.controller.js').seedDependencies(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.stakeholders-setup.server.controller.js').seedStakeholders(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.portfolio-people.server.controller.js').seedPortfolioPeople(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.project-people.server.controller.js').seedProjectPeople(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.review-setup.server.controller.js').seedReviewScores(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.project-review.server.controller.js').seedProjectReviews(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.portfolio-review.server.controller.js').seedPortfolioReviews(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.maturity-setup.server.controller.js').seedMaturityModels(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.improvement-setup.server.controller.js').seedImprovements(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.log-setup.server.controller.js').seedLogs(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.milestone-setup.server.controller.js').seedMilestones(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.status-setup.server.controller.js').seedStatuses(req, callback);
                },
                function(callback){
                    return require('./seed-data/seed-data.process-setup.server.controller.js').seedProcesses(req, callback);
                }
            ], function(err, results) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, results);
                }
            });
        },
        // 2) Create projects, portfolio and similar by calling the 'route'
        function(callback){

            callback(null, {message: 'function two'});
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
