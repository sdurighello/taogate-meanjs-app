'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Portfolio milestone
 */
exports.create = function(req, res) {
	var PortfolioMilestone = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioMilestone');
	var portfolioMilestone = new PortfolioMilestone(req.body);
	portfolioMilestone.user = req.user;
    portfolioMilestone.statusReview = {
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

	portfolioMilestone.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioMilestone);
		}
	});
};

/**
 * Show the current Portfolio milestone
 */
exports.read = function(req, res) {
	res.jsonp(req.portfolioMilestone);
};

/**
 * Update a Portfolio milestone
 */
exports.update = function(req, res) {
	var portfolioMilestone = req.portfolioMilestone ;

	portfolioMilestone = _.extend(portfolioMilestone , req.body);

	portfolioMilestone.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioMilestone);
		}
	});
};

exports.updateHeader = function(req, res) {
    var portfolioMilestone = req.portfolioMilestone ;
    portfolioMilestone.name = req.body.name;
    portfolioMilestone.description = req.body.description;
    portfolioMilestone.state = req.body.state;
    portfolioMilestone.type = req.body.type;

    portfolioMilestone.user = req.user;
    portfolioMilestone.created = Date.now();

    portfolioMilestone.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioMilestone);
        }
    });
};

exports.updateStatus = function(req, res) {
    var portfolioMilestone = req.portfolioMilestone ;

    portfolioMilestone.statusReview.history.push({
        baselineDeliveryDate : portfolioMilestone.statusReview.currentRecord.baselineDeliveryDate,
        estimateDeliveryDate : portfolioMilestone.statusReview.currentRecord.estimateDeliveryDate,
        actualDeliveryDate : portfolioMilestone.statusReview.currentRecord.actualDeliveryDate,
        status : portfolioMilestone.statusReview.currentRecord.status,
        completed : portfolioMilestone.statusReview.currentRecord.completed,
        statusComment : portfolioMilestone.statusReview.currentRecord.statusComment,
        user : portfolioMilestone.statusReview.currentRecord.user,
        created : portfolioMilestone.statusReview.currentRecord.created
    });
    portfolioMilestone.statusReview.currentRecord.user = req.user;
    portfolioMilestone.statusReview.currentRecord.created = Date.now();
    portfolioMilestone.statusReview.currentRecord.baselineDeliveryDate = req.body.statusReview.currentRecord.baselineDeliveryDate;
    portfolioMilestone.statusReview.currentRecord.estimateDeliveryDate = req.body.statusReview.currentRecord.estimateDeliveryDate;
    portfolioMilestone.statusReview.currentRecord.actualDeliveryDate = req.body.statusReview.currentRecord.actualDeliveryDate;
    portfolioMilestone.statusReview.currentRecord.status = req.body.statusReview.currentRecord.status;
    portfolioMilestone.statusReview.currentRecord.completed = req.body.statusReview.currentRecord.completed;
    portfolioMilestone.statusReview.currentRecord.statusComment = req.body.statusReview.currentRecord.statusComment;

    portfolioMilestone.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioMilestone);
        }
    });
};

/**
 * Delete an Portfolio milestone
 */
exports.delete = function(req, res) {
	var portfolioMilestone = req.portfolioMilestone ;

	portfolioMilestone.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioMilestone);
		}
	});
};

/**
 * List of Portfolio milestones
 */
exports.list = function(req, res) {
    var PortfolioMilestone = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioMilestone');
    PortfolioMilestone.find(req.query).populate('user', 'displayName').exec(function(err, portfolioMilestones) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioMilestones);
		}
	});
};

// **************** ASSOCIATED PROJECT MILESTONES ******************


exports.availableProjectMilestones = function(req, res) {

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var ProjectMilestone = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectMilestone');

    async.waterfall([
        // Find all projects belonging to that portfolio
        function(callback){
            var projectIds = [];
            Project.find({portfolio: req.params.portfolioId}).exec(function(err, projects){
                if(err){ return callback(err); }
                async.each(projects, function(project, callback){
                    projectIds.push(project._id);
                    callback();
                });
                callback(null, projectIds);
            });
        },
        // For all projects, extract all the milestones that aren't already associated
        function(projectIds, callback){
            ProjectMilestone.find({
                _id: {$nin: req.portfolioMilestone.associatedProjectMilestones},
                project: {$in: projectIds}
            }).exec(function(err, availableProjectMilestones){
                if(err){
                    return callback(err);
                }
                callback(null, availableProjectMilestones);
            });
        }
    ], function(err, availableProjectMilestones){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(availableProjectMilestones);
        }
    });


};


exports.addProjectMilestone = function(req, res) {

    var portfolioMilestone = req.portfolioMilestone;
    portfolioMilestone.associatedProjectMilestones.push(req.params.projectMilestoneId);
    portfolioMilestone.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioMilestone);
        }
    });

};

exports.removeProjectMilestone = function(req, res) {
    var portfolioMilestone = req.portfolioMilestone;
    portfolioMilestone.associatedProjectMilestones.splice(portfolioMilestone.associatedProjectMilestones.indexOf(req.params.projectMilestoneId), 1);
    portfolioMilestone.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioMilestone);
        }
    });

};




/**
 * Portfolio milestone middleware
 */
exports.portfolioMilestoneByID = function(req, res, next, id) {
    var PortfolioMilestone = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioMilestone');
    PortfolioMilestone.findById(id).deepPopulate([
        'associatedProjectMilestones'
    ]).populate('user', 'displayName').exec(function(err, portfolioMilestone) {
		if (err) return next(err);
		if (! portfolioMilestone) return next(new Error('Failed to load Portfolio milestone ' + id));
		req.portfolioMilestone = portfolioMilestone ;
		next();
	});
};

/**
 * Portfolio milestone authorization middleware
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
