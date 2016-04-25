'use strict';

/**
 * SEED - ACTUAL DURATIONS
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

exports.seedActualDurations = function(user, callback){

    var GateReview = mongoose.mtModel(user.tenantId + '.' + 'GateReview');
    var ProjectStatusUpdate = mongoose.mtModel(user.tenantId + '.' + 'ProjectStatusUpdate');

    var GateStatusAssignment = mongoose.mtModel(user.tenantId + '.' + 'GateStatusAssignment');
    var GateOutcomeReview = mongoose.mtModel(user.tenantId + '.' + 'GateOutcomeReview');
    var ProjectAreaReview = mongoose.mtModel(user.tenantId + '.' + 'ProjectAreaReview');

    var BaselineDuration = mongoose.mtModel(user.tenantId + '.' + 'BaselineDuration');
    var BaselineCost = mongoose.mtModel(user.tenantId + '.' + 'BaselineCost');
    var BaselineCompletion = mongoose.mtModel(user.tenantId + '.' + 'BaselineCompletion');
    var EstimateDuration = mongoose.mtModel(user.tenantId + '.' + 'EstimateDuration');
    var EstimateCost = mongoose.mtModel(user.tenantId + '.' + 'EstimateCost');
    var EstimateCompletion = mongoose.mtModel(user.tenantId + '.' + 'EstimateCompletion');
    var ActualDuration = mongoose.mtModel(user.tenantId + '.' + 'ActualDuration');
    var ActualCost = mongoose.mtModel(user.tenantId + '.' + 'ActualCost');
    var ActualCompletion = mongoose.mtModel(user.tenantId + '.' + 'ActualCompletion');

    // Outcome scores
    var goScore1 = seedIDs.GateOutcomeScore.goScore1;
    var goScore2 = seedIDs.GateOutcomeScore.goScore2;
    var goScore3 = seedIDs.GateOutcomeScore.goScore3;

    // Gate Statuses
    var gStatus1 = seedIDs.GateStatus.gStatus1;
    var gStatus2 = seedIDs.GateStatus.gStatus2;
    var gStatus3 = seedIDs.GateStatus.gStatus3;
    var gStatus4 = seedIDs.GateStatus.gStatus4;
    var gStatus5 = seedIDs.GateStatus.gStatus5;
    var gStatus6 = seedIDs.GateStatus.gStatus6;

    // Waterfall
    var w1 = seedIDs.GateProcess.w1;

    var w11 = seedIDs.Gate.w11; // Startup
    var w12 = seedIDs.Gate.w12; // Initiation
    var w13 = seedIDs.Gate.w13; // Planning
    var w14 = seedIDs.Gate.w14; // Execution
    var w15 = seedIDs.Gate.w15; // Warranty
    var w16 = seedIDs.Gate.w16; // Closure

    var w111 = seedIDs.GateOutcome.w111; // Initiative aligned to approved strategic theme
    var w112 = seedIDs.GateOutcome.w112; // Formal support by a named Sponsor identified
    var w113 = seedIDs.GateOutcome.w113; // Expected delivery identified in approved roadmap
    var w114 = seedIDs.GateOutcome.w114; // A Project Manager has been assigned

    var w121 = seedIDs.GateOutcome.w121; // Business justification agreed between stakeholders
    var w122 = seedIDs.GateOutcome.w122; // Funding available and committed
    var w123 = seedIDs.GateOutcome.w123; // Strategic intent clear and aligned with other initiatives

    var w131 = seedIDs.GateOutcome.w131; // Cost/Benefits ownership agreed
    var w132 = seedIDs.GateOutcome.w132; // Clear requirements
    var w133 = seedIDs.GateOutcome.w133; // Impacts on other systems and interfaces identified
    var w134 = seedIDs.GateOutcome.w134; // Impacts on business processes, organization and people identified
    var w135 = seedIDs.GateOutcome.w135; // Delivery and operations risks mitigated

    var w141 = seedIDs.GateOutcome.w141; // Business change validated
    var w142 = seedIDs.GateOutcome.w142; // Functional behaviour detailed
    var w143 = seedIDs.GateOutcome.w143; // Business case approved
    var w144 = seedIDs.GateOutcome.w144; // Testing strategy agreed

    var w151 = seedIDs.GateOutcome.w151; // Solution built as per design with variance to design documented and agreed
    var w152 = seedIDs.GateOutcome.w152; // Changes have been placed into production based on formal approval
    var w153 = seedIDs.GateOutcome.w153; // Users understand how changes to systems and processes will impact them, and where to go for support
    var w154 = seedIDs.GateOutcome.w154; // Maintenance of new systems, processes or required updates in place

    var w161 = seedIDs.GateOutcome.w161; // Post implementation review completed
    var w162 = seedIDs.GateOutcome.w162; // Lessons learned captured and embedded
    var w163 = seedIDs.GateOutcome.w163; // Business benefits realization tracking initiated
    var w164 = seedIDs.GateOutcome.w164; // Project formally closed in management systems

    // Projects
    var project1 = seedIDsProject.Project.project1;
    

    // GateReview
    var gReviewP1w11 = seedIDsProject.GateReview.gReviewP1w11, gReviewP1w12 = seedIDsProject.GateReview.gReviewP1w12, gReviewP1w13 = seedIDsProject.GateReview.gReviewP1w13;
    var gReviewP1w14 = seedIDsProject.GateReview.gReviewP1w14, gReviewP1w15 = seedIDsProject.GateReview.gReviewP1w15, gReviewP1w16 = seedIDsProject.GateReview.gReviewP1w16;

    // ProjectStatusUpdate
    var statusP1w11 = seedIDsProject.ProjectStatusUpdate.statusP1w11, statusP1w12 = seedIDsProject.ProjectStatusUpdate.statusP1w12, statusP1w13 = seedIDsProject.ProjectStatusUpdate.statusP1w13;
    var statusP1w14 = seedIDsProject.ProjectStatusUpdate.statusP1w14, statusP1w15 = seedIDsProject.ProjectStatusUpdate.statusP1w15, statusP1w16 = seedIDsProject.ProjectStatusUpdate.statusP1w16;

    // GateStatusAssignment
    var p1gw11Status = seedIDsProject.GateStatusAssignment.p1gw11Status;
    var p1gw12Status = seedIDsProject.GateStatusAssignment.p1gw12Status;
    var p1gw13Status = seedIDsProject.GateStatusAssignment.p1gw13Status;
    var p1gw14Status = seedIDsProject.GateStatusAssignment.p1gw14Status;
    var p1gw15Status = seedIDsProject.GateStatusAssignment.p1gw15Status;
    var p1gw16Status = seedIDsProject.GateStatusAssignment.p1gw16Status;

    // GateOutcomeReview
    var p1gw11Out1 = seedIDsProject.GateOutcomeReview.p1gw11Out1;
    var p1gw11Out2 = seedIDsProject.GateOutcomeReview.p1gw11Out2;
    var p1gw11Out3 = seedIDsProject.GateOutcomeReview.p1gw11Out3;
    var p1gw11Out4 = seedIDsProject.GateOutcomeReview.p1gw11Out4;

    var p1gw12Out1 = seedIDsProject.GateOutcomeReview.p1gw12Out1;
    var p1gw12Out2 = seedIDsProject.GateOutcomeReview.p1gw12Out2;
    var p1gw12Out3 = seedIDsProject.GateOutcomeReview.p1gw12Out3;

    var p1gw13Out1 = seedIDsProject.GateOutcomeReview.p1gw13Out1;
    var p1gw13Out2 = seedIDsProject.GateOutcomeReview.p1gw13Out2;
    var p1gw13Out3 = seedIDsProject.GateOutcomeReview.p1gw13Out3;
    var p1gw13Out4 = seedIDsProject.GateOutcomeReview.p1gw13Out4;
    var p1gw13Out5 = seedIDsProject.GateOutcomeReview.p1gw13Out5;

    var p1gw14Out1 = seedIDsProject.GateOutcomeReview.p1gw14Out1;
    var p1gw14Out2 = seedIDsProject.GateOutcomeReview.p1gw14Out2;
    var p1gw14Out3 = seedIDsProject.GateOutcomeReview.p1gw14Out3;
    var p1gw14Out4 = seedIDsProject.GateOutcomeReview.p1gw14Out4;

    var p1gw15Out1 = seedIDsProject.GateOutcomeReview.p1gw15Out1;
    var p1gw15Out2 = seedIDsProject.GateOutcomeReview.p1gw15Out2;
    var p1gw15Out3 = seedIDsProject.GateOutcomeReview.p1gw15Out3;
    var p1gw15Out4 = seedIDsProject.GateOutcomeReview.p1gw15Out4;

    var p1gw16Out1 = seedIDsProject.GateOutcomeReview.p1gw16Out1;
    var p1gw16Out2 = seedIDsProject.GateOutcomeReview.p1gw16Out2;
    var p1gw16Out3 = seedIDsProject.GateOutcomeReview.p1gw16Out3;
    var p1gw16Out4 = seedIDsProject.GateOutcomeReview.p1gw16Out4;

    // ProjectAreaReview
    var p1gw11Area1 = seedIDsProject.ProjectAreaReview.p1gw11Area1, p1gw11Area2 = seedIDsProject.ProjectAreaReview.p1gw11Area2, p1gw11Area3 = seedIDsProject.ProjectAreaReview.p1gw11Area3;
    var p1gw12Area1 = seedIDsProject.ProjectAreaReview.p1gw12Area1, p1gw12Area2 = seedIDsProject.ProjectAreaReview.p1gw12Area2, p1gw12Area3 = seedIDsProject.ProjectAreaReview.p1gw12Area3;
    var p1gw13Area1 = seedIDsProject.ProjectAreaReview.p1gw13Area1, p1gw13Area2 = seedIDsProject.ProjectAreaReview.p1gw13Area2, p1gw13Area3 = seedIDsProject.ProjectAreaReview.p1gw13Area3;
    var p1gw14Area1 = seedIDsProject.ProjectAreaReview.p1gw14Area1, p1gw14Area2 = seedIDsProject.ProjectAreaReview.p1gw14Area2, p1gw14Area3 = seedIDsProject.ProjectAreaReview.p1gw14Area3;
    var p1gw15Area1 = seedIDsProject.ProjectAreaReview.p1gw15Area1, p1gw15Area2 = seedIDsProject.ProjectAreaReview.p1gw15Area2, p1gw15Area3 = seedIDsProject.ProjectAreaReview.p1gw15Area3;
    var p1gw16Area1 = seedIDsProject.ProjectAreaReview.p1gw16Area1, p1gw16Area2 = seedIDsProject.ProjectAreaReview.p1gw16Area2, p1gw16Area3 = seedIDsProject.ProjectAreaReview.p1gw16Area3;

    // BaselineDuration
    var basDur1Sw11Tw11= seedIDsProject.BaselineDuration.basDur1Sw11Tw11, basDur1Sw11Tw12= seedIDsProject.BaselineDuration.basDur1Sw11Tw12, basDur1Sw11Tw13= seedIDsProject.BaselineDuration.basDur1Sw11Tw13, basDur1Sw11Tw14= seedIDsProject.BaselineDuration.basDur1Sw11Tw14, basDur1Sw11Tw15= seedIDsProject.BaselineDuration.basDur1Sw11Tw15, basDur1Sw11Tw16= seedIDsProject.BaselineDuration.basDur1Sw11Tw16;
    var basDur1Sw12Tw12= seedIDsProject.BaselineDuration.basDur1Sw12Tw12, basDur1Sw12Tw13= seedIDsProject.BaselineDuration.basDur1Sw12Tw13, basDur1Sw12Tw14= seedIDsProject.BaselineDuration.basDur1Sw12Tw14, basDur1Sw12Tw15= seedIDsProject.BaselineDuration.basDur1Sw12Tw15, basDur1Sw12Tw16= seedIDsProject.BaselineDuration.basDur1Sw12Tw16;
    var basDur1Sw13Tw13= seedIDsProject.BaselineDuration.basDur1Sw13Tw13, basDur1Sw13Tw14= seedIDsProject.BaselineDuration.basDur1Sw13Tw14, basDur1Sw13Tw15= seedIDsProject.BaselineDuration.basDur1Sw13Tw15, basDur1Sw13Tw16= seedIDsProject.BaselineDuration.basDur1Sw13Tw16;
    var basDur1Sw14Tw14= seedIDsProject.BaselineDuration.basDur1Sw14Tw14, basDur1Sw14Tw15= seedIDsProject.BaselineDuration.basDur1Sw14Tw15, basDur1Sw14Tw16= seedIDsProject.BaselineDuration.basDur1Sw14Tw16;
    var basDur1Sw15Tw15= seedIDsProject.BaselineDuration.basDur1Sw15Tw15, basDur1Sw15Tw16= seedIDsProject.BaselineDuration.basDur1Sw15Tw16;
    var basDur1Sw16Tw16= seedIDsProject.BaselineDuration.basDur1Sw16Tw16;

    // BaselineCost
    var basCost1Sw11Tw11= seedIDsProject.BaselineCost.basCost1Sw11Tw11, basCost1Sw11Tw12= seedIDsProject.BaselineCost.basCost1Sw11Tw12, basCost1Sw11Tw13= seedIDsProject.BaselineCost.basCost1Sw11Tw13, basCost1Sw11Tw14= seedIDsProject.BaselineCost.basCost1Sw11Tw14, basCost1Sw11Tw15= seedIDsProject.BaselineCost.basCost1Sw11Tw15, basCost1Sw11Tw16= seedIDsProject.BaselineCost.basCost1Sw11Tw16;
    var basCost1Sw12Tw12= seedIDsProject.BaselineCost.basCost1Sw12Tw12, basCost1Sw12Tw13= seedIDsProject.BaselineCost.basCost1Sw12Tw13, basCost1Sw12Tw14= seedIDsProject.BaselineCost.basCost1Sw12Tw14, basCost1Sw12Tw15= seedIDsProject.BaselineCost.basCost1Sw12Tw15, basCost1Sw12Tw16= seedIDsProject.BaselineCost.basCost1Sw12Tw16;
    var basCost1Sw13Tw13= seedIDsProject.BaselineCost.basCost1Sw13Tw13, basCost1Sw13Tw14= seedIDsProject.BaselineCost.basCost1Sw13Tw14, basCost1Sw13Tw15= seedIDsProject.BaselineCost.basCost1Sw13Tw15, basCost1Sw13Tw16= seedIDsProject.BaselineCost.basCost1Sw13Tw16;
    var basCost1Sw14Tw14= seedIDsProject.BaselineCost.basCost1Sw14Tw14, basCost1Sw14Tw15= seedIDsProject.BaselineCost.basCost1Sw14Tw15, basCost1Sw14Tw16= seedIDsProject.BaselineCost.basCost1Sw14Tw16;
    var basCost1Sw15Tw15= seedIDsProject.BaselineCost.basCost1Sw15Tw15, basCost1Sw15Tw16= seedIDsProject.BaselineCost.basCost1Sw15Tw16;
    var basCost1Sw16Tw16= seedIDsProject.BaselineCost.basCost1Sw16Tw16;

    // BaselineCompletion
    var basComp1Sw11Tw11= seedIDsProject.BaselineCompletion.basComp1Sw11Tw11, basComp1Sw11Tw12= seedIDsProject.BaselineCompletion.basComp1Sw11Tw12, basComp1Sw11Tw13= seedIDsProject.BaselineCompletion.basComp1Sw11Tw13, basComp1Sw11Tw14= seedIDsProject.BaselineCompletion.basComp1Sw11Tw14, basComp1Sw11Tw15= seedIDsProject.BaselineCompletion.basComp1Sw11Tw15, basComp1Sw11Tw16= seedIDsProject.BaselineCompletion.basComp1Sw11Tw16;
    var basComp1Sw12Tw12= seedIDsProject.BaselineCompletion.basComp1Sw12Tw12, basComp1Sw12Tw13= seedIDsProject.BaselineCompletion.basComp1Sw12Tw13, basComp1Sw12Tw14= seedIDsProject.BaselineCompletion.basComp1Sw12Tw14, basComp1Sw12Tw15= seedIDsProject.BaselineCompletion.basComp1Sw12Tw15, basComp1Sw12Tw16= seedIDsProject.BaselineCompletion.basComp1Sw12Tw16;
    var basComp1Sw13Tw13= seedIDsProject.BaselineCompletion.basComp1Sw13Tw13, basComp1Sw13Tw14= seedIDsProject.BaselineCompletion.basComp1Sw13Tw14, basComp1Sw13Tw15= seedIDsProject.BaselineCompletion.basComp1Sw13Tw15, basComp1Sw13Tw16= seedIDsProject.BaselineCompletion.basComp1Sw13Tw16;
    var basComp1Sw14Tw14= seedIDsProject.BaselineCompletion.basComp1Sw14Tw14, basComp1Sw14Tw15= seedIDsProject.BaselineCompletion.basComp1Sw14Tw15, basComp1Sw14Tw16= seedIDsProject.BaselineCompletion.basComp1Sw14Tw16;
    var basComp1Sw15Tw15= seedIDsProject.BaselineCompletion.basComp1Sw15Tw15, basComp1Sw15Tw16= seedIDsProject.BaselineCompletion.basComp1Sw15Tw16;
    var basComp1Sw16Tw16= seedIDsProject.BaselineCompletion.basComp1Sw16Tw16;

    // EstimateDuration
    var estDur1Sw11Tw11= seedIDsProject.EstimateDuration.estDur1Sw11Tw11, estDur1Sw11Tw12= seedIDsProject.EstimateDuration.estDur1Sw11Tw12, estDur1Sw11Tw13= seedIDsProject.EstimateDuration.estDur1Sw11Tw13, estDur1Sw11Tw14= seedIDsProject.EstimateDuration.estDur1Sw11Tw14, estDur1Sw11Tw15= seedIDsProject.EstimateDuration.estDur1Sw11Tw15, estDur1Sw11Tw16= seedIDsProject.EstimateDuration.estDur1Sw11Tw16;
    var estDur1Sw12Tw12= seedIDsProject.EstimateDuration.estDur1Sw12Tw12, estDur1Sw12Tw13= seedIDsProject.EstimateDuration.estDur1Sw12Tw13, estDur1Sw12Tw14= seedIDsProject.EstimateDuration.estDur1Sw12Tw14, estDur1Sw12Tw15= seedIDsProject.EstimateDuration.estDur1Sw12Tw15, estDur1Sw12Tw16= seedIDsProject.EstimateDuration.estDur1Sw12Tw16;
    var estDur1Sw13Tw13= seedIDsProject.EstimateDuration.estDur1Sw13Tw13, estDur1Sw13Tw14= seedIDsProject.EstimateDuration.estDur1Sw13Tw14, estDur1Sw13Tw15= seedIDsProject.EstimateDuration.estDur1Sw13Tw15, estDur1Sw13Tw16= seedIDsProject.EstimateDuration.estDur1Sw13Tw16;
    var estDur1Sw14Tw14= seedIDsProject.EstimateDuration.estDur1Sw14Tw14, estDur1Sw14Tw15= seedIDsProject.EstimateDuration.estDur1Sw14Tw15, estDur1Sw14Tw16= seedIDsProject.EstimateDuration.estDur1Sw14Tw16;
    var estDur1Sw15Tw15= seedIDsProject.EstimateDuration.estDur1Sw15Tw15, estDur1Sw15Tw16= seedIDsProject.EstimateDuration.estDur1Sw15Tw16;
    var estDur1Sw16Tw16= seedIDsProject.EstimateDuration.estDur1Sw16Tw16;

    // EstimateCost
    var estCost1Sw11Tw11= seedIDsProject.EstimateCost.estCost1Sw11Tw11, estCost1Sw11Tw12= seedIDsProject.EstimateCost.estCost1Sw11Tw12, estCost1Sw11Tw13= seedIDsProject.EstimateCost.estCost1Sw11Tw13, estCost1Sw11Tw14= seedIDsProject.EstimateCost.estCost1Sw11Tw14, estCost1Sw11Tw15= seedIDsProject.EstimateCost.estCost1Sw11Tw15, estCost1Sw11Tw16= seedIDsProject.EstimateCost.estCost1Sw11Tw16;
    var estCost1Sw12Tw12= seedIDsProject.EstimateCost.estCost1Sw12Tw12, estCost1Sw12Tw13= seedIDsProject.EstimateCost.estCost1Sw12Tw13, estCost1Sw12Tw14= seedIDsProject.EstimateCost.estCost1Sw12Tw14, estCost1Sw12Tw15= seedIDsProject.EstimateCost.estCost1Sw12Tw15, estCost1Sw12Tw16= seedIDsProject.EstimateCost.estCost1Sw12Tw16;
    var estCost1Sw13Tw13= seedIDsProject.EstimateCost.estCost1Sw13Tw13, estCost1Sw13Tw14= seedIDsProject.EstimateCost.estCost1Sw13Tw14, estCost1Sw13Tw15= seedIDsProject.EstimateCost.estCost1Sw13Tw15, estCost1Sw13Tw16= seedIDsProject.EstimateCost.estCost1Sw13Tw16;
    var estCost1Sw14Tw14= seedIDsProject.EstimateCost.estCost1Sw14Tw14, estCost1Sw14Tw15= seedIDsProject.EstimateCost.estCost1Sw14Tw15, estCost1Sw14Tw16= seedIDsProject.EstimateCost.estCost1Sw14Tw16;
    var estCost1Sw15Tw15= seedIDsProject.EstimateCost.estCost1Sw15Tw15, estCost1Sw15Tw16= seedIDsProject.EstimateCost.estCost1Sw15Tw16;
    var estCost1Sw16Tw16= seedIDsProject.EstimateCost.estCost1Sw16Tw16;

    // EstimateCompletion
    var estComp1Sw11Tw11= seedIDsProject.EstimateCompletion.estComp1Sw11Tw11, estComp1Sw11Tw12= seedIDsProject.EstimateCompletion.estComp1Sw11Tw12, estComp1Sw11Tw13= seedIDsProject.EstimateCompletion.estComp1Sw11Tw13, estComp1Sw11Tw14= seedIDsProject.EstimateCompletion.estComp1Sw11Tw14, estComp1Sw11Tw15= seedIDsProject.EstimateCompletion.estComp1Sw11Tw15, estComp1Sw11Tw16= seedIDsProject.EstimateCompletion.estComp1Sw11Tw16;
    var estComp1Sw12Tw12= seedIDsProject.EstimateCompletion.estComp1Sw12Tw12, estComp1Sw12Tw13= seedIDsProject.EstimateCompletion.estComp1Sw12Tw13, estComp1Sw12Tw14= seedIDsProject.EstimateCompletion.estComp1Sw12Tw14, estComp1Sw12Tw15= seedIDsProject.EstimateCompletion.estComp1Sw12Tw15, estComp1Sw12Tw16= seedIDsProject.EstimateCompletion.estComp1Sw12Tw16;
    var estComp1Sw13Tw13= seedIDsProject.EstimateCompletion.estComp1Sw13Tw13, estComp1Sw13Tw14= seedIDsProject.EstimateCompletion.estComp1Sw13Tw14, estComp1Sw13Tw15= seedIDsProject.EstimateCompletion.estComp1Sw13Tw15, estComp1Sw13Tw16= seedIDsProject.EstimateCompletion.estComp1Sw13Tw16;
    var estComp1Sw14Tw14= seedIDsProject.EstimateCompletion.estComp1Sw14Tw14, estComp1Sw14Tw15= seedIDsProject.EstimateCompletion.estComp1Sw14Tw15, estComp1Sw14Tw16= seedIDsProject.EstimateCompletion.estComp1Sw14Tw16;
    var estComp1Sw15Tw15= seedIDsProject.EstimateCompletion.estComp1Sw15Tw15, estComp1Sw15Tw16= seedIDsProject.EstimateCompletion.estComp1Sw15Tw16;
    var estComp1Sw16Tw16= seedIDsProject.EstimateCompletion.estComp1Sw16Tw16;

    // ActualDuration
    var actDur1Sw11Tw11= seedIDsProject.ActualDuration.actDur1Sw11Tw11;
    var actDur1Sw12Tw12= seedIDsProject.ActualDuration.actDur1Sw12Tw12;
    var actDur1Sw13Tw13= seedIDsProject.ActualDuration.actDur1Sw13Tw13;
    var actDur1Sw14Tw14= seedIDsProject.ActualDuration.actDur1Sw14Tw14;
    var actDur1Sw15Tw15= seedIDsProject.ActualDuration.actDur1Sw15Tw15;
    var actDur1Sw16Tw16= seedIDsProject.ActualDuration.actDur1Sw16Tw16;

    // ActualCost
    var actCost1Sw11Tw11= seedIDsProject.ActualCost.actCost1Sw11Tw11;
    var actCost1Sw12Tw12= seedIDsProject.ActualCost.actCost1Sw12Tw12;
    var actCost1Sw13Tw13= seedIDsProject.ActualCost.actCost1Sw13Tw13;
    var actCost1Sw14Tw14= seedIDsProject.ActualCost.actCost1Sw14Tw14;
    var actCost1Sw15Tw15= seedIDsProject.ActualCost.actCost1Sw15Tw15;
    var actCost1Sw16Tw16= seedIDsProject.ActualCost.actCost1Sw16Tw16;

    // ActualCompletion
    var actComp1Sw11Tw11= seedIDsProject.ActualCompletion.actComp1Sw11Tw11;
    var actComp1Sw12Tw12= seedIDsProject.ActualCompletion.actComp1Sw12Tw12;
    var actComp1Sw13Tw13= seedIDsProject.ActualCompletion.actComp1Sw13Tw13;
    var actComp1Sw14Tw14= seedIDsProject.ActualCompletion.actComp1Sw14Tw14;
    var actComp1Sw15Tw15= seedIDsProject.ActualCompletion.actComp1Sw15Tw15;
    var actComp1Sw16Tw16= seedIDsProject.ActualCompletion.actComp1Sw16Tw16;

    var seedArray =  [
        // Gate w11
        {
            _id: actDur1Sw11Tw11,
            project:project1,
            sourceGate: w11,
            targetGate: w11,

            currentRecord: {
                gateDate: new Date('2016-01-10T23:00:00Z'),
                completed : true,
                currentGate : false,
                sourceChangeRequest: null,
                sourceGateReview: gReviewP1w11,
                created: new Date('2015-12-31T23:00:00Z'),
                user: user._id
            },
            history:[]
        },
        // Gate w12
        {
            _id: actDur1Sw12Tw12,
            project:project1,
            sourceGate: w12,
            targetGate: w12,

            currentRecord: {
                gateDate: new Date('2016-03-10T23:00:00Z'),
                completed : true,
                currentGate : false,
                sourceChangeRequest: null,
                sourceGateReview: gReviewP1w12,
                created: new Date('2016-03-30T23:00:00Z'),
                user: user._id
            },
            history:[]
        },
        // Gate w13
        {
            _id: actDur1Sw13Tw13,
            project:project1,
            sourceGate: w13,
            targetGate: w13,

            currentRecord: {
                gateDate: new Date('2016-05-10T23:00:00Z'),
                completed : true,
                currentGate : false,
                sourceChangeRequest: null,
                sourceGateReview: gReviewP1w13,
                created: new Date('2016-04-30T23:00:00Z'),
                user: user._id
            },
            history:[]
        },
        // Gate w14
        {
            _id: actDur1Sw14Tw14,
            project:project1,
            sourceGate: w14,
            targetGate: w14,

            currentRecord: {
                gateDate: new Date('2016-08-10T23:00:00Z'),
                completed : true,
                currentGate : false,
                sourceChangeRequest: null,
                sourceGateReview: gReviewP1w14,
                created: new Date('2016-07-30T23:00:00Z'),
                user: user._id
            },
            history:[]
        },
        // Gate 15
        {
            _id: actDur1Sw15Tw15,
            project:project1,
            sourceGate: w15,
            targetGate: w15,

            currentRecord: {
                gateDate: new Date('2016-12-10T23:00:00Z'),
                completed : true,
                currentGate : false,
                sourceChangeRequest: null,
                sourceGateReview: gReviewP1w15,
                created: new Date('2016-11-30T23:00:00Z'),
                user: user._id
            },
            history:[]
        },
        // Gate w16
        {
            _id: actDur1Sw16Tw16,
            project:project1,
            sourceGate: w16,
            targetGate: w16,

            currentRecord: {
                gateDate: new Date('2017-01-10T23:00:00Z'),
                completed : true,
                currentGate : true,
                sourceChangeRequest: null,
                sourceGateReview: gReviewP1w16,
                created: new Date('2016-12-30T23:00:00Z'),
                user: user._id
            },
            history:[]
        }
    ];
    
    createObjects(ActualDuration, 'ActualDuration', seedArray, callback);
};
