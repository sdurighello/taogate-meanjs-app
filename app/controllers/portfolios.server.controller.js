'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    async = require('async'),
	_ = require('lodash');


// --- PORTFOLIO ---

var createPortfolio = function(user, body, callback){
    var PortfolioRanking = mongoose.mtModel(user.tenantId + '.' + 'PortfolioRanking');
    var Portfolio = mongoose.mtModel(user.tenantId + '.' + 'Portfolio');
    var portfolio = new Portfolio(body);
    portfolio.user = user;

    var PeopleCategory = mongoose.mtModel(user.tenantId + '.' + 'PeopleCategory');
    var PeoplePortfolioGroup = mongoose.mtModel(user.tenantId + '.' + 'PeoplePortfolioGroup');
    var PeoplePortfolioRole = mongoose.mtModel(user.tenantId + '.' + 'PeoplePortfolioRole');

    var LogStatusArea = mongoose.mtModel(user.tenantId + '.' + 'LogStatusArea');

    async.series([
        // PORTFOLIO: Save new portfolio
        function(callback){
            portfolio.save(function(err){
                callback(err);
            });
        },
        // PORTFOLIO-RANKINGS: Add portfolio to rankings
        function(callback){
            var portfolioRanking = new PortfolioRanking({
                portfolio: portfolio._id,
                projects: []
            });
            portfolioRanking.save(function(err){
                callback(err);
            });
        },
        // PORTFOLIO STATUS AREAS
        function(callback){
            LogStatusArea.find({ applicableTo: {$in: ['portfolio', 'both']} }).exec(function(err, areas){
                if(err){
                    return callback(err);
                }
                _.each(areas, function(area){
                    portfolio.portfolioStatus.portfolioStatusAreas.push({
                        statusArea:{
                            _id: area._id,
                            name: area.name
                        },
                        currentRecord: {user:{_id: user._id, displayName: user.displayName}},
                        history:[]
                    });
                });
                portfolio.save(function(err){
                    callback(err);
                });
            });
        },
        // PORTFOLIO.STAKEHOLDERS: Add all existing groups/roles + categories/values to new portfolio
        function(callback){
            async.waterfall([
                // Create the "categorization" array [{category:<objectId>, categoryValue:null}] from all existing people-categories
                function(callback){
                    PeopleCategory.find().exec(function(err, categories) {
                        if (err) {
                            callback(err);
                        } else {
                            var retArray = [];
                            async.each(categories, function(category, callback){
                                retArray.push({
                                    category: category._id,
                                    categoryValue: null
                                });
                                callback();
                            });
                            callback(null, retArray);
                        }
                    });
                },
                // Add to portfolios all the people-groups/roles with the "categorization" array
                function(retArray, callback){
                    PeoplePortfolioGroup.find().exec(function(err, groups){
                        if (err) {
                            callback(err);
                        } else {
                            async.each(groups, function(group, callback){
                                var obj = {group: group._id, roles: []};
                                async.each(group.roles, function(role, callback){
                                    obj.roles.push({
                                        role: role,
                                        person: null,
                                        categorization: retArray
                                    });
                                    callback();
                                });
                                portfolio.stakeholders.push(obj);
                                portfolio.save(function(err){
                                    if(err){callback(err);} else {callback();}
                                });
                            });
                            callback(null);
                        }
                    });
                }
            ],function(err){
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    ],function(err){
        if (err) {
            callback(err);
        } else {
            callback(null, portfolio);
        }
    });
};

exports.createPortfolio = createPortfolio;

exports.create = function(req, res) {
    createPortfolio(req.user, req.body, function(err, portfolio){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolio);
        }
    });

    // var PortfolioRanking = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioRanking');
    // var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
    // var portfolio = new Portfolio(req.body);
    // portfolio.user = req.user;
    //
    // var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');
    // var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');
    // var PeoplePortfolioRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioRole');
    //
    // async.series([
    //     // PORTFOLIO: Save new portfolio
    //     function(callback){
    //         portfolio.save(function(err){
    //             callback(err);
    //         });
    //     },
    //     // PORTFOLIO-RANKINGS: Add portfolio to rankings
    //     function(callback){
    //         var portfolioRanking = new PortfolioRanking({
    //             portfolio: portfolio._id,
    //             projects: []
    //         });
    //         portfolioRanking.save(function(err){
    //             callback(err);
    //         });
    //     },
    //     // PORTFOLIO.STAKEHOLDERS: Add all existing groups/roles + categories/values to new portfolio
    //     function(callback){
    //         async.waterfall([
    //             // Create the "categorization" array [{category:<objectId>, categoryValue:null}] from all existing people-categories
    //             function(callback){
    //                 PeopleCategory.find().exec(function(err, categories) {
    //                     if (err) {
    //                         callback(err);
    //                     } else {
    //                         var retArray = [];
    //                         async.each(categories, function(category, callback){
    //                             retArray.push({
    //                                 category: category._id,
    //                                 categoryValue: null
    //                             });
    //                             callback();
    //                         });
    //                         callback(null, retArray);
    //                     }
    //                 });
    //             },
    //             // Add to portfolios all the people-groups/roles with the "categorization" array
    //             function(retArray, callback){
    //                 PeoplePortfolioGroup.find().exec(function(err, groups){
    //                     if (err) {
    //                         callback(err);
    //                     } else {
    //                         async.each(groups, function(group, callback){
    //                             var obj = {group: group._id, roles: []};
    //                             async.each(group.roles, function(role, callback){
    //                                 obj.roles.push({
    //                                     role: role,
    //                                     person: null,
    //                                     categorization: retArray
    //                                 });
    //                                 callback();
    //                             });
    //                             portfolio.stakeholders.push(obj);
    //                             portfolio.save(function(err){
    //                                 if(err){callback(err);} else {callback();}
    //                             });
    //                         });
    //                         callback(null);
    //                     }
    //                 });
    //             }
    //         ],function(err){
    //             if (err) {
    //                 callback(err);
    //             } else {
    //                 callback(null);
    //             }
    //         });
    //     }
    // ],function(err){
    //     if (err) {
    //         return res.status(400).send({
    //             message: errorHandler.getErrorMessage(err)
    //         });
    //     } else {
    //         res.jsonp(portfolio);
    //     }
    // });

};

exports.read = function(req, res) {
	res.jsonp(req.portfolio);
};

exports.update = function(req, res) {
	var portfolio = req.portfolio ;
    portfolio.user = req.user;
    portfolio.created = Date.now();
	portfolio = _.extend(portfolio , req.body);

    portfolio.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolio);
		}
	});
};

