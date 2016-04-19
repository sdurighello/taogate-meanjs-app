'use strict';

/**
 * SEED - PORTFOLIO SETUP
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

exports.seedPortfolioTypes = function(req, callback){
    var pnt1 = mongoose.Types.ObjectId();
    var pnt2 = mongoose.Types.ObjectId();
    var pnt3 = mongoose.Types.ObjectId();
    async.series([
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioType');
            var seedArray =  [
                {
                    _id: pnt1,
                    name: 'Regional office',
                    description:'Regional office',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: pnt2,
                    name: 'Business line',
                    description:'Business line',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: pnt3,
                    name: 'Division',
                    description:'Division',
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PortfolioType', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
