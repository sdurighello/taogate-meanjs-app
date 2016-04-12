'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Portfolio review
 */
exports.create = function(req, res) {
	var PortfolioReview = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReview');
	var PortfolioReviewTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReviewTemplate');

	var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
	var Person = mongoose.mtModel(req.user.tenantId + '.' + 'Person');


	var portfolioReview = new PortfolioReview(req.body);
	portfolioReview.user = req.user;
	portfolioReview.approval.currentRecord.user = req.user;

	async.waterfall([
		// Get template for new review
		function(callback) {
			PortfolioReviewTemplate.findById(req.body.template).exec(function(err, template){
				if(err){
					return callback(err);
				}
				callback(null, template);
			});
		},
		// Create peopleReviews array
		function(template, callback) {
			Portfolio.findById(req.body.portfolio).exec(function(err, portfolio){
				if(err){
					return callback(err);
				}
				callback(null, template, portfolio);
			});
		},
		// Create new review from template
		function(template, portfolio, callback) {
			portfolioReview.type = template.type;
			portfolioReview.groups = template.groups;
			_.each(portfolioReview.groups, function(reviewGroup){
				_.each(reviewGroup.peopleGroups, function(peopleGroup){
					if(_.find(portfolio.stakeholders, function(stakeholderGroup){
							return stakeholderGroup.group.equals(peopleGroup);
						})){
						var foundGroup = _.find(portfolio.stakeholders, function(stakeholderGroup){
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
		// Save the new portfolio review
		function(callback){
			portfolioReview.save(function(err, result) {
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
 * Show the current Portfolio review
 */
exports.read = function(req, res) {
	res.jsonp(req.portfolioReview);
};

/**
 * Update a Portfolio review
 */
exports.update = function(req, res) {
	var portfolioReview = req.portfolioReview ;
	portfolioReview.user = req.user;
	portfolioReview.created = Date.now();
	portfolioReview = _.extend(portfolioReview , req.body);

	portfolioReview.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReview);
		}
	});
};

/**
 * Delete an Portfolio review
 */
exports.delete = function(req, res) {
	var portfolioReview = req.portfolioReview ;

	portfolioReview.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReview);
		}
	});
};

/**
 * List of Portfolio reviews
 */
exports.list = function(req, res) {
	var PortfolioReview = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReview');
	PortfolioReview.find(req.query)
        .populate('user', 'displayName')
        .populate('groups.items.peopleReviews.person')
        .populate('approval.currentRecord.user', 'displayName')
        .populate('approval.history.user', 'displayName')
		.exec(function(err, portfolioReviews) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReviews);
		}
	});
};

/**
 * Portfolio review middleware
 */
exports.portfolioReviewByID = function(req, res, next, id) {
	var PortfolioReview = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReview');
	PortfolioReview.findById(id)
        .populate('user', 'displayName')
		.populate('groups.items.peopleReviews.person')
        .populate('approval.currentRecord.user', 'displayName')
        .populate('approval.history.user', 'displayName')
        .exec(function(err, portfolioReview) {
		if (err) return next(err);
		if (! portfolioReview) return next(new Error('Failed to load Portfolio review ' + id));
		req.portfolioReview = portfolioReview ;
		next();
	});
};


exports.updateHeader = function(req, res){
    var portfolioReview = req.portfolioReview ;

    portfolioReview.user = req.user;
    portfolioReview.created = Date.now();
    portfolioReview.name = req.body.name;
    portfolioReview.startDate = req.body.startDate;
    portfolioReview.endDate = req.body.endDate;
    portfolioReview.description = req.body.description;

    portfolioReview.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioReview);
        }
    });
};



// ---------------- PEOPLE REVIEW --------------------

