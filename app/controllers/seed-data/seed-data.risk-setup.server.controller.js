'use strict';

/**
 * SEED - RISK SETUP
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
    var r1 = mongoose.Types.ObjectId();

    var r11 = mongoose.Types.ObjectId(); // Poor product quality
    var r12 = mongoose.Types.ObjectId(); // Supplier failure
    var r13 = mongoose.Types.ObjectId(); // Lack of staff or skills

// Financial
    var r2 = mongoose.Types.ObjectId();

    var r21 = mongoose.Types.ObjectId(); // Cost overrun
    var r22 = mongoose.Types.ObjectId(); // Increased cost variability
    var r23 = mongoose.Types.ObjectId(); // Increased capex/opex ratio

// Technology
    var r3 = mongoose.Types.ObjectId();

    var r31 = mongoose.Types.ObjectId(); // Technology aging
    var r32 = mongoose.Types.ObjectId(); // Platform instability
    var r33 = mongoose.Types.ObjectId(); // Impacts on other systems

// Operational
    var r4 = mongoose.Types.ObjectId();

    var r41 = mongoose.Types.ObjectId(); // Impaired support and maintenance
    var r42 = mongoose.Types.ObjectId(); // Difficult business adoption
    var r43 = mongoose.Types.ObjectId(); // Business process failure

// Market
    var r5 = mongoose.Types.ObjectId();

    var r51 = mongoose.Types.ObjectId(); // Poor market reception
    var r52 = mongoose.Types.ObjectId(); // Impact on Partner relationships
    var r53 = mongoose.Types.ObjectId(); // Reaction from competition

// Legal
    var r6 = mongoose.Types.ObjectId();

    var r61 = mongoose.Types.ObjectId(); // Regulatory breach
    var r62 = mongoose.Types.ObjectId(); // Exposure to lawsuit loss

// Impacts

    var incidental = mongoose.Types.ObjectId();
    var minor = mongoose.Types.ObjectId();
    var moderate = mongoose.Types.ObjectId();
    var major = mongoose.Types.ObjectId();
    var extreme = mongoose.Types.ObjectId();

// Probabilities

    var rare = mongoose.Types.ObjectId();
    var unlikely = mongoose.Types.ObjectId();
    var possible = mongoose.Types.ObjectId();
    var likely = mongoose.Types.ObjectId();
    var frequent = mongoose.Types.ObjectId();

// Severities

    var low = mongoose.Types.ObjectId();
    var medium = mongoose.Types.ObjectId();
    var high = mongoose.Types.ObjectId();

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
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
