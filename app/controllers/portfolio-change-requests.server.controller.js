'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Portfolio change request
 */
exports.create = function(req, res) {
	var PortfolioChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioChangeRequest');
	var portfolioChangeRequest = new PortfolioChangeRequest(req.body);
	portfolioChangeRequest.user = req.user;
    portfolioChangeRequest.approval = {
        currentRecord : {
            approvalState: 'draft',
            created: Date.now(),
            user: req.user
        },
        history : []
    };

	portfolioChangeRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioChangeRequest);
		}
	});
};

/**
 * Show the current Portfolio change request
 */
exports.read = function(req, res) {
	res.jsonp(req.portfolioChangeRequest);
};

/**
 * Update a Portfolio change request
 */
exports.update = function(req, res) {
	var portfolioChangeRequest = req.portfolioChangeRequest ;

	portfolioChangeRequest = _.extend(portfolioChangeRequest , req.body);

	portfolioChangeRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioChangeRequest);
		}
	});
};

exports.updateHeader = function(req, res) {
    var portfolioChangeRequest = req.portfolioChangeRequest ;

    portfolioChangeRequest.raisedOnDate = req.body.raisedOnDate;
    portfolioChangeRequest.title = req.body.title;
    portfolioChangeRequest.description = req.body.description;
    portfolioChangeRequest.state = req.body.state;
    portfolioChangeRequest.priority = req.body.priority;

    portfolioChangeRequest.user = req.user;
    portfolioChangeRequest.created = Date.now();

    portfolioChangeRequest.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioChangeRequest);
        }
    });
};


/**
 * Delete an Portfolio change request
 */
exports.delete = function(req, res) {
    var portfolioChangeRequest = req.portfolioChangeRequest ;

    portfolioChangeRequest.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioChangeRequest);
        }
    });
};


/**
 * List of Portfolio change requests
 */
exports.list = function(req, res) {
    var PortfolioChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioChangeRequest');
    PortfolioChangeRequest.find(req.query).populate('user', 'displayName').exec(function(err, portfolioChangeRequests) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioChangeRequests);
        }
    });
};


// ************************** APPROVAL **************************

exports.submit = function(req, res) {
    var portfolioChangeRequest = req.portfolioChangeRequest;
    if(portfolioChangeRequest.approval.currentRecord.approvalState === 'draft'){
        portfolioChangeRequest.approval.history.push({
            approvalState : portfolioChangeRequest.approval.currentRecord.approvalState,
            user : portfolioChangeRequest.approval.currentRecord.user,
            created : portfolioChangeRequest.approval.currentRecord.created
        });
        portfolioChangeRequest.approval.currentRecord.approvalState = 'submitted';
        portfolioChangeRequest.approval.currentRecord.user = req.user;
        portfolioChangeRequest.approval.currentRecord.created = Date.now();

        portfolioChangeRequest.save(function(err){
            if (err) {
                console.log(err);
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(portfolioChangeRequest);
            }
        });
    } else {
        res.status(403).send({message :'Current document is '+ portfolioChangeRequest.approval.currentRecord.approvalState +' and cannot be submitted'});
    }
};

exports.approve = function(req, res) {
    var portfolioChangeRequest = req.portfolioChangeRequest;
    if(portfolioChangeRequest.approval.currentRecord.approvalState === 'submitted'){
        portfolioChangeRequest.approval.history.push({
            approvalState : portfolioChangeRequest.approval.currentRecord.approvalState,
            user : portfolioChangeRequest.approval.currentRecord.user,
            created : portfolioChangeRequest.approval.currentRecord.created
        });
        portfolioChangeRequest.approval.currentRecord.approvalState = 'approved';
        portfolioChangeRequest.approval.currentRecord.user = req.user;
        portfolioChangeRequest.approval.currentRecord.created = Date.now();

        portfolioChangeRequest.save(function(err){
            if (err) {
                console.log(err);
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(portfolioChangeRequest);
            }
        });
    } else {
        res.status(403).send({message :'Current document is '+ portfolioChangeRequest.approval.currentRecord.approvalState +' and cannot be approved'});
    }
};

