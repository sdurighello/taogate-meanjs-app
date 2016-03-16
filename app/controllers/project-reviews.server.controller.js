'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Project review
 */
exports.create = function(req, res) {

	var ProjectReview = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReview');
    var ProjectReviewTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReviewTemplate');

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var Person = mongoose.mtModel(req.user.tenantId + '.' + 'Person');


    var projectReview = new ProjectReview(req.body);
	projectReview.user = req.user;
    projectReview.approval.currentRecord.user = req.user;

    async.waterfall([
        // Get template for new review
        function(callback) {
            ProjectReviewTemplate.findById(req.body.template).exec(function(err, template){
                if(err){
                    return callback(err);
                }
                callback(null, template);
            });
        },
        // Create peopleReviews array
        function(template, callback) {
            Project.findById(req.body.project).exec(function(err, project){
                if(err){
                    return callback(err);
                }
                callback(null, template, project);
            });
        },
        // Create new review from template
        function(template, project, callback) {
            projectReview.type = template.type;
            projectReview.groups = template.groups;
            _.each(projectReview.groups, function(reviewGroup){
                _.each(reviewGroup.peopleGroups, function(peopleGroup){
                    if(_.find(project.stakeholders, function(stakeholderGroup){
                            return stakeholderGroup.group.equals(peopleGroup);
                        })){
                        var foundGroup = _.find(project.stakeholders, function(stakeholderGroup){
                            return stakeholderGroup.group.equals(peopleGroup);
                        });
                        var foundPeople = _.map(foundGroup.roles, function(stakeholderRole){
                            return {
                                peopleGroup : peopleGroup,
                                peopleRole : stakeholderRole.role,
                                person : stakeholderRole.person,
                                comment : '',
                                score : null
                            };
                        });
                        _.each(reviewGroup.items, function(item){
                            item.peopleReviews = foundPeople;
                        });

                    }
                });
            });
            callback(null);
        },
        // Save the new project review
        function(callback){
            projectReview.save(function(err, result) {
                if (err) {
                    return callback(err);
                } else {
                    callback(null, result);
                }
            });
        },
        // Populate names of person
        function(result, callback) {
            Person.populate(result, {path: 'groups.items.peopleReviews.person'}, function(err, populatedResult){
                if(err){
                    return callback(err);
                }
                callback(null, populatedResult);
            });
        }
    ], function (err, populatedResult) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(populatedResult);
        }
    });
};

/**
 * Show the current Project review
 */
exports.read = function(req, res) {
	res.jsonp(req.projectReview);
};

/**
 * Update a Project review
 */
exports.update = function(req, res) {
	var projectReview = req.projectReview ;
	projectReview.user = req.user;
	projectReview.created = Date.now();
	projectReview = _.extend(projectReview , req.body);

	projectReview.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReview);
		}
	});
};

/**
 * Delete an Project review
 */
exports.delete = function(req, res) {
	var projectReview = req.projectReview ;

	projectReview.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReview);
		}
	});
};

/**
 * List of Project reviews
 */
exports.list = function(req, res) {
	var ProjectReview = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReview');
	ProjectReview.find(req.query)
        .populate('user', 'displayName')
        .populate('groups.items.peopleReviews.person')
        .populate('approval.currentRecord.user', 'displayName')
        .populate('approval.history.user', 'displayName')
        .exec(function(err, projectReviews) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReviews);
		}
	});
};

/**
 * Project review middleware
 */
exports.projectReviewByID = function(req, res, next, id) {
	var ProjectReview = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReview');
	ProjectReview.findById(id)
        .populate('user', 'displayName')
        .populate('groups.items.peopleReviews.person')
        .populate('approval.currentRecord.user', 'displayName')
        .populate('approval.history.user', 'displayName')
        .exec(function(err, projectReview) {
		if (err) return next(err);
		if (! projectReview) return next(new Error('Failed to load Project review ' + id));
		req.projectReview = projectReview ;
		next();
	});
};


exports.updateHeader = function(req, res){
    var projectReview = req.projectReview ;

    projectReview.user = req.user;
    projectReview.created = Date.now();
    projectReview.name = req.body.name;
    projectReview.startDate = req.body.startDate;
    projectReview.endDate = req.body.endDate;
    projectReview.description = req.body.description;

    projectReview.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectReview);
        }
    });
};


// ---------------- PEOPLE REVIEW --------------------