exports.updatePeopleReview = function(req, res){

    var portfolioReview = req.portfolioReview ;

    var peopleReview = portfolioReview.groups.id(req.params.groupId).items.id(req.params.itemId).peopleReviews.id(req.params.peopleReviewId);
    peopleReview.score = req.body.score;
    peopleReview.comment = req.body.comment;
    peopleReview.user = req.user;
    peopleReview.created = Date.now();

    portfolioReview.save(function(err){
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

    var portfolioReview = req.portfolioReview ;

    var peopleReview = portfolioReview.groups.id(req.params.groupId).items.id(req.params.itemId).peopleReviews.id(req.params.peopleReviewId);
    peopleReview.submitted = true;
    peopleReview.user = req.user;
    peopleReview.created = Date.now();

    portfolioReview.save(function(err){
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
    var portfolioReview = req.portfolioReview;

    portfolioReview.approval.history.push({
        approvalState : portfolioReview.approval.currentRecord.approvalState,
        user : portfolioReview.approval.currentRecord.user,
        created : portfolioReview.approval.currentRecord.created
    });

    portfolioReview.approval.currentRecord.approvalState = 'draft';
    portfolioReview.approval.currentRecord.user = req.user;
    portfolioReview.approval.currentRecord.created = Date.now();

    portfolioReview.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioReview);
        }
    });

};

exports.submit = function(req, res){
    var portfolioReview = req.portfolioReview;

    portfolioReview.approval.history.push({
        approvalState : portfolioReview.approval.currentRecord.approvalState,
        user : portfolioReview.approval.currentRecord.user,
        created : portfolioReview.approval.currentRecord.created
    });

    portfolioReview.approval.currentRecord.approvalState = 'submitted';
    portfolioReview.approval.currentRecord.user = req.user;
    portfolioReview.approval.currentRecord.created = Date.now();

    portfolioReview.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioReview);
        }
    });
};

exports.complete = function(req, res){
    var portfolioReview = req.portfolioReview;

    portfolioReview.approval.history.push({
        approvalState : portfolioReview.approval.currentRecord.approvalState,
        user : portfolioReview.approval.currentRecord.user,
        created : portfolioReview.approval.currentRecord.created
    });

    portfolioReview.approval.currentRecord.approvalState = 'completed';
    portfolioReview.approval.currentRecord.user = req.user;
    portfolioReview.approval.currentRecord.created = Date.now();

    portfolioReview.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioReview);
        }
    });
};



/**
 * Portfolio review authorization middleware
 */

exports.hasCreateAuthorization = function(req, res, next) {
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    var authArray = [];

    async.waterfall([
        // Set flag if "portfolio manager" or "backup portfolio manager" of this portfolio
        function(callback) {
            Portfolio.findById(req.body.portfolio).exec(function(err, portfolio){
                if(err){
                    callback(err);
                } else {
                    authArray.push(!!portfolio.portfolioManager && portfolio.portfolioManager.equals(req.user._id));
                    authArray.push(!!portfolio.backupPortfolioManager && portfolio.backupPortfolioManager.equals(req.user._id));
                    callback(null);
                }
            });
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


exports.hasManagementAuthorization = function(req, res, next) {
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    var authArray = [];

    async.waterfall([
        // Set flag if "portfolio manager" or "backup portfolio manager" of this portfolio
        function(callback) {
            Portfolio.findById(req.portfolioReview.portfolio).exec(function(err, portfolio){
                if(err){
                    callback(err);
                } else {
                    authArray.push(!!portfolio.portfolioManager && portfolio.portfolioManager.equals(req.user._id));
                    authArray.push(!!portfolio.backupPortfolioManager && portfolio.backupPortfolioManager.equals(req.user._id));
                    callback(null);
                }
            });
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
    var peopleReview = req.portfolioReview.groups.id(req.params.groupId).items.id(req.params.itemId).peopleReviews.id(req.params.peopleReviewId);
    authArray.push(req.user._id.equals(peopleReview.person.assignedUser));

    // Set flag if user role is "super-hero"
    authArray.push(!!_.find(req.user.roles, function (role) {
        return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
    }));

    if (!_.some(authArray, function (elem) {
            return elem === true;
        })) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }

    next();
};
