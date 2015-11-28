'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Strategy node type
 */
exports.create = function(req, res) {
	var StrategyNodeType = mongoose.mtModel(req.user.tenantId + '.' + 'StrategyNodeType');
	var strategyNodeType = new StrategyNodeType(req.body);
	strategyNodeType.user = req.user;

	strategyNodeType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(strategyNodeType);
		}
	});
};

/**
 * Show the current Strategy node type
 */
exports.read = function(req, res) {
	res.jsonp(req.strategyNodeType);
};

/**
 * Update a Strategy node type
 */
exports.update = function(req, res) {
	var strategyNodeType = req.strategyNodeType ;
	strategyNodeType.user = req.user;
	strategyNodeType.created = Date.now();
	strategyNodeType = _.extend(strategyNodeType , req.body);

	strategyNodeType.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(strategyNodeType);
		}
	});
};

/**
 * Delete an Strategy node type
 */
exports.delete = function(req, res) {
    var StrategyNodeType = mongoose.mtModel(req.user.tenantId + '.' + 'StrategyNodeType');
    var strategyNodeType = req.strategyNodeType;

    var StrategyNode = mongoose.mtModel(req.user.tenantId + '.' + 'StrategyNode');

    async.series([
		// NODE-TYPES: Delete strategy node type from node types
		function(callback){
            strategyNodeType.remove(function(err){
                callback(err);
            });
        },
        // NODES: Remove type assignment from nodes
        function(callback){
            StrategyNode.find({type: strategyNodeType._id}).exec(function(err, strategyNodes){
                async.each(strategyNodes, function(item, callback){
                    item.type = null;
                    item.save(function(err){
                        if(err){callback(err);} else {callback();}
                    });
                });
            });
            callback(null);
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(strategyNodeType);
        }
    });
};

/**
 * List of Strategy node types
 */
exports.list = function(req, res) {
    var StrategyNodeType = mongoose.mtModel(req.user.tenantId + '.' + 'StrategyNodeType');
	StrategyNodeType.find().populate('user', 'displayName').exec(function(err, strategyNodeTypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(strategyNodeTypes);
		}
	});
};

/**
 * Strategy node type middleware
 */
exports.strategyNodeTypeByID = function(req, res, next, id) {
    var StrategyNodeType = mongoose.mtModel(req.user.tenantId + '.' + 'StrategyNodeType');
	StrategyNodeType.findById(id).populate('user', 'displayName').exec(function(err, strategyNodeType) {
		if (err) return next(err);
		if (! strategyNodeType) return next(new Error('Failed to load Strategy node type ' + id));
		req.strategyNodeType = strategyNodeType ;
		next();
	});
};

/**
 * Strategy node type authorization middleware
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
