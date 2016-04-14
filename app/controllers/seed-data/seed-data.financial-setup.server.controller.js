'use strict';

/**
 * SEED - COSTS & BENEFITS SETUP
 */

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');


// ------ COSTS ------

// Capex
var cost1 = mongoose.Types.ObjectId();

var cost11 = mongoose.Types.ObjectId(); // Hardware
var cost12 = mongoose.Types.ObjectId(); // Network equipment
var cost13 = mongoose.Types.ObjectId(); // Property

// Opex
var cost2 = mongoose.Types.ObjectId();

var cost21 = mongoose.Types.ObjectId(); // Software licences
var cost22 = mongoose.Types.ObjectId(); // Internal labour
var cost23 = mongoose.Types.ObjectId(); // External contractors
var cost24 = mongoose.Types.ObjectId(); // Consulting services
var cost25 = mongoose.Types.ObjectId(); // External support and maintenance services


exports.getFinancialCostGroups = function(req){
    return [
        {
            _id: cost1,
            name: 'CAPEX',
            description:'Funds or assumption of a liability in order to obtain physical assets ' +
            'that are to be used for productive purposes for at least one year',
            costTypes: [cost11, cost12, cost13],
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: cost2,
            name: 'OPEX',
            description:'Expenses that are fully tax-deductible in the year they are made, ' +
            'incurred as a result of performing normal business operations',
            costTypes: [cost21, cost22, cost23, cost24, cost25],
            user:req.user._id,
            created: Date.now()
        }
    ];
};

exports.getFinancialCostTypes = function(req){
    return [
        {
            _id: cost11,
            name: 'Hardware',
            description:'Hardware',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: cost12,
            name: 'Network equipment',
            description:'Network equipment',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: cost13,
            name: 'Property',
            description:'Property',
            user:req.user._id,
            created: Date.now()
        },
        // --
        {
            _id: cost21,
            name: 'Software licences',
            description:'Software licences',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: cost22,
            name: 'Internal labour',
            description:'Internal labour',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: cost23,
            name: 'External contractors',
            description:'External contractors',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: cost24,
            name: 'Consulting services',
            description:'Consulting services',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: cost25,
            name: 'External support and maintenance services',
            description:'External support and maintenance services',
            user:req.user._id,
            created: Date.now()
        }
    ];
};


// ------ BENEFITS ------


// Revenue increase
var benefit1 = mongoose.Types.ObjectId();

var benefit11 = mongoose.Types.ObjectId(); // Higher leads conversion rates
var benefit12 = mongoose.Types.ObjectId(); // Churn reduction
var benefit13 = mongoose.Types.ObjectId(); // Sales increase

// Cost reduction
var benefit2 = mongoose.Types.ObjectId();

var benefit21 = mongoose.Types.ObjectId(); // Staff efficiency increase
var benefit22 = mongoose.Types.ObjectId(); // Externalization
var benefit23 = mongoose.Types.ObjectId(); // Supplier cost reduction

// Intangible benefit
var benefit3 = mongoose.Types.ObjectId();

var benefit31 = mongoose.Types.ObjectId(); // Increased brand awareness
var benefit32 = mongoose.Types.ObjectId(); // Achieved regulatory compliance


exports.getFinancialBenefitGroups = function(req){
    return [
        {
            _id: benefit1,
            name: 'Revenue increase',
            description:'Revenue increase',
            benefitTypes: [benefit11, benefit12, benefit13],
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: benefit2,
            name: 'Churn reduction',
            description:'Churn reduction',
            benefitTypes: [benefit21, benefit22, benefit23],
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: benefit3,
            name: 'Intangible benefit',
            description:'Intangible benefit',
            benefitTypes: [benefit31, benefit32],
            user:req.user._id,
            created: Date.now()
        }
    ];
};


exports.getFinancialBenefitTypes = function(req){
    return [
        {
            _id: benefit11,
            name: 'Higher leads conversion rates',
            description:'Higher leads conversion rates',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: benefit12,
            name: 'Churn reduction',
            description:'Churn reduction',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: benefit13,
            name: 'Sales increase',
            description:'Sales increase',
            user:req.user._id,
            created: Date.now()
        },
        // --
        {
            _id: benefit21,
            name: 'Staff efficiency increase',
            description:'Staff efficiency increase',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: benefit22,
            name: 'Externalization',
            description:'Externalization',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: benefit23,
            name: 'Supplier cost reduction',
            description:'Supplier cost reduction',
            user:req.user._id,
            created: Date.now()
        },
        // --
        {
            _id: benefit31,
            name: 'Increased brand awareness',
            description:'Increased brand awareness',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: benefit32,
            name: 'Achieved regulatory compliance',
            description:'Achieved regulatory compliance',
            user:req.user._id,
            created: Date.now()
        }
    ];
};
