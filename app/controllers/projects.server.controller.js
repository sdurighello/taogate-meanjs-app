'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');


/* PROJECT */

exports.create = function(req, res) {
    require('./projects/projects.create.server.controller').create(req.user, req.body, function (err, project) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });
};

exports.read = function(req, res) {
	res.jsonp(req.project);
};

exports.update = function(req, res) {
	var project = req.project ;
    project.user = req.user;
    project.created = Date.now();
	project = _.extend(project , req.body);

	project.save(function(err) {
		if (err) {
            console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(project);
		}
	});
};

exports.delete = require('./projects/projects.delete.server.controller').delete;

exports.list = function(req, res) {

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    Project.find(req.query).populate('portfolio').populate('user', 'displayName').exec(function(err, projects) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projects);
        }
    });
};


// ------------------------------ DEFINITION ------------------------------

exports.updateStrategyAssignment = require('./projects/projects.strategyAssignment.server.controller').updateStrategyAssignment;

exports.updatePortfolioAssignment = require('./projects/projects.portfolioAssignment.server.controller').updatePortfolioAssignment;

exports.updateCategoryAssignment = require('./projects/projects.categorization.server.controller').updateCategoryAssignment;

exports.updatePriorityAssignment = require('./projects/projects.prioritization.server.controller').updatePriorityAssignment;


// ------------------------------ EVALUATION ------------------------------

exports.updateImpactAssignment = require('./projects/projects.qualitativeAnalysis.server.controller').updateImpactAssignment;

exports.updateRiskAssignment = require('./projects/projects.riskAnalysis.server.controller').updateRiskAssignment;

exports.updatePeopleAssignment = require('./projects/projects.stakeholderAnalysis.server.controller').updatePeopleAssignment;

// ------------------------------ PROCESS ASSIGNMENT ------------------------------

exports.confirmAssignment = require('./projects/projects.gateProcess.server.controller').confirmAssignment;

exports.customAssignment = require('./projects/projects.gateProcess.server.controller').customAssignment;

exports.standardAssignment = require('./projects/projects.gateProcess.server.controller').standardAssignment;

exports.removeAssignment = require('./projects/projects.gateProcess.server.controller').removeAssignment;


exports.updateProcess = require('./projects/projects.gateProcess.server.controller').updateProcess;


exports.createGate = require('./projects/projects.gateProcess.server.controller').createGate;

exports.updateGateHeader = require('./projects/projects.gateProcess.server.controller').updateGateHeader;

exports.updateGatePosition = require('./projects/projects.gateProcess.server.controller').updateGatePosition;

exports.deleteGate = require('./projects/projects.gateProcess.server.controller').deleteGate;


exports.createOutcome = require('./projects/projects.gateProcess.server.controller').createOutcome;

exports.updateOutcome = require('./projects/projects.gateProcess.server.controller').updateOutcome;

exports.deleteOutcome = require('./projects/projects.gateProcess.server.controller').deleteOutcome;


exports.submitProcess = require('./projects/projects.gateProcess.server.controller').submitProcess;

exports.approveProcess = require('./projects/projects.gateProcess.server.controller').approveProcess;

exports.rejectProcess = require('./projects/projects.gateProcess.server.controller').rejectProcess;

exports.draftProcess = require('./projects/projects.gateProcess.server.controller').draftProcess;


// ------------------------------ GATE REVIEWS ------------------------------

exports.createGateReview = require('./projects/projects.gateReviews.server.controller').createGateReview;

exports.deleteGateReview = require('./projects/projects.gateReviews.server.controller').deleteGateReview;


exports.updateGateReviewHeader = require('./projects/projects.gateReviews.server.controller').updateGateReviewHeader;

exports.updateGateStatusReview = require('./projects/projects.gateReviews.server.controller').updateGateStatusReview;

exports.updateGateBudgetReview = require('./projects/projects.gateReviews.server.controller').updateGateBudgetReview;


exports.updateOutcomeReview = require('./projects/projects.gateReviews.server.controller').updateOutcomeReview;


