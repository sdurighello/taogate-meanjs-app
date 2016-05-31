'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * APPROVE PROJECT-STATUS-UPDATE
 */
exports.approve = function(req, res) {

    // var ProjectStatusUpdate = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectStatusUpdate');
    // var projectStatusUpdate = req.projectStatusUpdate;
    //
    // var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');
    //
    // var EstimateDuration = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateDuration');
    // var EstimateCost = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCost');
    // var EstimateCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCompletion');
    //
    // var ProjectAreaReview = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectAreaReview');
    // var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');
    // var GateOutcomeReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeReview');
    //
    // async.series([
    //     function(callback){
    //         // Async.series inside an async.series so it doesn't save the projectChangeUpdate if the rest is not done
    //         async.series([
    //             // ESTIMATE-DURATION
    //             function(callback){
    //                 async.eachSeries(req.body.estimateDurationReviews, function(estimateDurationReview, callback){
    //                     EstimateDuration.findById(estimateDurationReview.estimateDuration._id).exec(function(err, performance){
    //                         if(err){
    //                             return callback(err);
    //                         } else if(! performance){
    //                             return callback(new Error('Cannot find estimate duration ' + estimateDurationReview.estimateDuration._id));
    //                         } else {
    //                             performance.history.push({
    //                                 user : performance.currentRecord.user,
    //                                 created : performance.currentRecord.created,
    //                                 sourceStatusUpdate : performance.currentRecord.sourceStatusUpdate,
    //                                 sourceGateReview : performance.currentRecord.sourceGateReview,
    //                                 gateDate : performance.currentRecord.gateDate
    //                             });
    //                             performance.currentRecord.gateDate = estimateDurationReview.newDate;
    //                             performance.currentRecord.sourceGateReview = null;
    //                             performance.currentRecord.sourceStatusUpdate = req.body._id;
    //                             performance.currentRecord.created = Date.now();
    //                             performance.currentRecord.user = req.user;
    //                             performance.save(function(err){
    //                                 if(err){ callback(err); }
    //                             });
    //                         }
    //                     });
    //                     callback();
    //                 });
    //                 callback(null);
    //             },
    //             // ESTIMATE-COST
    //             function(callback){
    //                 async.eachSeries(req.body.estimateCostReviews, function(estimateCostReview, callback){
    //                     EstimateCost.findById(estimateCostReview.estimateCost._id).exec(function(err, performance){
    //                         if(err){
    //                             return callback(err);
    //                         } else if(! performance){
    //                             return callback(new Error('Cannot find estimate cost ' + estimateCostReview.estimateCost._id));
    //                         } else {
    //                             performance.history.push({
    //                                 user : performance.currentRecord.user,
    //                                 created : performance.currentRecord.created,
    //                                 sourceStatusUpdate : performance.currentRecord.sourceStatusUpdate,
    //                                 sourceGateReview : performance.currentRecord.sourceGateReview,
    //                                 cost : performance.currentRecord.cost
    //                             });
    //                             performance.currentRecord.cost = estimateCostReview.newCost;
    //                             performance.currentRecord.sourceGateReview = null;
    //                             performance.currentRecord.sourceStatusUpdate = req.body._id;
    //                             performance.currentRecord.created = Date.now();
    //                             performance.currentRecord.user = req.user;
    //                             performance.save(function(err){
    //                                 if(err){ callback(err); }
    //                             });
    //                         }
    //                     });
    //                     callback();
    //                 });
    //                 callback(null);
    //             },
    //             // ESTIMATE-COMPLETION
    //             function(callback){
    //                 async.eachSeries(req.body.estimateCompletionReviews, function(estimateCompletionReview, callback){
    //                     EstimateCompletion.findById(estimateCompletionReview.estimateCompletion._id).exec(function(err, performance){
    //                         if(err){
    //                             return callback(err);
    //                         } else if(! performance){
    //                             return callback(new Error('Cannot find estimate completion ' + estimateCompletionReview.estimateCompletion._id));
    //                         } else {
    //                             performance.history.push({
    //                                 user : performance.currentRecord.user,
    //                                 created : performance.currentRecord.created,
    //                                 sourceStatusUpdate : performance.currentRecord.sourceStatusUpdate,
    //                                 sourceGateReview : performance.currentRecord.sourceGateReview,
    //                                 completion : performance.currentRecord.completion
    //                             });
    //                             performance.currentRecord.completion = estimateCompletionReview.newCompletion;
    //                             performance.currentRecord.sourceGateReview = null;
    //                             performance.currentRecord.sourceStatusUpdate = req.body._id;
    //                             performance.currentRecord.created = Date.now();
    //                             performance.currentRecord.user = req.user;
    //                             performance.save(function(err){
    //                                 if(err){ callback(err); }
    //                             });
    //                         }
    //                     });
    //                     callback();
    //                 });
    //                 callback(null);
    //             },
    //             // STATUS-AREAS
    //             function(callback){
    //                 async.eachSeries(req.body.statusAreaUpdates, function(statusAreaUpdate, callback){
    //                     ProjectAreaReview.findById(statusAreaUpdate.projectAreaReview._id).exec(function(err, areaReview){
    //                         if(err){
    //                             return callback(err);
    //                         } else if(! areaReview){
    //                             return callback(new Error('Cannot find project area review ' + statusAreaUpdate.projectAreaReview._id));
    //                         } else {
    //                             areaReview.history.push({
    //                                 user : areaReview.currentRecord.user,
    //                                 created : areaReview.currentRecord.created,
    //                                 sourceStatusUpdate : areaReview.currentRecord.sourceStatusUpdate,
    //                                 status : areaReview.currentRecord.status,
    //                                 comment : areaReview.currentRecord.comment
    //                             });
    //                             areaReview.currentRecord.status = statusAreaUpdate.newStatus;
    //                             areaReview.currentRecord.comment = statusAreaUpdate.comment;
    //                             areaReview.currentRecord.sourceStatusUpdate = req.body._id;
    //                             areaReview.currentRecord.created = Date.now();
    //                             areaReview.currentRecord.user = req.user;
    //                             areaReview.save(function(err){
    //                                 if(err){ callback(err); }
    //                             });
    //                         }
    //                     });
    //                     callback();
    //                 });
    //                 callback(null);
    //             },
    //             // GATE-STATUS-ASSIGNMENT
    //             function(callback){
    //                 GateStatusAssignment.findById(req.body.gateStatusUpdate.gateStatusAssignment).exec(function(err, statusAssignment){
    //                     if(err){
    //                         return callback(err);
    //                     } else if(!statusAssignment){
    //                         return callback(new Error('Cannot find gateStatusAssignment ' + projectStatusUpdate.gateStatusAssignment));
    //                     } else {
    //                         // Overall status
    //                         statusAssignment.overallStatus.history.push({
    //                             user : statusAssignment.overallStatus.currentRecord.user,
    //                             created: statusAssignment.overallStatus.currentRecord.created,
    //                             sourceStatusUpdate : statusAssignment.overallStatus.currentRecord.sourceStatusUpdate,
    //                             status : statusAssignment.overallStatus.currentRecord.status,
    //                             comment : statusAssignment.overallStatus.currentRecord.comment
    //                         });
    //                         statusAssignment.overallStatus.currentRecord.created = Date.now();
    //                         statusAssignment.overallStatus.currentRecord.user = req.user;
    //                         statusAssignment.overallStatus.currentRecord.sourceStatusUpdate = req.body._id;
    //                         statusAssignment.overallStatus.currentRecord.status = req.body.gateStatusUpdate.overallUpdate.status;
    //                         statusAssignment.overallStatus.currentRecord.comment = req.body.gateStatusUpdate.overallUpdate.comment;
    //                         // Duration status
    //                         statusAssignment.durationStatus.history.push({
    //                             user : statusAssignment.durationStatus.currentRecord.user,
    //                             created: statusAssignment.durationStatus.currentRecord.created,
    //                             sourceStatusUpdate : statusAssignment.durationStatus.currentRecord.sourceStatusUpdate,
    //                             status : statusAssignment.durationStatus.currentRecord.status,
    //                             comment : statusAssignment.durationStatus.currentRecord.comment
    //                         });
    //                         statusAssignment.durationStatus.currentRecord.created = Date.now();
    //                         statusAssignment.durationStatus.currentRecord.user = req.user;
    //                         statusAssignment.durationStatus.currentRecord.sourceStatusUpdate = req.body._id;
    //                         statusAssignment.durationStatus.currentRecord.status = req.body.gateStatusUpdate.durationUpdate.status;
    //                         statusAssignment.durationStatus.currentRecord.comment = req.body.gateStatusUpdate.durationUpdate.comment;
    //                         // Cost status
    //                         statusAssignment.costStatus.history.push({
    //                             user : statusAssignment.costStatus.currentRecord.user,
    //                             created: statusAssignment.costStatus.currentRecord.created,
    //                             sourceStatusUpdate : statusAssignment.costStatus.currentRecord.sourceStatusUpdate,
    //                             status : statusAssignment.costStatus.currentRecord.status,
    //                             comment : statusAssignment.costStatus.currentRecord.comment
    //                         });
    //                         statusAssignment.costStatus.currentRecord.created = Date.now();
    //                         statusAssignment.costStatus.currentRecord.user = req.user;
    //                         statusAssignment.costStatus.currentRecord.sourceStatusUpdate = req.body._id;
    //                         statusAssignment.costStatus.currentRecord.status = req.body.gateStatusUpdate.costUpdate.status;
    //                         statusAssignment.costStatus.currentRecord.comment = req.body.gateStatusUpdate.costUpdate.comment;
    //                         // Completion status
    //                         statusAssignment.completionStatus.history.push({
    //                             user : statusAssignment.completionStatus.currentRecord.user,
    //                             created: statusAssignment.completionStatus.currentRecord.created,
    //                             sourceStatusUpdate : statusAssignment.completionStatus.currentRecord.sourceStatusUpdate,
    //                             status : statusAssignment.completionStatus.currentRecord.status,
    //                             comment : statusAssignment.completionStatus.currentRecord.comment
    //                         });
    //                         statusAssignment.completionStatus.currentRecord.created = Date.now();
    //                         statusAssignment.completionStatus.currentRecord.user = req.user;
    //                         statusAssignment.completionStatus.currentRecord.sourceStatusUpdate = req.body._id;
    //                         statusAssignment.completionStatus.currentRecord.status = req.body.gateStatusUpdate.completionUpdate.status;
    //                         statusAssignment.completionStatus.currentRecord.comment = req.body.gateStatusUpdate.completionUpdate.comment;
    //                         // Save the object
    //                         statusAssignment.save(function(err){
    //                             callback(err);
    //                         });
    //                     }
    //                 });
    //             },
    //             // OUTCOME-REVIEWS
    //             function(callback){
    //                 async.eachSeries(req.body.outcomeStatusUpdates, function(outcomeUpdate, callback){
    //                     GateOutcomeReview.findById(outcomeUpdate.outcomeReview._id).exec(function(err, outcomeReview){
    //                         if(err){
    //                             return callback(err);
    //                         } else if(!outcomeReview){
    //                             return callback(new Error('Cannot find gateOutcomeReview ' + outcomeUpdate.outcomeReview._id));
    //                         } else {
    //                             outcomeReview.historyStatus.push({
    //                                 created: outcomeReview.currentRecord.created,
    //                                 user: outcomeReview.currentRecord.user,
    //                                 sourceStatusUpdate: outcomeReview.currentRecord.sourceGateReview,
    //                                 status: outcomeReview.currentRecord.status,
    //                                 comment: outcomeReview.currentRecord.comment
    //                             });
    //                             outcomeReview.currentStatus.status = outcomeUpdate.newStatus;
    //                             outcomeReview.currentStatus.comment = outcomeUpdate.comment;
    //                             outcomeReview.currentStatus.sourceGateReview = req.body._id;
    //                             outcomeReview.currentStatus.created = Date.now();
    //                             outcomeReview.currentStatus.user = req.user;
    //                             outcomeReview.save(function(err){
    //                                 if(err){ callback(err); }
    //                             });
    //                         }
    //                     });
    //                     callback();
    //                 });
    //                 callback(null);
    //             }
    //         ], function(err){
    //             if(err){
    //                 callback(err);
    //             } else {
    //                 callback(null);
    //             }
    //         });
    //     },
    //     // If all the above series function are successful, set the 'approval' record
    //     function(callback){
    //         projectStatusUpdate.approval.history.push({
    //             approvalState : projectStatusUpdate.approval.currentRecord.approvalState,
    //             user : projectStatusUpdate.approval.currentRecord.user,
    //             created : projectStatusUpdate.approval.currentRecord.created
    //         });
    //         projectStatusUpdate.approval.currentRecord.approvalState = 'approved';
    //         projectStatusUpdate.approval.currentRecord.user = req.user;
    //         projectStatusUpdate.approval.currentRecord.created = Date.now();
    //
    //         projectStatusUpdate.user = req.user;
    //         projectStatusUpdate.created = Date.now();
    //
    //         projectStatusUpdate.save(function(err){
    //             callback(err);
    //         });
    //     }
    // ], function(err){
    //     if (err) {
    //         console.log(err);
    //         return res.status(400).send({
    //             message: errorHandler.getErrorMessage(err)
    //         });
    //     } else {
    //         res.jsonp(projectStatusUpdate);
    //     }
    // });

};
