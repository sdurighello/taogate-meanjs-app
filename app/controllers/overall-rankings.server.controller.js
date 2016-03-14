'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Overall ranking
 */
exports.create = function(req, res) {
	var OverallRanking = mongoose.mtModel(req.user.tenantId + '.' + 'OverallRanking');
	var overallRanking = new OverallRanking(req.body);
	overallRanking.user = req.user;

	overallRanking.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(overallRanking);
		}
	});
};

/**
 * Show the current Overall ranking
 */
exports.read = function(req, res) {
	res.jsonp(req.overallRanking);
};

/**
 * Update a Overall ranking
 */
exports.update = function(req, res) {
	var overallRanking = req.overallRanking ;
	overallRanking.user = req.user;
	overallRanking.created = Date.now();
	overallRanking = _.extend(overallRanking , req.body);

	overallRanking.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(overallRanking);
		}
	});
};

/**
 * Delete an Overall ranking
 */
exports.delete = function(req, res) {
	var overallRanking = req.overallRanking ;

	overallRanking.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(overallRanking);
		}
	});
};

/**
 * List of Overall rankings
 */
exports.list = function(req, res) {
	var OverallRanking = mongoose.mtModel(req.user.tenantId + '.' + 'OverallRanking');

    OverallRanking.find().populate('user', 'displayName').populate('projects')
        .exec(function(err, rankings){
            // Remove the projects 'Not selected for prioritization' or 'Inactive'
            async.each(rankings[0].projects, function(project, callback) {
                if(project){
                    if(project.selection.selectedForPrioritization === false || project.selection.active === false){
                        rankings[0].projects.splice(rankings[0].projects.indexOf(project), 1);
                        rankings[0].save();
                    }
                }
                callback();
            }, function(err){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(rankings);
                }
            });
        });
};

/**
 * Overall ranking middleware
 */
exports.overallRankingByID = function(req, res, next, id) {
	var OverallRanking = mongoose.mtModel(req.user.tenantId + '.' + 'OverallRanking');
	OverallRanking.findById(id).populate('user', 'displayName').exec(function(err, overallRanking) {
		if (err) return next(err);
		if (! overallRanking) return next(new Error('Failed to load Overall ranking ' + id));
		req.overallRanking = overallRanking ;
		next();
	});
};

exports.checkExistenceAndCreate = function(req, res, next){
    // If there is no document in the collection create one
	if(!req.params.overallRankingId){
        var OverallRanking = mongoose.mtModel(req.user.tenantId + '.' + 'OverallRanking');
        async.waterfall([
            // Get the overall rankings
            function(callback) {
                OverallRanking.find().exec(function(err, overallRankings) {
                    if (err) {
                        return callback(err);
                    } else {
                        callback(null, overallRankings);
                    }
                });
            },
            // If the overall ranking array is empty, create one, else do nothing
            function(overallRankings, callback) {
                if(!overallRankings.length){
                    var overallRanking = new OverallRanking({
                        created : Date.now(),
                        user : null,
                        projects : []
                    }) ;
                    overallRanking.save(function(err) {
                        if (err) {
                            return callback(err);
                        }
                    });
                }

                callback(null);
            }
        ], function (err, result) {
            if(err){
                return res.status(404).send({
                    message: 'Cannot find or create overall ranking document'
                });
            }
            next();
        });
    }
};

/**
 * Overall ranking authorization middleware
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
