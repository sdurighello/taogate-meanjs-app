'use strict';

/**
 * SEED - IMPROVEMENT SETUP
 */

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');


// Reasons for improvement

var reason1 = mongoose.Types.ObjectId();
var reason2 = mongoose.Types.ObjectId();
var reason3 = mongoose.Types.ObjectId();

exports.getImprovementReasons = function(req){
    return [
        {
            _id: reason1,
            name: 'Low business value of projects',
            description:'Low business value of projects',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: reason2,
            name: 'Low team morale',
            description:'Low team morale',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: reason3,
            name: 'Idea to market shorter lead time',
            description:'Idea to market shorter lead time',
            user:req.user._id,
            created: Date.now()
        }
    ];
};

// Improvement States

var state1 = mongoose.Types.ObjectId();
var state2 = mongoose.Types.ObjectId();
var state3 = mongoose.Types.ObjectId();
var state4 = mongoose.Types.ObjectId();

exports.getImprovementStates = function(req){
    return [
        {
            _id: state1,
            name: 'Not started',
            description:'Not started',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: state2,
            name: 'In progress',
            description:'In progress',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: state3,
            name: 'On-hold',
            description:'On-hold',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: state4,
            name: 'Closed',
            description:'Closed',
            user:req.user._id,
            created: Date.now()
        }
    ];
};

// Improvement Types

var type1 = mongoose.Types.ObjectId();
var type2 = mongoose.Types.ObjectId();
var type3 = mongoose.Types.ObjectId();
var type4 = mongoose.Types.ObjectId();

exports.getImprovementTypes = function(req){
    return [
        {
            _id: type1,
            name: 'Coaching',
            description:'Coaching',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: type2,
            name: 'New governance artifact',
            description:'New governance artifact',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: type3,
            name: 'Team building activity',
            description:'Team building activity',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: type4,
            name: 'Internal process improvement',
            description:'Internal process improvement',
            user:req.user._id,
            created: Date.now()
        }
    ];
};
