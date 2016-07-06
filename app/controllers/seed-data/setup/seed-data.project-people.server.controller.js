'use strict';

/**
 * SEED - PROJECT PEOPLE
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

exports.seedProjectPeople = function(user, callback){

    // Project Steering Committee
    var group1 = seedIDs.PeopleProjectGroup.group1;

    // Architecture Review Board
    var group2 = seedIDs.PeopleProjectGroup.group2;

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PeopleProjectGroup');
            var seedArray =  [
                {
                    _id: group1,
                    name: 'Project steering committee',
                    description:'Project steering committee',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: group2,
                    name: 'Architecture review board',
                    description:'Architecture review board',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PeopleProjectGroup', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
