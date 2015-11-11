'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Qualitative impact
 */
exports.create = function(req, res) {
	var QualitativeImpact = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpact');
	var qualitativeImpact = new QualitativeImpact(req.body);
	qualitativeImpact.user = req.user;

	qualitativeImpact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(qualitativeImpact);
		}
	});
};

/**
 * Show the current Qualitative impact
 */
exports.read = function(req, res) {
	res.jsonp(req.qualitativeImpact);
};

/**
 * Update a Qualitative impact
 */
exports.update = function(req, res) {
	var qualitativeImpact = req.qualitativeImpact ;
    qualitativeImpact.user = req.user;
    qualitativeImpact.created = Date.now();
	qualitativeImpact = _.extend(qualitativeImpact , req.body);

	qualitativeImpact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(qualitativeImpact);
		}
	});
};

/**
 * Delete an Qualitative impact
 */
exports.delete = function(req, res) {
    var qualitativeImpact = req.qualitativeImpact ;
    var QualitativeImpactGroup = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');

    async.series([
        function(callback){
            // Delete impact from its collection
            qualitativeImpact.remove();
            callback(null, 'one');
        },
        function(callback){
            // Delete impact from groups where assigned
            QualitativeImpactGroup.find({impacts: {$in: [qualitativeImpact._id]}}).exec(function(err, groups){
                async.each(groups, function(item, callback){
                    item.impacts.splice(item.impacts.indexOf(qualitativeImpact._id), 1);
                    item.save();
                    callback();
                });
            });
            callback(null, 'two');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(qualitativeImpact);
        }
    });
};

/**
 * List of Qualitative impacts
 */
exports.list = function(req, res) {
    var QualitativeImpact = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpact');
	QualitativeImpact.find().sort('-created').populate('user', 'displayName').exec(function(err, qualitativeImpacts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(qualitativeImpacts);
		}
	});
};

/**
 * Qualitative impact middleware
 */
exports.qualitativeImpactByID = function(req, res, next, id) {
    var QualitativeImpact = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpact');
	QualitativeImpact.findById(id).populate('user', 'displayName').exec(function(err, qualitativeImpact) {
		if (err) return next(err);
		if (! qualitativeImpact) return next(new Error('Failed to load Qualitative impact ' + id));
		req.qualitativeImpact = qualitativeImpact ;
		next();
	});
};

/**
 * Qualitative impact authorization middleware
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
