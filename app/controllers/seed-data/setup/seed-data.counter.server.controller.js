'use strict';

/**
 * SEED - COUNTERS
 */
var _ = require('lodash'),
    errorHandler = require('../../errors.server.controller.js'),
    mongoose = require('mongoose'),
    async = require('async'),
    seedIDs = require('./../seed-data.ids.server.controller.js').getIDs(),
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

exports.seedCounters = function(user, callback){
    
    var projectSequence = seedIDs.Counter.projectSequence;

    var schema = mongoose.mtModel(user.tenantId + '.' + 'Counter');
    
    var seedArray =  [
        {
            _id: projectSequence,
            seq: 2
        }
    ];
    
    createObjects(schema, 'Counter', seedArray, callback);
    
};
