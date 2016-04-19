'use strict';

/**
 * SEED - STATUS SETUP
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

exports.seedStatuses = function(req, callback){
    
    // Status indicators

    var indicator1 = mongoose.Types.ObjectId();
    var indicator2 = mongoose.Types.ObjectId();
    var indicator3 = mongoose.Types.ObjectId();

    // Status areas

    var area1 = mongoose.Types.ObjectId();
    var area2 = mongoose.Types.ObjectId();
    var area3 = mongoose.Types.ObjectId();

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusIndicator');
            var seedArray =  [
                {
                    _id: indicator1,
                    name: 'Red',
                    description:'Item is failing',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: indicator2,
                    name: 'Amber',
                    description:'Item requires attention',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: indicator3,
                    name: 'Green',
                    description:'Item is successfully progressing',
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'LogStatusIndicator', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusArea');
            var seedArray =  [
                {
                    _id: area1,
                    name: 'Risk management',
                    description:'Risk management status',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: area2,
                    name: 'Benefits realization',
                    description:'Benefits realization',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: area3,
                    name: 'Stakeholders management',
                    description:'Stakeholders management',
                    user:req.user._id,
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
