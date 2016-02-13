'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Dependency
 */
exports.create = function(req, res) {
	var Dependency = mongoose.mtModel(req.user.tenantId + '.' + 'Dependency');
	var dependency = new Dependency(req.body);
	dependency.user = req.user;

	dependency.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependency);
		}
	});
};

/**
 * Show the current Dependency
 */
exports.read = function(req, res) {
	res.jsonp(req.dependency);
};

/**
 * Update a Dependency
 */
exports.update = function(req, res) {
	var dependency = req.dependency ;

	dependency = _.extend(dependency , req.body);

	dependency.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependency);
		}
	});
};



exports.updateHeader = function(req, res) {

    var dependency = req.dependency ;

    dependency.user = req.user;
    dependency.created = Date.now();

    dependency.name = req.body.name;
    dependency.description = req.body.description;

    dependency.source = req.body.source;
    dependency.target = req.body.target;

    dependency.state = req.body.state;
    dependency.type = req.body.type;
    dependency.impact = req.body.impact;


    dependency.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(dependency);
        }
    });
};

exports.updateStatus = function(req, res) {
    var dependency = req.dependency ;

    dependency.statusReview.history.push({
        baselineDeliveryDate : dependency.statusReview.currentRecord.baselineDeliveryDate,
        estimateDeliveryDate : dependency.statusReview.currentRecord.estimateDeliveryDate,
        actualDeliveryDate : dependency.statusReview.currentRecord.actualDeliveryDate,
        status : dependency.statusReview.currentRecord.status,
        completed : dependency.statusReview.currentRecord.completed,
        statusComment : dependency.statusReview.currentRecord.statusComment,
        user : dependency.statusReview.currentRecord.user,
        created : dependency.statusReview.currentRecord.created
    });
    dependency.statusReview.currentRecord.user = req.user;
    dependency.statusReview.currentRecord.created = Date.now();
    dependency.statusReview.currentRecord.baselineDeliveryDate = req.body.statusReview.currentRecord.baselineDeliveryDate;
    dependency.statusReview.currentRecord.estimateDeliveryDate = req.body.statusReview.currentRecord.estimateDeliveryDate;
    dependency.statusReview.currentRecord.actualDeliveryDate = req.body.statusReview.currentRecord.actualDeliveryDate;
    dependency.statusReview.currentRecord.status = req.body.statusReview.currentRecord.status;
    dependency.statusReview.currentRecord.completed = req.body.statusReview.currentRecord.completed;
    dependency.statusReview.currentRecord.statusComment = req.body.statusReview.currentRecord.statusComment;

    dependency.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(dependency);
        }
    });
};



/**
 * Delete an Dependency
 */
exports.delete = function(req, res) {
	var dependency = req.dependency ;

	dependency.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependency);
		}
	});
};

/**
 * List of Dependencies
 */
exports.list = function(req, res) {
    var Dependency = mongoose.mtModel(req.user.tenantId + '.' + 'Dependency');
    Dependency.find(req.query).populate('user', 'displayName').exec(function(err, dependencies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dependencies);
		}
	});
};

/**
 * Dependency middleware
 */
exports.dependencyByID = function(req, res, next, id) {

    var Dependency = mongoose.mtModel(req.user.tenantId + '.' + 'Dependency');

	Dependency.findById(id).populate('user', 'displayName').exec(function(err, dependency) {
		if (err) return next(err);
		if (! dependency) return next(new Error('Failed to load Dependency ' + id));
		req.dependency = dependency ;
		next();
	});
};

/**
 * Dependency authorization middleware
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
