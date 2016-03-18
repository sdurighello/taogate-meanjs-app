'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Project milestone
 */
exports.create = function(req, res) {
	var ProjectMilestone = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectMilestone');
	var projectMilestone = new ProjectMilestone(req.body);
	projectMilestone.user = req.user;

    projectMilestone.statusReview = {
        currentRecord : {
            baselineDeliveryDate : null,
            estimateDeliveryDate : null,
            actualDeliveryDate : null,
            completed : false,
            status: null,
            statusComment : '',
            created: Date.now(),
            user: req.user
        },
        history : []
    };

	projectMilestone.save(function(err) {
		if (err) {
            console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectMilestone);
		}
	});
};

/**
 * Show the current Project milestone
 */
exports.read = function(req, res) {
	res.jsonp(req.projectMilestone);
};

/**
 * Update a Project milestone
 */
exports.update = function(req, res) {
	var projectMilestone = req.projectMilestone ;
    projectMilestone.user = req.user;
    projectMilestone.created = Date.now();
	projectMilestone = _.extend(projectMilestone , req.body);

	projectMilestone.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectMilestone);
		}
	});
};

exports.updateHeader = function(req, res) {

    var projectMilestone = req.projectMilestone ;

    projectMilestone.user = req.user;
    projectMilestone.created = Date.now();
    projectMilestone.name = req.body.name;
    projectMilestone.description = req.body.description;
    projectMilestone.state = req.body.state;
    projectMilestone.type = req.body.type;


    projectMilestone.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectMilestone);
        }
    });
};

exports.updateStatus = function(req, res) {
    var projectMilestone = req.projectMilestone ;

    projectMilestone.statusReview.history.push({
        baselineDeliveryDate : projectMilestone.statusReview.currentRecord.baselineDeliveryDate,
        estimateDeliveryDate : projectMilestone.statusReview.currentRecord.estimateDeliveryDate,
        actualDeliveryDate : projectMilestone.statusReview.currentRecord.actualDeliveryDate,
        status : projectMilestone.statusReview.currentRecord.status,
        completed : projectMilestone.statusReview.currentRecord.completed,
        statusComment : projectMilestone.statusReview.currentRecord.statusComment,
        user : projectMilestone.statusReview.currentRecord.user,
        created : projectMilestone.statusReview.currentRecord.created
    });
    projectMilestone.statusReview.currentRecord.user = req.user;
    projectMilestone.statusReview.currentRecord.created = Date.now();
    projectMilestone.statusReview.currentRecord.baselineDeliveryDate = req.body.statusReview.currentRecord.baselineDeliveryDate;
    projectMilestone.statusReview.currentRecord.estimateDeliveryDate = req.body.statusReview.currentRecord.estimateDeliveryDate;
    projectMilestone.statusReview.currentRecord.actualDeliveryDate = req.body.statusReview.currentRecord.actualDeliveryDate;
    projectMilestone.statusReview.currentRecord.status = req.body.statusReview.currentRecord.status;
    projectMilestone.statusReview.currentRecord.completed = req.body.statusReview.currentRecord.completed;
    projectMilestone.statusReview.currentRecord.statusComment = req.body.statusReview.currentRecord.statusComment;

    projectMilestone.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectMilestone);
        }
    });
};

exports.milestonesForProject = function(req, res) {

    var ProjectMilestone = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectMilestone');
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    async.waterfall([
        // Get the project and populate its process's gates
        function(callback) {
            Project.findById(req.query.project).deepPopulate(['process.gates']).exec(function(err, project){
                if(err){
                    return callback(err);
                }
                if(!project){
                    return callback(new Error('Failed to load project ' + req.query.project));
                }
                callback(null, project);
            });
        },
        // Get all the milestones for that project
        function(project, callback) {
            ProjectMilestone.find(req.query).populate('user', 'displayName').exec(function(err, milestones) {
                if (err) {
                    return callback(err);
                }
                if(!milestones){
                    return callback(new Error('Failed to load milestone for project ' + project._id));
                }
                callback(null, project, milestones);
            });
        },
        // Create the projectMilestoneList array
        function(project, milestones, callback) {

            var projectMilestoneList = _.chain(project.process.gates)
                .map(function (gate) {
                    return {
                        gate: gate,
                        projectMilestones: _.filter(milestones, function(milestone){
                            return milestone.gate.equals(gate._id);
                        })
                    };
                })
                .value();

            callback(null, projectMilestoneList);
        },
        // Sort by gate position (since lodash sortBy in the chain doesn't seem to work ...
        function(projectMilestoneList, callback) {

            async.sortBy(projectMilestoneList, function(reviewObj, callback){
                callback(null, reviewObj.gate.position);
            }, function(err, projectMilestoneList){
                if(err){
                    return callback(err);
                }
                callback(null, projectMilestoneList);
            });
        }
    ], function (err, projectMilestoneList) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectMilestoneList);
        }
    });
};


/**
 * Delete an Project milestone
 */
exports.delete = function(req, res) {
	var projectMilestone = req.projectMilestone ;

	projectMilestone.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectMilestone);
		}
	});
};

/**
 * List of Project milestones
 */
exports.list = function(req, res) {
    var ProjectMilestone = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectMilestone');
    ProjectMilestone.find(req.query).populate('user', 'displayName').exec(function(err, projectMilestones) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectMilestones);
		}
	});
};

/**
 * Project milestone middleware
 */
exports.projectMilestoneByID = function(req, res, next, id) {
    var ProjectMilestone = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectMilestone');
    ProjectMilestone.findById(id).populate('user', 'displayName').exec(function(err, projectMilestone) {
		if (err) return next(err);
		if (! projectMilestone) return next(new Error('Failed to load Project milestone ' + id));
		req.projectMilestone = projectMilestone ;
		next();
	});
};

/**
 * Project milestone authorization middleware
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
            Project.findById(req.projectMilestone.project).populate('portfolio').exec(function(err, project) {
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