exports.delete = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var PortfolioRanking = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioRanking');
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
    var portfolio = req.portfolio ;

    async.series([
        // PORTFOLIOS: Delete portfolio from portfolios
        function(callback){
            portfolio.remove(function(err){
                callback(err);
            });
        },
        // 1st DEGREE CHILDREN: Delete portfolio from first degree children portfolios (parent and ancestors)
        function(callback){
            Portfolio.find({parent: portfolio._id}).exec(function(err, portfolios){
                if(err){
                    callback(err);
                } else {
                    async.each(portfolios, function(item, callback){
                        item.parent = null;
                        item.ancestors = [];
                        item.save(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    });
                    callback(null);
                }
            });
        },
        // 2nd DEGREE CHILDREN: Delete portfolio from second degree children portfolios (in ancestors only)
        function(callback){
            Portfolio.find({ancestors: {$in: [portfolio._id]}}).exec(function(err, portfolios){
                if(err){
                    callback(err);
                } else {
                    async.each(portfolios, function(item, callback){
                        item.ancestors.splice(item.ancestors.indexOf(portfolio._id), 1);
                        item.save(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    });
                    callback(null);
                }
            });
        },
        // PROJECTS: Delete portfolio from assigned projects and set project's "portfolio" property to null (important since ranking checks if null)
        function(callback){
            Project.find({portfolio: portfolio._id}).exec(function(err, projects){
                if(err){
                    callback(err);
                } else {
                    async.each(projects, function(project, callback){
                        project.portfolio = null;
                        project.save(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    });
                    callback(null);
                }
            });
        },
        // RANKING: Delete portfolio ranking
        function(callback){
            PortfolioRanking.findOne({portfolio: portfolio._id}).exec(function(err, portfolioRanking){
                if (err) {
                    callback(err);
                } else {
                    if(portfolioRanking){ // This check shouldn't be necessary since when I create a portfolio I also create a ranking
                        portfolioRanking.remove(function(err){
                            if(err){callback(err);}
                        });
                    }
                    callback(null);
                }
            });
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolio);
        }
    });
};

exports.list = function(req, res) {
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
    Portfolio.find(req.query).populate('user', 'displayName').exec(function(err, portfolios) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolios);
        }
    });
};


// --- STATUS UPDATES ---


