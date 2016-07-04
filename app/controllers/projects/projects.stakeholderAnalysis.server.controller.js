'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');



/**
 *  Update Stakeholders
 */


exports.createAssignedRole = function(req, res){

    var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');


    // Checks
    if(!req.params.assignedGroupId){
        return res.status(400).send({
            message: 'Assigned stakeholder group ID is required'
        });
    }    
    
    var project = req.project;
    project.user = req.user;
    project.created = Date.now();

    async.waterfall([
        function(callback) {
            PeopleCategory.find().exec(function(err, categories) {
                if (err) {
                    callback(err);
                } else {
                    var categorization = [];
                    _.each(categories, function(category){
                        categorization.push({
                            category: category._id,
                            categoryValue: null
                        });
                    });
                    
                    callback(null, categorization);
                }
            });
        },
        function(categorization, callback) {
            var editedGroup = project.stakeholders.id(req.params.assignedGroupId);
            var newAssignedRole = editedGroup.roles.create({
                role : {
                    name: 'New role'
                },
                person: null,
                categorization: categorization
            });
            
            editedGroup.roles.push(newAssignedRole);
            
            project.save(function(err){
                if(err){
                    return callback(err);
                }
                callback(null, newAssignedRole);
            });
        },
        function(newAssignedRole, callback){
            Project.findById(req.params.projectId).deepPopulate([
                'portfolio', 'stakeholders.group','stakeholders.roles.categorization.category.categoryValues'
            ]).exec(function(err, project){
                if(err){
                    return callback(err);
                }
                var populatedRole = project.stakeholders.id(req.params.assignedGroupId).roles.id(newAssignedRole._id);
                callback(null, populatedRole);
            });
        }
    ], function (err, populatedRole) {
        if( err ) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(populatedRole);
        }
    });
    
    
};


exports.updateAssignedRole = function(req, res) {
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

    var editedAssignedGroup = project.stakeholders.id(req.params.assignedGroupId);
    var editedAssignedRole = editedAssignedGroup.roles.id(req.params.assignedRoleId);

    editedAssignedRole = _.extend(editedAssignedRole, req.body);
    
    project.save(function(err){
        if( err ) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedAssignedRole);
        }
    });

};


exports.deleteAssignedRole = function(req, res){
    
    var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');

    // Checks
    if(!req.params.assignedGroupId){
        return res.status(400).send({
            message: 'Assigned stakeholder group ID is required'
        });
    }
    if(!req.params.assignedRoleId){
        return res.status(400).send({
            message: 'Assigned stakeholder role ID is required'
        });
    }

    var project = req.project;
    project.user = req.user;
    project.created = Date.now();

    var editedGroup = project.stakeholders.id(req.params.assignedGroupId);
    var deletedAssignedRole = editedGroup.roles.id(req.params.assignedRoleId).remove();

    project.save(function(err){
        if( err ) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(deletedAssignedRole);
        }
    });
    
};
