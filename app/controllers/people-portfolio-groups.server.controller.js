'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a People portfolio group
 */
exports.create = function(req, res) {
	var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
	var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');
	var peoplePortfolioGroup = new PeoplePortfolioGroup(req.body);
	peoplePortfolioGroup.user = req.user;

    async.series([
        // GROUP: Save Group in its collection
        function(callback){
            peoplePortfolioGroup.save(function(err){
                callback(err);
            });
        },
        // PORTFOLIOS: Add new group to all portfolios
        function(callback){
            Portfolio.find().exec(function(err, portfolios){
                if (err) {
                    callback(err);
                } else {
                    async.each(portfolios, function(portfolio, callback){
                        portfolio.stakeholders.push({
                            group: peoplePortfolioGroup._id,
                            roles: []
                        });
                        portfolio.save(function(err){
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
            res.jsonp(peoplePortfolioGroup);
        }
    });
};

/**
 * Show the current People Portfolio group
 */
exports.read = function(req, res) {
	res.jsonp(req.peoplePortfolioGroup);
};

/**
 * Update a People Portfolio group
 */
exports.update = function(req, res) {
	var peoplePortfolioGroup = req.peoplePortfolioGroup ;
	peoplePortfolioGroup.user = req.user;
	peoplePortfolioGroup.created = Date.now();
	peoplePortfolioGroup = _.extend(peoplePortfolioGroup , req.body);

	peoplePortfolioGroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peoplePortfolioGroup);
		}
	});
};

/**
 * Delete an People Portfolio group
 */
exports.delete = function(req, res) {
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
    var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');
	var peoplePortfolioGroup = req.peoplePortfolioGroup ;

    async.series([
        // PEOPLE-PORTFOLIO-GROUP: Delete Group from its collection
        function(callback){
            peoplePortfolioGroup.remove(function(err){
                callback(err);
            });
        },
        // PORTFOLIOS: Delete group object from portfolio.stakeholders
        function(callback){
            Portfolio.find().exec(function(err, portfolios){
                if (err) {
                    callback(err);
                } else {
                    async.each(portfolios, function(portfolio, callback){
                        async.each(portfolio.stakeholders, function(assignedGroup, callback){
                            if(assignedGroup.group.equals(peoplePortfolioGroup._id)){
                                assignedGroup.remove(function(err){
                                    if(err){callback(err);}
                                });
                            }
                            callback();
                        });
                        portfolio.save(function(err){
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
            res.jsonp(peoplePortfolioGroup);
        }
    });
};

/**
 * List of People Portfolio groups
 */
exports.list = function(req, res) {
	var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');
	PeoplePortfolioGroup.find().populate('user', 'displayName').exec(function(err, peoplePortfolioGroups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peoplePortfolioGroups);
		}
	});
};

/**
 * People Portfolio group middleware
 */
exports.peoplePortfolioGroupByID = function(req, res, next, id) {
	var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');
	PeoplePortfolioGroup.findById(id).populate('user', 'displayName').exec(function(err, peoplePortfolioGroup) {
		if (err) return next(err);
		if (! peoplePortfolioGroup) return next(new Error('Failed to load People Portfolio group ' + id));
		req.peoplePortfolioGroup = peoplePortfolioGroup ;
		next();
	});
};

/**
 * People Portfolio group authorization middleware
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