exports.createStatusUpdate = function(req, res){

    var portfolio = req.portfolio;
    
    var newStatusUpdate = portfolio.portfolioStatusUpdates.create({
        updateDate : req.body.updateDate,
        title : req.body.title,
        approval : {
            currentRecord : {
                approvalState: 'draft',
                user: { _id: req.user._id, displayName: req.user.displayName }
            },
            history : []
        },
        portfolioStatus : {
            overallStatusReview : {
                currentRecord: {
                    status: {
                        _id : portfolio.portfolioStatus.overallStatus.currentRecord.status._id,
                        name : portfolio.portfolioStatus.overallStatus.currentRecord.status.name,
                        color : portfolio.portfolioStatus.overallStatus.currentRecord.status.color
                    },
                    comment : portfolio.portfolioStatus.overallStatus.currentRecord.comment
                },
                newStatus: {
                    _id : portfolio.portfolioStatus.overallStatus.currentRecord.status._id,
                    name : portfolio.portfolioStatus.overallStatus.currentRecord.status.name,
                    color : portfolio.portfolioStatus.overallStatus.currentRecord.status.color
                },
                newComment : portfolio.portfolioStatus.overallStatus.currentRecord.comment
            },
            portfolioStatusAreaReviews : []
        },
        budgetReview : {
            currentAmount : portfolio.budget.currentRecord.amount,
            newAmount : portfolio.budget.currentRecord.amount
        },
        user: req.user._id
    });

    // Create status areas reviews
    _.each(portfolio.portfolioStatus.portfolioStatusAreas, function(area){
        newStatusUpdate.portfolioStatus.portfolioStatusAreaReviews.push({
            portfolioStatusArea : {
                _id: area._id,
                statusArea: {
                    _id: area.statusArea._id,
                    name: area.statusArea.name
                },
                currentRecord: {
                    status: {
                        _id : area.currentRecord.status._id,
                        name : area.currentRecord.status.name,
                        color : area.currentRecord.status.color
                    },
                    comment : area.currentRecord.comment
                }
            },
            newStatus:  {
                _id : area.currentRecord.status._id,
                name : area.currentRecord.status.name,
                color : area.currentRecord.status.color
            },
            newComment:  area.currentRecord.comment
        });
    });

    
    portfolio.portfolioStatusUpdates.push(newStatusUpdate);

    portfolio.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(newStatusUpdate);
        }
    });

};

exports.deleteStatusUpdate = function(req, res){

    var portfolio = req.portfolio ;
    
    var deletedDocument = portfolio.portfolioStatusUpdates.id(req.params.portfolioStatusUpdateId).remove();

    portfolio.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(deletedDocument);
        }
    });
};


// Header

exports.updateStatusUpdateHeader = function(req, res){

    var portfolio = req.portfolio ;
    
    var editedStatusUpdate = portfolio.portfolioStatusUpdates.id(req.params.portfolioStatusUpdateId);

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    editedStatusUpdate.updateDate = req.body.updateDate;
    editedStatusUpdate.title = req.body.title;
    editedStatusUpdate.description = req.body.description;

    portfolio.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });
};


// Budget

exports.updateStatusUpdateBudget = function(req, res){

    var portfolio = req.portfolio ;
    
    var editedStatusUpdate = portfolio.portfolioStatusUpdates.id(req.params.portfolioStatusUpdateId);

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    editedStatusUpdate.budgetReview.newAmount = req.body.budgetReview.newAmount;

    portfolio.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });
};


// Delivery Status

exports.updateOverallDeliveryStatus = function(req, res){

    var portfolio = req.portfolio ;

    var editedStatusUpdate = portfolio.portfolioStatusUpdates.id(req.params.portfolioStatusUpdateId);

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    editedStatusUpdate.portfolioStatus.overallStatusReview.newStatus = req.body.portfolioStatus.overallStatusReview.newStatus;
    editedStatusUpdate.portfolioStatus.overallStatusReview.newComment = req.body.portfolioStatus.overallStatusReview.newComment;

    portfolio.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });

};

exports.updateStatusAreaReview = function(req, res){

    var portfolio = req.portfolio ;

    var editedStatusUpdate = portfolio.portfolioStatusUpdates.id(req.params.portfolioStatusUpdateId);
    var editedStatusAreaReview = editedStatusUpdate.portfolioStatus.portfolioStatusAreaReviews.id(req.params.statusAreaReviewId);

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    editedStatusAreaReview.newStatus = req.body.newStatus;
    editedStatusAreaReview.newComment = req.body.newComment;

    portfolio.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusAreaReview);
        }
    });

};


// Approval

