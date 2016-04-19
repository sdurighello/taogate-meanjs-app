'use strict';

/**
 * SEED - LOG SETUP
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');


var createObjects = function(schema, stringMsg, seedArray, callback){
    async.each(seedArray, function(item, callbackEach) {
        schema.findById(item._id).exec(function(err, itemReturned){
            if(!itemReturned){
                schema.create(item, function(err){
                    callbackEach(err);
                });
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

exports.seedLogs = function(req, callback){

    // ------ Log priorities ------

    var priority1 = mongoose.Types.ObjectId(); // Low
    var priority2 = mongoose.Types.ObjectId(); // medium
    var priority3 = mongoose.Types.ObjectId(); // high

    // ------ Log reasons ------

    var reason1 = mongoose.Types.ObjectId();
    var reason2 = mongoose.Types.ObjectId();
    var reason3 = mongoose.Types.ObjectId();

    // ------ Issue states ------

    var issueState1 = mongoose.Types.ObjectId();
    var issueState2 = mongoose.Types.ObjectId();
    var issueState3 = mongoose.Types.ObjectId();
    var issueState4 = mongoose.Types.ObjectId();
    var issueState5 = mongoose.Types.ObjectId();

    // ------ Issue action states ------

    var actionState1 = mongoose.Types.ObjectId();
    var actionState2 = mongoose.Types.ObjectId();
    var actionState3 = mongoose.Types.ObjectId();
    var actionState4 = mongoose.Types.ObjectId();

    // ------ Change Request states ------

    var changeState1 = mongoose.Types.ObjectId();
    var changeState2 = mongoose.Types.ObjectId();
    var changeState3 = mongoose.Types.ObjectId();
    var changeState4 = mongoose.Types.ObjectId();
    var changeState5 = mongoose.Types.ObjectId();
    var changeState6 = mongoose.Types.ObjectId();

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'LogPriority');
            var seedArray =  [
                {
                    _id: priority1,
                    name: 'High',
                    description:'High priority',
                    numericalValue: 100,
                    position: 1,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: priority2,
                    name: 'Medium',
                    description:'Medium priority',
                    numericalValue: 70,
                    position: 2,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: priority3,
                    name: 'Low',
                    description:'Low priority',
                    numericalValue: 30,
                    position: 3,
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'LogPriority', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'LogReason');
            var seedArray =  [
                {
                    _id: reason1,
                    name: 'Poor estimation',
                    description:'Change is required due to poor previous estimation',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: reason2,
                    name: 'Resource bottleneck',
                    description:'Change is required due to lack of staff or skills',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: reason3,
                    name: 'Scope change',
                    description:'Change is required due to scope change',
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'LogReason', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'IssueState');
            var seedArray =  [
                {
                    _id: issueState1,
                    name: 'To be analyzed',
                    description:'Issues has been recorded and awaiting analysis',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: issueState2,
                    name: 'No resolution available',
                    description:'There is no resolution for the issue',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: issueState3,
                    name: 'Resolution under implementation',
                    description:'Resolution is currently being implemented',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: issueState4,
                    name: 'Resolution on hold',
                    description:'Resolution implementation has been put on-hold',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: issueState5,
                    name: 'Resolved',
                    description:'Resolution has been successfully implemented, tested and deployed',
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'IssueState', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'IssueActionState');
            var seedArray =  [
                {
                    _id: actionState1,
                    name: 'Requested',
                    description:'Action has been requested',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: actionState2,
                    name: 'In progress',
                    description:'Owner has been informed and has accepted the escalation',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: actionState3,
                    name: 'On-hold',
                    description:'Escalation on hold',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: actionState4,
                    name: 'Closed',
                    description:'Escalation action closed',
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'IssueActionState', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'ChangeRequestState');
            var seedArray =  [
                {
                    _id: changeState1,
                    name: 'Submitted',
                    description:'Change has been submitted',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: changeState2,
                    name: 'Approved',
                    description:'Change has been approved',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: changeState3,
                    name: 'Rejected',
                    description:'Change is currently being implemented',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: changeState4,
                    name: 'In progress',
                    description:'Change is currently being implemented',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: changeState5,
                    name: 'On-hold',
                    description:'Change implementation has been put on-hold',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: changeState6,
                    name: 'Closed',
                    description:'Change has been successfully implemented, tested and deployed or otherwise deemed closed',
                    user:req.user._id,
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
