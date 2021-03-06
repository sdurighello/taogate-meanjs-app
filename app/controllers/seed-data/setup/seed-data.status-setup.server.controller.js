'use strict';

/**
 * SEED - STATUS SETUP
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

exports.seedStatuses = function(user, callback){
    
    // Status indicators

    var indicator1 = seedIDs.LogStatusIndicator.indicator1;
    var indicator2 = seedIDs.LogStatusIndicator.indicator2;
    var indicator3 = seedIDs.LogStatusIndicator.indicator3;
    var indicator4 = seedIDs.LogStatusIndicator.indicator4;
    var indicator5 = seedIDs.LogStatusIndicator.indicator5;

    // Status areas

    var area1 = seedIDs.LogStatusArea.area1;
    var area2 = seedIDs.LogStatusArea.area2;
    var area3 = seedIDs.LogStatusArea.area3;

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'LogStatusIndicator');
            var seedArray =  [
                {
                    _id: indicator1,
                    name: 'Red',
                    description:'Item is failing',
                    color: 'red',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: indicator2,
                    name: 'Amber',
                    description:'Item requires attention',
                    color: 'yellow',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: indicator3,
                    name: 'Green',
                    description:'Item is successfully progressing',
                    color: 'green',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: indicator4,
                    name: 'Not started',
                    description:'Item has not started yet',
                    color: 'blue',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: indicator5,
                    name: 'Completed',
                    description:'Item is completed',
                    color: 'gray',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'LogStatusIndicator', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'LogStatusArea');
            var seedArray =  [
                {
                    _id: area1,
                    name: 'Risk management',
                    description:'Risk management status',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: area2,
                    name: 'Benefits realization',
                    description:'Benefits realization',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: area3,
                    name: 'Stakeholders management',
                    description:'Stakeholders management',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'LogStatusArea', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
