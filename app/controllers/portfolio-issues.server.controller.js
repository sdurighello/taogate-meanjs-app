'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');



// ************************************************ ISSUE ************************************************

exports.create = require('./portfolio-issues/portfolio-issues.issue.server.controller.js').create;

exports.update = require('./portfolio-issues/portfolio-issues.issue.server.controller.js').update;

exports.updateHeader = require('./portfolio-issues/portfolio-issues.issue.server.controller.js').updateHeader;

exports.updateStatus = require('./portfolio-issues/portfolio-issues.issue.server.controller.js').updateStatus;

exports.delete = require('./portfolio-issues/portfolio-issues.issue.server.controller.js').delete;

exports.list = require('./portfolio-issues/portfolio-issues.issue.server.controller.js').list;

// --- Show the current Portfolio issue ---
exports.read = function(req, res) {
	res.jsonp(req.portfolioIssue);
};


// ************************************************ ACTION ************************************************


exports.createAction = require('./portfolio-issues/portfolio-issues.escalationAction.server.controller.js').createAction;

exports.updateActionHeader = require('./portfolio-issues/portfolio-issues.escalationAction.server.controller.js').updateActionHeader;

exports.updateActionStatus = require('./portfolio-issues/portfolio-issues.escalationAction.server.controller.js').updateActionStatus;

exports.deleteAction = require('./portfolio-issues/portfolio-issues.escalationAction.server.controller.js').deleteAction;


// ***************************************** ASSOCIATED PROJECT ISSUE **************************************


exports.availableProjectIssues = require('./portfolio-issues/portfolio-issues.associatedProjectIssue.server.controller.js').availableProjectIssues;

exports.addProjectIssue = require('./portfolio-issues/portfolio-issues.associatedProjectIssue.server.controller.js').addProjectIssue;

exports.removeProjectIssue = require('./portfolio-issues/portfolio-issues.associatedProjectIssue.server.controller.js').removeProjectIssue;


// ************************************************ MIDDLEWARE ************************************************


/**
 * Portfolio issue middleware
 */
exports.portfolioIssueByID = function(req, res, next, id) {
    var PortfolioIssue = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioIssue');
    PortfolioIssue.findById(id).populate('user', 'displayName').exec(function(err, portfolioIssue) {
		if (err) return next(err);
		if (! portfolioIssue) return next(new Error('Failed to load Portfolio issue ' + id));
		req.portfolioIssue = portfolioIssue ;
		next();
	});
};

/**
 * Portfolio issue authorization middleware
 */

exports.hasCreateAuthorization = function(req, res, next) {
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    var authObj = {
        isPortfolioManager : false,
        isSuperhero : false
    };

    async.waterfall([
        // isPortfolioManager
        function(callback) {
            Portfolio.findById(req.body.portfolio).exec(function(err, portfolio) {
                if(err){
                    return callback(err);
                }
                authObj.isPortfolioManager = (!!portfolio.portfolioManager && portfolio.portfolioManager.equals(req.user._id)) ||
                    (!!portfolio.backupPortfolioManager && portfolio.backupPortfolioManager.equals(req.user._id));

                callback(null);
            });
        },
        // isSuperhero
        function(callback) {
            authObj.isSuperhero = !!_.find(req.user.roles, function(role){
                return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
            });
            callback(null);
        }
    ], function (err) {
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if(!(authObj.isPortfolioManager || authObj.isSuperhero)){
            return res.status(403).send({
                message: 'User is not authorized'
            });
        }
        next();
    });
};


exports.hasAuthorization = function(req, res, next) {
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    var authObj = {
        isPortfolioManager : false,
        isSuperhero : false
    };

    async.waterfall([
        // isPortfolioManager
        function(callback) {
            Portfolio.findById(req.portfolioIssue.portfolio).exec(function(err, portfolio) {
                if(err){
                    return callback(err);
                }
                authObj.isPortfolioManager = (!!portfolio.portfolioManager && portfolio.portfolioManager.equals(req.user._id)) ||
                    (!!portfolio.backupPortfolioManager && portfolio.backupPortfolioManager.equals(req.user._id));

                callback(null);
            });
        },
        // isSuperhero
        function(callback) {
            authObj.isSuperhero = !!_.find(req.user.roles, function(role){
                return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
            });
            callback(null);
        }
    ], function (err) {
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if(!(authObj.isPortfolioManager || authObj.isSuperhero)){
            return res.status(403).send({
                message: 'User is not authorized'
            });
        }
        next();
    });
};
