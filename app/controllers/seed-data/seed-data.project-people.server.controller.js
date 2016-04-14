'use strict';

/**
 * SEED - PROJECT PEOPLE
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');


// Project Steering Committee
var projectSteeringCommittee = mongoose.Types.ObjectId();

var seniorUser = mongoose.Types.ObjectId();
var seniorSupplier = mongoose.Types.ObjectId();
var executiveSponsor = mongoose.Types.ObjectId();
var projectManager = mongoose.Types.ObjectId();

// Architecture Review Board
var architectureReviewBoard = mongoose.Types.ObjectId();

var designCoordinator = mongoose.Types.ObjectId();
var securityOfficer = mongoose.Types.ObjectId();
var applicationArchitect = mongoose.Types.ObjectId();
var enterpriseArchitect = mongoose.Types.ObjectId();


exports.getPeopleProjectGroups = function(req){
    return [
        {
            _id: projectSteeringCommittee,
            name: 'Project steering committee',
            description:'Project steering committee',
            roles: [seniorSupplier, seniorUser, executiveSponsor, projectManager],
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: architectureReviewBoard,
            name: 'Architecture review board',
            description:'Architecture review board',
            roles: [designCoordinator, securityOfficer, applicationArchitect, enterpriseArchitect],
            user:req.user._id,
            created: Date.now()
        }
    ];
};

exports.getPeopleProjectRoles = function(req){
    return [
        {
            _id: seniorUser,
            name: 'Senior user',
            description:'Represents the interests of Users within the project',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: seniorSupplier,
            name: 'Senior supplier',
            description:'Represents the interests of Suppliers within the project',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: executiveSponsor,
            name: 'Executive sponsor',
            description:'Senior member of the project board and often the chair. ' +
            'The project sponsor will be a senior executive in a corporation who is responsible ' +
            'to the business for the success of the project',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: projectManager,
            name: 'Project Manager',
            description:'Project manager',
            user:req.user._id,
            created: Date.now()
        },
        // ---
        {
            _id: designCoordinator,
            name: 'Design coordinator',
            description:'Design coordinator',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: securityOfficer,
            name: 'Security officer',
            description:'Security officer',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: applicationArchitect,
            name: 'Application architect',
            description:'Application architect',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: enterpriseArchitect,
            name: 'Enterprise architect',
            description:'Enterprise architect',
            user:req.user._id,
            created: Date.now()
        }
    ];
};
