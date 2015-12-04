'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


/**
 *  Update a Risk Assignment
 */
exports.updateRiskAssignment = function(req, res) {
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

    var RiskSeverityAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverityAssignment');

    async.waterfall([
        // Find the SEVERITY ASSIGNMENT based on impact and probability
        function(callback){
            RiskSeverityAssignment.findOne({probability: req.body.probabilityId, impact:req.body.impactId},
                function(err, severityAssignment) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, severityAssignment);
                    }
                });
        },
        // Update IMPACT and PROBABILITY and SEVERITY
        function(severityAssignment, callback){
            async.each(project.riskAnalysis, function(assignedCategory, callback){
                if(assignedCategory._id.equals(req.params.assignedCategoryId)){
                    async.each(assignedCategory.risks, function(assignedRisk, callback){
                        if(assignedRisk._id.equals(req.params.assignedRiskId)){
                            assignedRisk.impact = req.body.impactId;
                            assignedRisk.probability = req.body.probabilityId;
                            if(severityAssignment){
                                assignedRisk.severityAssignment = severityAssignment._id;
                            } else {
                                assignedRisk.severityAssignment = null;
                            }
                            project.save(function(err){
                                if(err){callback(err);}
                            });
                        }
                        callback();
                    });
                }
                callback();
            });
            callback(null);
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });
};

