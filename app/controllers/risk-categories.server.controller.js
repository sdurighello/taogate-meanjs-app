'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Risk category
 */
exports.create = function(req, res) {
	var RiskCategory = mongoose.mtModel(req.user.tenantId + '.' + 'RiskCategory');
	var riskCategory = new RiskCategory(req.body);
	riskCategory.user = req.user;

	riskCategory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskCategory);
		}
	});
};

/**
 * Show the current Risk category
 */
exports.read = function(req, res) {
	res.jsonp(req.riskCategory);
};

/**
 * Update a Risk category
 */
exports.update = function(req, res) {
	var riskCategory = req.riskCategory ;
    riskCategory.user = req.user;
	riskCategory = _.extend(riskCategory , req.body);

	riskCategory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskCategory);
		}
	});
};

/**
 * Delete an Risk category
 */
exports.delete = function(req, res) {
    var RiskCategory = mongoose.mtModel(req.user.tenantId + '.' + 'RiskCategory');
    var Risk = mongoose.mtModel(req.user.tenantId + '.' + 'Risk');
    var riskCategory = req.riskCategory ;

    async.series([
        function(callback){
            // Delete all risks (from "risks" collection) belonging to this Group
            async.each(riskCategory.risks, function(item, callback){
                Risk.findById(item._id).exec(function(err, risk){
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        risk.remove();
                    }
                });
                callback();
            });
            callback(null, 'one');
        },
        function(callback){
            // Delete Group from its collection
            riskCategory.remove();
            callback(null, 'two');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(riskCategory);
        }
    });
};

/**
 * List of Risk categories
 */
exports.list = function(req, res) {
    var RiskCategory = mongoose.mtModel(req.user.tenantId + '.' + 'RiskCategory');
	RiskCategory.find().sort('-created').deepPopulate(['risks']).populate('user', 'displayName').exec(function(err, riskCategories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(riskCategories);
		}
	});
};

/**
 * Risk category middleware
 */
exports.riskCategoryByID = function(req, res, next, id) {
    var RiskCategory = mongoose.mtModel(req.user.tenantId + '.' + 'RiskCategory');
	RiskCategory.findById(id).deepPopulate(['risks']).populate('user', 'displayName').exec(function(err, riskCategory) {
		if (err) return next(err);
		if (! riskCategory) return next(new Error('Failed to load Risk category ' + id));
		req.riskCategory = riskCategory ;
		next();
	});
};

/**
 * Risk category authorization middleware
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