exports.submitStatusUpdate = function(req, res) {

    var portfolio = req.portfolio ;
    
    var editedStatusUpdate = portfolio.portfolioStatusUpdates.id(req.params.portfolioStatusUpdateId);

    editedStatusUpdate.approval.history.push({
        approvalState : editedStatusUpdate.approval.currentRecord.approvalState,
        user : {
            _id: editedStatusUpdate.approval.currentRecord.user._id,
            displayName: editedStatusUpdate.approval.currentRecord.user.displayName
        },
        created : editedStatusUpdate.approval.currentRecord.created
    });

    editedStatusUpdate.approval.currentRecord.approvalState = 'submitted';
    editedStatusUpdate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedStatusUpdate.approval.currentRecord.created = Date.now();

    portfolio.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });

};

exports.approveStatusUpdate = function(req, res) {

    var portfolio = req.portfolio ;
    
    var editedStatusUpdate = portfolio.portfolioStatusUpdates.id(req.params.portfolioStatusUpdateId);
    
    // Update editedStatusUpdate with req.body information

    editedStatusUpdate.approval.history.push({
        approvalState : editedStatusUpdate.approval.currentRecord.approvalState,
        user : {
            _id: editedStatusUpdate.approval.currentRecord.user._id,
            displayName: editedStatusUpdate.approval.currentRecord.user.displayName
        },
        created : editedStatusUpdate.approval.currentRecord.created
    });

    editedStatusUpdate.approval.currentRecord.approvalState = 'approved';
    editedStatusUpdate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedStatusUpdate.approval.currentRecord.created = Date.now();

    // Apply changes to DELIVERY STATUS - Overall

    portfolio.portfolioStatus.overallStatus.history.push({
        sourceStatusUpdate : portfolio.portfolioStatus.overallStatus.currentRecord.sourceStatusUpdate,
        status: portfolio.portfolioStatus.overallStatus.currentRecord.status,
        comment: portfolio.portfolioStatus.overallStatus.currentRecord.comment,
        created: portfolio.portfolioStatus.overallStatus.currentRecord.created,
        user: portfolio.portfolioStatus.overallStatus.currentRecord.user
    });
    portfolio.portfolioStatus.overallStatus.currentRecord.sourceStatusUpdate = editedStatusUpdate._id;
    portfolio.portfolioStatus.overallStatus.currentRecord.status = editedStatusUpdate.portfolioStatus.overallStatusReview.newStatus;
    portfolio.portfolioStatus.overallStatus.currentRecord.comment = editedStatusUpdate.portfolioStatus.overallStatusReview.newComment;
    portfolio.portfolioStatus.overallStatus.currentRecord.created = Date.now();
    portfolio.portfolioStatus.overallStatus.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};

    // Apply changes to DELIVERY STATUS - Status Areas

    _.each(editedStatusUpdate.portfolioStatus.portfolioStatusAreaReviews, function(statusAreaReview){
        var editedPortfolioStatusArea = portfolio.portfolioStatus.portfolioStatusAreas.id(statusAreaReview.portfolioStatusArea._id);
        editedPortfolioStatusArea.history.push({
            sourceStatusUpdate : editedPortfolioStatusArea.currentRecord.sourceStatusUpdate,
            status: editedPortfolioStatusArea.currentRecord.status,
            comment: editedPortfolioStatusArea.currentRecord.comment,
            created: editedPortfolioStatusArea.currentRecord.created,
            user: editedPortfolioStatusArea.currentRecord.user
        });
        editedPortfolioStatusArea.currentRecord.sourceStatusUpdate = editedStatusUpdate._id;
        editedPortfolioStatusArea.currentRecord.status = statusAreaReview.newStatus;
        editedPortfolioStatusArea.currentRecord.comment = statusAreaReview.newComment;
        editedPortfolioStatusArea.currentRecord.created = Date.now();
        editedPortfolioStatusArea.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    });

    // Apply changes to BUDGET

    portfolio.budget.history.push({
        sourceStatusUpdate : portfolio.budget.currentRecord.sourceStatusUpdate,
        amount: portfolio.budget.currentRecord.cost,
        created: portfolio.budget.currentRecord.created,
        user: portfolio.budget.currentRecord.user
    });
    portfolio.budget.currentRecord.sourceStatusUpdate = editedStatusUpdate._id;
    portfolio.budget.currentRecord.amount = editedStatusUpdate.budgetReview.newAmount;
    portfolio.budget.currentRecord.created = Date.now();
    portfolio.budget.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};

    // Save portfolio

    portfolio.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });
};

