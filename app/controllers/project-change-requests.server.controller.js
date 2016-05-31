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

exports.updateBudget = require('./project-change-requests/project-change-requests.updateBudget.server.controller').updateBudget;

// --- Approval ---

exports.submit = require('./project-change-requests/project-change-requests.submit.server.controller.js').submit;

exports.approve = require('./project-change-requests/project-change-requests.approve.server.controller.js').approve;

exports.reject = require('./project-change-requests/project-change-requests.reject.server.controller.js').reject;

exports.draft = require('./project-change-requests/project-change-requests.draft.server.controller.js').draft;


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
    ]).populate('user', 'displayName').populate('approval.history.user', 'displayName').populate('approval.currentRecord.user', 'displayName').exec(function(err, projectChangeRequest) {
		if (err) return next(err);
		if (! projectChangeRequest) return next(new Error('Failed to load Project change request ' + id));
		req.projectChangeRequest = projectChangeRequest ;
		next();
	});
};

/**
 * Project change request authorization middleware
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
            Project.findById(req.projectChangeRequest.project).populate('portfolio').exec(function(err, project) {
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
            Project.findById(req.projectChangeRequest.project).populate('portfolio').exec(function(err, project) {
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

    var objectIsDraft = req.projectChangeRequest.approval.currentRecord.approvalState === 'draft';

    if(!objectIsDraft){
        return res.status(403).send({
            message: 'Object cannot be edited'
        });
    }

    next();
};
