'use strict';

/**
 * SEED - IMPROVEMENT SETUP
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

exports.seedImprovements = function(user, callback){

    // Reasons for improvement

    var reason1 = seedIDs.ImprovementReason.reason1;
    var reason2 = seedIDs.ImprovementReason.reason2;
    var reason3 = seedIDs.ImprovementReason.reason3;

    // Improvement States

    var state1 = seedIDs.ImprovementState.state1;
    var state2 = seedIDs.ImprovementState.state2;
    var state3 = seedIDs.ImprovementState.state3;
    var state4 = seedIDs.ImprovementState.state4;

    // Improvement Types

    var type1 = seedIDs.ImprovementType.type1;
    var type2 = seedIDs.ImprovementType.type2;
    var type3 = seedIDs.ImprovementType.type3;
    var type4 = seedIDs.ImprovementType.type4;

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'ImprovementReason');
            var seedArray =  [
                {
                    _id: reason1,
                    name: 'Low business value of projects',
                    description:'Low business value of projects',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: reason2,
                    name: 'Low team morale',
                    description:'Low team morale',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: reason3,
                    name: 'Idea to market shorter lead time',
                    description:'Idea to market shorter lead time',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'ImprovementReason', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'ImprovementState');
            var seedArray =  [
                {
                    _id: state1,
                    name: 'Not started',
                    description:'Not started',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: state2,
                    name: 'In progress',
                    description:'In progress',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: state3,
                    name: 'On-hold',
                    description:'On-hold',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: state4,
                    name: 'Closed',
                    description:'Closed',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'ImprovementState', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'ImprovementType');
            var seedArray =  [
                {
                    _id: type1,
                    name: 'Coaching',
                    description:'Coaching',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: type2,
                    name: 'New governance artifact',
                    description:'New governance artifact',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: type3,
                    name: 'Team building activity',
                    description:'Team building activity',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: type4,
                    name: 'Internal process improvement',
                    description:'Internal process improvement',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'ImprovementType', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            console.log(err);
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
