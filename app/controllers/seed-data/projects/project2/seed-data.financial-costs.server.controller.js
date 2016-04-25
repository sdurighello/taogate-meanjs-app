'use strict';

/**
 * SEED - FINANCIAL COSTS
 */

var _ = require('lodash'),
    errorHandler = require('../../../errors.server.controller.js'),
    mongoose = require('mongoose'),
    async = require('async'),
    seedIDs = require('./../../seed-data.ids.server.controller.js').getIDs(),
    seedIDsProject = require('./seed-data.ids-project.server.controller.js').getIDs(),
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

exports.seedFinancialCosts = function(user, callback){

    var FinancialCost = mongoose.mtModel(user.tenantId + '.' + 'FinancialCost');


    // ------ COSTS CATEGORIES & TYPES------

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

    // --------- PROJECT COSTS ----------

    var project1Cost1 = seedIDsProject.FinancialCost.project1Cost1;
    var project1Cost2 = seedIDsProject.FinancialCost.project1Cost2;
    var project1Cost3 = seedIDsProject.FinancialCost.project1Cost3;
    var project1Cost4 = seedIDsProject.FinancialCost.project1Cost4;
    var project1Cost5 = seedIDsProject.FinancialCost.project1Cost5;
    var project1Cost6 = seedIDsProject.FinancialCost.project1Cost6;
    var project1Cost7 = seedIDsProject.FinancialCost.project1Cost7;
    var project1Cost8 = seedIDsProject.FinancialCost.project1Cost8;
    var project1Cost9 = seedIDsProject.FinancialCost.project1Cost9;
    var project1Cost10 = seedIDsProject.FinancialCost.project1Cost10;
    var project1Cost11 = seedIDsProject.FinancialCost.project1Cost11;
    var project1Cost12 = seedIDsProject.FinancialCost.project1Cost12;
    var project1Cost13 = seedIDsProject.FinancialCost.project1Cost13;
    var project1Cost14 = seedIDsProject.FinancialCost.project1Cost14;
    var project1Cost15 = seedIDsProject.FinancialCost.project1Cost15;
    var project1Cost16 = seedIDsProject.FinancialCost.project1Cost16;

    var seedArrayProject1 =  [
        // Opex
        {
            _id: project1Cost1,
            group: cost2,
            type: cost21,
            name: 'GForce cloud platform access',
            year: 2015,
            amount: 10000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Cost2,
            group: cost2,
            type: cost21,
            name: 'Netbox suite licences',
            year: 2015,
            amount: 10000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Cost3,
            group: cost2,
            type: cost22,
            name: 'Developers and designers staff',
            year: 2015,
            amount: 10000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Cost4,
            group: cost2,
            type: cost22,
            name: 'Test team headcount increase',
            year: 2015,
            amount: 10000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Cost5,
            group: cost2,
            type: cost23,
            name: 'Design agency services',
            year: 2015,
            amount: 10000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Cost6,
            group: cost2,
            type: cost24,
            name: 'Big 4 expensive advice',
            year: 2015,
            amount: 10000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Cost7,
            group: cost2,
            type: cost25,
            name: 'Outsourced call center service',
            year: 2015,
            amount: 100000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Cost8,
            group: cost2,
            type: cost25,
            name: 'Outsourced server support service',
            year: 2015,
            amount: 100000,
            user:user._id,
            created: Date.now()
        },
        // Capex
        {
            _id: project1Cost9,
            group: cost1,
            type: cost11,
            name: 'Arduino server clusters',
            year: 2015,
            amount: 50000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Cost10,
            group: cost1,
            type: cost11,
            name: 'Load balancer machine',
            year: 2016,
            amount: 10000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Cost11,
            group: cost1,
            type: cost11,
            name: 'Data center materials',
            year: 2017,
            amount: 20000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Cost12,
            group: cost1,
            type: cost12,
            name: 'Routers and connectivity',
            year: 2018,
            amount: 20000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Cost13,
            group: cost1,
            type: cost12,
            name: 'Network optimizer equipment',
            year: 2019,
            amount: 20000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Cost14,
            group: cost1,
            type: cost12,
            name: 'CPE dashboard panel',
            year: 2019,
            amount: 90000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Cost15,
            group: cost1,
            type: cost13,
            name: 'Office extension',
            year: 2020,
            amount: 20000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Cost16,
            group: cost1,
            type: cost13,
            name: 'Meeting room furniture',
            year: 2021,
            amount: 20000,
            user:user._id,
            created: Date.now()
        }
    ];

    createObjects(FinancialCost, 'FinancialCost', seedArrayProject1, callback);
};
