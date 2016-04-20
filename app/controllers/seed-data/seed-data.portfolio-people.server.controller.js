'use strict';

/**
 * SEED - PORTFOLIO PEOPLE
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

exports.seedPortfolioPeople = function(user, callback){
    // Portfolio Governance Board
    var portfolioGovernanceBoard = mongoose.Types.ObjectId();

    var businessExecutive = mongoose.Types.ObjectId();
    var sectorITManager = mongoose.Types.ObjectId();
    var portfolioManager = mongoose.Types.ObjectId();
    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PeoplePortfolioGroup');
            var seedArray =  [
                {
                    _id: portfolioGovernanceBoard,
                    name: 'Portfolio governance board',
                    description:'Portfolio governance board',
                    roles: [businessExecutive, sectorITManager, portfolioManager],
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PeoplePortfolioGroup', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PeoplePortfolioRole');
            var seedArray =  [
                {
                    _id: businessExecutive,
                    name: 'Business executive',
                    description:'Business executive',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: sectorITManager,
                    name: 'Sector IT Manager',
                    description:'Sector IT Manager',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: portfolioManager,
                    name: 'Portfolio Manager',
                    description:'Portfolio Manager',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PeoplePortfolioRole', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
