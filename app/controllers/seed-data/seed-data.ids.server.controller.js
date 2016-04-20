'use strict';

/**
 * SEED - IDs
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');

exports.getIDs = function(){
    return {
        // Definition
        PortfolioType:{
            pnt1 : mongoose.Types.ObjectId(),
            pnt2 : mongoose.Types.ObjectId(),
            pnt3 : mongoose.Types.ObjectId()
        },
        Portfolio:{
            pn1:mongoose.Types.ObjectId(),
            pn11:mongoose.Types.ObjectId(), pn111:mongoose.Types.ObjectId(), pn112:mongoose.Types.ObjectId(),
            pn12:mongoose.Types.ObjectId(), pn121:mongoose.Types.ObjectId(), pn122:mongoose.Types.ObjectId(),
            pn2:mongoose.Types.ObjectId(),
            pn21:mongoose.Types.ObjectId(), pn211:mongoose.Types.ObjectId(), pn212:mongoose.Types.ObjectId(),
            pn22:mongoose.Types.ObjectId(), pn221:mongoose.Types.ObjectId(), pn222:mongoose.Types.ObjectId(),
            pn3:mongoose.Types.ObjectId(),
            pn31:mongoose.Types.ObjectId(), pn311:mongoose.Types.ObjectId(), pn312:mongoose.Types.ObjectId(),
            pn32:mongoose.Types.ObjectId(), pn321:mongoose.Types.ObjectId(), pn322:mongoose.Types.ObjectId()
        },
        CategoryGroup:{
            cat1 : mongoose.Types.ObjectId(),
            cat2 : mongoose.Types.ObjectId(),
            cat3 : mongoose.Types.ObjectId(),
            cat4 : mongoose.Types.ObjectId()
        },
        Category:{
            cat11 : mongoose.Types.ObjectId(), cat12 : mongoose.Types.ObjectId(), cat13 : mongoose.Types.ObjectId(), cat14 : mongoose.Types.ObjectId(),
            cat21 : mongoose.Types.ObjectId(), cat22 : mongoose.Types.ObjectId(), cat23 : mongoose.Types.ObjectId(),
            cat31 : mongoose.Types.ObjectId(), cat32 : mongoose.Types.ObjectId(),
            cat41 : mongoose.Types.ObjectId(), cat42 : mongoose.Types.ObjectId(), cat43 : mongoose.Types.ObjectId()
        },
        CategoryValue:{
            // Strategic Business Unit
            cat111 : mongoose.Types.ObjectId(), cat112 : mongoose.Types.ObjectId(), cat113 : mongoose.Types.ObjectId(),
            // Product
            cat121 : mongoose.Types.ObjectId(), cat122 : mongoose.Types.ObjectId(), cat123 : mongoose.Types.ObjectId(),
            // Market
            cat131 : mongoose.Types.ObjectId(), cat132 : mongoose.Types.ObjectId(), cat133 : mongoose.Types.ObjectId(),
            // Geography
            cat141 : mongoose.Types.ObjectId(), cat142 : mongoose.Types.ObjectId(), cat143 : mongoose.Types.ObjectId(),
            
            // Business Novelty
            cat211 : mongoose.Types.ObjectId(), cat212 : mongoose.Types.ObjectId(), cat213 : mongoose.Types.ObjectId(),
            // Technology novelty
            cat221 : mongoose.Types.ObjectId(), cat222 : mongoose.Types.ObjectId(), cat223 : mongoose.Types.ObjectId(),
            // Ease of implementation
            cat231 : mongoose.Types.ObjectId(), cat232 : mongoose.Types.ObjectId(), cat233 : mongoose.Types.ObjectId(),
            
            // Technology change
            cat311 : mongoose.Types.ObjectId(), cat312 : mongoose.Types.ObjectId(), cat313 : mongoose.Types.ObjectId(),
            // Business change
            cat321 : mongoose.Types.ObjectId(), cat322 : mongoose.Types.ObjectId(), cat323 : mongoose.Types.ObjectId(), cat324 : mongoose.Types.ObjectId(),
            
            // Delivery process
            cat411 : mongoose.Types.ObjectId(), cat412 : mongoose.Types.ObjectId(), cat413 : mongoose.Types.ObjectId(),
            // Effort size
            cat421 : mongoose.Types.ObjectId(), cat422 : mongoose.Types.ObjectId(), cat423 : mongoose.Types.ObjectId(),
            // Technology type
            cat431 : mongoose.Types.ObjectId(), cat432 : mongoose.Types.ObjectId(), cat433 : mongoose.Types.ObjectId(), cat434 : mongoose.Types.ObjectId()
        },
        // Evaluation
        FinancialCostGroup: {
            cost1 : mongoose.Types.ObjectId(), cost2 : mongoose.Types.ObjectId()
        },
        FinancialCostType: {
            cost11 : mongoose.Types.ObjectId(), cost12 : mongoose.Types.ObjectId(), cost13 : mongoose.Types.ObjectId(),
            cost21 : mongoose.Types.ObjectId(), cost22 : mongoose.Types.ObjectId(), cost23 : mongoose.Types.ObjectId(), cost24 : mongoose.Types.ObjectId(), cost25 : mongoose.Types.ObjectId()
        },
        FinancialBenefitGroup: {
            benefit1 : mongoose.Types.ObjectId(), benefit2 : mongoose.Types.ObjectId(), benefit3 : mongoose.Types.ObjectId()
        },
        FinancialBenefitType: {
            benefit11 : mongoose.Types.ObjectId(), benefit12 : mongoose.Types.ObjectId(), benefit13 : mongoose.Types.ObjectId(),
            benefit21 : mongoose.Types.ObjectId(), benefit22 : mongoose.Types.ObjectId(), benefit23 : mongoose.Types.ObjectId(),
            benefit31 : mongoose.Types.ObjectId(), benefit32 : mongoose.Types.ObjectId()
        },
        DependencyType: {
            dt1 : mongoose.Types.ObjectId(), dt2 : mongoose.Types.ObjectId(), dt3 : mongoose.Types.ObjectId(),
            dt4 : mongoose.Types.ObjectId(), dt5 : mongoose.Types.ObjectId(), dt6 : mongoose.Types.ObjectId(),
            dt7 : mongoose.Types.ObjectId(), dt8 : mongoose.Types.ObjectId(), dt9 : mongoose.Types.ObjectId(),
            dt10 : mongoose.Types.ObjectId(), dt11 : mongoose.Types.ObjectId(), dt12 : mongoose.Types.ObjectId()
        },
        DependencyImpact: {
            di1 : mongoose.Types.ObjectId(), di2 : mongoose.Types.ObjectId(), di3 : mongoose.Types.ObjectId(),
            di4 : mongoose.Types.ObjectId(), di5 : mongoose.Types.ObjectId()
        },
        DependencyState: {
            ds1 : mongoose.Types.ObjectId(), ds2 : mongoose.Types.ObjectId(), ds3 : mongoose.Types.ObjectId(),
            ds4 : mongoose.Types.ObjectId()
        },
        ImprovementReason: {
            reason1 : mongoose.Types.ObjectId(), reason2 : mongoose.Types.ObjectId(), reason3 : mongoose.Types.ObjectId()
        },
        ImprovementState: {
            state1 : mongoose.Types.ObjectId(), state2 : mongoose.Types.ObjectId(), state3 : mongoose.Types.ObjectId(), state4 : mongoose.Types.ObjectId()
        },
        ImprovementType: {
            type1 : mongoose.Types.ObjectId(), type2 : mongoose.Types.ObjectId(), type3 : mongoose.Types.ObjectId(), type4 : mongoose.Types.ObjectId()
        },
        
        // Delivery
        
        
    };
};
