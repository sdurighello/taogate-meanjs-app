'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');



/**
 * Create a Project
 */

exports.create = require('./projects/projects.create.server.controller').create;


/**
 * Show the current Project
 */
exports.read = function(req, res) {
	res.jsonp(req.project);
};


/**
 * Update a Project
 */
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


/**
 * Delete a Project
 */

exports.delete = require('./projects/projects.delete.server.controller').delete;


/**
 * List of Projects
 */

exports.list = function(req, res) {

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    Project.find(req.query).deepPopulate(['process.gates', 'portfolio']).populate('user', 'displayName').exec(function(err, projects) {
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

// ------------------------------ DELIVERY ------------------------------

exports.updateProcessAssignment = require('./projects/projects.gateProcess.server.controller').updateProcessAssignment;


// -----------------------------------------------------------------------


/**
 * Project middleware
 */

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

/**
 * Project authorization middleware
 */

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
