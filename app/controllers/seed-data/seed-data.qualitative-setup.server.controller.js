'use strict';

/**
 * SEED - QUALITATIVE SETUP
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

exports.seedQualitativeImpacts = function(req, callback){

// Alignment
    var q1 = mongoose.Types.ObjectId();

    var q11 = mongoose.Types.ObjectId(); // Business alignment
    var q12 = mongoose.Types.ObjectId(); // Technology alignment

// Economic contribution
    var q2 = mongoose.Types.ObjectId();

    var q21 = mongoose.Types.ObjectId(); // Revenue generation
    var q22 = mongoose.Types.ObjectId(); // Cost reduction
    var q23 = mongoose.Types.ObjectId(); // Differentiation
    var q24 = mongoose.Types.ObjectId(); // Competitive advantage

// Balanced scorecard
    var q3 = mongoose.Types.ObjectId();

    var q31 = mongoose.Types.ObjectId(); // Financial
    var q32 = mongoose.Types.ObjectId(); // Internal
    var q33 = mongoose.Types.ObjectId(); // Growth
    var q34 = mongoose.Types.ObjectId(); // Customer

// Marketing contribution
    var q4 = mongoose.Types.ObjectId();

    var q41 = mongoose.Types.ObjectId(); // Customer acquisition
    var q42 = mongoose.Types.ObjectId(); // Customer retention
    var q43 = mongoose.Types.ObjectId(); // Reputation
    var q44 = mongoose.Types.ObjectId(); // Brand awareness

// Impact scores

    var none = mongoose.Types.ObjectId();
    var veryLow = mongoose.Types.ObjectId();
    var low = mongoose.Types.ObjectId();
    var medium = mongoose.Types.ObjectId();
    var high = mongoose.Types.ObjectId();
    var veryHigh = mongoose.Types.ObjectId();

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');
            var seedArray =  [
                {
                    _id: q1,
                    name: 'Alignment',
                    description:'Alignment',
                    weight: 25,
                    impacts: [q11, q12],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: q2,
                    name: 'Economic contribution',
                    description:'Economic contribution',
                    weight: 25,
                    impacts: [q21, q22, q23, q24],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: q3,
                    name: 'Balanced scorecard',
                    description:'Balanced scorecard',
                    weight: 25,
                    impacts: [q31, q32, q33, q34],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: q4,
                    name: 'Marketing contribution',
                    description:'Marketing contribution',
                    weight: 25,
                    impacts: [q41, q42, q43, q44],
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'QualitativeImpactGroup', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpact');
            var seedArray =  [
                {
                    _id: q11,
                    name: 'Business alignment',
                    description:'Business alignment',
                    weight: 50,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: q12,
                    name: 'Technology alignment',
                    description:'Technology alignment',
                    weight: 50,
                    user:req.user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: q21,
                    name: 'Revenue generation',
                    description:'Technology alignment',
                    weight: 25,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: q22,
                    name: 'Cost reduction',
                    description:'Cost reduction',
                    weight: 25,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: q23,
                    name: 'Differentiation',
                    description:'Differentiation',
                    weight: 25,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: q24,
                    name: 'Competitive advantage',
                    description:'Competitive advantage',
                    weight: 25,
                    user:req.user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: q31,
                    name: 'Financial',
                    description:'Financial',
                    weight: 25,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: q32,
                    name: 'Internal',
                    description:'Internal',
                    weight: 25,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: q33,
                    name: 'Growth',
                    description:'Growth',
                    weight: 25,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: q34,
                    name: 'Customer',
                    description:'Customer',
                    weight: 25,
                    user:req.user._id,
                    created: Date.now()
                },
                // ---
                {
                    _id: q41,
                    name: 'Customer acquisition',
                    description:'Customer acquisition',
                    weight: 25,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: q42,
                    name: 'Customer retention',
                    description:'Customer retention',
                    weight: 25,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: q43,
                    name: 'Reputation',
                    description:'Reputation',
                    weight: 25,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: q44,
                    name: 'Brand awareness',
                    description:'Brand awareness',
                    weight: 25,
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'QualitativeImpact', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactScore');
            var seedArray =  [
                {
                    _id: none,
                    name: 'None',
                    description:'No project contribution to the impact',
                    numericalValue: 0,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: veryLow,
                    name: 'Very low',
                    description:'Project contribution to the impact is very low',
                    numericalValue: 10,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: low,
                    name: 'Low',
                    description:'Project contribution to the impact is low',
                    numericalValue: 20,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: medium,
                    name: 'Medium',
                    description:'Project contribution to the impact is medium',
                    numericalValue: 30,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: high,
                    name: 'High',
                    description:'Project contribution to the impact is high',
                    numericalValue: 40,
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: veryHigh,
                    name: 'Very high',
                    description:'Project contribution to the impact is very high',
                    numericalValue: 50,
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'QualitativeImpactScore', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
