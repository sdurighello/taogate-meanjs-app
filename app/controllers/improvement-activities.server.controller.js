'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Improvement activity
 */
exports.create = function(req, res) {
    var Counter = mongoose.mtModel(req.user.tenantId + '.' + 'Counter');
    var ImprovementActivity = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementActivity');

    var improvementActivity = new ImprovementActivity(req.body);

    improvementActivity.user = req.user;
    improvementActivity.statusReview = {
        currentRecord : {
            baselineDeliveryDate : null,
            estimateDeliveryDate : null,
            actualDeliveryDate : null,
            completed : false,
            status: null,
            statusComment : '',
            created: Date.now(),
            user: req.user
        },
        history : []
    };

    async.series([
        // Add the sequential number
        function(callback){
            Counter.findByIdAndUpdate({_id: 'improvementActivitySequence'}, {$inc: { seq: 1} }, function(error, counter)   {
                if(error){
                    return callback(error);
                }
                // Must create the the document in 'counter' collection for our entity the first time we create an entity document
                if(!counter){
                    var newCounter = new Counter({
                        _id : 'improvementActivitySequence'
                    });
                    newCounter.save(function(err){
                        if(err){
                            return callback( new Error('Failed to create sequence counter for improvement activity'));
                        }
                        improvementActivity.idNumber = 1;
                        callback(null);
                    });
                }
                if(counter) {
                    improvementActivity.idNumber = counter.seq;
                    callback(null);
                }
            });
        },
        function(callback){
            improvementActivity.save(function(err) {
                callback(err);
            });
        }
    ], function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(improvementActivity);
        }
    });
};



exports.updateHeader = function(req, res) {

    var improvementActivity = req.improvementActivity ;

    improvementActivity.user = req.user;
    improvementActivity.created = Date.now();

    improvementActivity.raisedOnDate = req.body.raisedOnDate;
    improvementActivity.title = req.body.title;
    improvementActivity.description = req.body.description;
    improvementActivity.portfolio = req.body.portfolio;
    improvementActivity.type = req.body.type;
    improvementActivity.assignedTo = req.body.assignedTo;
    improvementActivity.reason = req.body.reason;
    improvementActivity.state = req.body.state;
    improvementActivity.priority = req.body.priority;

    improvementActivity.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(improvementActivity);
        }
    });

};

exports.updateStatus = function(req, res) {

    var improvementActivity = req.improvementActivity ;

    improvementActivity.statusReview.history.push({
        baselineDeliveryDate : improvementActivity.statusReview.currentRecord.baselineDeliveryDate,
        estimateDeliveryDate : improvementActivity.statusReview.currentRecord.estimateDeliveryDate,
        actualDeliveryDate : improvementActivity.statusReview.currentRecord.actualDeliveryDate,
        status : improvementActivity.statusReview.currentRecord.status,
        completed : improvementActivity.statusReview.currentRecord.completed,
        statusComment : improvementActivity.statusReview.currentRecord.statusComment,
        user : improvementActivity.statusReview.currentRecord.user,
        created : improvementActivity.statusReview.currentRecord.created
    });

    improvementActivity.statusReview.currentRecord.baselineDeliveryDate = req.body.statusReview.currentRecord.baselineDeliveryDate;
    improvementActivity.statusReview.currentRecord.estimateDeliveryDate = req.body.statusReview.currentRecord.estimateDeliveryDate;
    improvementActivity.statusReview.currentRecord.actualDeliveryDate = req.body.statusReview.currentRecord.actualDeliveryDate;
    improvementActivity.statusReview.currentRecord.status = req.body.statusReview.currentRecord.status;
    improvementActivity.statusReview.currentRecord.completed = req.body.statusReview.currentRecord.completed;
    improvementActivity.statusReview.currentRecord.statusComment = req.body.statusReview.currentRecord.statusComment;
    improvementActivity.statusReview.currentRecord.user = req.user;
    improvementActivity.statusReview.currentRecord.created = Date.now();

    improvementActivity.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(improvementActivity);
        }
    });
};







/**
 * Show the current Improvement activity
 */
exports.read = function(req, res) {
	res.jsonp(req.improvementActivity);
};

/**
 * Update a Improvement activity
 */
exports.update = function(req, res) {
	var improvementActivity = req.improvementActivity ;
    improvementActivity.user = req.user;
    improvementActivity.created = Date.now();
	improvementActivity = _.extend(improvementActivity , req.body);

	improvementActivity.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementActivity);
		}
	});
};

/**
 * Delete an Improvement activity
 */
exports.delete = function(req, res) {
	var improvementActivity = req.improvementActivity ;

	improvementActivity.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementActivity);
		}
	});
};

/**
 * List of Improvement activities
 */
exports.list = function(req, res) {
    var ImprovementActivity = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementActivity');
    ImprovementActivity.find(req.query).deepPopulate([
        'portfolio', 'assignedTo', 'type', 'reason', 'state', 'priority', 'statusReview.currentRecord.status'
    ]).populate('user', 'displayName').exec(function(err, improvementActivities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(improvementActivities);
		}
	});
};

/**
 * Improvement activity middleware
 */
exports.improvementActivityByID = function(req, res, next, id) {
    var ImprovementActivity = mongoose.mtModel(req.user.tenantId + '.' + 'ImprovementActivity');
    ImprovementActivity.findById(id).deepPopulate([
        'portfolio', 'assignedTo', 'type', 'reason', 'state', 'priority', 'statusReview.currentRecord.status'
    ]).populate('user', 'displayName').exec(function(err, improvementActivity) {
		if (err) return next(err);
		if (! improvementActivity) return next(new Error('Failed to load Improvement activity ' + id));
		req.improvementActivity = improvementActivity ;
		next();
	});
};

/**
 * Improvement activity authorization middleware
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
