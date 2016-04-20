'use strict';

/**
 * SEED - DEPENDENCY SETUP
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

exports.seedDependencies = function(user, callback){

    // Dependency types

    var dt1 = seedIDs.PortfolioType.dt1; // inputForReview
    var dt2 = seedIDs.PortfolioType.dt2; // reviewResponse

    var dt3 = seedIDs.PortfolioType.dt3; // inputForApproval
    var dt4 = seedIDs.PortfolioType.dt4; // approvalResponse

    var dt5 = seedIDs.PortfolioType.dt5; // software
    var dt6 = seedIDs.PortfolioType.dt6; // hardware
    var dt7 = seedIDs.PortfolioType.dt7; // resource

    var dt8 = seedIDs.PortfolioType.dt8; // planning
    var dt9 = seedIDs.PortfolioType.dt9; // analysis
    var dt10 = seedIDs.PortfolioType.dt10; // design
    var dt11 = seedIDs.PortfolioType.dt11; // build
    var dt12 = seedIDs.PortfolioType.dt12; // test

    // Dependency impacts

    var di1 = seedIDs.PortfolioType.di1; // veryLow
    var di2 = seedIDs.PortfolioType.di2; // low
    var di3 = seedIDs.PortfolioType.di3; // medium
    var di4 = seedIDs.PortfolioType.di4; // high
    var di5 = seedIDs.PortfolioType.di5; // veryHigh

    // Dependency state

    var ds1 = seedIDs.PortfolioType.ds1; // toBeDiscussed
    var ds2 = seedIDs.PortfolioType.ds2; // underDiscussion
    var ds3 = seedIDs.PortfolioType.ds3; // agreed
    var ds4 = seedIDs.PortfolioType.ds4; // done

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'DependencyType');
            var seedArray =  [
                {
                    _id: dt1,
                    name: 'Input for review',
                    description:'Any input from the source project expected to be reviewed by the target project',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: dt2,
                    name: 'Review response',
                    description:'Any review output from the source project expected to be received by the target project',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: dt3,
                    name: 'Input for approval',
                    description:'Any input from the source project expected to be approved by the target project',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: dt4,
                    name: 'Approval response',
                    description:'Any approval output from the source project expected to be received by the target project',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: dt5,
                    name: 'Software',
                    description:'Any software based artifact or product',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: dt6,
                    name: 'Hardware',
                    description:'Any hardware based artifact or product',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: dt7,
                    name: 'Resource',
                    description:'Any resource (financial, personnel, etc.) from the source project expected to be received by the target project',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: dt8,
                    name: 'Planning',
                    description:'Any planning artifact from the source project expected to be received by the target project',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: dt9,
                    name: 'Analysis',
                    description:'Any analysis artifact from the source project expected to be received by the target project',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: dt10,
                    name: 'Design',
                    description:'Any design artifact from the source project expected to be received by the target project',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: dt11,
                    name: 'Build',
                    description:'Any build artifact from the source project expected to be received by the target project',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: dt12,
                    name: 'Test',
                    description:'Any test artifact from the source project expected to be received by the target project',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'DependencyType', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'DependencyImpact');
            var seedArray =  [
                {
                    _id: di1,
                    name: 'Very high',
                    description:'Input from the source project is critical to the target project continuation. ' +
                    'Dependency delays will impact directly the target project budget, timing and quality and ' +
                    'will not allow the project to continue at all',
                    numericalValue: 100,
                    position: 1,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: di2,
                    name: 'High',
                    description:'Input from the source project has high importance to the target project success. ' +
                    'Dependency delays will impact directly the target project budget, timing and quality and ' +
                    'but the project may continue',
                    numericalValue: 80,
                    position: 2,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: di3,
                    name: 'Medium',
                    description:'Dependency delays may impact the target-project budget, timing and quality',
                    numericalValue: 60,
                    position: 3,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: di4,
                    name: 'Low',
                    description:'Dependency delays can be partially mitigated with workarounds or additional slack',
                    numericalValue: 40,
                    position: 4,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: di5,
                    name: 'Very low',
                    description:'Dependency delays can be absorbed with workarounds or additional slack',
                    numericalValue: 20,
                    position: 5,
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'DependencyImpact', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'DependencyState');
            var seedArray =  [
                {
                    _id: ds1,
                    name: 'To be discussed',
                    description:'Dependency has been recorded but not yet discussed between the source and target projects',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ds2,
                    name: 'Under discussion',
                    description:'Dependency is under discussion between the source and target projects',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ds3,
                    name: 'Agreed',
                    description:'Dependency has been agreed between the source and target projects to delivered as baselined',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ds4,
                    name: 'Done',
                    description:'Dependency has been successfully provided',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'DependencyState', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
