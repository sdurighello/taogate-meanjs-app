'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


/**
 * Create a Project
 */

exports.create = function(user, body, callback) {

    var Counter = mongoose.mtModel(user.tenantId + '.' + 'Counter');
    var Project = mongoose.mtModel(user.tenantId + '.' + 'Project');

    var project = new Project(body);
    project.user = user;

    var CategoryGroup = mongoose.mtModel(user.tenantId + '.' + 'CategoryGroup');
    var Category = mongoose.mtModel(user.tenantId + '.' + 'Category');
    var PriorityGroup = mongoose.mtModel(user.tenantId + '.' + 'PriorityGroup');
    var Priority = mongoose.mtModel(user.tenantId + '.' + 'Priority');
    var QualitativeImpactGroup = mongoose.mtModel(user.tenantId + '.' + 'QualitativeImpactGroup');
    var QualitativeImpact = mongoose.mtModel(user.tenantId + '.' + 'QualitativeImpact');
    var RiskCategory = mongoose.mtModel(user.tenantId + '.' + 'RiskCategory');
    var Risk = mongoose.mtModel(user.tenantId + '.' + 'Risk');
    var PeopleCategory = mongoose.mtModel(user.tenantId + '.' + 'PeopleCategory');
    var PeopleProjectGroup = mongoose.mtModel(user.tenantId + '.' + 'PeopleProjectGroup');


    async.series([
        // COUNTER: Add the sequential number
        function(callback){
            Counter.findByIdAndUpdate({_id: 'projectSequence'}, {$inc: { seq: 1} }, function(error, counter)   {
                if(error){
                    return callback(error);
                }
                // Must create the document in 'counter' collection for our entity the first time we create an entity document
                if(!counter){
                    var newCounter = new Counter({
                        _id : 'projectSequence'
                    });
                    newCounter.save(function(err){
                        if(err){
                            return callback( new Error('Failed to create sequence counter for project'));
                        }
                        project.idNumber = 1;
                        callback(null);
                    });
                }
                if(counter) {
                    project.idNumber = counter.seq;
                    callback(null);
                }
            });
        },
        // PROJECT: Save project in its collection
        function(callback){
            project.save(function(err){
                callback(err);
            });
        },
        // PROJECT.CATEGORIZATION: Add all existing groups (and their categories) to new project
        function(callback){
            CategoryGroup.find().exec(function(err, groups){
                if (err) {
                    callback(err);
                } else {
                    async.each(groups, function(group, callback){
                        var obj = {group: group._id, categories: []};
                        async.each(group.categories, function(category, callback){
                            obj.categories.push({
                                category: category,
                                categoryValue: null
                            });
                            callback();
                        }, function(err){
                            if(err){callback(err);} else {
                                project.categorization.push(obj);
                                project.save(function(err){
                                    callback(err);
                                });
                            }
                        });
                    });
                    callback(null);
                }
            });
        },
        // PROJECT.PRIORITIZATION: Add all existing groups (and their priorities) to new project
        function(callback){
            PriorityGroup.find().exec(function(err, groups){
                if (err) {
                    callback(err);
                } else {
                    async.each(groups, function(group, callback){
                        var obj = {group: group._id, priorities: []};
                        async.each(group.priorities, function(priority, callback){
                            obj.priorities.push({
                                priority: priority,
                                priorityValue: null
                            });
                            callback();
                        }, function(err){
                            if(err){callback(err);} else {
                                project.prioritization.push(obj);
                                project.save(function(err){
                                    callback(err);
                                });
                            }
                        });
                    });
                    callback(null);
                }
            });
        },
        // PROJECT.QUALITATIVE-ANALYSIS: Add all existing qualitative-groups (and their impacts) to new project
        function(callback){
            QualitativeImpactGroup.find().exec(function(err, groups){
                if (err) {
                    callback(err);
                } else {
                    async.each(groups, function(group, callback){
                        var obj = {group: group._id, impacts: []};
                        async.each(group.impacts, function(impact, callback){
                            obj.impacts.push({
                                impact: impact,
                                score: null
                            });
                            callback();
                        });
                        project.qualitativeAnalysis.push(obj);
                        project.save(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    });
                    callback(null);
                }
            });
        },
        // PROJECT.RISK-ANALYSIS: Add all existing risks to new project
        function(callback){
            RiskCategory.find().exec(function(err, categories){
                if (err) {
                    callback(err);
                } else {
                    async.each(categories, function(category, callback){
                        var obj = {category: category._id, risks: []};
                        async.each(category.risks, function(risk, callback){
                            obj.risks.push({
                                risk: risk,
                                impact: null,
                                probability: null,
                                severityAssignment: null
                            });
                            callback();
                        });
                        project.riskAnalysis.push(obj);
                        project.save(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    });
                    callback(null);
                }
            });
        },
        // PROJECT.STAKEHOLDERS: Add all existing people groups to new project
        function(callback){
            PeopleProjectGroup.find().exec(function(err, groups){
                if (err) {
                    return callback(err);
                }
                
                _.each(groups, function(group){
                    var newAssignedGroup = project.stakeholders.create({group: group._id, roles: []});
                    project.stakeholders.push(newAssignedGroup);
                });
                
                project.save(function(err){
                    callback(err);
                });
                
            });
        }
    ],function(err){
        if (err) {
            callback(err);
        } else {
            callback(null, project);
        }
    });
};