exports.updatePeopleReview = function(req, res){

    var projectReview = req.projectReview ;

    var peopleReview = projectReview.groups.id(req.params.groupId).items.id(req.params.itemId).peopleReviews.id(req.params.peopleReviewId);
    peopleReview.score = req.body.score;
    peopleReview.comment = req.body.comment;
    peopleReview.user = req.user;
    peopleReview.created = Date.now();

    projectReview.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(peopleReview);
        }
    });
};



exports.submitPeopleReview = function(req, res){

    var projectReview = req.projectReview ;

    var peopleReview = projectReview.groups.id(req.params.groupId).items.id(req.params.itemId).peopleReviews.id(req.params.peopleReviewId);
    peopleReview.submitted = true;
    peopleReview.user = req.user;
    peopleReview.created = Date.now();

    projectReview.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(peopleReview);
        }
    });
};


// ----------------------- APPROVAL ----------------------


exports.draft = function(req, res){
    var projectReview = req.projectReview;

    projectReview.approval.history.push({
        approvalState : projectReview.approval.currentRecord.approvalState,
        user : projectReview.approval.currentRecord.user,
        created : projectReview.approval.currentRecord.created
    });

    projectReview.approval.currentRecord.approvalState = 'draft';
    projectReview.approval.currentRecord.user = req.user;
    projectReview.approval.currentRecord.created = Date.now();

    projectReview.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectReview);
        }
    });

};

exports.submit = function(req, res){
    var projectReview = req.projectReview;

    projectReview.approval.history.push({
        approvalState : projectReview.approval.currentRecord.approvalState,
        user : projectReview.approval.currentRecord.user,
        created : projectReview.approval.currentRecord.created
    });

    projectReview.approval.currentRecord.approvalState = 'submitted';
    projectReview.approval.currentRecord.user = req.user;
    projectReview.approval.currentRecord.created = Date.now();

    projectReview.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectReview);
        }
    });
};

exports.complete = function(req, res){
    var projectReview = req.projectReview;

    projectReview.approval.history.push({
        approvalState : projectReview.approval.currentRecord.approvalState,
        user : projectReview.approval.currentRecord.user,
        created : projectReview.approval.currentRecord.created
    });

    projectReview.approval.currentRecord.approvalState = 'completed';
    projectReview.approval.currentRecord.user = req.user;
    projectReview.approval.currentRecord.created = Date.now();

    projectReview.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectReview);
        }
    });
};



/**
 * Project review authorization middleware
 */

exports.hasManagementAuthorization = function(req, res, next) {
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    var authArray = [];

    async.waterfall([
        // Set flag if "project manager" or "backup project manager" of this project
        function(callback) {
            Project.findById(req.projectReview.project).exec(function(err, project){
                if(err){
                    callback(err);
                } else {
                    authArray.push(!!project.identification.projectManager && project.identification.projectManager.equals(req.user._id));
                    authArray.push(!!project.identification.backupProjectManager && project.identification.backupProjectManager.equals(req.user._id));
                    callback(null, project);
                }
            });
        },
        function(project, callback) {
            // Set flag if "portfolio manager" or "backup portfolio manager" of the project's portfolio
            if(project.portfolio){
                Portfolio.findById(project.portfolio).exec(function(err, portfolio) {
                    if(err){
                        return callback(err);
                    }
                    authArray.push(!!portfolio.portfolioManager && portfolio.portfolioManager.equals(req.user._id));
                    authArray.push(!!portfolio.backupPortfolioManager && portfolio.backupPortfolioManager.equals(req.user._id));
                    callback(null);
                });
            } else {
                callback(null);
            }
        },
        // Set flag if user role is "super-hero"
        function(callback) {
            authArray.push(!!_.find(req.user.roles, function(role){
                return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
            }));
            callback(null);
        }
    ], function (err) {
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if(
            !_.some(authArray, function(elem){
                return elem === true;
            })
        ){
            return res.status(403).send({
                message: 'User is not authorized'
            });
        }

        next();

    });
};

exports.hasReviewAuthorization = function(req, res, next) {

    var authArray = [];

    // Set flag if user is the "assigned reviewer"
    var peopleReview = req.projectReview.groups.id(req.params.groupId).items.id(req.params.itemId).peopleReviews.id(req.params.peopleReviewId);
    authArray.push(req.user._id.equals(peopleReview.person.assignedUser));

    // Set flag if user role is "super-hero"
    authArray.push(!!_.find(req.user.roles, function(role){
        return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
    }));

    if(!_.some(authArray, function(elem){ return elem === true; })){
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }

    next();

};
