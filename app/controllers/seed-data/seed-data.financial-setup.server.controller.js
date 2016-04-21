'use strict';

/**
 * SEED - COSTS & BENEFITS SETUP
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

exports.seedFinancials = function(user, callback){

    // ------ COSTS ------

// Capex
    var cost1 = seedIDs.FinancialCostGroup.cost1;

    var cost11 = seedIDs.FinancialCostType.cost11; // Hardware
    var cost12 = seedIDs.FinancialCostType.cost12; // Network equipment
    var cost13 = seedIDs.FinancialCostType.cost13; // Property

// Opex
    var cost2 = seedIDs.FinancialCostGroup.cost2;

    var cost21 = seedIDs.FinancialCostType.cost21; // Software licences
    var cost22 = seedIDs.FinancialCostType.cost22; // Internal labour
    var cost23 = seedIDs.FinancialCostType.cost23; // External contractors
    var cost24 = seedIDs.FinancialCostType.cost24; // Consulting services
    var cost25 = seedIDs.FinancialCostType.cost25; // External support and maintenance services

    // ------ BENEFITS ------


// Revenue increase
    var benefit1 = seedIDs.FinancialBenefitGroup.benefit1;

    var benefit11 = seedIDs.FinancialBenefitType.benefit11; // Higher leads conversion rates
    var benefit12 = seedIDs.FinancialBenefitType.benefit12; // Churn reduction
    var benefit13 = seedIDs.FinancialBenefitType.benefit13; // Sales increase

// Cost reduction
    var benefit2 = seedIDs.FinancialBenefitGroup.benefit2;

    var benefit21 = seedIDs.FinancialBenefitType.benefit21; // Staff efficiency increase
    var benefit22 = seedIDs.FinancialBenefitType.benefit22; // Externalization
    var benefit23 = seedIDs.FinancialBenefitType.benefit23; // Supplier cost reduction

// Intangible benefit
    var benefit3 = seedIDs.FinancialBenefitGroup.benefit3;

    var benefit31 = seedIDs.FinancialBenefitType.benefit31; // Increased brand awareness
    var benefit32 = seedIDs.FinancialBenefitType.benefit32; // Achieved regulatory compliance


    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'FinancialCostGroup');
            var seedArray =  [
                {
                    _id: cost1,
                    name: 'CAPEX',
                    description:'Funds or assumption of a liability in order to obtain physical assets ' +
                    'that are to be used for productive purposes for at least one year',
                    costTypes: [cost11, cost12, cost13],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cost2,
                    name: 'OPEX',
                    description:'Expenses that are fully tax-deductible in the year they are made, ' +
                    'incurred as a result of performing normal business operations',
                    costTypes: [cost21, cost22, cost23, cost24, cost25],
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'FinancialCostGroup', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'FinancialCostType');
            var seedArray =  [
                {
                    _id: cost11,
                    name: 'Hardware',
                    description:'Hardware',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cost12,
                    name: 'Network equipment',
                    description:'Network equipment',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cost13,
                    name: 'Property',
                    description:'Property',
                    user:user._id,
                    created: Date.now()
                },
                // --
                {
                    _id: cost21,
                    name: 'Software licences',
                    description:'Software licences',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cost22,
                    name: 'Internal labour',
                    description:'Internal labour',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cost23,
                    name: 'External contractors',
                    description:'External contractors',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cost24,
                    name: 'Consulting services',
                    description:'Consulting services',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cost25,
                    name: 'External support and maintenance services',
                    description:'External support and maintenance services',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'FinancialCostType', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'FinancialBenefitGroup');
            var seedArray =  [
                {
                    _id: benefit1,
                    name: 'Revenue increase',
                    description:'Revenue increase',
                    benefitTypes: [benefit11, benefit12, benefit13],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: benefit2,
                    name: 'Churn reduction',
                    description:'Churn reduction',
                    benefitTypes: [benefit21, benefit22, benefit23],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: benefit3,
                    name: 'Intangible benefit',
                    description:'Intangible benefit',
                    benefitTypes: [benefit31, benefit32],
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'FinancialBenefitGroup', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'FinancialBenefitType');
            var seedArray =  [
                {
                    _id: benefit11,
                    name: 'Higher leads conversion rates',
                    description:'Higher leads conversion rates',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: benefit12,
                    name: 'Churn reduction',
                    description:'Churn reduction',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: benefit13,
                    name: 'Sales increase',
                    description:'Sales increase',
                    user:user._id,
                    created: Date.now()
                },
                // --
                {
                    _id: benefit21,
                    name: 'Staff efficiency increase',
                    description:'Staff efficiency increase',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: benefit22,
                    name: 'Externalization',
                    description:'Externalization',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: benefit23,
                    name: 'Supplier cost reduction',
                    description:'Supplier cost reduction',
                    user:user._id,
                    created: Date.now()
                },
                // --
                {
                    _id: benefit31,
                    name: 'Increased brand awareness',
                    description:'Increased brand awareness',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: benefit32,
                    name: 'Achieved regulatory compliance',
                    description:'Achieved regulatory compliance',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'FinancialBenefitType', seedArray, callback);
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
