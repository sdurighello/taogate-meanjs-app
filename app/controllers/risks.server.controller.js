'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Risk
 */
exports.create = function(req, res) {
	var Risk = mongoose.mtModel(req.user.tenantId + '.' + 'Risk');
	var risk = new Risk(req.body);
	risk.user = req.user;

	risk.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(risk);
		}
	});
};

/**
 * Show the current Risk
 */
exports.read = function(req, res) {
	res.jsonp(req.risk);
};

/**
 * Update a Risk
 */
exports.update = function(req, res) {
	var risk = req.risk ;
    risk.user = req.user;
    risk.created = Date.now();
	risk = _.extend(risk , req.body);

	risk.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(risk);
		}
	});
};

/**
 * Delete an Risk
 */
exports.delete = function(req, res) {
    var risk = req.risk ;
    var RiskCategory = mongoose.mtModel(req.user.tenantId + '.' + 'RiskCategory');

    async.series([
        function(callback){
            // Delete risk from its collection
            risk.remove();
            callback(null, 'one');
        },
        function(callback){
            // Delete risk from categories where assigned
            RiskCategory.find({risks: {$in: [risk._id]}}).exec(function(err, categories){
                async.each(categories, function(item, callback){
                    item.risks.splice(item.risks.indexOf(risk._id), 1);
                    item.save();
                    callback();
                });
            });
            callback(null, 'three');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(risk);
        }
    });
};

/**
 * List of Risks
 */
exports.list = function(req, res) {
    var Risk = mongoose.mtModel(req.user.tenantId + '.' + 'Risk');
	Risk.find().sort('-created').populate('user', 'displayName').exec(function(err, risks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(risks);
		}
	});
};

/**
 * Risk middleware
 */
exports.riskByID = function(req, res, next, id) {
    var Risk = mongoose.mtModel(req.user.tenantId + '.' + 'Risk');
	Risk.findById(id).populate('user', 'displayName').exec(function(err, risk) {
		if (err) return next(err);
		if (! risk) return next(new Error('Failed to load Risk ' + id));
		req.risk = risk ;
		next();
	});
};

/**
 * Risk authorization middleware
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
