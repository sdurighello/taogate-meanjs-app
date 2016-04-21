'use strict';

/**
 * SEED - RISK SETUP
 */

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    seedIDs = require('./seed-data.ids.server.controller').getIDs(),
    async = require('async'),
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

exports.seedRisks = function(user, callback){

// Delivery
    var r1 = seedIDs.RiskCategory.r1;

    var r11 = seedIDs.Risk.r11; // Poor product quality
    var r12 = seedIDs.Risk.r12; // Supplier failure
    var r13 = seedIDs.Risk.r13; // Lack of staff or skills

// Financial
    var r2 = seedIDs.RiskCategory.r2;

    var r21 = seedIDs.Risk.r21; // Cost overrun
    var r22 = seedIDs.Risk.r22; // Increased cost variability
    var r23 = seedIDs.Risk.r23; // Increased capex/opex ratio

// Technology
    var r3 = seedIDs.RiskCategory.r3;

    var r31 = seedIDs.Risk.r31; // Technology aging
    var r32 = seedIDs.Risk.r32; // Platform instability
    var r33 = seedIDs.Risk.r33; // Impacts on other systems

// Operational
    var r4 = seedIDs.RiskCategory.r4;

    var r41 = seedIDs.Risk.r41; // Impaired support and maintenance
    var r42 = seedIDs.Risk.r42; // Difficult business adoption
    var r43 = seedIDs.Risk.r43; // Business process failure

// Market
    var r5 = seedIDs.RiskCategory.r5;

    var r51 = seedIDs.Risk.r51; // Poor market reception
    var r52 = seedIDs.Risk.r52; // Impact on Partner relationships
    var r53 = seedIDs.Risk.r53; // Reaction from competition

// Legal
    var r6 = seedIDs.RiskCategory.r6;

    var r61 = seedIDs.Risk.r61; // Regulatory breach
    var r62 = seedIDs.Risk.r62; // Exposure to lawsuit loss

// Impacts

    var incidental = seedIDs.RiskImpact.incidental;
    var minor = seedIDs.RiskImpact.minor;
    var moderate = seedIDs.RiskImpact.moderate;
    var major = seedIDs.RiskImpact.major;
    var extreme = seedIDs.RiskImpact.extreme;

// Probabilities

    var rare = seedIDs.RiskProbability.rare;
    var unlikely = seedIDs.RiskProbability.unlikely;
    var possible = seedIDs.RiskProbability.possible;
    var likely = seedIDs.RiskProbability.likely;
    var frequent = seedIDs.RiskProbability.frequent;

// Severities

    var low = seedIDs.RiskSeverity.low;
    var medium = seedIDs.RiskSeverity.medium;
    var high = seedIDs.RiskSeverity.high;

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'RiskCategory');
            var seedArray =  [
                {
                    _id: r1,
                    name: 'Delivery',
                    description:'Delivery risks',
                    risks: [r11, r12, r13],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r2,
                    name: 'Financial',
                    description:'Financial risks',
                    risks: [r21, r22, r23],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r3,
                    name: 'Technology',
                    description:'Technology risks',
                    risks: [r31, r32, r33],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r4,
                    name: 'Operational',
                    description:'Operational risks',
                    risks: [r41, r42, r43],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r5,
                    name: 'Market',
                    description:'Market risks',
                    risks: [r51, r52, r53],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r6,
                    name: 'Legal',
                    description:'Legal risks',
                    risks: [r61, r62],
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'RiskCategory', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'Risk');
            var seedArray =  [
                {
                    _id: r11,
                    name: 'Poor product quality',
                    description:'Poor product quality',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r12,
                    name: 'Supplier failure',
                    description:'Supplier failure',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r13,
                    name: 'Lack of staff or skills',
                    description:'Lack of staff or skills',
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: r21,
                    name: 'Cost overrun',
                    description:'Cost overrun',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r22,
                    name: 'Increased cost variability',
                    description:'Increased cost variability',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r23,
                    name: 'Increased capex/opex ratio',
                    description:'Increased capex/opex ratio',
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: r31,
                    name: 'Technology aging',
                    description:'Technology aging',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r32,
                    name: 'Platform instability',
                    description:'Platform instability',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r33,
                    name: 'Impacts on other systems',
                    description:'Impacts on other systems',
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: r41,
                    name: 'Impaired support and maintenance',
                    description:'Impaired support and maintenance',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r42,
                    name: 'Difficult business adoption',
                    description:'Difficult business adoption',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r43,
                    name: 'Business process failure',
                    description:'Business process failure',
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: r51,
                    name: 'Poor market reception',
                    description:'Poor market reception',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r52,
                    name: 'Impact on Partner relationships',
                    description:'Impact on Partner relationships',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r53,
                    name: 'Reaction from competition',
                    description:'Reaction from competition',
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: r61,
                    name: 'Regulatory breach',
                    description:'Regulatory breach',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: r62,
                    name: 'Exposure to lawsuit loss',
                    description:'Exposure to lawsuit loss',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'Risk', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'RiskImpact');
            var seedArray =  [
                {
                    _id: incidental,
                    name: 'Incidental',
                    description:'Incidental impact on operations',
                    impactValue: 0,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: minor,
                    name: 'Minor',
                    description:'Minor impact on operations',
                    impactValue: 25,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: moderate,
                    name: 'Moderate',
                    description:'Moderate impact on operations',
                    impactValue: 50,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: major,
                    name: 'Major',
                    description:'Major impact on operations',
                    impactValue: 75,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: extreme,
                    name: 'Extreme',
                    description:'Extreme impact on operations',
                    impactValue: 100,
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'RiskImpact', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'RiskProbability');
            var seedArray =  [
                {
                    _id: rare,
                    name: 'Rare',
                    description:'Rare likelihood',
                    probabilityValue: 0,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: unlikely,
                    name: 'Unlikely',
                    description:'Unlikely likelihood',
                    probabilityValue: 25,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: possible,
                    name: 'Possible',
                    description:'Possible likelihood',
                    probabilityValue: 50,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: likely,
                    name: 'Likely',
                    description:'Likely to happen',
                    probabilityValue: 75,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: frequent,
                    name: 'Frequent',
                    description:'Almost certain',
                    probabilityValue: 100,
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'RiskProbability', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'RiskSeverity');
            var seedArray =  [
                {
                    _id: high,
                    name: 'High',
                    description:'High severity of combined impact and probability',
                    severityValue: 99,
                    position: 1,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: medium,
                    name: 'Medium',
                    description:'Medium severity of combined impact and probability',
                    severityValue: 66,
                    position: 2,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: low,
                    name: 'Low',
                    description:'Low severity of combined impact and probability',
                    severityValue: 33,
                    position: 3,
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'RiskSeverity', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'RiskSeverityAssignment');
            var seedArray =  [
                {
                    impact: incidental,
                    probability: frequent,
                    severity: medium,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: incidental,
                    probability: likely,
                    severity: medium,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: incidental,
                    probability: possible,
                    severity: low,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: incidental,
                    probability: unlikely,
                    severity: low,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: incidental,
                    probability: rare,
                    severity: low,
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    impact: minor,
                    probability: frequent,
                    severity: high,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: minor,
                    probability: likely,
                    severity: medium,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: minor,
                    probability: possible,
                    severity: medium,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: minor,
                    probability: unlikely,
                    severity: low,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: minor,
                    probability: rare,
                    severity: low,
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    impact: moderate,
                    probability: frequent,
                    severity: high,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: moderate,
                    probability: likely,
                    severity: high,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: moderate,
                    probability: possible,
                    severity: medium,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: moderate,
                    probability: unlikely,
                    severity: medium,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: moderate,
                    probability: rare,
                    severity: low,
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    impact: major,
                    probability: frequent,
                    severity: high,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: major,
                    probability: likely,
                    severity: high,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: major,
                    probability: possible,
                    severity: high,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: major,
                    probability: unlikely,
                    severity: medium,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: major,
                    probability: rare,
                    severity: medium,
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    impact: extreme,
                    probability: frequent,
                    severity: high,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: extreme,
                    probability: likely,
                    severity: high,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: extreme,
                    probability: possible,
                    severity: high,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: extreme,
                    probability: unlikely,
                    severity: high,
                    user:user._id,
                    created: Date.now()
                },
                {
                    impact: extreme,
                    probability: rare,
                    severity: medium,
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'RiskSeverityAssignment', seedArray, callback);
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
