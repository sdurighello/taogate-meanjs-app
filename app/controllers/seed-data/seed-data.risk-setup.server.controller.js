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

    var riskImpact1 = seedIDs.RiskImpact.riskImpact1; // incidental
    var riskImpact2 = seedIDs.RiskImpact.riskImpact2; // minor
    var riskImpact3 = seedIDs.RiskImpact.riskImpact3; // moderate
    var riskImpact4 = seedIDs.RiskImpact.riskImpact4; // major
    var riskImpact5 = seedIDs.RiskImpact.riskImpact5; // extreme

    // Probabilities

    var riskProb1 = seedIDs.RiskProbability.riskProb1; // rare
    var riskProb2 = seedIDs.RiskProbability.riskProb2; // unlikely
    var riskProb3 = seedIDs.RiskProbability.riskProb3; // possible
    var riskProb4 = seedIDs.RiskProbability.riskProb4; // likely
    var riskProb5 = seedIDs.RiskProbability.riskProb5; // frequent

    // Severities

    var riskSev1 = seedIDs.RiskSeverity.riskSev1; // low
    var riskSev2 = seedIDs.RiskSeverity.riskSev2; // medium
    var riskSev3 = seedIDs.RiskSeverity.riskSev3; // high

    // Severities Assignments

    var ri1Rp5 = seedIDs.RiskSeverityAssignment.ri1Rp5;
    var ri1Rp4 = seedIDs.RiskSeverityAssignment.ri1Rp4;
    var ri1Rp3 = seedIDs.RiskSeverityAssignment.ri1Rp3;
    var ri1Rp2 = seedIDs.RiskSeverityAssignment.ri1Rp2;
    var ri1Rp1 = seedIDs.RiskSeverityAssignment.ri1Rp1;

    var ri2Rp5 = seedIDs.RiskSeverityAssignment.ri2Rp5;
    var ri2Rp4 = seedIDs.RiskSeverityAssignment.ri2Rp4;
    var ri2Rp3 = seedIDs.RiskSeverityAssignment.ri2Rp3;
    var ri2Rp2 = seedIDs.RiskSeverityAssignment.ri2Rp2;
    var ri2Rp1 = seedIDs.RiskSeverityAssignment.ri2Rp1;

    var ri3Rp5 = seedIDs.RiskSeverityAssignment.ri3Rp5;
    var ri3Rp4 = seedIDs.RiskSeverityAssignment.ri3Rp4;
    var ri3Rp3 = seedIDs.RiskSeverityAssignment.ri3Rp3;
    var ri3Rp2 = seedIDs.RiskSeverityAssignment.ri3Rp2;
    var ri3Rp1 = seedIDs.RiskSeverityAssignment.ri3Rp1;

    var ri4Rp5 = seedIDs.RiskSeverityAssignment.ri4Rp5;
    var ri4Rp4 = seedIDs.RiskSeverityAssignment.ri4Rp4;
    var ri4Rp3 = seedIDs.RiskSeverityAssignment.ri4Rp3;
    var ri4Rp2 = seedIDs.RiskSeverityAssignment.ri4Rp2;
    var ri4Rp1 = seedIDs.RiskSeverityAssignment.ri4Rp1;

    var ri5Rp5 = seedIDs.RiskSeverityAssignment.ri5Rp5;
    var ri5Rp4 = seedIDs.RiskSeverityAssignment.ri5Rp4;
    var ri5Rp3 = seedIDs.RiskSeverityAssignment.ri5Rp3;
    var ri5Rp2 = seedIDs.RiskSeverityAssignment.ri5Rp2;
    var ri5Rp1 = seedIDs.RiskSeverityAssignment.ri5Rp1;


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
                    _id: riskImpact1,
                    name: 'Incidental',
                    description:'Incidental impact on operations',
                    impactValue: 0,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: riskImpact2,
                    name: 'Minor',
                    description:'Minor impact on operations',
                    impactValue: 25,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: riskImpact3,
                    name: 'Moderate',
                    description:'Moderate impact on operations',
                    impactValue: 50,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: riskImpact4,
                    name: 'Major',
                    description:'Major impact on operations',
                    impactValue: 75,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: riskImpact5,
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
                    _id: riskProb1,
                    name: 'Rare',
                    description:'Rare likelihood',
                    probabilityValue: 0,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: riskProb2,
                    name: 'Unlikely',
                    description:'Unlikely likelihood',
                    probabilityValue: 25,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: riskProb3,
                    name: 'Possible',
                    description:'Possible likelihood',
                    probabilityValue: 50,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: riskProb4,
                    name: 'Likely',
                    description:'Likely to happen',
                    probabilityValue: 75,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: riskProb5,
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
                    _id: riskSev3,
                    name: 'High',
                    description:'High severity of combined impact and probability',
                    severityValue: 99,
                    position: 1,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: riskSev2,
                    name: 'Medium',
                    description:'Medium severity of combined impact and probability',
                    severityValue: 66,
                    position: 2,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: riskSev1,
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
                    _id: ri1Rp5,
                    impact: riskImpact1,
                    probability: riskProb5,
                    severity: riskSev2,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri1Rp4,
                    impact: riskImpact1,
                    probability: riskProb4,
                    severity: riskSev2,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri1Rp3,
                    impact: riskImpact1,
                    probability: riskProb3,
                    severity: riskSev1,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri1Rp2,
                    impact: riskImpact1,
                    probability: riskProb2,
                    severity: riskSev1,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri1Rp1,
                    impact: riskImpact1,
                    probability: riskProb1,
                    severity: riskSev1,
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: ri2Rp5,
                    impact: riskImpact2,
                    probability: riskProb5,
                    severity: riskSev3,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri2Rp4,
                    impact: riskImpact2,
                    probability: riskProb4,
                    severity: riskSev2,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri2Rp3,
                    impact: riskImpact2,
                    probability: riskProb3,
                    severity: riskSev2,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri2Rp2,
                    impact: riskImpact2,
                    probability: riskProb2,
                    severity: riskSev1,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri2Rp1,
                    impact: riskImpact2,
                    probability: riskProb1,
                    severity: riskSev1,
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: ri3Rp5,
                    impact: riskImpact3,
                    probability: riskProb5,
                    severity: riskSev3,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri3Rp4,
                    impact: riskImpact3,
                    probability: riskProb4,
                    severity: riskSev3,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri3Rp3,
                    impact: riskImpact3,
                    probability: riskProb3,
                    severity: riskSev2,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri3Rp2,
                    impact: riskImpact3,
                    probability: riskProb2,
                    severity: riskSev2,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri3Rp1,
                    impact: riskImpact3,
                    probability: riskProb1,
                    severity: riskSev1,
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: ri4Rp5,
                    impact: riskImpact4,
                    probability: riskProb5,
                    severity: riskSev3,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri4Rp4,
                    impact: riskImpact4,
                    probability: riskProb4,
                    severity: riskSev3,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri4Rp3,
                    impact: riskImpact4,
                    probability: riskProb3,
                    severity: riskSev3,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri4Rp2,
                    impact: riskImpact4,
                    probability: riskProb2,
                    severity: riskSev2,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri4Rp1,
                    impact: riskImpact4,
                    probability: riskProb1,
                    severity: riskSev2,
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: ri5Rp5,
                    impact: riskImpact5,
                    probability: riskProb5,
                    severity: riskSev3,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri5Rp4,
                    impact: riskImpact5,
                    probability: riskProb4,
                    severity: riskSev3,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri5Rp3,
                    impact: riskImpact5,
                    probability: riskProb3,
                    severity: riskSev3,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri5Rp2,
                    impact: riskImpact5,
                    probability: riskProb2,
                    severity: riskSev3,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: ri5Rp1,
                    impact: riskImpact5,
                    probability: riskProb1,
                    severity: riskSev2,
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