exports.updateActualCompletionReview = require('./projects/projects.gateReviews.server.controller').updateActualCompletionReview;

exports.updateActualCostReview = require('./projects/projects.gateReviews.server.controller').updateActualCostReview;

exports.updateActualDurationReview = require('./projects/projects.gateReviews.server.controller').updateActualDurationReview;


exports.updateEstimateCompletionReview = require('./projects/projects.gateReviews.server.controller').updateEstimateCompletionReview;

exports.updateEstimateCostReview = require('./projects/projects.gateReviews.server.controller').updateEstimateCostReview;

exports.updateEstimateDurationReview = require('./projects/projects.gateReviews.server.controller').updateEstimateDurationReview;


exports.updateBaselineCompletionReview = require('./projects/projects.gateReviews.server.controller').updateBaselineCompletionReview;

exports.updateBaselineCostReview = require('./projects/projects.gateReviews.server.controller').updateBaselineCostReview;

exports.updateBaselineDurationReview = require('./projects/projects.gateReviews.server.controller').updateBaselineDurationReview;


exports.submitGateReview = require('./projects/projects.gateReviews.server.controller').submitGateReview;

exports.approveGateReview = require('./projects/projects.gateReviews.server.controller').approveGateReview;

exports.rejectGateReview = require('./projects/projects.gateReviews.server.controller').rejectGateReview;

exports.draftGateReview = require('./projects/projects.gateReviews.server.controller').draftGateReview;


// ------------------------------ CHANGE REQUESTS ------------------------------

exports.createChangeRequest = require('./projects/projects.changeRequests.server.controller').createChangeRequest;

exports.deleteChangeRequest = require('./projects/projects.changeRequests.server.controller').deleteChangeRequest;


exports.updateChangeRequestHeader = require('./projects/projects.changeRequests.server.controller').updateChangeRequestHeader;

exports.updateChangeRequestStatus = require('./projects/projects.changeRequests.server.controller').updateChangeRequestStatus;

exports.updateGateBudgetReviewForCR = require('./projects/projects.changeRequests.server.controller').updateGateBudgetReviewForCR;


exports.updateOutcomeReviewForCR = require('./projects/projects.changeRequests.server.controller').updateOutcomeReviewForCR;


exports.updateActualCompletionReviewForCR = require('./projects/projects.changeRequests.server.controller').updateActualCompletionReviewForCR;

exports.updateActualCostReviewForCR = require('./projects/projects.changeRequests.server.controller').updateActualCostReviewForCR;

exports.updateActualDurationReviewForCR = require('./projects/projects.changeRequests.server.controller').updateActualDurationReviewForCR;


exports.updateBaselineCompletionReviewForCR = require('./projects/projects.changeRequests.server.controller').updateBaselineCompletionReviewForCR;

exports.updateBaselineCostReviewForCR = require('./projects/projects.changeRequests.server.controller').updateBaselineCostReviewForCR;

exports.updateBaselineDurationReviewForCR = require('./projects/projects.changeRequests.server.controller').updateBaselineDurationReviewForCR;


exports.submitChangeRequest = require('./projects/projects.changeRequests.server.controller').submitChangeRequest;

exports.approveChangeRequest = require('./projects/projects.changeRequests.server.controller').approveChangeRequest;

exports.rejectChangeRequest = require('./projects/projects.changeRequests.server.controller').rejectChangeRequest;

exports.draftChangeRequest = require('./projects/projects.changeRequests.server.controller').draftChangeRequest;


// ------------------------------ PROJECT STATUS UPDATES ------------------------------

exports.createStatusUpdate = require('./projects/projects.statusUpdates.server.controller').createStatusUpdate;

exports.deleteStatusUpdate = require('./projects/projects.statusUpdates.server.controller').deleteStatusUpdate;


exports.updateStatusUpdateHeader = require('./projects/projects.statusUpdates.server.controller').updateStatusUpdateHeader;

