'use strict';

/**
 * SEED - PORTFOLIO PEOPLE
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');


// Portfolio Governance Board
var portfolioGovernanceBoard = mongoose.Types.ObjectId();

var businessExecutive = mongoose.Types.ObjectId();
var sectorITManager = mongoose.Types.ObjectId();
var portfolioManager = mongoose.Types.ObjectId();


exports.getPeoplePortfolioGroups = function(req){
    return [
        {
            _id: portfolioGovernanceBoard,
            name: 'Portfolio governance board',
            description:'Portfolio governance board',
            roles: [businessExecutive, sectorITManager, portfolioManager],
            user:req.user._id,
            created: Date.now()
        }
    ];
};

exports.getPeoplePortfolioRoles = function(req){
    return [
        {
            _id: businessExecutive,
            name: 'Business executive',
            description:'Business executive',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: sectorITManager,
            name: 'Sector IT Manager',
            description:'Sector IT Manager',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: portfolioManager,
            name: 'Portfolio Manager',
            description:'Portfolio Manager',
            user:req.user._id,
            created: Date.now()
        }
    ];
};
