'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Qualitative impact
 */
exports.create = function(req, res) {
	var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var QualitativeImpactGroup = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');
    var QualitativeImpact = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpact');
	var qualitativeImpact = new QualitativeImpact(req.body);
	qualitativeImpact.user = req.user;

    async.series([
        // IMPACTS: Save the new impact to its collection
        function(callback){
            qualitativeImpact.save(function(err){
                callback(err);
            });
        },
        // GROUP.IMPACTS: Add the impact to the group's "impacts" array
        function(callback){
            QualitativeImpactGroup.findById(req.query.groupId).exec(function(err, group){
                if(err){
                    callback(err);
                } else {
                    group.impacts.push(qualitativeImpact._id);
                    group.save(function(err){
                        callback(err);
                    });
                }
            });
        },
        // PROJECTS.QUALITATIVE-ANALYSIS: Add the impact to all existing projects
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    callback(err);
                } else {
                    async.each(projects, function(project, callback){
                        async.each(project.qualitativeAnalysis, function(assignedGroup, callback){
                            if(assignedGroup.group.equals(req.query.groupId)){
                                assignedGroup.impacts.push({
                                    impact: qualitativeImpact._id,
                                    score: null
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
            res.jsonp(qualitativeImpact);
        }
    });
};

/**
 * Show the current Qualitative impact
 */
exports.read = function(req, res) {
	res.jsonp(req.qualitativeImpact);
};

/**
 * Update a Qualitative impact
 */
exports.update = function(req, res) {
	var qualitativeImpact = req.qualitativeImpact ;
    qualitativeImpact.user = req.user;
    qualitativeImpact.created = Date.now();
	qualitativeImpact = _.extend(qualitativeImpact , req.body);

	qualitativeImpact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(qualitativeImpact);
		}
	});
};

/**
 * Delete an Qualitative impact
 */
exports.delete = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var qualitativeImpact = req.qualitativeImpact ;
    var QualitativeImpactGroup = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');

    async.series([
        // IMPACTS: Delete impact from its collection
        function(callback){
            qualitativeImpact.remove(function(err){
                callback(err);
            });
        },
        // GROUP.IMPACTS: Delete impact from group where assigned
        function(callback){
            QualitativeImpactGroup.findById(req.query.groupId).exec(function(err, group){
                if(err){
                    callback(err);
                } else {
                    group.impacts.splice(group.impacts.indexOf(qualitativeImpact._id), 1);
                    group.save(function(err){
                        callback(err);
                    });
                }
            });
        },
        // PROJECTS.QUALITATIVE-ANALYSIS: Remove the impact from all existing projects
        function(callback){
            Project.find().exec(function(err, projects){
                if (err) {
                    callback(err);
                } else {
                    async.each(projects, function(project, callback){
                        async.each(project.qualitativeAnalysis, function(assignedGroup, callback){
                            if(assignedGroup.group.equals(req.query.groupId)){
                                async.each(assignedGroup.impacts, function(assignedImpact, callback){
                                    if(assignedImpact.impact.equals(qualitativeImpact._id)){
                                        assignedImpact.remove(function(err){
                                            if(err){callback(err);}
                                        });
                                    }
                                    callback();
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
            res.jsonp(qualitativeImpact);
        }
    });
};

/**
 * List of Qualitative impacts
 */
exports.list = function(req, res) {
    var QualitativeImpact = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpact');
	QualitativeImpact.find().populate('user', 'displayName').exec(function(err, qualitativeImpacts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(qualitativeImpacts);
		}
	});
};

/**
 * Qualitative impact middleware
 */
exports.qualitativeImpactByID = function(req, res, next, id) {
    var QualitativeImpact = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpact');
	QualitativeImpact.findById(id).populate('user', 'displayName').exec(function(err, qualitativeImpact) {
		if (err) return next(err);
		if (! qualitativeImpact) return next(new Error('Failed to load Qualitative impact ' + id));
		req.qualitativeImpact = qualitativeImpact ;
		next();
	});
};

/**
 * Qualitative impact authorization middleware
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
