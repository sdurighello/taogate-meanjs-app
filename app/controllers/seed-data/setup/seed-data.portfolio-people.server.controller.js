'use strict';

/**
 * SEED - PORTFOLIO PEOPLE
 */
var _ = require('lodash'),
    errorHandler = require('../../errors.server.controller.js'),
    mongoose = require('mongoose'),
    async = require('async'),
    seedIDs = require('./../seed-data.ids.server.controller.js').getIDs(),
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
    var group1 = seedIDs.PeoplePortfolioGroup.group1;

    var role1 = seedIDs.PeoplePortfolioRole.role1;
    var role2 = seedIDs.PeoplePortfolioRole.role2;
    var role3 = seedIDs.PeoplePortfolioRole.role3;

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PeoplePortfolioGroup');
            var seedArray =  [
                {
                    _id: group1,
                    name: 'Portfolio governance board',
                    description:'Portfolio governance board',
                    roles: [role1, role2, role3],
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
                    _id: role1,
                    name: 'Business executive',
                    description:'Business executive',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: role2,
                    name: 'Sector IT Manager',
                    description:'Sector IT Manager',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: role3,
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
