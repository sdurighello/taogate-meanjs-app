'use strict';

/**
 * SEED - DEPENDENCY SETUP
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');


// Dependency types

var inputForReview = mongoose.Types.ObjectId();
var reviewResponse = mongoose.Types.ObjectId();

var inputForApproval = mongoose.Types.ObjectId();
var approvalResponse = mongoose.Types.ObjectId();

var software = mongoose.Types.ObjectId();
var hardware = mongoose.Types.ObjectId();
var resource = mongoose.Types.ObjectId();

var planning = mongoose.Types.ObjectId();
var analysis = mongoose.Types.ObjectId();
var design = mongoose.Types.ObjectId();
var build = mongoose.Types.ObjectId();
var test = mongoose.Types.ObjectId();

exports.getDependencyTypes = function(req){
    return [
        {
            _id: inputForReview,
            name: 'Input for review',
            description:'Any input from the source project expected to be reviewed by the target project',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: reviewResponse,
            name: 'Review response',
            description:'Any review output from the source project expected to be received by the target project',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: inputForApproval,
            name: 'Input for approval',
            description:'Any input from the source project expected to be approved by the target project',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: approvalResponse,
            name: 'Approval response',
            description:'Any approval output from the source project expected to be received by the target project',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: software,
            name: 'Software',
            description:'Any software based artifact or product',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: hardware,
            name: 'Hardware',
            description:'Any hardware based artifact or product',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: resource,
            name: 'Resource',
            description:'Any resource (financial, personnel, etc.) from the source project expected to be received by the target project',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: planning,
            name: 'Planning',
            description:'Any planning artifact from the source project expected to be received by the target project',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: analysis,
            name: 'Analysis',
            description:'Any analysis artifact from the source project expected to be received by the target project',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: design,
            name: 'Design',
            description:'Any design artifact from the source project expected to be received by the target project',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: build,
            name: 'Build',
            description:'Any build artifact from the source project expected to be received by the target project',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: test,
            name: 'Test',
            description:'Any test artifact from the source project expected to be received by the target project',
            user:req.user._id,
            created: Date.now()
        }
    ];
};


// Dependency impacts

var veryLow = mongoose.Types.ObjectId();
var low = mongoose.Types.ObjectId();
var medium = mongoose.Types.ObjectId();
var high = mongoose.Types.ObjectId();
var veryHigh = mongoose.Types.ObjectId();

exports.getDependencyImpacts = function(req){
    return [
        {
            _id: veryHigh,
            name: 'Very high',
            description:'Input from the source project is critical to the target project continuation. ' +
            'Dependency delays will impact directly the target project budget, timing and quality and ' +
            'will not allow the project to continue at all',
            numericalValue: 100,
            position: 1,
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: high,
            name: 'High',
            description:'Input from the source project has high importance to the target project success. ' +
            'Dependency delays will impact directly the target project budget, timing and quality and ' +
            'but the project may continue',
            numericalValue: 80,
            position: 2,
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: medium,
            name: 'Medium',
            description:'Dependency delays may impact the target-project budget, timing and quality',
            numericalValue: 60,
            position: 3,
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: low,
            name: 'Low',
            description:'Dependency delays can be partially mitigated with workarounds or additional slack',
            numericalValue: 40,
            position: 4,
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: veryLow,
            name: 'Very low',
            description:'Dependency delays can be absorbed with workarounds or additional slack',
            numericalValue: 20,
            position: 5,
            user:req.user._id,
            created: Date.now()
        }
    ];
};


// Dependency state

var toBeDiscussed = mongoose.Types.ObjectId();
var underDiscussion = mongoose.Types.ObjectId();
var agreed = mongoose.Types.ObjectId();
var done = mongoose.Types.ObjectId();

exports.getDependencyStates = function(req){
    return [
        {
            _id: toBeDiscussed,
            name: 'To be discussed',
            description:'Dependency has been recorded but not yet discussed between the source and target projects',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: underDiscussion,
            name: 'Under discussion',
            description:'Dependency is under discussion between the source and target projects',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: agreed,
            name: 'Agreed',
            description:'Dependency has been agreed between the source and target projects to delivered as baselined',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: done,
            name: 'Done',
            description:'Dependency has been successfully provided',
            user:req.user._id,
            created: Date.now()
        }
    ];
};
