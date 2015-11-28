'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    async = require('async'),
	_ = require('lodash');

/**
 * Create a Portfolio
 */
exports.create = function(req, res) {
    var PortfolioRanking = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioRanking');
	var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
	var portfolio = new Portfolio(req.body);
	portfolio.user = req.user;

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

/**
 * Show the current Portfolio
 */
exports.read = function(req, res) {
	res.jsonp(req.portfolio);
};

/**
 * Update a Portfolio
 */
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

/**
 * Delete an Portfolio
 */
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


/**
 * List of Portfolios
 */
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

/**
 * Portfolio middleware
 */
exports.portfolioByID = function(req, res, next, id) {
	var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
	Portfolio.findById(id).deepPopulate(['parent','type','portfolioManager','backupPortfolioManager']).populate('user', 'displayName').exec(function(err, portfolio) {
		if (err) return next(err);
		if (! portfolio) return next(new Error('Failed to load Portfolio ' + id));
		req.portfolio = portfolio ;
		next();
	});
};

/**
 * Portfolio authorization middleware
 */
exports.hasCreateAuthorization = function(req, res, next) {
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

exports.hasEditAuthorization = function(req, res, next) {
	// User role check
    var isPortfolioManagerAssigned = function(){
        if(_.isUndefined(req.portfolio.portfolioManager) || _.isNull(req.portfolio.portfolioManager)){
           return false;
        } else {
            return req.portfolio.portfolioManager.equals(req.user._id);
        }
    };

    var isBackupPortfolioManagerAssigned = function(){
        if(_.isUndefined(req.portfolio.backupPortfolioManager) || _.isNull(req.portfolio.backupPortfolioManager)){
            return false;
        } else {
            return req.portfolio.backupPortfolioManager.equals(req.user._id);
        }
    };

	if(!_.find(req.user.roles, function(role){
			return (role === 'superAdmin' || role === 'admin' || role === 'pmo' ||
            (role === 'portfolioManager' && isPortfolioManagerAssigned()) ||
                (role === 'portfolioManager' && isBackupPortfolioManagerAssigned())
            );
		})
	){
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
