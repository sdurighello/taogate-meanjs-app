'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a People portfolio role
 */
exports.create = function(req, res) {
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
    var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');
    var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');
	var PeoplePortfolioRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioRole');
	var peoplePortfolioRole = new PeoplePortfolioRole(req.body);
	peoplePortfolioRole.user = req.user;

    async.series([
        // ROLES: Save the new role to its collection
        function(callback){
            peoplePortfolioRole.save(function(err){
                callback(err);
            });
        },
        // GROUP.ROLES: Add the role to the group's "roles" array
        function(callback){
            PeoplePortfolioGroup.findById(req.query.groupId).exec(function(err, group){
                if (err) {
                    callback(err);
                } else {
                    group.roles.push(peoplePortfolioRole._id);
                    group.save(function(err){
                        callback(err);
                    });
                }
            });
        },
        // PORTFOLIO.STAKEHOLDERS: Add the role to all existing portfolio (requires the "categorization" array built from existing people-categories)
        function(callback){
            async.waterfall([
                // Create the "categorization" array [{category:<objectId>, categoryValue:null}] from all existing people-categories
                function(callback){
                    PeopleCategory.find().exec(function(err, categories) {
                        if (err) {
                            callback(err);
                        } else {
                            var retArray = [];
                            async.each(categories, function(category, callback){
                                retArray.push({
                                    category: category._id,
                                    categoryValue: null
                                });
                                callback();
                            });
                            callback(null, retArray);
                        }
                    });
                },
                // Add to all existing portfolios the new role with the "categorization" array (to the correct people-group)
                function(retArray, callback){
                    Portfolio.find().exec(function(err, portfolios){
                        if (err) {
                            callback(err);
                        } else {
                            async.each(portfolios, function(portfolio, callback){
                                async.each(portfolio.stakeholders, function(assignedGroup, callback){
                                    if(assignedGroup.group.equals(req.query.groupId)){
                                        assignedGroup.roles.push({
                                            role: peoplePortfolioRole._id,
                                            person: null,
                                            categorization: retArray
                                        });
                                    }
                                    callback();
                                });
                                portfolio.save(function(err){
                                    if(err){
                                        callback(err);
                                    } else {
                                        callback();
                                    }
                                });
                            });
                            callback(null);
                        }
                    });
                }
            ],function(err){
                if (err) {
                    callback(err);
                } else {
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
            res.jsonp(peoplePortfolioRole);
        }
    });
};

/**
 * Show the current People portfolio role
 */
exports.read = function(req, res) {
	res.jsonp(req.peoplePortfolioRole);
};

/**
 * Update a People portfolio role
 */
exports.update = function(req, res) {
	var peoplePortfolioRole = req.peoplePortfolioRole ;
    peoplePortfolioRole.user = req.user;
    peoplePortfolioRole.created = Date.now();
	peoplePortfolioRole = _.extend(peoplePortfolioRole , req.body);

    peoplePortfolioRole.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(peoplePortfolioRole);
        }
    });

};

/**
 * Delete an People portfolio role
 */
exports.delete = function(req, res) {
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
    var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');
    var peoplePortfolioRole = req.peoplePortfolioRole ;

    async.series([
        // ROLES: Delete role from its collection
        function(callback){
            peoplePortfolioRole.remove(function(err){
                callback(err);
            });
        },
        // GROUP.ROLES: Delete role from group where assigned
        function(callback){
            PeoplePortfolioGroup.findById(req.query.groupId).exec(function(err, group){
                if(err){
                    callback(err);
                } else {
                    group.roles.splice(group.roles.indexOf(peoplePortfolioRole._id), 1);
                    group.save(function(err){
                        if(err){
                            callback(err);
                        } else {
                            callback(null);
                        }
                    });
                }
            });
        },
        // PORTFOLIOS.STAKEHOLDERS: Remove the role from all existing portfolios
        function(callback){
            Portfolio.find().exec(function(err, portfolios){
                if (err) {
                    callback(err);
                } else {
                    async.each(portfolios, function(portfolio, callback){
                        async.each(portfolio.stakeholders, function(assignedGroup, callback){
                            if(assignedGroup.group.equals(req.query.groupId)){
                                async.each(assignedGroup.roles, function(assignedRole, callback){
                                    if(assignedRole.role.equals(peoplePortfolioRole._id)){
                                        assignedRole.remove(function(err){
                                            if(err){callback(err);}
                                        });
                                    }
                                    callback();
                                });
                            }
                            callback();
                        });
                        portfolio.save(function(err){
                            if(err){
                                callback(err);
                            } else {
                                callback();
                            }
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
            res.jsonp(peoplePortfolioRole);
        }
    });
};

/**
 * List of People portfolio roles
 */
exports.list = function(req, res) {
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
    var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');
    var PeoplePortfolioRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioRole');
	PeoplePortfolioRole.find().populate('user', 'displayName').exec(function(err, peoplePortfolioRoles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peoplePortfolioRoles);
		}
	});
};

/**
 * People portfolio role middleware
 */
exports.peoplePortfolioRoleByID = function(req, res, next, id) {
    var PeoplePortfolioRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioRole');
	PeoplePortfolioRole.findById(id).populate('user', 'displayName').exec(function(err, peoplePortfolioRole) {
		if (err) return next(err);
		if (! peoplePortfolioRole) return next(new Error('Failed to load People portfolio role ' + id));
		req.peoplePortfolioRole = peoplePortfolioRole ;
		next();
	});
};

/**
 * People portfolio role authorization middleware
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
