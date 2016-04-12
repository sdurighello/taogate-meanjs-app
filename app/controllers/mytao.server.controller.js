'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');



// -------------------------

exports.getUserProjects = function(req, res) {

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    Project.find({
        $and: [{'selection.active' : true}, {
            $or: [ { 'identification.projectManager': req.user._id }, { 'identification.backupProjectManager': req.user._id } ]
        }]
    }).populate('user', 'displayName').exec(function(err, projects) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projects);
        }
    });

};



exports.getUserPortfolios = function(req, res) {

    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    Portfolio.find({
        $or: [ { portfolioManager: req.user._id }, { backupPortfolioManager: req.user._id } ]
    }).populate('user', 'displayName').exec(function(err, portfolios) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolios);
        }
    });

};


exports.getUserProjectReviews = function(req, res) {

    var ProjectReview = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReview');
    var Person = mongoose.mtModel(req.user.tenantId + '.' + 'Person');

    // Find the 'person' associated to that user
    Person.findOne({assignedUser: req.user._id}).exec(function(err, person) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if(!person){
            return res.status(400).send({message :'Cannot find person for user ' + req.user.displayName});
        }
        // Return all reviews 'submitted by PM (header)' and 'not submitted by person (peopleReview)' associated with that person
        ProjectReview.find({
            $and: [
                {'approval.currentRecord.approvalState': 'submitted'},
                {'groups.items.peopleReviews.person': person._id},
                {'groups.items.peopleReviews.submitted': false}
            ]
        }).populate('project', 'identification.name').exec(function(err, reviews) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(reviews);
            }
        });
    });
};


exports.getUserPortfolioReviews = function(req, res) {

    var PortfolioReview = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReview');
    var Person = mongoose.mtModel(req.user.tenantId + '.' + 'Person');

    // Find the 'person' associated to that user
    Person.findOne({assignedUser: req.user._id}).exec(function(err, person) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if(!person){
            return res.status(400).send({message : 'Cannot find person for user ' + req.user.displayName});
        }
        // Return all reviews 'submitted by PM (header)' and 'not submitted by person (peopleReview)' associated with that person
        PortfolioReview.find({
            $and: [
                {'approval.currentRecord.approvalState': 'submitted'},
                {'groups.items.peopleReviews.person': person._id},
                {'groups.items.peopleReviews.submitted': false}
            ]
        }).populate('portfolio', 'name').exec(function(err, reviews) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(reviews);
            }
        });
    });
};


exports.getUserImprovementActivities = function(req, res) {

    var ImprovementActivity = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementActivity');
    var Person = mongoose.mtModel(req.user.tenantId + '.' + 'Person');

    // Find the 'person' associated to that user
    Person.findOne({assignedUser: req.user._id}).exec(function(err, person) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if(!person){
            return res.status(400).send({message : 'Cannot find person for user ' + req.user.displayName});
        }
        // Return all activities 'not completed' associated with that person
        ImprovementActivity.find({
            $and: [
                {'statusReview.currentRecord.completed': {$ne: true}},
                {'assignedTo': person._id}
            ]
        }).deepPopulate([
            'portfolio', 'assignedTo', 'type', 'reason', 'state', 'priority', 'statusReview.currentRecord.status'
        ]).populate('user', 'displayName')
            .exec(function(err, activities) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(activities);
            }
        });
    });
};


