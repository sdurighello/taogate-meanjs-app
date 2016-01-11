'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    async = require('async'),
	_ = require('lodash');

/**
 * Create a Project change request
 */

exports.create = require('./project-change-requests/project-change-requests.create.server.controller').create;



/**
 * Show the current Project change request
 */
exports.read = function(req, res) {
	res.jsonp(req.projectChangeRequest);
};



/**
 * Update a Project change request
 */
exports.update = function(req, res) {
	var projectChangeRequest = req.projectChangeRequest ;

	projectChangeRequest = _.extend(projectChangeRequest , req.body);

	projectChangeRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectChangeRequest);
		}
	});
};


exports.updateHeader = require('./project-change-requests/project-change-requests.updateHeader.server.controller').updateHeader;

exports.updateStatus = require('./project-change-requests/project-change-requests.updateStatus.server.controller').updateStatus;

// --- Approval ---

exports.submit = require('./project-change-requests/project-change-requests.submit.server.controller.js').submit;

exports.approve = require('./project-change-requests/project-change-requests.approve.server.controller.js').approve;

// --- Baseline ---

exports.updateBaselineDuration = require('./project-change-requests/project-change-requests.updatePerformance.server.controller.js').updateBaselineDuration;

exports.updateBaselineCost = require('./project-change-requests/project-change-requests.updatePerformance.server.controller.js').updateBaselineCost;

exports.updateBaselineCompletion = require('./project-change-requests/project-change-requests.updatePerformance.server.controller.js').updateBaselineCompletion;

// --- Estimate ---

exports.updateEstimateDuration = require('./project-change-requests/project-change-requests.updatePerformance.server.controller.js').updateEstimateDuration;

exports.updateEstimateCost = require('./project-change-requests/project-change-requests.updatePerformance.server.controller.js').updateEstimateCost;

exports.updateEstimateCompletion = require('./project-change-requests/project-change-requests.updatePerformance.server.controller.js').updateEstimateCompletion;

// --- Actual ---

exports.updateActualDuration = require('./project-change-requests/project-change-requests.updatePerformance.server.controller.js').updateActualDuration;

exports.updateActualCost = require('./project-change-requests/project-change-requests.updatePerformance.server.controller.js').updateActualCost;

exports.updateActualCompletion = require('./project-change-requests/project-change-requests.updatePerformance.server.controller.js').updateActualCompletion;





/**
 * Delete an Project change request
 */
exports.delete = function(req, res) {
	var projectChangeRequest = req.projectChangeRequest ;

	projectChangeRequest.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectChangeRequest);
		}
	});
};

/**
 * List of Project change requests
 */
exports.list = function(req, res) {
    var ProjectChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectChangeRequest');
    ProjectChangeRequest.find().deepPopulate([]).populate('user', 'displayName').exec(function(err, projectChangeRequests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectChangeRequests);
		}
	});
};

/**
 * List of changes for a project
 */
exports.changeRequestsForProject = require('./project-change-requests/project-change-requests.requestsForProject.server.controller.js').changeRequestsForProject;


/**
 * Project change request middleware
 */
exports.projectChangeRequestByID = function(req, res, next, id) {
    var ProjectChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectChangeRequest');
	ProjectChangeRequest.findById(id).deepPopulate([
        'baselineDurationReviews.baselineDuration.targetGate', 'estimateDurationReviews.estimateDuration.targetGate', 'actualDurationReviews.actualDuration.targetGate',
        'baselineCostReviews.baselineCost.targetGate', 'estimateCostReviews.estimateCost.targetGate', 'actualCostReviews.actualCost.targetGate',
        'baselineCompletionReviews.baselineCompletion.targetGate', 'estimateCompletionReviews.estimateCompletion.targetGate', 'actualCompletionReviews.actualCompletion.targetGate'
    ]).populate('user', 'displayName').populate('appliedChanges.user', 'displayName').exec(function(err, projectChangeRequest) {
		if (err) return next(err);
		if (! projectChangeRequest) return next(new Error('Failed to load Project change request ' + id));
		req.projectChangeRequest = projectChangeRequest ;
		next();
	});
};

/**
 * Project change request authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    var roleIsAuthorized = _.some(req.user.roles, function(role){
        return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
    });
    if(!roleIsAuthorized){
        return res.status(403).send({
            message: 'Role is not authorized'
        });
    }

    next();
};
