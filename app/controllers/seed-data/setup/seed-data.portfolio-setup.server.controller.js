'use strict';

/**
 * SEED - PORTFOLIO SETUP
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

exports.seedPortfolioSetup = function(user, callback){

    // Portfolio types
    var pnt1 = seedIDs.PortfolioType.pnt1;
    var pnt2 = seedIDs.PortfolioType.pnt2;
    var pnt3 = seedIDs.PortfolioType.pnt3;


    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PortfolioType');
            var seedArray =  [
                {
                    _id: pnt1,
                    name: 'Regional office',
                    description:'Regional office',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: pnt2,
                    name: 'Business line',
                    description:'Business line',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: pnt3,
                    name: 'Division',
                    description:'Division',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PortfolioType', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            console.log(err);
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
