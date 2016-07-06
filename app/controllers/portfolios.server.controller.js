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
        // PORTFOLIO.STAKEHOLDERS: Add all existing people groups to new portfolio
        function(callback){
            PeoplePortfolioGroup.find().exec(function(err, groups){
                if (err) {
                    return callback(err);
                }

                _.each(groups, function(group){
                    var newAssignedGroup = portfolio.stakeholders.create({group: group._id, roles: []});
                    portfolio.stakeholders.push(newAssignedGroup);
                });

                portfolio.save(function(err){
                    callback(err);
                });

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


// --- STAKEHOLDERS ---


exports.createAssignedRole = function(req, res){

    var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    // Checks
    if(!req.params.assignedGroupId){
        return res.status(400).send({
            message: 'Assigned stakeholder group ID is required'
        });
    }

    var portfolio = req.portfolio;
    portfolio.user = req.user;
    portfolio.created = Date.now();

    async.waterfall([
        function(callback) {
            PeopleCategory.find().exec(function(err, categories) {
                if (err) {
                    callback(err);
                } else {
                    var categorization = [];
                    _.each(categories, function(category){
                        categorization.push({
                            category: category._id,
                            categoryValue: null
                        });
                    });

                    callback(null, categorization);
                }
            });
        },
        function(categorization, callback) {
            var editedGroup = portfolio.stakeholders.id(req.params.assignedGroupId);
            var newAssignedRole = editedGroup.roles.create({
                role : {
                    name: 'New role'
                },
                person: null,
                categorization: categorization
            });

            editedGroup.roles.push(newAssignedRole);

            portfolio.save(function(err){
                if(err){
                    return callback(err);
                }
                callback(null, newAssignedRole);
            });
        },
        function(newAssignedRole, callback){
            Portfolio.findById(req.params.portfolioId).deepPopulate([
                'stakeholders.group','stakeholders.roles.categorization.category.categoryValues'
            ]).exec(function(err, portfolio){
                if(err){
                    return callback(err);
                }
                var populatedRole = portfolio.stakeholders.id(req.params.assignedGroupId).roles.id(newAssignedRole._id);
                callback(null, populatedRole);
            });
        }
    ], function (err, populatedRole) {
        if( err ) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(populatedRole);
        }
    });


};


exports.updateAssignedRole = function(req, res) {
    var portfolio = req.portfolio ;
    portfolio.user = req.user;
    portfolio.created = Date.now();

    var editedAssignedGroup = portfolio.stakeholders.id(req.params.assignedGroupId);
    var editedAssignedRole = editedAssignedGroup.roles.id(req.params.assignedRoleId);

    editedAssignedRole = _.extend(editedAssignedRole, req.body);

    portfolio.save(function(err){
        if( err ) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedAssignedRole);
        }
    });

};


exports.deleteAssignedRole = function(req, res){

    var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');

    // Checks
    if(!req.params.assignedGroupId){
        return res.status(400).send({
            message: 'Assigned stakeholder group ID is required'
        });
    }
    if(!req.params.assignedRoleId){
        return res.status(400).send({
            message: 'Assigned stakeholder role ID is required'
        });
    }

    var portfolio = req.portfolio;
    portfolio.user = req.user;
    portfolio.created = Date.now();

    var editedGroup = portfolio.stakeholders.id(req.params.assignedGroupId);
    var deletedAssignedRole = editedGroup.roles.id(req.params.assignedRoleId).remove();

    portfolio.save(function(err){
        if( err ) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(deletedAssignedRole);
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
