'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Qualitative impact group
 */
exports.create = function(req, res) {
    var QualitativeImpactGroup = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');
	var qualitativeImpactGroup = new QualitativeImpactGroup(req.body);
	qualitativeImpactGroup.user = req.user;

	qualitativeImpactGroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(qualitativeImpactGroup);
		}
	});
};

/**
 * Show the current Qualitative impact group
 */
exports.read = function(req, res) {
	res.jsonp(req.qualitativeImpactGroup);
};

/**
 * Update a Qualitative impact group
 */
exports.update = function(req, res) {
	var qualitativeImpactGroup = req.qualitativeImpactGroup ;
    qualitativeImpactGroup.user = req.user;
    qualitativeImpactGroup.created = Date.now();
	qualitativeImpactGroup = _.extend(qualitativeImpactGroup , req.body);

	qualitativeImpactGroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(qualitativeImpactGroup);
		}
	});
};

/**
 * Delete an Qualitative impact group
 */
exports.delete = function(req, res) {
    var QualitativeImpactGroup = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');
    var QualitativeImpact = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpact');
    var qualitativeImpactGroup = req.qualitativeImpactGroup ;

    async.series([
        function(callback){
            // Delete all impacts (from "impacts" collection) belonging to this impact Group
            async.each(qualitativeImpactGroup.impacts, function(item, callback){
                QualitativeImpact.findById(item._id).exec(function(err, impact){
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        impact.remove();
                    }
                });
                callback();
            });
            callback(null, 'one');
        },
        function(callback){
            // Delete Group from its collection
            qualitativeImpactGroup.remove();
            callback(null, 'two');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(qualitativeImpactGroup);
        }
    });
};

/**
 * List of Qualitative impact groups
 */
exports.list = function(req, res) {
    var QualitativeImpactGroup = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');
	QualitativeImpactGroup.find().sort('-created').deepPopulate(['impacts']).populate('user', 'displayName').exec(function(err, qualitativeImpactGroups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(qualitativeImpactGroups);
		}
	});
};

/**
 * Qualitative impact group middleware
 */
exports.qualitativeImpactGroupByID = function(req, res, next, id) {
    var QualitativeImpactGroup = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');
	QualitativeImpactGroup.findById(id).deepPopulate(['impacts']).populate('user', 'displayName').exec(function(err, qualitativeImpactGroup) {
		if (err) return next(err);
		if (! qualitativeImpactGroup) return next(new Error('Failed to load Qualitative impact group ' + id));
		req.qualitativeImpactGroup = qualitativeImpactGroup ;
		next();
	});
};

/**
 * Qualitative impact group authorization middleware
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
