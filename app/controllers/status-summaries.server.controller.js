'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

exports.portfolioSummary = function(req, res){

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    var GateStatusAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatusAssignment');
    var ProjectAreaReview = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectAreaReview');
    var GateOutcomeReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeReview');

    async.waterfall([
        // Get all the projects in delivery and with a process assigned
        function(callback) {
            Project.find({'selection.active':true, 'selection.selectedForDelivery':true, 'process':{$ne:null}})
                .deepPopulate(['portfolio','parent', 'process'])
                .populate('identification.projectManager', 'displayName')
                .populate('identification.backupProjectManager', 'displayName')
                .exec(function (err, projects) {
                if (err) {
                    return callback(err);
                }
                callback(null, projects);
            });
        },
        // For each project, get its status
        function(projects, callback){
            var retArray = [];
            async.eachSeries(projects, function(project, callbackEach) {
                async.waterfall([
                    // Get " GateStatusAssignment " of "current gate"
                    function(callback) {
                        GateStatusAssignment.findOne({'project': project._id, 'currentRecord.currentGate': true})
                            .populate('gate')
                            .populate('currentRecord.status')
                            .populate('currentRecord.overallScore')
                            .populate('overallStatus.currentRecord.status')
                            .populate('durationStatus.currentRecord.status')
                            .populate('costStatus.currentRecord.status')
                            .populate('completionStatus.currentRecord.status')
                            .exec(function (err, assignment) {
                                if (err) {
                                    return callback(err);
                                }
                                var currentGate = null; // Object
                                if(assignment){
                                    currentGate = assignment.gate;
                                }
                                callback(null, assignment, currentGate);
                        });
                    },
                    // Get " ProjectAreaReview "
                    function(assignment, currentGate, callback) {
                        ProjectAreaReview.find({'project': project._id, 'gate': currentGate && currentGate._id})
                            .populate('currentRecord.status')
                            .populate('statusArea')
                            .exec(function (err, areaReviews) {
                                if (err) {
                                    return callback(err);
                                }
                                areaReviews = _.sortBy(areaReviews, function(review){
                                    return review.statusArea._id;
                                });
                                callback(null, assignment, currentGate, areaReviews);
                        });
                    },
                    // Get " GateOutcomeReview "
                    function(assignment, currentGate, areaReviews, callback) {
                        GateOutcomeReview.find({'project': project._id, 'gate': currentGate && currentGate._id})
                            .populate('currentRecord.score')
                            .populate('currentStatus.status')
                            .populate('outcome')
                            .exec(function (err, outcomeReviews) {
                                if (err) {
                                    return callback(err);
                                }
                                outcomeReviews = _.sortBy(outcomeReviews, function(review){
                                    return review._id;
                                });
                                callback(null, assignment, currentGate, areaReviews, outcomeReviews);
                            });
                    }
                ], function (err, assignment, currentGate, areaReviews, outcomeReviews) {
                    if(err){
                        return callbackEach(err);
                    }
                    retArray.push({
                        _id: project._id,
                        idNumber: project.idNumber,
                        portfolio: project.portfolio,
                        parent: project.parent,
                        process: project.process,
                        identification: project.identification,
                        currentGate: currentGate,
                        gateStatusAssignment : assignment,
                        projectAreaReviews : areaReviews,
                        gateOutcomeReviews : outcomeReviews
                    });
                    callbackEach();
                });
            }, function(err){
                if( err ) {
                    callback(err);
                } else {
                    callback(null, retArray);
                }
            });
        }
    ], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(result);
            /* result = [ ]
             *  resultObj = {
             *      projectId, projectName, parent, portfolio, earmarkedFunds, portfolioRanking, overallRanking,
             *          qualitativeScore, qualitativeAnalysis : [ ],
             *          riskScore, riskAnalysis : [ ],
             *          financialRatios : { }, financialYearlyData : [ ]
             *	    }
             *          qualitativeAnalysisObj = { groupId, groupName, groupWeight, sumImpactScores, weightedScore, impacts : [ ] }
             *		    riskAnalysisObj = { categoryId, categoryName, sumSeverityValues, risks : [{severityValue} ] },
             *		    financialRatios = { IRR, costBenefitRatio, paybackPeriod, totalBenefit, totalBenefitDsicounted (same for cost and net), },
             *		    financialYearlyDataObj = { year, yearlyBenefit(discounted), yearlyCost(discounted), yearlyNet(discounted)}
             */
        }
    });

};

/**
 * Definition dashboard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

    next();
};
