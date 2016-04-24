'use strict';

/**
 * SEED - LOAD PROJECT
 */

var _ = require('lodash'),
    errorHandler = require('../../../errors.server.controller.js'),
    mongoose = require('mongoose'),
    seedIDs = require('./../../seed-data.ids.server.controller.js').getIDs(),
    async = require('async'),
    User = mongoose.model('User');


exports.loadProject = function(user, callback){
    async.parallel([
        function(callback){
            return require('./seed-data.financial-costs.server.controller.js').seedFinancialCosts(user, callback);
        },
        function(callback){
            return require('./seed-data.financial-benefits.server.controller.js').seedFinancialBenefits(user, callback);
        },
        // --- Project's Gate Management data ----
        function(callback){
            return require('./seed-data.gate-reviews.server.controller.js').seedGateReviews(user, callback);
        },
        function(callback){
            return require('./seed-data.project-status-updates.server.controller.js').seedProjectStatusUpdates(user, callback);
        },
        function(callback){
            return require('./seed-data.gate-status-assignments.server.controller.js').seedGateStatusAssignments(user, callback);
        },
        function(callback){
            return require('./seed-data.gate-outcome-reviews.server.controller.js').seedGateOutcomeReviews(user, callback);
        },
        function(callback){
            return require('./seed-data.project-area-reviews.server.controller.js').seedProjectAreaReviews(user, callback);
        },
        function(callback){
            return require('./seed-data.baseline-durations.server.controller.js').seedBaselineDurations(user, callback);
        },
        function(callback){
            return require('./seed-data.baseline-costs.server.controller.js').seedBaselineCosts(user, callback);
        },
        function(callback){
            return require('./seed-data.baseline-completions.server.controller.js').seedBaselineCompletions(user, callback);
        },
        function(callback){
            return require('./seed-data.estimate-durations.server.controller.js').seedEstimateDurations(user, callback);
        },
        function(callback){
            return require('./seed-data.estimate-costs.server.controller.js').seedEstimateCosts(user, callback);
        },
        function(callback){
            return require('./seed-data.estimate-completions.server.controller.js').seedEstimateCompletions(user, callback);
        },
        function(callback){
            return require('./seed-data.actual-durations.server.controller.js').seedActualDurations(user, callback);
        },
        function(callback){
            return require('./seed-data.actual-costs.server.controller.js').seedActualCosts(user, callback);
        },
        function(callback){
            return require('./seed-data.actual-completions.server.controller.js').seedActualCompletions(user, callback);
        },
        // ----------------------
        function(callback){
            return require('./seed-data.project-identification.server.controller.js').seedProjects(user, callback);
        }
    ], function(err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null, results);
        }
    });
};
