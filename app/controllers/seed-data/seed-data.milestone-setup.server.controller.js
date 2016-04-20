'use strict';

/**
 * SEED - MILESTONE SETUP
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

exports.seedMilestones = function(user, callback){

    // Milestone states

    var state1 = mongoose.Types.ObjectId();
    var state2 = mongoose.Types.ObjectId();
    var state3 = mongoose.Types.ObjectId();
    var state4 = mongoose.Types.ObjectId();
    var state5 = mongoose.Types.ObjectId();
    var state6 = mongoose.Types.ObjectId();
    var state7 = mongoose.Types.ObjectId();

    // Project Milestone Types

    var projectMilType1 = mongoose.Types.ObjectId();
    var projectMilType2 = mongoose.Types.ObjectId();
    var projectMilType3 = mongoose.Types.ObjectId();
    var projectMilType4 = mongoose.Types.ObjectId();
    var projectMilType5 = mongoose.Types.ObjectId();
    var projectMilType6 = mongoose.Types.ObjectId();

    // Portfolio Milestone Types

    var portfolioMilType1 = mongoose.Types.ObjectId();
    var portfolioMilType2 = mongoose.Types.ObjectId();
    var portfolioMilType3 = mongoose.Types.ObjectId();

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'MilestoneState');
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
                    name: 'Delayed',
                    description:'Delayed',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: state5,
                    name: 'Partially achieved',
                    description:'Partially achieved',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: state6,
                    name: 'Fully achieved',
                    description:'Fully achieved',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: state7,
                    name: 'Not achieved',
                    description:'Not achieved',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'MilestoneState', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'ProjectMilestoneType');
            var seedArray =  [
                {
                    _id: projectMilType1,
                    name: 'Business justification',
                    description:'Business case or financial modelling',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: projectMilType2,
                    name: 'Business analysis',
                    description:'Business process analysis',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: projectMilType3,
                    name: 'Organizational change',
                    description:'Organizational change',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: projectMilType4,
                    name: 'System development',
                    description:'System development',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: projectMilType5,
                    name: 'Testing',
                    description:'Testing',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: projectMilType6,
                    name: 'Training',
                    description:'Training',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'ProjectMilestoneType', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PortfolioMilestoneType');
            var seedArray =  [
                {
                    _id: portfolioMilType1,
                    name: 'Quick win',
                    description:'Quick win',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: portfolioMilType2,
                    name: 'Enabling',
                    description:'Enabling',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: portfolioMilType3,
                    name: 'Disrupting',
                    description:'Disrupting',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PortfolioMilestoneType', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
