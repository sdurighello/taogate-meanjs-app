'use strict';

/**
 * SEED - PRIORITY SETUP
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

exports.seedPriorities = function(user, callback){

    // ------ Priority values ------

    var prioValue1 = seedIDs.PriorityValue.prioValue1;
    var prioValue2 = seedIDs.PriorityValue.prioValue2;
    var prioValue3 = seedIDs.PriorityValue.prioValue3;

    // ------ Project stakeholders ------

    var prio1 = seedIDs.PriorityGroup.prio1;

    var prio11 = seedIDs.Priority.prio11; // Supplier
    var prio12 = seedIDs.Priority.prio12; // User
    var prio13 = seedIDs.Priority.prio13; // Sponsor

    // ------ Executive management ------

    var prio2 = seedIDs.PriorityGroup.prio2;

    var prio21 = seedIDs.Priority.prio21; // Executive board
    var prio22 = seedIDs.Priority.prio22; // Investment management committee

    // ------ Technology leadership ------

    var prio3 = seedIDs.PriorityGroup.prio3;

    var prio31 = seedIDs.Priority.prio31; // Project Management Office
    var prio32 = seedIDs.Priority.prio32; // Enterprise Architecture Board

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PriorityGroup');
            var seedArray = [
                {
                    _id: prio1,
                    name: 'Project stakeholders',
                    description:'Project stakeholders prioritization',
                    priorities: [prio11, prio12, prio13],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: prio2,
                    name: 'Executive management',
                    description:'Executive management prioritization',
                    priorities: [prio21, prio22],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: prio3,
                    name: 'Technology leadership',
                    description:'Technology leadership prioritization',
                    priorities: [prio31, prio32],
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PriorityGroup', seedArray, callback);
        },
        function(callback){
            var schema = mongoose.mtModel(user.tenantId + '.' + 'Priority');
            var seedArray = [
                {
                    _id: prio11,
                    name: 'Supplier',
                    description:'Supplier prioritization',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: prio12,
                    name: 'User',
                    description:'User prioritization',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: prio13,
                    name: 'Sponsor',
                    description:'Sponsor prioritization',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: prio21,
                    name: 'Executive board',
                    description:'Executive board prioritization',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: prio22,
                    name: 'Investment management committee',
                    description:'Investment management committee prioritization',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: prio31,
                    name: 'Project Management Office',
                    description:'Project Management Office prioritization',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: prio32,
                    name: 'Enterprise Architecture Board',
                    description:'Enterprise Architecture Board prioritization',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'Priority', seedArray, callback);
        },
        function(callback){
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PriorityValue');
            var seedArray = [
                {
                    _id: prioValue1,
                    name: 'High',
                    description:'High priority',
                    numericalValue: 30,
                    position: 1,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: prioValue2,
                    name: 'Medium',
                    description:'Medium priority',
                    numericalValue: 20,
                    position: 2,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: prioValue3,
                    name: 'Low',
                    description:'Low priority',
                    numericalValue: 10,
                    position: 3,
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PriorityValue', seedArray, callback);
        }        
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
