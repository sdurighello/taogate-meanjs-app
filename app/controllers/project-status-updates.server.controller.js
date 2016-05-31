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

exports.create = require('./project-status-updates/project-status-updates.create.server.controller').create;

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

// --- Header update ---
exports.updateHeader = require('./project-status-updates/project-status-updates.updateHeader.server.controller').updateHeader;

// --- Gate Status update ---
exports.updateOverallStatus = require('./project-status-updates/project-status-updates.updateGateStatus.server.controller').updateOverallStatus;

exports.updateDurationStatus = require('./project-status-updates/project-status-updates.updateGateStatus.server.controller').updateDurationStatus;

exports.updateCostStatus = require('./project-status-updates/project-status-updates.updateGateStatus.server.controller').updateCostStatus;

exports.updateCompletionStatus = require('./project-status-updates/project-status-updates.updateGateStatus.server.controller').updateCompletionStatus;

// --- Outcomes update ---
exports.updateOutcome = require('./project-status-updates/project-status-updates.updateOutcome.server.controller').updateOutcome;

// --- Status areas update ---
exports.updateStatusArea = require('./project-status-updates/project-status-updates.updateStatusArea.server.controller').updateStatusArea;


// --- Approval ---

exports.submit = require('./project-status-updates/project-status-updates.submit.server.controller.js').submit;

exports.approve = require('./project-status-updates/project-status-updates.approve.server.controller.js').approve;

exports.reject = require('./project-status-updates/project-status-updates.reject.server.controller.js').reject;

exports.draft = require('./project-status-updates/project-status-updates.draft.server.controller.js').draft;

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
	ProjectStatusUpdate.find(req.query).populate('user', 'displayName').exec(function(err, projectStatusUpdates) {
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
        
    ]).populate('user', 'displayName')
        .populate('approval.history.user', 'displayName')
        .populate('approval.currentRecord.user', 'displayName').exec(function(err, projectStatusUpdate) {
		if (err) return next(err);
		if (! projectStatusUpdate) return next(new Error('Failed to load Project status update ' + id));
		req.projectStatusUpdate = projectStatusUpdate ;
		next();
	});
};

/**
 * Project status update authorization middleware
 */


exports.hasCreateAuthorization = function(req, res, next) {

	var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

	var authObj = {
		isProjectManager : false,
		isPortfolioManager : false,
		isSuperhero : false
	};

	async.waterfall([
		// isProjectManager - isPortfolioManager
		function(callback) {
			Project.findById(req.body.project).populate('portfolio').exec(function(err, project) {
				if(err){
					return callback(err);
				}
				authObj.isProjectManager = (!!project.identification.projectManager && project.identification.projectManager.equals(req.user._id)) ||
					(!!project.identification.backupProjectManager && project.identification.backupProjectManager.equals(req.user._id));
				if(project.portfolio){
					authObj.isPortfolioManager = (!!project.portfolio.portfolioManager && project.portfolio.portfolioManager.equals(req.user._id)) ||
						(!!project.portfolio.backupPortfolioManager && project.portfolio.backupPortfolioManager.equals(req.user._id));
				}
				callback(null);
			});
		},
		// isSuperhero
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


exports.hasEditAuthorization = function(req, res, next) {

	var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

	var authObj = {
		isProjectManager : false,
		isPortfolioManager : false,
		isSuperhero : false
	};

	async.waterfall([
		// isProjectManager - isPortfolioManager
		function(callback) {
			Project.findById(req.projectStatusUpdate.project).populate('portfolio').exec(function(err, project) {
				if(err){
					return callback(err);
				}
				authObj.isProjectManager = (!!project.identification.projectManager && project.identification.projectManager.equals(req.user._id)) ||
					(!!project.identification.backupProjectManager && project.identification.backupProjectManager.equals(req.user._id));

				if(project.portfolio){
					authObj.isPortfolioManager = (!!project.portfolio.portfolioManager && project.portfolio.portfolioManager.equals(req.user._id)) ||
						(!!project.portfolio.backupPortfolioManager && project.portfolio.backupPortfolioManager.equals(req.user._id));
				}

				callback(null);
			});
		},
		// isSuperhero
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


// Project Managers can't approve/reject, only submit/draft
exports.hasApproveAuthorization = function(req, res, next) {

	var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

	var authObj = {
		isPortfolioManager : false,
		isSuperhero : false
	};

	async.waterfall([
		// isPortfolioManager
		function(callback) {
			Project.findById(req.projectStatusUpdate.project).populate('portfolio').exec(function(err, project) {
				if(err){
					return callback(err);
				}

				if(project.portfolio){
					authObj.isPortfolioManager = (!!project.portfolio.portfolioManager && project.portfolio.portfolioManager.equals(req.user._id)) ||
						(!!project.portfolio.backupPortfolioManager && project.portfolio.backupPortfolioManager.equals(req.user._id));
				}

				callback(null);
			});
		},
		// isSuperhero
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
		if(!(authObj.isPortfolioManager || authObj.isSuperhero)){
			return res.status(403).send({
				message: 'User is not authorized'
			});
		}
		next();
	});
};


exports.objectIsEditable = function(req, res, next) {

	var objectIsDraft = req.projectStatusUpdate.approval.currentRecord.approvalState === 'draft';

	if(!objectIsDraft){
		return res.status(403).send({
			message: 'Object cannot be edited'
		});
	}

	next();
};
