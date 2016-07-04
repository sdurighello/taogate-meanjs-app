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

    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    var portfolioChangeRequest = req.portfolioChangeRequest;

    if(portfolioChangeRequest.approval.currentRecord.approvalState !== 'submitted'){
        return res.status(403).send(
            {message :'Current document is '+ portfolioChangeRequest.approval.currentRecord.approvalState +' and cannot be approved'}
        );
    }

    async.waterfall([
        // Update portfolioChangeRequest
        function(callback) {
            portfolioChangeRequest.approval.history.push({
                approvalState : portfolioChangeRequest.approval.currentRecord.approvalState,
                user : portfolioChangeRequest.approval.currentRecord.user,
                created : portfolioChangeRequest.approval.currentRecord.created
            });
            portfolioChangeRequest.approval.currentRecord.approvalState = 'approved';
            portfolioChangeRequest.approval.currentRecord.user = req.user;
            portfolioChangeRequest.approval.currentRecord.created = Date.now();

            portfolioChangeRequest.save(function(err){
                callback(err);
            });
        },
        // Get portfolio
        function(callback) {
            Portfolio.findById(portfolioChangeRequest.portfolio).exec(function(err, portfolio){
                if(err){
                    return callback(err);
                }
                if(!portfolio){
                    return callback({message: 'Cannot find portfolio with id: '+ portfolioChangeRequest.portfolio});
                }
                callback(null, portfolio);
            });
        },
        // Update portfolio budget
        function(portfolio, callback) {

            portfolio.budget.history.push({
                amount: portfolio.budget.currentRecord.amount,
                sourceChangeRequest: portfolio.budget.currentRecord.sourceChangeRequest,
                created: portfolio.budget.currentRecord.created,
                user: portfolio.budget.currentRecord.user
            });

            portfolio.budget.currentRecord.amount = portfolio.budget.currentRecord.amount + portfolioChangeRequest.totalFunding.totalFundingPortfolioChangeRequest;
            portfolio.budget.currentRecord.sourceChangeRequest = portfolioChangeRequest._id;
            portfolio.budget.currentRecord.created = Date.now();
            portfolio.budget.currentRecord.user = { _id: req.user._id, displayName : req.user.displayName };

            portfolio.save(function(err){
                callback(err);
            });
        }
    ], function (err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioChangeRequest);
        }
    });


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

	var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    Project.find(
        {
            'selection.active': true, 'selection.selectedForDelivery': true, 
            'process.assignmentConfirmed': true,
            'portfolio': req.params.portfolioId
        }
    ).exec(function(err, projects){
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            }); 
        }
        var availableProjectChangeRequests = [];
        _.each(projects, function(project){
            _.each(project.process.gates, function(gate){
                _.each(gate.projectChangeRequests, function(projectChangeRequest){
                    var notAlreadyAssociated = !projectChangeRequest.associatedPortfolioChangeRequest;
                    var isNotDraft = projectChangeRequest.approval.currentRecord.approvalState !== 'draft';
                    var hasBudgetChange = projectChangeRequest.budgetReview.budgetChange && (projectChangeRequest.budgetReview.budgetChange !== 0);
                    
                    if(notAlreadyAssociated && isNotDraft && hasBudgetChange){
                        availableProjectChangeRequests.push({
                            _id : projectChangeRequest._id,
                            project: {
                                _id: project._id,
                                name: project.identification.name
                            },
                            gate : {
                                _id: gate._id,
                                name: gate.name
                            },
                            raisedOnDate : projectChangeRequest.raisedOnDate,
                            title : projectChangeRequest.title,
                            description : projectChangeRequest.description,

                            reason : {
                                _id: projectChangeRequest.reason._id,
                                name: projectChangeRequest.reason.name
                            },
                            state : {
                                _id: projectChangeRequest.state._id,
                                name: projectChangeRequest.state.name
                            },
                            priority : {
                                _id: projectChangeRequest.priority._id,
                                name: projectChangeRequest.priority.name
                            },

                            changeStatus : {
                                currentRecord : {
                                    baselineDeliveryDate : projectChangeRequest.changeStatus.currentRecord.baselineDeliveryDate,
                                    estimateDeliveryDate : projectChangeRequest.changeStatus.currentRecord.estimateDeliveryDate,
                                    actualDeliveryDate : projectChangeRequest.changeStatus.currentRecord.actualDeliveryDate,

                                    completed : projectChangeRequest.changeStatus.currentRecord.completed,
                                    status: {
                                        _id: projectChangeRequest.changeStatus.currentRecord.status._id,
                                        name: projectChangeRequest.changeStatus.currentRecord.status.name,
                                        color: projectChangeRequest.changeStatus.currentRecord.status.color
                                    },
                                    comment : projectChangeRequest.changeStatus.currentRecord.comment
                                }
                            },

                            approval : {
                                currentRecord : {
                                    approvalState: projectChangeRequest.changeStatus.currentRecord.approvalState
                                }
                            },

                            budgetReview : {
                                currentAmount: projectChangeRequest.budgetReview.currentAmount,
                                newAmount: projectChangeRequest.budgetReview.newAmount,
                                budgetChange : projectChangeRequest.budgetReview.budgetChange
                            }
                        });
                    }
                                        
                });
            });
        });

        res.jsonp(availableProjectChangeRequests);

    });

};


exports.addProjectChangeRequest = function(req, res) {

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    var portfolioChangeRequest = req.portfolioChangeRequest;
    
    async.waterfall([
        // Add projectCR to portfolioChangeRequest.associatedProjectCRs
        function(callback) {
            portfolioChangeRequest.associatedProjectChangeRequests.push(req.body);
            portfolioChangeRequest.save(function(err){
                callback(err);
            });
        },
        // Set "associatedPortfolioCR" flag in projectCR to portfolioCRId
        function(callback) {
            Project.findById(req.body.project._id).exec(function(err, project){
                if (err) {
                    return callback(err);
                }
                var cr = project.process.gates.id(req.body.gate._id).projectChangeRequests.id(req.body._id);
                cr.associatedPortfolioChangeRequest = portfolioChangeRequest._id;
                project.save(function(err){
                    callback(err);
                });
            });
        }
    ], function (err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.jsonp(portfolioChangeRequest);
    });
    
};

exports.removeProjectChangeRequest = function(req, res) {

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    var portfolioChangeRequest = req.portfolioChangeRequest;

    async.waterfall([
        // Remove projectCR to portfolioChangeRequest.associatedProjectCRs
        function(callback) {
            portfolioChangeRequest.associatedProjectChangeRequests.id(req.params.projectChangeRequestId).remove();
            portfolioChangeRequest.save(function(err){
                callback(err);
            });
        },
        // Set "associatedPortfolioCR" flag in projectCR to null
        function(callback) {
            Project.findById(req.body.project._id).exec(function(err, project){
                if (err) {
                    return callback(err);
                }
                var cr = project.process.gates.id(req.body.gate._id).projectChangeRequests.id(req.body._id);
                cr.associatedPortfolioChangeRequest = null;
                project.save(function(err){
                    callback(err);
                });
            });
        }
    ], function (err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.jsonp(portfolioChangeRequest);
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

    var PortfolioChangeRequest = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioChangeRequest');

    PortfolioChangeRequest.findById(id)
        .exec(function(err, portfolioChangeRequest) {
		if (err){ return next(err); }
		if (! portfolioChangeRequest){ return next(new Error({message:'Failed to load Portfolio change request ' + id})); }
        req.portfolioChangeRequest = portfolioChangeRequest ;
        next();
	});
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


