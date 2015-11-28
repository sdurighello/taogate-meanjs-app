'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Qualitative impact group
 */
exports.create = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var QualitativeImpactGroup = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');
	var qualitativeImpactGroup = new QualitativeImpactGroup(req.body);
	qualitativeImpactGroup.user = req.user;

    async.series([
        // GROUP: Save Group in its collection
        function(callback){
            qualitativeImpactGroup.save(function(err){
                callback(err);
            });
        },
        // PROJECTS: Add new group to all projects
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    callback(err);
                } else {
                    async.each(projects, function(project, callback){
                        project.qualitativeAnalysis.push({
                            group: qualitativeImpactGroup._id,
                            impacts: []
                        });
                        project.save(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    });
                    callback(null);
                }
            });
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(qualitativeImpactGroup);
        }
    });
};

/**
 * Show the current Qualitative impact group
 */
exports.read = function(req, res) {
	res.jsonp(req.qualitativeImpactGroup);
};

/**
 * Update a Qualitative impact group
 */
exports.update = function(req, res) {
	var qualitativeImpactGroup = req.qualitativeImpactGroup ;
    qualitativeImpactGroup.user = req.user;
    qualitativeImpactGroup.created = Date.now();
	qualitativeImpactGroup = _.extend(qualitativeImpactGroup , req.body);

	qualitativeImpactGroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(qualitativeImpactGroup);
		}
	});
};

/**
 * Delete an Qualitative impact group
 */
exports.delete = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var QualitativeImpactGroup = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');
    var QualitativeImpact = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpact');
    var qualitativeImpactGroup = req.qualitativeImpactGroup ;

    async.series([
        // QUALITATIVE-IMPACT-GROUP: Delete Group from its collection
        function(callback){
            qualitativeImpactGroup.remove(function(err){
                callback(err);
            });
        },
        // QUALITATIVE-IMPACTS: Delete all impacts (from "impacts" collection) belonging to this Group
        function(callback){
            async.each(qualitativeImpactGroup.impacts, function(item, callback){
                QualitativeImpact.findByIdAndRemove(item._id, function(err){
                    if(err){callback(err);} else {callback();}
                });
            });
            callback(null);
        },
        // PROJECTS: Delete group object from project.qualitativeAnalysis
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    callback(err);
                } else {
                    async.each(projects, function(project, callback){
                        async.each(project.qualitativeAnalysis, function(assignedGroup, callback){
                            if(assignedGroup.group.equals(qualitativeImpactGroup._id)){
                                assignedGroup.remove(function(err){
                                    if(err){callback(err);}
                                });
                            }
                            callback();
                        });
                        project.save(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    });
                    callback(null);
                }
            });
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(qualitativeImpactGroup);
        }
    });
};

/**
 * List of Qualitative impact groups
 */
exports.list = function(req, res) {
    var QualitativeImpactGroup = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');
	QualitativeImpactGroup.find().deepPopulate(['impacts']).populate('user', 'displayName').exec(function(err, qualitativeImpactGroups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(qualitativeImpactGroups);
		}
	});
};

/**
 * Qualitative impact group middleware
 */
exports.qualitativeImpactGroupByID = function(req, res, next, id) {
    var QualitativeImpactGroup = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');
	QualitativeImpactGroup.findById(id).deepPopulate(['impacts']).populate('user', 'displayName').exec(function(err, qualitativeImpactGroup) {
		if (err) return next(err);
		if (! qualitativeImpactGroup) return next(new Error('Failed to load Qualitative impact group ' + id));
		req.qualitativeImpactGroup = qualitativeImpactGroup ;
		next();
	});
};

/**
 * Qualitative impact group authorization middleware
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