exports.getUserProjectChangeRequests = function(req, res) {
/*
* All change requests for all projects in the portfolio that need to be approved by the user because
* it is either the Portfolio Manager for that portfolio or a SuperHero
*/
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var ProjectChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectChangeRequest');

    async.waterfall([
        // Find all portfolios where the user is either the Portfolio Manager or the Backup Portfolio Manager
        function(callback) {
            var portfolioIds = [];
            Portfolio.find({
                $or:[
                    {'portfolioManager':req.user._id},
                    {'backupPortfolioManager':req.user._id}
                ]
            }).exec(function (err, portfolios) {
                if (err) {
                    return callback(err);
                }
                // If portfolios is empty, return it empty to the next step to satisfy a Superhero with no portfolios
                if(portfolios){
                    _.each(portfolios, function (portfolio) {
                        portfolioIds.push(portfolio._id);
                    });
                }
                callback(null, portfolioIds);
            });
        },
        // Find all the projects belonging to those portfolios.
        // If Superhero, add also the projects without portfolio.
        function(portfolioIds, callback) {

            var projectIds = [];

            var isSuperhero = !!_.find(req.user.roles, function(role){
                return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
            });

            var queryObj;
            if(isSuperhero){
                queryObj = {$or:[
                    {'portfolio': {$in: portfolioIds}},
                    {'portfolio': null}
                ]};
            } else {
                queryObj = {'portfolio': {$in: portfolioIds}};
            }

            Project.find(queryObj).exec(function (err, projects) {
                if (err) {
                    return callback(err);
                }
                if(projects){
                    _.each(projects, function (project) {
                        projectIds.push(project._id);
                    });
                }
                callback(null, projectIds);
            });
        },
        // Find the change requests for all projects in those portfolios that need to be approved.
        function(projectIds, callback) {
            ProjectChangeRequest.find({
                $and: [
                    {'project': {$in: projectIds}},
                    {'approval.currentRecord.approvalState' : 'submitted'}
                ]
            }).populate('project', 'identification').exec(function (err, changeRequests) {
                if (err) {
                    return callback(err);
                }
                callback(null, changeRequests);
            });
        }
    ], function (err, changeRequests) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(changeRequests);
        }
    });


};


exports.getUserProjectStatusUpdates = function(req, res) {
    /*
     * All status updates for all projects in the portfolio that need to be approved by the user because
     * it is either the Portfolio Manager for that portfolio or a SuperHero
     */
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var ProjectStatusUpdate = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectStatusUpdate');

    async.waterfall([
        // Find all portfolios where the user is either the Portfolio Manager or the Backup Portfolio Manager
        function(callback) {
            var portfolioIds = [];
            Portfolio.find({
                $or:[
                    {'portfolioManager':req.user._id},
                    {'backupPortfolioManager':req.user._id}
                ]
            }).exec(function (err, portfolios) {
                if (err) {
                    return callback(err);
                }
                // If portfolios is empty, return it empty to the next step to satisfy a Superhero with no portfolios
                if(portfolios){
                    _.each(portfolios, function (portfolio) {
                        portfolioIds.push(portfolio._id);
                    });
                }
                callback(null, portfolioIds);
            });
        },
        // Find all the projects belonging to those portfolios.
        // If Superhero, add also the projects without portfolio.
        function(portfolioIds, callback) {

            var projectIds = [];

            var isSuperhero = !!_.find(req.user.roles, function(role){
                return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
            });

            var queryObj;
            if(isSuperhero){
                queryObj = {$or:[
                    {'portfolio': {$in: portfolioIds}},
                    {'portfolio': null}
                ]};
            } else {
                queryObj = {'portfolio': {$in: portfolioIds}};
            }

            Project.find(queryObj).exec(function (err, projects) {
                if (err) {
                    return callback(err);
                }
                if(projects){
                    _.each(projects, function (project) {
                        projectIds.push(project._id);
                    });
                }
                callback(null, projectIds);
            });
        },
        // Find the status updates for all projects in those portfolios that need to be approved.
        function(projectIds, callback) {
            ProjectStatusUpdate.find({
                $and: [
                    {'project': {$in: projectIds}},
                    {'approval.currentRecord.approvalState' : 'submitted'}
                ]
            }).populate('project', 'identification').exec(function (err, statusUpdates) {
                if (err) {
                    return callback(err);
                }
                callback(null, statusUpdates);
            });
        }
    ], function (err, statusUpdates) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(statusUpdates);
        }
    });


};



exports.getUserGateReviews = function(req, res) {
    /*
     * All gate reviews submitted
     */

    var GateReview = mongoose.mtModel(req.user.tenantId + '.' + 'GateReview');

    GateReview.find({'approval.currentRecord.approvalState': 'submitted'})
        .populate('project', 'identification').populate('gate').exec(function (err, reviews) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(reviews);
        }
    });

};

exports.getUserPortfolioChangeRequests = function(req, res) {
    /*
     * All portfolio change requests submitted
     */

    var PortfolioChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioChangeRequest');

    PortfolioChangeRequest.find({'approval.currentRecord.approvalState': 'submitted'})
        .populate('portfolio','name').exec(function (err, reviews) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(reviews);
        }
    });

};
