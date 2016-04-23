'use strict';

/**
 * SEED - FINANCIAL BENEFITS
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

exports.seedFinancialBenefits = function(user, callback){

    var FinancialBenefit = mongoose.mtModel(user.tenantId + '.' + 'FinancialBenefit');


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

    // --------- PROJECT BENEFITS ----------

    var project1Benefit1 = seedIDs.FinancialBenefit.project1Benefit1;
    var project1Benefit2 = seedIDs.FinancialBenefit.project1Benefit2;
    var project1Benefit3 = seedIDs.FinancialBenefit.project1Benefit3;
    var project1Benefit4 = seedIDs.FinancialBenefit.project1Benefit4;
    var project1Benefit5 = seedIDs.FinancialBenefit.project1Benefit5;
    var project1Benefit6 = seedIDs.FinancialBenefit.project1Benefit6;
    var project1Benefit7 = seedIDs.FinancialBenefit.project1Benefit7;
    var project1Benefit8 = seedIDs.FinancialBenefit.project1Benefit8;
    var project1Benefit9 = seedIDs.FinancialBenefit.project1Benefit9;
    var project1Benefit10 = seedIDs.FinancialBenefit.project1Benefit10;
    var project1Benefit11 = seedIDs.FinancialBenefit.project1Benefit11;
    var project1Benefit12 = seedIDs.FinancialBenefit.project1Benefit12;


    var seedArrayProject1 =  [
        // Revenue increase
        {
            _id: project1Benefit1,
            group: benefit1,
            type: benefit11,
            name: 'Increase registrations from revised copywriting',
            year: 2015,
            amount: 10000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Benefit2,
            group: benefit1,
            type: benefit12,
            name: 'New subscription parameters',
            year: 2016,
            amount: 60000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Benefit3,
            group: benefit1,
            type: benefit13,
            name: 'Double sales force literature',
            year: 2016,
            amount: 30000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Benefit4,
            group: benefit1,
            type: benefit13,
            name: 'Improved on-boarding process',
            year: 2017,
            amount: 10000,
            user:user._id,
            created: Date.now()
        },
        // Cost reduction
        {
            _id: project1Benefit5,
            group: benefit2,
            type: benefit21,
            name: 'Team headcount reduction',
            year: 2017,
            amount: 140000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Benefit6,
            group: benefit2,
            type: benefit22,
            name: 'Double phone followup per day',
            year: 2018,
            amount: 10000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Benefit7,
            group: benefit2,
            type: benefit23,
            name: 'Reduced handover contract time',
            year: 2018,
            amount: 120000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Benefit8,
            group: benefit2,
            type: benefit22,
            name: 'One time manual entry',
            year: 2019,
            amount: 10000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Benefit9,
            group: benefit2,
            type: benefit23,
            name: 'Centralized marketing kit',
            year: 2020,
            amount: 10000,
            user:user._id,
            created: Date.now()
        },
        // Intangible benefit
        {
            _id: project1Benefit10,
            group: benefit3,
            type: benefit31,
            name: 'More trials from campaigns',
            year: 2020,
            amount: 170000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Benefit11,
            group: benefit3,
            type: benefit32,
            name: 'Regulatory fines avoided',
            year: 2021,
            amount: 10000,
            user:user._id,
            created: Date.now()
        },
        {
            _id: project1Benefit12,
            group: benefit3,
            type: benefit32,
            name: 'Optimization legal department',
            year: 2021,
            amount: 210000,
            user:user._id,
            created: Date.now()
        }
    ];

    var project2Benefit1 = seedIDs.FinancialBenefit.project2Benefit1;
    var project2Benefit2 = seedIDs.FinancialBenefit.project2Benefit2;
    var project2Benefit3 = seedIDs.FinancialBenefit.project2Benefit3;
    var project2Benefit4 = seedIDs.FinancialBenefit.project2Benefit4;
    var project2Benefit5 = seedIDs.FinancialBenefit.project2Benefit5;
    var project2Benefit6 = seedIDs.FinancialBenefit.project2Benefit6;
    var project2Benefit7 = seedIDs.FinancialBenefit.project2Benefit7;
    var project2Benefit8 = seedIDs.FinancialBenefit.project2Benefit8;
    var project2Benefit9 = seedIDs.FinancialBenefit.project2Benefit9;
    var project2Benefit10 = seedIDs.FinancialBenefit.project2Benefit10;
    var project2Benefit11 = seedIDs.FinancialBenefit.project2Benefit11;
    var project2Benefit12 = seedIDs.FinancialBenefit.project2Benefit12;




    // ---------------------------------


    async.parallel([
        // Benefits for Project1
        function(callback) {
            createObjects(FinancialBenefit, 'Benefits for project 1', seedArrayProject1, callback);
        },
        // Benefits for Project2
        function(callback) {

            callback(null);
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
