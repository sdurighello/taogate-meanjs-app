'use strict';

/**
 * SEED - IDs PROJECT DATA
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');



var idObject = {

    // -----------------------------------------  DEFINITION  ----------------------------------------------


    // Projects identification
    Project: {
        project1: mongoose.Types.ObjectId()
    },

    // -----------------------------------------  EVALUATION  ----------------------------------------------

    // Project costs
    FinancialCost: {
        project1Cost1: mongoose.Types.ObjectId(), project1Cost2: mongoose.Types.ObjectId(), project1Cost3: mongoose.Types.ObjectId(),
        project1Cost4: mongoose.Types.ObjectId(), project1Cost5: mongoose.Types.ObjectId(), project1Cost6: mongoose.Types.ObjectId(),
        project1Cost7: mongoose.Types.ObjectId(), project1Cost8: mongoose.Types.ObjectId(), project1Cost9: mongoose.Types.ObjectId(),
        project1Cost10: mongoose.Types.ObjectId(), project1Cost11: mongoose.Types.ObjectId(), project1Cost12: mongoose.Types.ObjectId(),
        project1Cost13: mongoose.Types.ObjectId(), project1Cost14: mongoose.Types.ObjectId(), project1Cost15: mongoose.Types.ObjectId(),
        project1Cost16: mongoose.Types.ObjectId()
    },

    // Project benefits
    FinancialBenefit: {
        project1Benefit1: mongoose.Types.ObjectId(), project1Benefit2: mongoose.Types.ObjectId(), project1Benefit3: mongoose.Types.ObjectId(),
        project1Benefit4: mongoose.Types.ObjectId(), project1Benefit5: mongoose.Types.ObjectId(), project1Benefit6: mongoose.Types.ObjectId(),
        project1Benefit7: mongoose.Types.ObjectId(), project1Benefit8: mongoose.Types.ObjectId(), project1Benefit9: mongoose.Types.ObjectId(),
        project1Benefit10: mongoose.Types.ObjectId(), project1Benefit11: mongoose.Types.ObjectId(), project1Benefit12: mongoose.Types.ObjectId()
    },

    // -----------------------------------------  DELIVERY  ----------------------------------------------

    // Delivery data
    GateStatusAssignment: {
        // Project1 - Waterfall (w1)
        p1gw11Status: mongoose.Types.ObjectId(), p1gw12Status: mongoose.Types.ObjectId(), p1gw13Status: mongoose.Types.ObjectId(),
        p1gw14Status: mongoose.Types.ObjectId(), p1gw15Status: mongoose.Types.ObjectId(), p1gw16Status: mongoose.Types.ObjectId()
    },
    GateOutcomeReview: {
        // Project1 - Waterfall (w1)
        p1gw11Out1: mongoose.Types.ObjectId(), p1gw11Out2: mongoose.Types.ObjectId(), p1gw11Out3: mongoose.Types.ObjectId(), p1gw11Out4: mongoose.Types.ObjectId(),
        p1gw12Out1: mongoose.Types.ObjectId(), p1gw12Out2: mongoose.Types.ObjectId(), p1gw12Out3: mongoose.Types.ObjectId(),
        p1gw13Out1: mongoose.Types.ObjectId(), p1gw13Out2: mongoose.Types.ObjectId(), p1gw13Out3: mongoose.Types.ObjectId(), p1gw13Out4: mongoose.Types.ObjectId(), p1gw13Out5: mongoose.Types.ObjectId(),
        p1gw14Out1: mongoose.Types.ObjectId(), p1gw14Out2: mongoose.Types.ObjectId(), p1gw14Out3: mongoose.Types.ObjectId(), p1gw14Out4: mongoose.Types.ObjectId(),
        p1gw15Out1: mongoose.Types.ObjectId(), p1gw15Out2: mongoose.Types.ObjectId(), p1gw15Out3: mongoose.Types.ObjectId(), p1gw15Out4: mongoose.Types.ObjectId(),
        p1gw16Out1: mongoose.Types.ObjectId(), p1gw16Out2: mongoose.Types.ObjectId(), p1gw16Out3: mongoose.Types.ObjectId(), p1gw16Out4: mongoose.Types.ObjectId()
    },
    ProjectAreaReview: {
        // Project1 - Waterfall (w1)
        p1gw11Area1: mongoose.Types.ObjectId(), p1gw11Area2: mongoose.Types.ObjectId(), p1gw11Area3: mongoose.Types.ObjectId(),
        p1gw12Area1: mongoose.Types.ObjectId(), p1gw12Area2: mongoose.Types.ObjectId(), p1gw12Area3: mongoose.Types.ObjectId(),
        p1gw13Area1: mongoose.Types.ObjectId(), p1gw13Area2: mongoose.Types.ObjectId(), p1gw13Area3: mongoose.Types.ObjectId(),
        p1gw14Area1: mongoose.Types.ObjectId(), p1gw14Area2: mongoose.Types.ObjectId(), p1gw14Area3: mongoose.Types.ObjectId(),
        p1gw15Area1: mongoose.Types.ObjectId(), p1gw15Area2: mongoose.Types.ObjectId(), p1gw15Area3: mongoose.Types.ObjectId(),
        p1gw16Area1: mongoose.Types.ObjectId(), p1gw16Area2: mongoose.Types.ObjectId(), p1gw16Area3: mongoose.Types.ObjectId()
    },
    
    BaselineDuration: {
        // Project1 - Waterfall (w1)
        basDur1Sw11Tw11: mongoose.Types.ObjectId(), basDur1Sw11Tw12: mongoose.Types.ObjectId(), basDur1Sw11Tw13: mongoose.Types.ObjectId(), basDur1Sw11Tw14: mongoose.Types.ObjectId(), basDur1Sw11Tw15: mongoose.Types.ObjectId(), basDur1Sw11Tw16: mongoose.Types.ObjectId(),
        basDur1Sw12Tw12: mongoose.Types.ObjectId(), basDur1Sw12Tw13: mongoose.Types.ObjectId(), basDur1Sw12Tw14: mongoose.Types.ObjectId(), basDur1Sw12Tw15: mongoose.Types.ObjectId(), basDur1Sw12Tw16: mongoose.Types.ObjectId(),
        basDur1Sw13Tw13: mongoose.Types.ObjectId(), basDur1Sw13Tw14: mongoose.Types.ObjectId(), basDur1Sw13Tw15: mongoose.Types.ObjectId(), basDur1Sw13Tw16: mongoose.Types.ObjectId(),
        basDur1Sw14Tw14: mongoose.Types.ObjectId(), basDur1Sw14Tw15: mongoose.Types.ObjectId(), basDur1Sw14Tw16: mongoose.Types.ObjectId(),
        basDur1Sw15Tw15: mongoose.Types.ObjectId(), basDur1Sw15Tw16: mongoose.Types.ObjectId(),
        basDur1Sw16Tw16: mongoose.Types.ObjectId()
    },
    BaselineCost: {
        // Project1 - Waterfall (w1)
        basCost1Sw11Tw11: mongoose.Types.ObjectId(), basCost1Sw11Tw12: mongoose.Types.ObjectId(), basCost1Sw11Tw13: mongoose.Types.ObjectId(), basCost1Sw11Tw14: mongoose.Types.ObjectId(), basCost1Sw11Tw15: mongoose.Types.ObjectId(), basCost1Sw11Tw16: mongoose.Types.ObjectId(),
        basCost1Sw12Tw12: mongoose.Types.ObjectId(), basCost1Sw12Tw13: mongoose.Types.ObjectId(), basCost1Sw12Tw14: mongoose.Types.ObjectId(), basCost1Sw12Tw15: mongoose.Types.ObjectId(), basCost1Sw12Tw16: mongoose.Types.ObjectId(),
        basCost1Sw13Tw13: mongoose.Types.ObjectId(), basCost1Sw13Tw14: mongoose.Types.ObjectId(), basCost1Sw13Tw15: mongoose.Types.ObjectId(), basCost1Sw13Tw16: mongoose.Types.ObjectId(),
        basCost1Sw14Tw14: mongoose.Types.ObjectId(), basCost1Sw14Tw15: mongoose.Types.ObjectId(), basCost1Sw14Tw16: mongoose.Types.ObjectId(),
        basCost1Sw15Tw15: mongoose.Types.ObjectId(), basCost1Sw15Tw16: mongoose.Types.ObjectId(),
        basCost1Sw16Tw16: mongoose.Types.ObjectId()
    },
    BaselineCompletion: {
        // Project1 - Waterfall (w1)
        basComp1Sw11Tw11: mongoose.Types.ObjectId(), basComp1Sw11Tw12: mongoose.Types.ObjectId(), basComp1Sw11Tw13: mongoose.Types.ObjectId(), basComp1Sw11Tw14: mongoose.Types.ObjectId(), basComp1Sw11Tw15: mongoose.Types.ObjectId(), basComp1Sw11Tw16: mongoose.Types.ObjectId(),
        basComp1Sw12Tw12: mongoose.Types.ObjectId(), basComp1Sw12Tw13: mongoose.Types.ObjectId(), basComp1Sw12Tw14: mongoose.Types.ObjectId(), basComp1Sw12Tw15: mongoose.Types.ObjectId(), basComp1Sw12Tw16: mongoose.Types.ObjectId(),
        basComp1Sw13Tw13: mongoose.Types.ObjectId(), basComp1Sw13Tw14: mongoose.Types.ObjectId(), basComp1Sw13Tw15: mongoose.Types.ObjectId(), basComp1Sw13Tw16: mongoose.Types.ObjectId(),
        basComp1Sw14Tw14: mongoose.Types.ObjectId(), basComp1Sw14Tw15: mongoose.Types.ObjectId(), basComp1Sw14Tw16: mongoose.Types.ObjectId(),
        basComp1Sw15Tw15: mongoose.Types.ObjectId(), basComp1Sw15Tw16: mongoose.Types.ObjectId(),
        basComp1Sw16Tw16: mongoose.Types.ObjectId()
    },

    EstimateDuration: {
        // Project1 - Waterfall (w1)
        estDur1Sw11Tw11: mongoose.Types.ObjectId(), estDur1Sw11Tw12: mongoose.Types.ObjectId(), estDur1Sw11Tw13: mongoose.Types.ObjectId(), estDur1Sw11Tw14: mongoose.Types.ObjectId(), estDur1Sw11Tw15: mongoose.Types.ObjectId(), estDur1Sw11Tw16: mongoose.Types.ObjectId(),
        estDur1Sw12Tw12: mongoose.Types.ObjectId(), estDur1Sw12Tw13: mongoose.Types.ObjectId(), estDur1Sw12Tw14: mongoose.Types.ObjectId(), estDur1Sw12Tw15: mongoose.Types.ObjectId(), estDur1Sw12Tw16: mongoose.Types.ObjectId(),
        estDur1Sw13Tw13: mongoose.Types.ObjectId(), estDur1Sw13Tw14: mongoose.Types.ObjectId(), estDur1Sw13Tw15: mongoose.Types.ObjectId(), estDur1Sw13Tw16: mongoose.Types.ObjectId(),
        estDur1Sw14Tw14: mongoose.Types.ObjectId(), estDur1Sw14Tw15: mongoose.Types.ObjectId(), estDur1Sw14Tw16: mongoose.Types.ObjectId(),
        estDur1Sw15Tw15: mongoose.Types.ObjectId(), estDur1Sw15Tw16: mongoose.Types.ObjectId(),
        estDur1Sw16Tw16: mongoose.Types.ObjectId()
    },
    EstimateCost: {
        // Project1 - Waterfall (w1)
        estCost1Sw11Tw11: mongoose.Types.ObjectId(), estCost1Sw11Tw12: mongoose.Types.ObjectId(), estCost1Sw11Tw13: mongoose.Types.ObjectId(), estCost1Sw11Tw14: mongoose.Types.ObjectId(), estCost1Sw11Tw15: mongoose.Types.ObjectId(), estCost1Sw11Tw16: mongoose.Types.ObjectId(),
        estCost1Sw12Tw12: mongoose.Types.ObjectId(), estCost1Sw12Tw13: mongoose.Types.ObjectId(), estCost1Sw12Tw14: mongoose.Types.ObjectId(), estCost1Sw12Tw15: mongoose.Types.ObjectId(), estCost1Sw12Tw16: mongoose.Types.ObjectId(),
        estCost1Sw13Tw13: mongoose.Types.ObjectId(), estCost1Sw13Tw14: mongoose.Types.ObjectId(), estCost1Sw13Tw15: mongoose.Types.ObjectId(), estCost1Sw13Tw16: mongoose.Types.ObjectId(),
        estCost1Sw14Tw14: mongoose.Types.ObjectId(), estCost1Sw14Tw15: mongoose.Types.ObjectId(), estCost1Sw14Tw16: mongoose.Types.ObjectId(),
        estCost1Sw15Tw15: mongoose.Types.ObjectId(), estCost1Sw15Tw16: mongoose.Types.ObjectId(),
        estCost1Sw16Tw16: mongoose.Types.ObjectId()
    },
    EstimateCompletion: {
        // Project1 - Waterfall (w1)
        estComp1Sw11Tw11: mongoose.Types.ObjectId(), estComp1Sw11Tw12: mongoose.Types.ObjectId(), estComp1Sw11Tw13: mongoose.Types.ObjectId(), estComp1Sw11Tw14: mongoose.Types.ObjectId(), estComp1Sw11Tw15: mongoose.Types.ObjectId(), estComp1Sw11Tw16: mongoose.Types.ObjectId(),
        estComp1Sw12Tw12: mongoose.Types.ObjectId(), estComp1Sw12Tw13: mongoose.Types.ObjectId(), estComp1Sw12Tw14: mongoose.Types.ObjectId(), estComp1Sw12Tw15: mongoose.Types.ObjectId(), estComp1Sw12Tw16: mongoose.Types.ObjectId(),
        estComp1Sw13Tw13: mongoose.Types.ObjectId(), estComp1Sw13Tw14: mongoose.Types.ObjectId(), estComp1Sw13Tw15: mongoose.Types.ObjectId(), estComp1Sw13Tw16: mongoose.Types.ObjectId(),
        estComp1Sw14Tw14: mongoose.Types.ObjectId(), estComp1Sw14Tw15: mongoose.Types.ObjectId(), estComp1Sw14Tw16: mongoose.Types.ObjectId(),
        estComp1Sw15Tw15: mongoose.Types.ObjectId(), estComp1Sw15Tw16: mongoose.Types.ObjectId(),
        estComp1Sw16Tw16: mongoose.Types.ObjectId()
    },

    ActualDuration: {
        // Project1 - Waterfall (w1)
        actDur1Sw11Tw11: mongoose.Types.ObjectId(), 
        actDur1Sw12Tw12: mongoose.Types.ObjectId(),
        actDur1Sw13Tw13: mongoose.Types.ObjectId(), 
        actDur1Sw14Tw14: mongoose.Types.ObjectId(), 
        actDur1Sw15Tw15: mongoose.Types.ObjectId(), 
        actDur1Sw16Tw16: mongoose.Types.ObjectId()
    },
    ActualCost: {
        // Project1 - Waterfall (w1)
        actCost1Sw11Tw11: mongoose.Types.ObjectId(), 
        actCost1Sw12Tw12: mongoose.Types.ObjectId(), 
        actCost1Sw13Tw13: mongoose.Types.ObjectId(), 
        actCost1Sw14Tw14: mongoose.Types.ObjectId(), 
        actCost1Sw15Tw15: mongoose.Types.ObjectId(), 
        actCost1Sw16Tw16: mongoose.Types.ObjectId()
    },
    ActualCompletion: {
        // Project1 - Waterfall (w1)
        actComp1Sw11Tw11: mongoose.Types.ObjectId(),  
        actComp1Sw12Tw12: mongoose.Types.ObjectId(), 
        actComp1Sw13Tw13: mongoose.Types.ObjectId(), 
        actComp1Sw14Tw14: mongoose.Types.ObjectId(), 
        actComp1Sw15Tw15: mongoose.Types.ObjectId(), 
        actComp1Sw16Tw16: mongoose.Types.ObjectId()
    },
    
    GateReview: {
        gReviewP1w11: mongoose.Types.ObjectId(), gReviewP1w12: mongoose.Types.ObjectId(), gReviewP1w13: mongoose.Types.ObjectId(),
        gReviewP1w14: mongoose.Types.ObjectId(), gReviewP1w15: mongoose.Types.ObjectId(), gReviewP1w16: mongoose.Types.ObjectId()
    },
    
    ProjectStatusUpdate: {
        statusP1w11: mongoose.Types.ObjectId(), statusP1w12: mongoose.Types.ObjectId(), statusP1w13: mongoose.Types.ObjectId(),
        statusP1w14: mongoose.Types.ObjectId(), statusP1w15: mongoose.Types.ObjectId(), statusP1w16: mongoose.Types.ObjectId()
    }
};

exports.getIDs = function(){
    return idObject;
};
