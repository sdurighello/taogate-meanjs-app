'use strict';

/**
 * SEED - LOG SETUP
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

exports.seedLogs = function(user, callback){

    // ------ Log priorities ------

    var logPriority1 = seedIDs.LogPriority.logPriority1;
    var logPriority2 = seedIDs.LogPriority.logPriority2;
    var logPriority3 = seedIDs.LogPriority.logPriority3;

    // ------ Log reasons ------

    var logReason1 = seedIDs.LogReason.logReason1;
    var logReason2 = seedIDs.LogReason.logReason2;
    var logReason3 = seedIDs.LogReason.logReason3;

    // ------ Issue states ------

    var issueState1 = seedIDs.IssueState.issueState1;
    var issueState2 = seedIDs.IssueState.issueState2;
    var issueState3 = seedIDs.IssueState.issueState3;
    var issueState4 = seedIDs.IssueState.issueState4;
    var issueState5 = seedIDs.IssueState.issueState5;

    // ------ Issue action states ------

    var actionState1 = seedIDs.IssueActionState.actionState1;
    var actionState2 = seedIDs.IssueActionState.actionState2;
    var actionState3 = seedIDs.IssueActionState.actionState3;
    var actionState4 = seedIDs.IssueActionState.actionState4;

    // ------ Change Request states ------

    var changeState1 = seedIDs.ChangeRequestState.changeState1;
    var changeState2 = seedIDs.ChangeRequestState.changeState2;
    var changeState3 = seedIDs.ChangeRequestState.changeState3;
    var changeState4 = seedIDs.ChangeRequestState.changeState4;
    var changeState5 = seedIDs.ChangeRequestState.changeState5;
    var changeState6 = seedIDs.ChangeRequestState.changeState6;

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'LogPriority');
            var seedArray =  [
                {
                    _id: logPriority1,
                    name: 'High',
                    description:'High priority',
                    numericalValue: 100,
                    position: 1,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: logPriority2,
                    name: 'Medium',
                    description:'Medium priority',
                    numericalValue: 70,
                    position: 2,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: logPriority3,
                    name: 'Low',
                    description:'Low priority',
                    numericalValue: 30,
                    position: 3,
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'LogPriority', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'LogReason');
            var seedArray =  [
                {
                    _id: logReason1,
                    name: 'Poor estimation',
                    description:'Change is required due to poor previous estimation',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: logReason2,
                    name: 'Resource bottleneck',
                    description:'Change is required due to lack of staff or skills',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: logReason3,
                    name: 'Scope change',
                    description:'Change is required due to scope change',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'LogReason', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'IssueState');
            var seedArray =  [
                {
                    _id: issueState1,
                    name: 'To be analyzed',
                    description:'Issues has been recorded and awaiting analysis',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: issueState2,
                    name: 'No resolution available',
                    description:'There is no resolution for the issue',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: issueState3,
                    name: 'Resolution under implementation',
                    description:'Resolution is currently being implemented',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: issueState4,
                    name: 'Resolution on hold',
                    description:'Resolution implementation has been put on-hold',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: issueState5,
                    name: 'Resolved',
                    description:'Resolution has been successfully implemented, tested and deployed',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'IssueState', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'IssueActionState');
            var seedArray =  [
                {
                    _id: actionState1,
                    name: 'Requested',
                    description:'Action has been requested',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: actionState2,
                    name: 'In progress',
                    description:'Owner has been informed and has accepted the escalation',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: actionState3,
                    name: 'On-hold',
                    description:'Escalation on hold',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: actionState4,
                    name: 'Closed',
                    description:'Escalation action closed',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'IssueActionState', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'ChangeRequestState');
            var seedArray =  [
                {
                    _id: changeState1,
                    name: 'Submitted',
                    description:'Change has been submitted',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: changeState2,
                    name: 'Approved',
                    description:'Change has been approved',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: changeState3,
                    name: 'Rejected',
                    description:'Change is currently being implemented',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: changeState4,
                    name: 'In progress',
                    description:'Change is currently being implemented',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: changeState5,
                    name: 'On-hold',
                    description:'Change implementation has been put on-hold',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: changeState6,
                    name: 'Closed',
                    description:'Change has been successfully implemented, tested and deployed or otherwise deemed closed',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'ChangeRequestState', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
