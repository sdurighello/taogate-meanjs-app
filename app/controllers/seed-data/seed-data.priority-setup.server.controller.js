'use strict';

/**
 * SEED - PRIORITY SETUP
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');


// ------ Priority values ------

var low = mongoose.Types.ObjectId(); // Low
var medium = mongoose.Types.ObjectId(); // medium
var high = mongoose.Types.ObjectId(); // high

// ------ Project stakeholders ------

var prio1 = mongoose.Types.ObjectId();

var prio11 = mongoose.Types.ObjectId(); // Supplier
var prio12 = mongoose.Types.ObjectId(); // User
var prio13 = mongoose.Types.ObjectId(); // Sponsor

// ------ Executive management ------

var prio2 = mongoose.Types.ObjectId();

var prio21 = mongoose.Types.ObjectId(); // Executive board
var prio22 = mongoose.Types.ObjectId(); // Investment management committee

// ------ Technology leadership ------

var prio3 = mongoose.Types.ObjectId();

var prio31 = mongoose.Types.ObjectId(); // Project Management Office
var prio32 = mongoose.Types.ObjectId(); // Enterprise Architecture Board


// Objects

exports.getPriorityGroups = function(req){
    return [
        {
            _id: prio1,
            name: 'Project stakeholders',
            description:'Project stakeholders prioritization',
            priorities: [prio11, prio12, prio13],
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: prio2,
            name: 'Executive management',
            description:'Executive management prioritization',
            priorities: [prio21, prio22],
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: prio3,
            name: 'Technology leadership',
            description:'Technology leadership prioritization',
            priorities: [prio31, prio32],
            user:req.user._id,
            created: Date.now()
        }
    ];
};

exports.getPriorities = function(req){
    return [
        {
            _id: prio11,
            name: 'Supplier',
            description:'Supplier prioritization',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: prio12,
            name: 'User',
            description:'User prioritization',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: prio13,
            name: 'Sponsor',
            description:'Sponsor prioritization',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: prio21,
            name: 'Executive board',
            description:'Executive board prioritization',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: prio22,
            name: 'Investment management committee',
            description:'Investment management committee prioritization',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: prio31,
            name: 'Project Management Office',
            description:'Project Management Office prioritization',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: prio32,
            name: 'Enterprise Architecture Board',
            description:'Enterprise Architecture Board prioritization',
            user:req.user._id,
            created: Date.now()
        }
    ];
};

exports.getPriorityValues = function(req){
    return [
        {
            _id: high,
            name: 'High',
            description:'High priority',
            numericalValue: 30,
            position: 1,
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: medium,
            name: 'Medium',
            description:'Medium priority',
            numericalValue: 20,
            position: 2,
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: low,
            name: 'Low',
            description:'Low priority',
            numericalValue: 10,
            position: 3,
            user:req.user._id,
            created: Date.now()
        }
    ];
};


