'use strict';

/**
 * SEED - MILESTONE SETUP
 */

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');


// Milestone states

var state1 = mongoose.Types.ObjectId();
var state2 = mongoose.Types.ObjectId();
var state3 = mongoose.Types.ObjectId();
var state4 = mongoose.Types.ObjectId();
var state5 = mongoose.Types.ObjectId();
var state6 = mongoose.Types.ObjectId();
var state7 = mongoose.Types.ObjectId();

exports.getMilestoneStates = function(req){
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
            name: 'Delayed',
            description:'Delayed',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: state5,
            name: 'Partially achieved',
            description:'Partially achieved',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: state6,
            name: 'Fully achieved',
            description:'Fully achieved',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: state7,
            name: 'Not achieved',
            description:'Not achieved',
            user:req.user._id,
            created: Date.now()
        }
    ];
};


// Project Milestone Types

var projectMilType1 = mongoose.Types.ObjectId();
var projectMilType2 = mongoose.Types.ObjectId();
var projectMilType3 = mongoose.Types.ObjectId();
var projectMilType4 = mongoose.Types.ObjectId();
var projectMilType5 = mongoose.Types.ObjectId();
var projectMilType6 = mongoose.Types.ObjectId();

exports.getProjectMilestoneTypes = function(req){
    return [
        {
            _id: projectMilType1,
            name: 'Business justification',
            description:'Business case or financial modelling',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: projectMilType2,
            name: 'Business analysis',
            description:'Business process analysis',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: projectMilType3,
            name: 'Organizational change',
            description:'Organizational change',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: projectMilType4,
            name: 'System development',
            description:'System development',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: projectMilType5,
            name: 'Testing',
            description:'Testing',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: projectMilType6,
            name: 'Training',
            description:'Training',
            user:req.user._id,
            created: Date.now()
        }
    ];
};

// Portfolio Milestone Types

var portfolioMilType1 = mongoose.Types.ObjectId();
var portfolioMilType2 = mongoose.Types.ObjectId();
var portfolioMilType3 = mongoose.Types.ObjectId();

exports.getPortfolioMilestoneTypes = function(req){
    return [
        {
            _id: portfolioMilType1,
            name: 'Quick win',
            description:'Quick win',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: portfolioMilType2,
            name: 'Enabling',
            description:'Enabling',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: portfolioMilType3,
            name: 'Disrupting',
            description:'Disrupting',
            user:req.user._id,
            created: Date.now()
        }
    ];
};
