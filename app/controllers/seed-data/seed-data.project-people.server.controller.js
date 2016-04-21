'use strict';

/**
 * SEED - PROJECT PEOPLE
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    seedIDs = require('./seed-data.ids.server.controller').getIDs(),
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

    var role11 = seedIDs.PeopleProjectRole.role11;
    var role12 = seedIDs.PeopleProjectRole.role12;
    var role13 = seedIDs.PeopleProjectRole.role13;
    var role14 = seedIDs.PeopleProjectRole.role14;

    // Architecture Review Board
    var group2 = seedIDs.PeopleProjectGroup.group2;

    var role21 = seedIDs.PeopleProjectRole.role21;
    var role22 = seedIDs.PeopleProjectRole.role22;
    var role23 = seedIDs.PeopleProjectRole.role23;
    var role24 = seedIDs.PeopleProjectRole.role24;

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PeopleProjectGroup');
            var seedArray =  [
                {
                    _id: group1,
                    name: 'Project steering committee',
                    description:'Project steering committee',
                    roles: [role11, role12, role13, role14],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: group2,
                    name: 'Architecture review board',
                    description:'Architecture review board',
                    roles: [role21, role22, role23, role24],
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PeopleProjectGroup', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PeopleProjectRole');
            var seedArray =  [
                {
                    _id: role11,
                    name: 'Senior user',
                    description:'Represents the interests of Users within the project',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: role12,
                    name: 'Senior supplier',
                    description:'Represents the interests of Suppliers within the project',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: role13,
                    name: 'Executive sponsor',
                    description:'Senior member of the project board and often the chair. ' +
                    'The project sponsor will be a senior executive in a corporation who is responsible ' +
                    'to the business for the success of the project',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: role14,
                    name: 'Project Manager',
                    description:'Project manager',
                    user:user._id,
                    created: Date.now()
                },
                // ---
                {
                    _id: role21,
                    name: 'Design coordinator',
                    description:'Design coordinator',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: role22,
                    name: 'Security officer',
                    description:'Security officer',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: role23,
                    name: 'Application architect',
                    description:'Application architect',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: role24,
                    name: 'Enterprise architect',
                    description:'Enterprise architect',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PeopleProjectRole', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
