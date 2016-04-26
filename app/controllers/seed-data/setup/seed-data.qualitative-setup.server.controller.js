'use strict';

/**
 * SEED - QUALITATIVE SETUP
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

exports.seedQualitativeImpacts = function(user, callback){

// Alignment
    var q1 = seedIDs.QualitativeImpactGroup.q1;

    var q11 = seedIDs.QualitativeImpact.q11; // Business alignment
    var q12 = seedIDs.QualitativeImpact.q12; // Technology alignment

// Economic contribution
    var q2 = seedIDs.QualitativeImpactGroup.q2;

    var q21 = seedIDs.QualitativeImpact.q21; // Revenue generation
    var q22 = seedIDs.QualitativeImpact.q22; // Cost reduction
    var q23 = seedIDs.QualitativeImpact.q23; // Differentiation
    var q24 = seedIDs.QualitativeImpact.q24; // Competitive advantage

// Balanced scorecard
    var q3 = seedIDs.QualitativeImpactGroup.q3;

    var q31 = seedIDs.QualitativeImpact.q31; // Financial
    var q32 = seedIDs.QualitativeImpact.q32; // Internal
    var q33 = seedIDs.QualitativeImpact.q33; // Growth
    var q34 = seedIDs.QualitativeImpact.q34; // Customer

// Marketing contribution
    var q4 = seedIDs.QualitativeImpactGroup.q4;

    var q41 = seedIDs.QualitativeImpact.q41; // Customer acquisition
    var q42 = seedIDs.QualitativeImpact.q42; // Customer retention
    var q43 = seedIDs.QualitativeImpact.q43; // Reputation
    var q44 = seedIDs.QualitativeImpact.q44; // Brand awareness

// Impact scores

    var impactScore0 = seedIDs.QualitativeImpactScore.impactScore0;
    var impactScore1 = seedIDs.QualitativeImpactScore.impactScore1; 
    var impactScore2 = seedIDs.QualitativeImpactScore.impactScore2; 
    var impactScore3 = seedIDs.QualitativeImpactScore.impactScore3; 
    var impactScore4 = seedIDs.QualitativeImpactScore.impactScore4; 
    var impactScore5 = seedIDs.QualitativeImpactScore.impactScore5; 
    var impactScore6 = seedIDs.QualitativeImpactScore.impactScore6; 
    var impactScore7 = seedIDs.QualitativeImpactScore.impactScore7; 
    var impactScore8 = seedIDs.QualitativeImpactScore.impactScore8; 
    var impactScore9 = seedIDs.QualitativeImpactScore.impactScore9; 
    var impactScore10 = seedIDs.QualitativeImpactScore.impactScore10; 

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'QualitativeImpactGroup');
            var seedArray =  [
                {
                    _id: q1,
                    name: 'Alignment',
                    description:'Alignment',
                    weight: 25,
                    impacts: [q11, q12],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: q2,
                    name: 'Economic contribution',
                    description:'Economic contribution',
                    weight: 25,
                    impacts: [q21, q22, q23, q24],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: q3,
                    name: 'Balanced scorecard',
                    description:'Balanced scorecard',
                    weight: 25,
                    impacts: [q31, q32, q33, q34],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: q4,
                    name: 'Marketing contribution',
                    description:'Marketing contribution',
                    weight: 25,
                    impacts: [q41, q42, q43, q44],
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'QualitativeImpactGroup', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'QualitativeImpact');
            var seedArray =  [
                {
                    _id: q11,
                    name: 'Business alignment',
                    description:'Business alignment',
                    weight: 50,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: q12,
                    name: 'Technology alignment',
                    description:'Technology alignment',
                    weight: 50,
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: q21,
                    name: 'Revenue generation',
                    description:'Technology alignment',
                    weight: 25,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: q22,
                    name: 'Cost reduction',
                    description:'Cost reduction',
                    weight: 25,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: q23,
                    name: 'Differentiation',
                    description:'Differentiation',
                    weight: 25,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: q24,
                    name: 'Competitive advantage',
                    description:'Competitive advantage',
                    weight: 25,
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: q31,
                    name: 'Financial',
                    description:'Financial',
                    weight: 25,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: q32,
                    name: 'Internal',
                    description:'Internal',
                    weight: 25,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: q33,
                    name: 'Growth',
                    description:'Growth',
                    weight: 25,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: q34,
                    name: 'Customer',
                    description:'Customer',
                    weight: 25,
                    user:user._id,
                    created: Date.now()
                },
                // ---
                {
                    _id: q41,
                    name: 'Customer acquisition',
                    description:'Customer acquisition',
                    weight: 25,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: q42,
                    name: 'Customer retention',
                    description:'Customer retention',
                    weight: 25,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: q43,
                    name: 'Reputation',
                    description:'Reputation',
                    weight: 25,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: q44,
                    name: 'Brand awareness',
                    description:'Brand awareness',
                    weight: 25,
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'QualitativeImpact', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'QualitativeImpactScore');
            var seedArray =  [
                {
                    _id: impactScore0,
                    name: '0',
                    description:'No project contribution to the impact',
                    numericalValue: 0,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: impactScore1,
                    name: '10',
                    description:'Project contributes to impact',
                    numericalValue: 10,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: impactScore2,
                    name: '20',
                    description:'Project contributes to impact',
                    numericalValue: 20,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: impactScore3,
                    name: '30',
                    description:'Project contributes to impact',
                    numericalValue: 30,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: impactScore4,
                    name: '40',
                    description:'Project contributes to impact',
                    numericalValue: 40,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: impactScore5,
                    name: '50',
                    description:'Project contributes to impact',
                    numericalValue: 50,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: impactScore6,
                    name: '60',
                    description:'Project contributes to impact',
                    numericalValue: 60,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: impactScore7,
                    name: '70',
                    description:'Project contributes to impact',
                    numericalValue: 70,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: impactScore8,
                    name: '80',
                    description:'Project contributes to impact',
                    numericalValue: 80,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: impactScore9,
                    name: '90',
                    description:'Project contributes to impact',
                    numericalValue: 90,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: impactScore10,
                    name: '100',
                    description:'Project contributes to impact',
                    numericalValue: 100,
                    user:user._id,
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
