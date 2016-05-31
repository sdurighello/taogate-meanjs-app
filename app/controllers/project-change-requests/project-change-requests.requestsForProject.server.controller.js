'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


exports.changeRequestsForProject = function(req, res) {

    // var ProjectChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectChangeRequest');
    // var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    //
    // async.waterfall([
    //     // Get the project and populate its process's gates
    //     function(callback) {
    //         Project.findById(req.query.project).deepPopulate(['process.gates']).exec(function(err, project){
    //             if(err){
    //                 return callback(err);
    //             }
    //             if(!project){
    //                 return callback(new Error('Failed to load project ' + req.query.project));
    //             }
    //             callback(null, project);
    //         });
    //     },
    //     // Get all the changes for that project
    //     function(project, callback) {
    //         ProjectChangeRequest.find(req.query).populate('user', 'displayName').exec(function(err, changes) {
    //             if (err) {
    //                 return callback(err);
    //             }
    //             if(!changes){
    //                 return callback(new Error('Failed to load change requests for project ' + project._id));
    //             }
    //             callback(null, project, changes);
    //         });
    //     },
    //     // Create the projectChangeRequestList array
    //     function(project, changes, callback) {
    //
    //         var projectChangeRequestList = _.chain(project.process.gates)
    //             .map(function (gate) {
    //                 return {
    //                     gate: gate,
    //                     projectChangeRequests: _.filter(changes, function(change){
    //                         return change.gate.equals(gate._id);
    //                     })
    //                 };
    //             })
    //             .value();
    //
    //         callback(null, projectChangeRequestList);
    //     },
    //     // Sort by gate position (since lodash sortBy in the chain doesn't seem to work ...
    //     function(projectChangeRequestList, callback) {
    //
    //         async.sortBy(projectChangeRequestList, function(reviewObj, callback){
    //             callback(null, reviewObj.gate.position);
    //         }, function(err, projectChangeRequestList){
    //             if(err){
    //                 return callback(err);
    //             }
    //             callback(null, projectChangeRequestList);
    //         });
    //     }
    // ], function (err, projectChangeRequestList) {
    //     if (err) {
    //         return res.status(400).send({
    //             message: errorHandler.getErrorMessage(err)
    //         });
    //     } else {
    //         res.jsonp(projectChangeRequestList);
    //     }
    // });
};