exports.reject = function(req, res) {
    var portfolioChangeRequest = req.portfolioChangeRequest;
    if(portfolioChangeRequest.approval.currentRecord.approvalState === 'submitted'){
        portfolioChangeRequest.approval.history.push({
            approvalState : portfolioChangeRequest.approval.currentRecord.approvalState,
            user : portfolioChangeRequest.approval.currentRecord.user,
            created : portfolioChangeRequest.approval.currentRecord.created
        });
        portfolioChangeRequest.approval.currentRecord.approvalState = 'rejected';
        portfolioChangeRequest.approval.currentRecord.user = req.user;
        portfolioChangeRequest.approval.currentRecord.created = Date.now();

        portfolioChangeRequest.save(function(err){
            if (err) {
                console.log(err);
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(portfolioChangeRequest);
            }
        });
    } else {
        res.status(403).send({message :'Current document is '+ portfolioChangeRequest.approval.currentRecord.approvalState +' and cannot be rejected'});
    }
};

exports.draft = function(req, res) {
    var portfolioChangeRequest = req.portfolioChangeRequest;
    if(portfolioChangeRequest.approval.currentRecord.approvalState === 'rejected'){
        portfolioChangeRequest.approval.history.push({
            approvalState : portfolioChangeRequest.approval.currentRecord.approvalState,
            user : portfolioChangeRequest.approval.currentRecord.user,
            created : portfolioChangeRequest.approval.currentRecord.created
        });
        portfolioChangeRequest.approval.currentRecord.approvalState = 'draft';
        portfolioChangeRequest.approval.currentRecord.user = req.user;
        portfolioChangeRequest.approval.currentRecord.created = Date.now();

        portfolioChangeRequest.save(function(err){
            if (err) {
                console.log(err);
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(portfolioChangeRequest);
            }
        });
    } else {
        res.status(403).send({message :'Current document is '+ portfolioChangeRequest.approval.currentRecord.approvalState +' and cannot be drafted'});
    }
};


// **************** ASSOCIATED PROJECT CHANGES ******************


exports.availableProjectChangeRequests = function(req, res) {

	// var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
	// var ProjectChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectChangeRequest');
    //
	// async.waterfall([
	// 	// Find all projects belonging to that portfolio
	// 	function(callback){
	// 		var projectIds = [];
	// 		Project.find({portfolio: req.params.portfolioId}).exec(function(err, projects){
	// 			if(err){ return callback(err); }
	// 			async.each(projects, function(project, callback){
	// 				projectIds.push(project._id);
	// 				callback();
	// 			});
	// 			callback(null, projectIds);
	// 		});
	// 	},
	// 	// For all projects, extract all the changes that: are "not draft", and aren't already associated
	// 	function(projectIds, callback){
     //        ProjectChangeRequest.find({
	// 			_id: {$nin: req.portfolioChangeRequest.associatedProjectChangeRequests},
	// 			project: {$in: projectIds},
	// 			approval: {$ne: 'draft'}
	// 		}).exec(function(err, availableProjectChangeRequests){
	// 			if(err){
	// 				return callback(err);
	// 			}
	// 			callback(null, availableProjectChangeRequests);
	// 		});
	// 	}
	// ], function(err, availableProjectChangeRequests){
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.jsonp(availableProjectChangeRequests);
	// 	}
	// });


};


exports.addProjectChangeRequest = function(req, res) {

	var portfolioChangeRequest = req.portfolioChangeRequest;
    portfolioChangeRequest.associatedProjectChangeRequests.push(req.params.projectChangeRequestId);
    portfolioChangeRequest.save(function(err){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioChangeRequest);
		}
	});

};

exports.removeProjectChangeRequest = function(req, res) {
	var portfolioChangeRequest = req.portfolioChangeRequest;
    portfolioChangeRequest.associatedProjectChangeRequests.splice(portfolioChangeRequest.associatedProjectChangeRequests.indexOf(req.params.projectChangeRequestId), 1);
    portfolioChangeRequest.save(function(err){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioChangeRequest);
		}
	});

};



// **************** FUNDING REQUESTS ******************



exports.createFundingRequest = function(req, res) {

    var portfolioChangeRequest = req.portfolioChangeRequest;

    var newFundingRequest = portfolioChangeRequest.fundingRequests.create(req.body);
    portfolioChangeRequest.fundingRequests.push(newFundingRequest);

    portfolioChangeRequest.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(newFundingRequest);
        }
    });

};


