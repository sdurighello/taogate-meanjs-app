'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

// CRUD of areas -> Projects: will be updated at the next gate creation; Portfolios: only new portfolio creation will pick up the changes

var alignPortfolioAreas = function(req, area, crudAction, callback){

    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    Portfolio.find().exec(function(err, portfolios){
        if(err){
            return callback(err);
        }
        async.eachSeries(portfolios, function(portfolio, callbackEach) {
            // If it's completely new
            if((crudAction === 'create') && ((area.applicableTo === 'both') || (area.applicableTo === 'portfolio'))){
                portfolio.portfolioStatus.portfolioStatusAreas.push({
                    statusArea:{
                        _id: area._id,
                        name: area.name
                    },
                    currentRecord: {user:{_id: req.user._id, displayName: req.user.displayName}},
                    history:[]
                });
            }
            // Update name in case it's a portfolio area
            if((crudAction === 'update') && ((req.logStatusArea.applicableTo === 'portfolio') || (req.logStatusArea.applicableTo === 'both'))){
                var portfolioAreaEdit = _.find(portfolio.portfolioStatus.portfolioStatusAreas, function(portfolioArea){
                    return portfolioArea.statusArea._id && portfolioArea.statusArea._id.equals(area._id);
                });
                if(portfolioAreaEdit){
                    portfolioAreaEdit.statusArea.name = req.body.name;
                }
            }
            // If it existed but was only projects and now it's applicable to portfolio as well
            if((crudAction === 'update') && ((req.logStatusArea.applicableTo === 'project') && ((req.body.applicableTo === 'portfolio') || (req.body.applicableTo === 'both')))){
                portfolio.portfolioStatus.portfolioStatusAreas.push({
                    statusArea:{
                        _id: req.body._id,
                        name: req.body.name
                    },
                    currentRecord: {user:{_id: req.user._id, displayName: req.user.displayName}},
                    history:[]
                });
            }
            // If it existed and it is changed from portfolio to project
            if((crudAction === 'update') && (((req.logStatusArea.applicableTo === 'portfolio') || (req.logStatusArea.applicableTo === 'both')) && (req.body.applicableTo === 'project'))){
                var portfolioAreaUpdate = _.find(portfolio.portfolioStatus.portfolioStatusAreas, function(portfolioArea){
                    return portfolioArea.statusArea._id && portfolioArea.statusArea._id.equals(area._id);
                });
                if(portfolioAreaUpdate){
                    portfolioAreaUpdate.remove();
                }
            }
            // If it's deleted and it was assigned to portfolio
            if((crudAction === 'delete') && ((area.applicableTo === 'both') || (area.applicableTo === 'portfolio'))){
                var portfolioAreaDelete = _.find(portfolio.portfolioStatus.portfolioStatusAreas, function(portfolioArea){
                    return portfolioArea.statusArea._id && portfolioArea.statusArea._id.equals(area._id);
                });
                if(portfolioAreaDelete){
                    portfolioAreaDelete.remove();
                }
            }

            portfolio.save(function(err){
                if(err){
                    return callbackEach(err);
                }
                callbackEach();
            });

        }, function(err){
            if(err){
                callback(err);
            } else {
                callback(null);
            }
        });
    });
};

/**
 * Create a Log status area
 */
exports.create = function(req, res) {
	var LogStatusArea = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusArea');
	var logStatusArea = new LogStatusArea(req.body);
	logStatusArea.user = req.user;

    async.waterfall([
        // Save new area so you get the id
        function(callback) {
            logStatusArea.save(function(err) {
                callback(err);
            });
        },
        // Update portfolios
        function(callback) {
            alignPortfolioAreas(req, logStatusArea, 'create', function(err){
                callback(err);
            });
        }
    ], function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(logStatusArea);
        }
    });
};

/**
 * Show the current Log status area
 */
exports.read = function(req, res) {
	res.jsonp(req.logStatusArea);
};

/**
 * Update a Log status area
 */
exports.update = function(req, res) {

	var logStatusArea = req.logStatusArea ;

    async.waterfall([
        // Update portfolios
        function(callback) {
            alignPortfolioAreas(req, logStatusArea, 'update', function(err){
                callback(err);
            });
        },
        // Save new area after so you don't loose the pre-update info
        function(callback) {
            logStatusArea.user = req.user;
            logStatusArea.created = Date.now();
            logStatusArea = _.extend(logStatusArea , req.body);
            logStatusArea.save(function(err) {
                callback(err);
            });
        }
    ], function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(logStatusArea);
        }
    });
};

/**
 * Delete an Log status area
 */
exports.delete = function(req, res) {

	var logStatusArea = req.logStatusArea ;

    async.waterfall([
        // Delete area
        function(callback) {
            logStatusArea.remove(function(err) {
                callback(err);
            });
        },
        // Update portfolios
        function(callback) {
            alignPortfolioAreas(req, logStatusArea, 'delete', function(err){
                callback(err);
            });
        }
    ], function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(logStatusArea);
        }
    });
};

/**
 * List of Log status areas
 */
exports.list = function(req, res) {
	var LogStatusArea = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusArea');
	LogStatusArea.find().populate('user', 'displayName').exec(function(err, logStatusAreas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logStatusAreas);
		}
	});
};

/**
 * Log status area middleware
 */
exports.logStatusAreaByID = function(req, res, next, id) {
	var LogStatusArea = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusArea');
	LogStatusArea.findById(id).populate('user', 'displayName').exec(function(err, logStatusArea) {
		if (err) return next(err);
		if (! logStatusArea) return next(new Error('Failed to load Log status area ' + id));
		req.logStatusArea = logStatusArea ;
		next();
	});
};

/**
 * Log status area authorization middleware
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
