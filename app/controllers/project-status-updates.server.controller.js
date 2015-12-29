'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Project status update
 */

exports.create = require('./gate-reviews/gate-reviews.create.server.controller').create;

/**
 * Show the current Project status update
 */
exports.read = function(req, res) {
	res.jsonp(req.projectStatusUpdate);
};

/**
 * Update a Project status update
 */
exports.update = function(req, res) {
	var projectStatusUpdate = req.projectStatusUpdate ;
	projectStatusUpdate.user = req.user;
	projectStatusUpdate.created = Date.now();
	projectStatusUpdate = _.extend(projectStatusUpdate , req.body);

	projectStatusUpdate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectStatusUpdate);
		}
	});
};

exports.updateHeader = require('./project-status-updates/project-status-updates.updateHeader.server.controller').updateHeader;

exports.updateGateStatus = require('./project-status-updates/project-status-updates.updateGateStatus.server.controller').updateGateStatus;

exports.updateOutcome = require('./project-status-updates/project-status-updates.updateOutcome.server.controller').updateOutcome;

exports.updateStatusArea = require('./project-status-updates/project-status-updates.updateStatusArea.server.controller').updateStatusArea;


// --- Apply update ---

exports.applyUpdate = require('./project-status-updates/project-status-updates.applyUpdate.server.controller.js').applyUpdate;

// --- Estimate ---

exports.updateEstimateDuration = require('./project-status-updates/project-status-updates.updatePerformance.server.controller.js').updateEstimateDuration;

exports.updateEstimateCost = require('./project-status-updates/project-status-updates.updatePerformance.server.controller.js').updateEstimateCost;

exports.updateEstimateCompletion = require('./project-status-updates/project-status-updates.updatePerformance.server.controller.js').updateEstimateCompletion;


/**
 * Delete an Project status update
 */
exports.delete = function(req, res) {
	var projectStatusUpdate = req.projectStatusUpdate ;

	projectStatusUpdate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectStatusUpdate);
		}
	});
};

/**
 * List of Project status updates
 */
exports.list = function(req, res) {
	var ProjectStatusUpdate = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectStatusUpdate');
	ProjectStatusUpdate.find().populate('user', 'displayName').exec(function(err, projectStatusUpdates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectStatusUpdates);
		}
	});
};

/**
 * Project status update middleware
 */
exports.projectStatusUpdateByID = function(req, res, next, id) {
	var ProjectStatusUpdate = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectStatusUpdate');
	ProjectStatusUpdate.findById(id).deepPopulate([
        'gateStatusUpdate.gateStatusAssignment',
        'outcomeStatusUpdates.outcomeReview.outcome',
        'statusAreaUpdates.projectAreaReview.statusArea',
        'estimateDurationReviews.estimateDuration.targetGate',
        'estimateCostReviews.estimateCost.targetGate',
        'estimateCompletionReviews.estimateCompletion.targetGate'
    ]).populate('user', 'displayName').exec(function(err, projectStatusUpdate) {
		if (err) return next(err);
		if (! projectStatusUpdate) return next(new Error('Failed to load Project status update ' + id));
		req.projectStatusUpdate = projectStatusUpdate ;
		next();
	});
};

/**
 * Project status update authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// User role check
	if(!_.find(req.user.roles, function(role){
			return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
		})
	){
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
