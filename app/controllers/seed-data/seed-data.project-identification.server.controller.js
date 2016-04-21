'use strict';

/**
 * SEED - PROJECT IDENTIFICATION
 */

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    seedIDs = require('./seed-data.ids.server.controller').getIDs(),
    projectsCreateController = require('../projects/projects.create.server.controller'),
    async = require('async'),
    User = mongoose.model('User');


exports.seedProjects = function(user, callback){

    var schema = mongoose.mtModel(user.tenantId + '.' + 'Project');

    // Parents
    var sn111 = seedIDs.StrategyNode.sn111;

    // Portfolios
    var pn111 = seedIDs.Portfolio.pn111;

    // Projects
    var project1 = seedIDs.Project.project1;
    var project2 = seedIDs.Project.project2;
    var project3 = seedIDs.Project.project3;
    var project4 = seedIDs.Project.project4;
    var project5 = seedIDs.Project.project5;
    var project6 = seedIDs.Project.project6;
    var project7 = seedIDs.Project.project7;
    var project8 = seedIDs.Project.project8;
    var project9 = seedIDs.Project.project9;
    var project10 = seedIDs.Project.project10;

    var seedArray = [
        {
            _id: project1,
            parent: sn111,
            portfolio: pn111,
            identification: {
                idNumber: 'PID1',
                name: 'Radius implementation',
                description: 'Radius implementation',
                earmarkedFunds: 300000,
                reqStartDate: new Date('2015-12-31T23:00:00Z'),
                reqEndDate: new Date('2016-12-30T23:00:00Z'),
                projectManager : null,
                backupProjectManager : null
            },
            categorization: [],
            prioritization: [],
            selection: {
                active: true,
                selectedForPrioritization: true,
                selectedForEvaluation: true,
                selectedForDelivery: true
            },
            discountRate: null,
            baseYear: null,
            costs: [],
            benefits: [],

            qualitativeAnalysis: [],
            riskAnalysis: [],
            stakeholders: [],

            process: null
        }
    ];

    async.each(seedArray, function(item, callbackEach) {
        schema.findById(item._id).exec(function(err, itemReturned){
            if(!itemReturned){
                projectsCreateController.create(user, item, function(err){
                    callbackEach(err);
                });
            } else {
                callbackEach();
            }
        });
    }, function(err){
        if( err ) {
            callback(err);
        } else {
            callback(null, 'Project identification');
        }
    });

};
