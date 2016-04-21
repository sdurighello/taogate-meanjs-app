'use strict';

/**
 * SEED - STRATEGY SETUP
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    seedIDs = require('./seed-data.ids.server.controller').getIDs(),
    User = mongoose.model('User');

var createObjects = function(schema, stringMsg, seedArray, callback){
    async.each(seedArray, function(item, callbackEach) {
        schema.findById(item._id).exec(function(err, itemReturned){
            if(!itemReturned){
                schema.create(item, function(err){
                    callbackEach(err);
                });
            } else {
                callbackEach();
            }
        });
    }, function(err){
        if( err ) {
            callback(err);
        } else {
            callback(null, stringMsg);
        }
    });
};

exports.seedStrategySetup = function(user, callback){
    
    // Node types
    var nt1 = seedIDs.StrategyNodeType.nt1;
    var nt2 = seedIDs.StrategyNodeType.nt2;
    var nt3 = seedIDs.StrategyNodeType.nt3;

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'StrategyNodeType');
            var seedArray =  [
                {
                    _id: nt1,
                    name: 'Strategic theme',
                    description:'Strategic theme',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: nt2,
                    name: 'Business capability',
                    description:'Business capability',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: nt3,
                    name: 'Tactic',
                    description:'Tactic',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'StrategyNodeType', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
