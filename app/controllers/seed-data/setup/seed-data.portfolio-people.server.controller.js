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

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PeoplePortfolioGroup');
            var seedArray =  [
                {
                    _id: group1,
                    name: 'Portfolio governance board',
                    description:'Portfolio governance board',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PeoplePortfolioGroup', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
