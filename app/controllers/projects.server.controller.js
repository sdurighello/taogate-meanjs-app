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

    Project.find(req.query).deepPopulate(['process.gates']).populate('user', 'displayName').exec(function(err, projects) {
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
