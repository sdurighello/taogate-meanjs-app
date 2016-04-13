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
    async.parallel([
        
        // --- Category setup ---
        
        function(callback){
            var CategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryValue');
            var seedArray = require('./seed-data/seed-data.category-setup.server.controller.js').getCategoryValues(req);
            async.each(seedArray, function(item, callbackEach) {
                CategoryValue.create(item, function(err){
                    callbackEach(err);
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, {message: 'Seed category values created'});
                }
            });
        },
        function(callback){
            var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
            var seedArray = require('./seed-data/seed-data.category-setup.server.controller.js').getCategories(req);
            async.each(seedArray, function(item, callbackEach) {
                Category.create(item, function(err){
                    callbackEach(err);
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, {message: 'Seed categories created'});
                }
            });
        },
        function(callback){
            var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
            var seedArray = require('./seed-data/seed-data.category-setup.server.controller.js').getCategoryGroups(req);
            async.each(seedArray, function(item, callbackEach) {
                CategoryGroup.create(item, function(err){
                    callbackEach(err);
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, {message: 'Seed category groups created'});
                }
            });
        },

        // --- Priority setup ---
        
        function(callback){
            var PriorityValue = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityValue');
            var seedArray = require('./seed-data/seed-data.priority-setup.server.controller.js').getPriorityValues(req);
            async.each(seedArray, function(item, callbackEach) {
                PriorityValue.create(item, function(err){
                    callbackEach(err);
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, {message: 'Seed priority values created'});
                }
            });
        },
        function(callback){
            var Priority = mongoose.mtModel(req.user.tenantId + '.' + 'Priority');
            var seedArray = require('./seed-data/seed-data.priority-setup.server.controller.js').getPriorities(req);
            async.each(seedArray, function(item, callbackEach) {
                Priority.create(item, function(err){
                    callbackEach(err);
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, {message: 'Seed priorities created'});
                }
            });
        },
        function(callback){
            var PriorityGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityGroup');
            var seedArray = require('./seed-data/seed-data.priority-setup.server.controller.js').getPriorityGroups(req);
            async.each(seedArray, function(item, callbackEach) {
                PriorityGroup.create(item, function(err){
                    callbackEach(err);
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, {message: 'Seed priority groups created'});
                }
            });
        },



    ], function(err, results) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(results);
        }
    });

};