exports.updateFundingRequest = function(req, res) {
    var portfolioChangeRequest = req.portfolioChangeRequest;
    var fundingRequest = portfolioChangeRequest.fundingRequests.id(req.params.fundingRequestId);

    fundingRequest = _.extend(fundingRequest , req.body);

    portfolioChangeRequest.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(fundingRequest);
        }
    });

};


exports.deleteFundingRequest = function(req, res) {
    var portfolioChangeRequest = req.portfolioChangeRequest;
    portfolioChangeRequest.fundingRequests.id(req.params.fundingRequestId).remove();
    portfolioChangeRequest.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioChangeRequest);
        }
    });

};




// **************** MIDDLEWARE ******************



/**
 * Portfolio change request middleware
 */
exports.portfolioChangeRequestByID = function(req, res, next, id) {
    // var ProjectChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectChangeRequest');
    // var BaselineCost = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCost');
    // var ActualCost = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCost');
    //
    // var PortfolioChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioChangeRequest');
    // PortfolioChangeRequest.findById(id).deepPopulate([
     //    'associatedProjectChangeRequests'
    // ]).populate('user', 'displayName').populate('approval.currentRecord.user', 'displayName').populate('approval.history.user', 'displayName')
     //    .exec(function(err, portfolioChangeRequest) {
	// 	if (err){ return next(err); }
	// 	if (! portfolioChangeRequest){ return next(new Error({message:'Failed to load Portfolio change request ' + id})); }
     //    req.portfolioChangeRequest = portfolioChangeRequest ;
     //    next();
	// });
};

/**
 * Portfolio change request authorization middleware
 */

exports.hasCreateAuthorization = function(req, res, next) {

    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    var authObj = {
        isPortfolioManager : false,
        isSuperhero : false
    };

    async.waterfall([
        // isPortfolioManager
        function(callback) {
            Portfolio.findById(req.body.portfolio).exec(function(err, portfolio) {
                if(err){
                    return callback(err);
                }
                authObj.isPortfolioManager = (!!portfolio.portfolioManager && portfolio.portfolioManager.equals(req.user._id)) ||
                    (!!portfolio.backupPortfolioManager && portfolio.backupPortfolioManager.equals(req.user._id));

                callback(null);
            });
        },
        // isSuperhero
        function(callback) {
            authObj.isSuperhero = !!_.find(req.user.roles, function(role){
                return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
            });
            callback(null);
        }
    ], function (err) {
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if(!(authObj.isPortfolioManager || authObj.isSuperhero)){
            return res.status(403).send({
                message: 'User is not authorized'
            });
        }
        next();
    });
};

exports.hasEditAuthorization = function(req, res, next) {

    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    var authObj = {
        isPortfolioManager : false,
        isSuperhero : false
    };

    async.waterfall([
        // isPortfolioManager
        function(callback) {
            Portfolio.findById(req.portfolioChangeRequest.portfolio).exec(function(err, portfolio) {
                if(err){
                    return callback(err);
                }
                authObj.isPortfolioManager = (!!portfolio.portfolioManager && portfolio.portfolioManager.equals(req.user._id)) ||
                    (!!portfolio.backupPortfolioManager && portfolio.backupPortfolioManager.equals(req.user._id));

                callback(null);
            });
        },
        // isSuperhero
        function(callback) {
            authObj.isSuperhero = !!_.find(req.user.roles, function(role){
                return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
            });
            callback(null);
        }
    ], function (err) {
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if(!(authObj.isPortfolioManager || authObj.isSuperhero)){
            return res.status(403).send({
                message: 'User is not authorized'
            });
        }
        next();
    });
};

exports.hasApproveAuthorization = function(req, res, next) {

    var authObj = {
        isSuperhero : false
    };

    authObj.isSuperhero = !!_.find(req.user.roles, function(role){
        return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
    });

    if(!authObj.isSuperhero){
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }

    next();
};

exports.objectIsEditable = function(req, res, next) {

    var objectIsDraft = req.portfolioChangeRequest.approval.currentRecord.approvalState === 'draft';

    if(!objectIsDraft){
        return res.status(403).send({
            message: 'Object cannot be edited'
        });
    }

    next();
};


