'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Strategy node
 */
exports.create = function(req, res) {
	var StrategyNode = mongoose.mtModel(req.user.tenantId + '.' + 'StrategyNode');
	var strategyNode = new StrategyNode(req.body);
	strategyNode.user = req.user;

	strategyNode.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(strategyNode);
		}
	});
};

/**
 * Show the current Strategy node
 */
exports.read = function(req, res) {
	res.jsonp(req.strategyNode);
};

/**
 * Update a Strategy node
 */
exports.update = function(req, res) {
	var strategyNode = req.strategyNode ;
	strategyNode = _.extend(strategyNode , req.body);
    strategyNode.user = req.user;

	strategyNode.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(strategyNode);
		}
	});
};

/**
 * Delete an Strategy node
 */
exports.delete = function(req, res) {
    var StrategyNode = mongoose.mtModel(req.user.tenantId + '.' + 'StrategyNode');
    var strategyNode = req.strategyNode ;

    async.series([
        function(callback){
            // Delete strategyNode from strategyNodes
            strategyNode.remove();
            callback(null, 'one');
        },
        function(callback){
            // Delete strategyNode from first degree children strategyNodes (parent and ancestors)
            StrategyNode.find({parent: strategyNode._id}).exec(function(err, strategyNodes){
                async.each(strategyNodes, function(item, callback){
                    item.parent = null;
                    item.ancestors = [];
                    item.save();
                    callback();
                });
            });
            callback(null, 'two');
        },
        function(callback){
            // Delete strategyNode from second degree children strategyNodes (in ancestors only)
            StrategyNode.find({ancestors: {$in: [strategyNode._id]}}).exec(function(err, strategyNodes){
                async.each(strategyNodes, function(item, callback){
                    item.ancestors.splice(item.ancestors.indexOf(strategyNode._id), 1);
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
            res.jsonp(strategyNode);
        }
    });
};

/**
 * List of Strategy nodes
 */
exports.list = function(req, res) {
    var StrategyNode = mongoose.mtModel(req.user.tenantId + '.' + 'StrategyNode');
	StrategyNode.find().populate('user', 'displayName').exec(function(err, strategyNodes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(strategyNodes);
		}
	});
};

/**
 * Strategy node middleware
 */
exports.strategyNodeByID = function(req, res, next, id) {
    var StrategyNode = mongoose.mtModel(req.user.tenantId + '.' + 'StrategyNode');
    StrategyNode.findById(id).deepPopulate(['parent','type']).populate('user', 'displayName').exec(function(err, strategyNode) {
        if (err) return next(err);
        if (! strategyNode) return next(new Error('Failed to load strategyNode ' + id));
        req.strategyNode = strategyNode ;
        next();
    });
};

/**
 * Strategy node authorization middleware
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