exports.updateDeliveryStatus = require('./projects/projects.statusUpdates.server.controller').updateDeliveryStatus;


exports.updateStatusAreaReview = require('./projects/projects.statusUpdates.server.controller').updateStatusAreaReview;


exports.updateOutcomeReviewForSU = require('./projects/projects.statusUpdates.server.controller').updateOutcomeReviewForSU;


exports.updateEstimateCompletionReviewForSU = require('./projects/projects.statusUpdates.server.controller').updateEstimateCompletionReviewForSU;

exports.updateEstimateCostReviewForSU = require('./projects/projects.statusUpdates.server.controller').updateEstimateCostReviewForSU;

exports.updateEstimateDurationReviewForSU = require('./projects/projects.statusUpdates.server.controller').updateEstimateDurationReviewForSU;


exports.submitStatusUpdate = require('./projects/projects.statusUpdates.server.controller').submitStatusUpdate;

exports.approveStatusUpdate = require('./projects/projects.statusUpdates.server.controller').approveStatusUpdate;

exports.rejectStatusUpdate = require('./projects/projects.statusUpdates.server.controller').rejectStatusUpdate;

exports.draftStatusUpdate = require('./projects/projects.statusUpdates.server.controller').draftStatusUpdate;


// ------------------------ MIDDLEWARE -----------------------------

exports.projectByID = function(req, res, next, id) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    var retPropertiesString = '';
    var deepPopulateArray = [];

    if(req.query.retPropertiesString){
        retPropertiesString = req.query.retPropertiesString;
    }
    if(req.query.deepPopulateArray){
        deepPopulateArray = req.query.deepPopulateArray;
    }

    Project.findById(id, retPropertiesString).populate('user', 'displayName').deepPopulate(deepPopulateArray)
        .exec(function(err, project) {
            if (err) return next(err);
            if (! project) return next(new Error('Failed to load Project ' + id));
            req.project = project ;
            next();
        });

};

// ------------------------ AUTHORIZATION -----------------------------