exports.rejectStatusUpdate = function(req, res) {

    var portfolio = req.portfolio ;

    var editedStatusUpdate = portfolio.portfolioStatusUpdates.id(req.params.portfolioStatusUpdateId);

    editedStatusUpdate.approval.history.push({
        approvalState : editedStatusUpdate.approval.currentRecord.approvalState,
        user : {
            _id: editedStatusUpdate.approval.currentRecord.user._id,
            displayName: editedStatusUpdate.approval.currentRecord.user.displayName
        },
        created : editedStatusUpdate.approval.currentRecord.created
    });

    editedStatusUpdate.approval.currentRecord.approvalState = 'rejected';
    editedStatusUpdate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedStatusUpdate.approval.currentRecord.created = Date.now();

    // No missing fields check

    portfolio.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });

};

exports.draftStatusUpdate = function(req, res) {

    var portfolio = req.portfolio ;

    var editedStatusUpdate = portfolio.portfolioStatusUpdates.id(req.params.portfolioStatusUpdateId);

    editedStatusUpdate.approval.history.push({
        approvalState : editedStatusUpdate.approval.currentRecord.approvalState,
        user : {
            _id: editedStatusUpdate.approval.currentRecord.user._id,
            displayName: editedStatusUpdate.approval.currentRecord.user.displayName
        },
        created : editedStatusUpdate.approval.currentRecord.created
    });

    editedStatusUpdate.approval.currentRecord.approvalState = 'draft';
    editedStatusUpdate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedStatusUpdate.approval.currentRecord.created = Date.now();

    portfolio.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });

};

// --- STAKEHOLDERS ---

exports.updatePeopleAssignment = function(req, res) {
    var portfolio = req.portfolio ;
    portfolio.user = req.user;
    portfolio.created = Date.now();

    async.each(portfolio.stakeholders, function(assignedGroup, callback) {
        if(assignedGroup._id.equals(req.params.assignedGroupId)){
            async.each(assignedGroup.roles, function(assignedRole, callback){
                if(assignedRole._id.equals(req.params.assignedRoleId)){
                    assignedRole = _.extend(assignedRole, req.body);
                    portfolio.save(function(err){
                        if(err){callback(err);}
                    });
                }
                callback();
            });
        }
        callback();
    }, function(err){
        if( err ) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolio);
        }
    });

};


// --- MIDDLEWARE ---

exports.portfolioByID = function(req, res, next, id) {
	var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    var retPropertiesString = '';
    var deepPopulateArray = [];

    if(req.query.retPropertiesString){
        retPropertiesString = req.query.retPropertiesString;
    }
    if(req.query.deepPopulateArray){
        deepPopulateArray = req.query.deepPopulateArray;
    }

	Portfolio.findById(id, retPropertiesString).deepPopulate(deepPopulateArray).populate('user', 'displayName')
        .exec(function(err, portfolio) {
            if (err) return next(err);
            if (! portfolio) return next(new Error('Failed to load Portfolio ' + id));
            req.portfolio = portfolio ;
            next();
        }
    );
};

// --- AUTHORIZATION ---

exports.hasCreateAuthorization = function(req, res, next) {

    var userIsPortfolioManager, userIsBackupPortfolioManager, userIsSuperhero;

    if(req.body.portfolioManager){
        userIsPortfolioManager = req.portfolio.portfolioManager.equals(req.user._id);
    }

    if(req.body.backupPortfolioManager){
        userIsBackupPortfolioManager = req.portfolio.backupPortfolioManager.equals(req.user._id);
    }

    userIsSuperhero = !!_.find(req.user.roles, function(role) {
        return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
    });

    if(!(userIsPortfolioManager || userIsBackupPortfolioManager || userIsSuperhero)){
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }

    next();
};

exports.hasEditAuthorization = function(req, res, next) {

    var userIsPortfolioManager, userIsBackupPortfolioManager, userIsSuperhero;

    if(req.portfolio.portfolioManager){
        userIsPortfolioManager = req.portfolio.portfolioManager.equals(req.user._id);
    }

    if(req.portfolio.backupPortfolioManager){
        userIsBackupPortfolioManager = req.portfolio.backupPortfolioManager.equals(req.user._id);
    }

    userIsSuperhero = !!_.find(req.user.roles, function(role) {
        return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
    });

	if(!(userIsPortfolioManager || userIsBackupPortfolioManager || userIsSuperhero)){
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	next();
};

exports.isStatusUpdateEditable = function(req, res, next){
    next();
};

exports.hasApproveAuthorization = function(req, res, next){
    next();
};
