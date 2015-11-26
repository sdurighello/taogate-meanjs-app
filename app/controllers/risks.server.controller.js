'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Risk
 */
exports.create = function(req, res) {
	var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var RiskCategory = mongoose.mtModel(req.user.tenantId + '.' + 'RiskCategory');
	var Risk = mongoose.mtModel(req.user.tenantId + '.' + 'Risk');
	var risk = new Risk(req.body);
	risk.user = req.user;

    async.series([
        // RISKS: Save the new risk to its collection
        function(callback){
            risk.save();
            callback(null, 'one');
        },
        // RISK-CATEGORY.RISKS: Add the priority to the group's "priorities" array
        function(callback){
            RiskCategory.findById(req.query.groupId).exec(function(err, group){
                group.risks.push(risk._id);
                group.save();
            });
            callback(null, 'two');
        },
        // PROJECTS.RISK-ANALYSIS: Add the risk to all existing projects (in the right category)
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    async.each(projects, function(project, callback){
                        async.each(project.riskAnalysis, function(assignedGroup, callback){
                            if(assignedGroup.category.equals(req.query.groupId)){
                                assignedGroup.risks.push({
                                    risk: risk._id,
                                    impact: null,
                                    probability: null,
                                    severity: null
                                });
                            }
                            callback();
                        });
                        project.save();
                        callback();
                    });
                }
            });
            callback(null, 'three');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two', 'three']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(risk);
        }
    });
};

/**
 * Show the current Risk
 */
exports.read = function(req, res) {
	res.jsonp(req.risk);
};

/**
 * Update a Risk
 */
exports.update = function(req, res) {
	var risk = req.risk ;
    risk.user = req.user;
    risk.created = Date.now();
	risk = _.extend(risk , req.body);

	risk.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(risk);
		}
	});
};

/**
 * Delete an Risk
 */
exports.delete = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var risk = req.risk ;
    var RiskCategory = mongoose.mtModel(req.user.tenantId + '.' + 'RiskCategory');

    async.series([
        // RISKS: Delete risk from its collection
        function(callback){
            risk.remove();
            callback(null, 'one');
        },
        // CATEGORY.RISKS: Delete risk from group where assigned
        function(callback){
            RiskCategory.findById(req.query.groupId).exec(function(err, group){
                group.risks.splice(group.risks.indexOf(risk._id), 1);
                group.save();
            });
            callback(null, 'three');
        },
        // PROJECTS.RISK-ANALYSIS: Remove the risk from all existing projects
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    async.each(projects, function(project, callback){
                        async.each(project.riskAnalysis, function(assignedGroup, callback){
                            if(assignedGroup.category.equals(req.query.groupId)){
                                async.each(assignedGroup.risks, function(assignedRisk, callback){
                                    if(assignedRisk.risk.equals(risk._id)){
                                        assignedRisk.remove();
                                    }
                                    callback();
                                });
                            }
                            callback();
                        });
                        project.save();
                        callback();
                    });
                }
            });
            callback(null, 'four');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(risk);
        }
    });
};

/**
 * List of Risks
 */
exports.list = function(req, res) {
    var Risk = mongoose.mtModel(req.user.tenantId + '.' + 'Risk');
	Risk.find().populate('user', 'displayName').exec(function(err, risks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(risks);
		}
	});
};

/**
 * Risk middleware
 */
exports.riskByID = function(req, res, next, id) {
    var Risk = mongoose.mtModel(req.user.tenantId + '.' + 'Risk');
	Risk.findById(id).populate('user', 'displayName').exec(function(err, risk) {
		if (err) return next(err);
		if (! risk) return next(new Error('Failed to load Risk ' + id));
		req.risk = risk ;
		next();
	});
};

/**
 * Risk authorization middleware
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