exports.hasCreateAuthorization = function(req, res, next) {
    if(!_.find(req.user.roles, function(role){
            return (role === 'superAdmin' || role === 'admin' || role === 'pmo' || role === 'portfolioManager');
        })
    ){
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};

exports.hasEditAuthorization = function(req, res, next) {
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    var authObj = {
        isProjectManager : false,
        isPortfolioManager : false,
        isSuperhero : false
    };

    async.waterfall([
        // Set flag if "project manager" or "backup project manager" of this project
        function(callback) {
            authObj.isProjectManager = (!!req.project.identification.projectManager && req.project.identification.projectManager.equals(req.user._id)) ||
                (!!req.project.identification.backupProjectManager && req.project.identification.backupProjectManager.equals(req.user._id));
            callback(null);
        },
        // Set flag if "portfolio manager" or "backup portfolio manager" of the project's portfolio
        function(callback) {
            if(req.project.portfolio){
                Portfolio.findById(req.project.portfolio).exec(function(err, portfolio) {
                    if(err){
                        return callback(err);
                    }
                    authObj.isPortfolioManager = (!!portfolio.portfolioManager && portfolio.portfolioManager.equals(req.user._id)) ||
                        (!!portfolio.backupPortfolioManager && portfolio.backupPortfolioManager.equals(req.user._id));
                    callback(null);
                });
            } else {
                callback(null);
            }
        },
        // Set flag if user role is "super-hero"
        function(callback) {
            authObj.isSuperhero = !!_.find(req.user.roles, function(role){
                return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
            });
            callback(null);
        }
    ], function (err) {
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if(!(authObj.isPortfolioManager || authObj.isProjectManager || authObj.isSuperhero)){
            return res.status(403).send({
                message: 'User is not authorized'
            });
        }
        next();
    });
};

// Portfolio assignment
exports.hasAssignmentAuthorization = function(req, res, next) {
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    var allowNull = function(obj){
        if(obj){
            return obj._id;
        } else {
            return null;
        }
    };

    var sourcePortfolioId = req.project.portfolio;
    var targetPortfolioId = allowNull(req.body.portfolio); // Cleanup deepPopulate
    var authArray = [];

    async.waterfall([
        // Get source portfolio object
        function(callback) {
            var authPortfolios = {
                sourcePortfolio : null,
                targetPortfolio : null
            };
            if(sourcePortfolioId){
                Portfolio.findById(sourcePortfolioId).exec(function(err, portfolio) {
                    if(err){
                        return callback(err);
                    }
                    authPortfolios.sourcePortfolio = portfolio;
                    callback(null, authPortfolios);
                });
            } else {
                authPortfolios.sourcePortfolio = null;
                callback(null, authPortfolios);
            }
        },
        // Get target portfolio object
        function(authPortfolios, callback) {
            if(targetPortfolioId){
                Portfolio.findById(targetPortfolioId).exec(function(err, portfolio) {
                    if(err){
                        return callback(err);
                    }
                    authPortfolios.targetPortfolio = portfolio;
                    callback(null, authPortfolios);
                });
            } else {
                authPortfolios.targetPortfolio = null;
                callback(null, authPortfolios);
            }
        },
        function(authPortfolios, callback) {
            var isSourcePM, isSourceBackupPM, isTargetPM, isTargetBackupPM;
            var sourcePortfolio = authPortfolios.sourcePortfolio;
            var targetPortfolio = authPortfolios.targetPortfolio;

            // If both source and target not null, must be portfolio manager of both
            if(sourcePortfolio && targetPortfolio){
                isSourcePM = !!sourcePortfolio.portfolioManager && sourcePortfolio.portfolioManager.equals(req.user._id);
                isSourceBackupPM = !!sourcePortfolio.backupPortfolioManager && sourcePortfolio.backupPortfolioManager.equals(req.user._id);
                isTargetPM = !!targetPortfolio.portfolioManager && targetPortfolio.portfolioManager.equals(req.user._id);
                isTargetBackupPM = !!targetPortfolio.backupPortfolioManager && targetPortfolio.backupPortfolioManager.equals(req.user._id);

                authArray.push((isSourcePM || isSourceBackupPM) && (isTargetPM || isTargetBackupPM));
            }
            // If source null and target exist, must be portfolio manager of target
            if(!sourcePortfolio && targetPortfolio){
                isTargetPM = !!targetPortfolio.portfolioManager && targetPortfolio.portfolioManager.equals(req.user._id);
                isTargetBackupPM = !!targetPortfolio.backupPortfolioManager && targetPortfolio.backupPortfolioManager.equals(req.user._id);

                authArray.push(isTargetPM || isTargetBackupPM);
            }
            // If source exist and target is null, must be portfolio manager of source
            if(sourcePortfolio && !targetPortfolio){
                isSourcePM = !!sourcePortfolio.portfolioManager && sourcePortfolio.portfolioManager.equals(req.user._id);
                isSourceBackupPM = !!sourcePortfolio.backupPortfolioManager && sourcePortfolio.backupPortfolioManager.equals(req.user._id);

                authArray.push(isSourcePM || isSourceBackupPM);
            }
            // if both source and target null, authorize
            if(!sourcePortfolio && !targetPortfolio){
                authArray.push(true);
            }

            callback(null);
        },
        // Set flag if user role is "super-hero"
        function(callback) {
            authArray.push(!!_.find(req.user.roles, function(role){
                return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
            }));
            callback(null);
        }
    ], function (err) {
        if(err){
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if(
            !_.some(authArray, function(elem){
                return elem === true;
            })
        ){
            return res.status(403).send({
                message: 'User is not authorized'
            });
        }
        next();
    });
};

// Gate Reviews approval
exports.hasApproveAuthorization = function(req, res, next){
    next();
};

// Editable Objects

exports.isGateReviewEditable = function(req, res, next){
    next();
};

exports.isChangeRequestEditable = function(req, res, next){
    next();
};

exports.isStatusUpdateEditable = function(req, res, next){
    next();
};
