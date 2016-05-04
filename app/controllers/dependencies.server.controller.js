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

    async.waterfall([
        function(callback) {
            dependency.save(function(err) {
                if (err) {
                    return callback(err);
                } else {
                    callback(null);
                }
            });
        },
        function(callback) {
            Dependency.findById(dependency._id).deepPopulate([
                'source.portfolio', 'target.portfolio'
            ]).exec(function(err, populatedDependency){
                if(err){
                    return callback(err);
                }
                callback(null, populatedDependency);
            });
        }
    ], function (err, populatedDependency) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(populatedDependency);
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
    Dependency.find(req.query).populate('user', 'displayName').deepPopulate([
        'source.portfolio', 'target.portfolio'
    ]).exec(function(err, dependencies) {
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
 * Dependencies analysis
 */

exports.getDependenciesAnalysis = function(req, res) {

    var Dependency = mongoose.mtModel(req.user.tenantId + '.' + 'Dependency');

    async.waterfall([
        // Get all dependencies , excluding where BOTH target and source are 'not active' (e.g. at least one is active)
        function(callback) {
            Dependency.find()
                .populate('source', 'idNumber parent portfolio identification selection process')
                .populate('target', 'idNumber parent portfolio identification selection process')
                .populate('impact').populate('type').populate('state').populate('statusReview.currentRecord.status')
                .exec(function(err, res) {
                    if (err) {
                        return callback(err);
                    }
                    var dependencies = _.filter(res, function(dependency){
                        return dependency.source.selection.active || dependency.target.selection.active;
                    });
                    callback(null, dependencies);
            });
        },
        function(dependencies, callback) {

            var retArray = {
                nodes : [
                    // { project }
                ],
                links : [
                    // {
                    //  _id: dependencyId,
                    //  source: sourceProjectIndex, target: targetProjectIndex, value: impact.numericalValue
                    //  sourcePortfolio: portfolioId, targetPortfolio: portfolioId
                    //  dependency: { dependencyObj}
                    // }
                ]
            };

            var duplicatedNodes = [];
            _.each(dependencies, function(dependency){
                duplicatedNodes.push(dependency.source);
                duplicatedNodes.push(dependency.target);
            });

            var unique = function(xs) {
                var seen = {};
                return xs.filter(function(x) {
                    if (seen[x._id])
                        return;
                    seen[x._id] = true;
                    return x;
                });
            };

            var uniqueNodes = unique(duplicatedNodes);
            
            var links = _.map(dependencies, function (dependency) {
                return {
                    _id : dependency._id,
                    source: _.findIndex(uniqueNodes, function(node){
                        return node._id.equals(dependency.source._id);
                    }),
                    target: _.findIndex(uniqueNodes, function(node){
                        return node._id.equals(dependency.target._id);
                    }),
                    value: (dependency.impact && dependency.impact.numericalValue && dependency.impact.numericalValue > 0) ? dependency.impact.numericalValue : 1,
                    sourcePortfolioId: dependency.source.portfolio,
                    targetPortfolioId: dependency.target.portfolio,
                    dependency: dependency
                };
            });
            
            retArray.nodes = uniqueNodes;
            retArray.links = links;
            
            callback(null, retArray);
            
        }
    ], function (err, result) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(result);
        }
    });
    
};

/**
 * Dependency middleware
 */

exports.dependencyByID = function(req, res, next, id) {

    var Dependency = mongoose.mtModel(req.user.tenantId + '.' + 'Dependency');

	Dependency.findById(id).populate('user', 'displayName').deepPopulate([
        'source.portfolio', 'target.portfolio'
    ]).exec(function(err, dependency) {
		if (err) return next(err);
		if (! dependency) return next(new Error('Failed to load Dependency ' + id));
		req.dependency = dependency ;
		next();
	});
};

/**
 * Dependency authorization middleware
 */

exports.hasCreateAuthorization = function(req, res, next) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    var authObj = {

        isSourceProjectManager : false,
        isSourcePortfolioManager : false,

        isTargetProjectManager : false,
        isTargetPortfolioManager : false,

        isSuperhero : false
    };

    var sourceId = req.body.source;
    var targetId = req.body.target;

    async.waterfall([
        // SOURCE
        function(callback) {
            Project.findById(sourceId).populate('portfolio').exec(function(err, project){
                if(err){
                    return callback(err);
                }
                if(project.portfolio){
                    authObj.isSourcePortfolioManager =
                        (!!project.portfolio.portfolioManager && project.portfolio.portfolioManager.equals(req.user._id)) ||
                        (!!project.portfolio.backupPortfolioManager && project.portfolio.backupPortfolioManager.equals(req.user._id));
                }
                authObj.isSourceProjectManager =
                    (!!project.identification.projectManager && project.identification.projectManager.equals(req.user._id)) ||
                    (!!project.identification.backupProjectManager && project.identification.backupProjectManager.equals(req.user._id));

                callback(null);
            });
        },
        // TARGET
        function(callback) {
            Project.findById(targetId).populate('portfolio').exec(function(err, project){
                if(err){
                    return callback(err);
                }
                if(project.portfolio){
                    authObj.isTargetPortfolioManager =
                        (!!project.portfolio.portfolioManager && project.portfolio.portfolioManager.equals(req.user._id)) ||
                        (!!project.portfolio.backupPortfolioManager && project.portfolio.backupPortfolioManager.equals(req.user._id));
                }
                authObj.isTargetProjectManager =
                    (!!project.identification.projectManager && project.identification.projectManager.equals(req.user._id)) ||
                    (!!project.identification.backupProjectManager && project.identification.backupProjectManager.equals(req.user._id));

                callback(null);
            });
        },
        // SUPERHERO
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
        if(
            !(authObj.isSourcePortfolioManager || authObj.isSourceProjectManager ||
            authObj.isTargetPortfolioManager || authObj.isTargetProjectManager ||
            authObj.isSuperhero)
        ){
            return res.status(403).send({
                message: 'User is not authorized'
            });
        }

        next();
    });

};

exports.hasEditAuthorization = function(req, res, next) {

    var authObj = {

        isSourceProjectManager : false,
        isSourcePortfolioManager : false,

        isTargetProjectManager : false,
        isTargetPortfolioManager : false,

        isSuperhero : false
    };

    var source = req.dependency.source;
    var target = req.dependency.target;

    // SOURCE
    if(source.portfolio){
        authObj.isSourcePortfolioManager =
            (!!source.portfolio.portfolioManager && source.portfolio.portfolioManager.equals(req.user._id)) ||
            (!!source.portfolio.backupPortfolioManager && source.portfolio.backupPortfolioManager.equals(req.user._id));
    }
    authObj.isSourceProjectManager =
        (!!source.identification.projectManager && source.identification.projectManager.equals(req.user._id)) ||
        (!!source.identification.backupProjectManager && source.identification.backupProjectManager.equals(req.user._id));

    // TARGET
    if(target.portfolio){
        authObj.isTargetPortfolioManager =
            (!!target.portfolio.portfolioManager && target.portfolio.portfolioManager.equals(req.user._id)) ||
            (!!target.portfolio.backupPortfolioManager && target.portfolio.backupPortfolioManager.equals(req.user._id));
    }
    authObj.isTargetProjectManager =
        (!!target.identification.projectManager && target.identification.projectManager.equals(req.user._id)) ||
        (!!target.identification.backupProjectManager && target.identification.backupProjectManager.equals(req.user._id));

    // SUPERHERO
    authObj.isSuperhero = !!_.find(req.user.roles, function(role){
        return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
    });

    if(
        !(authObj.isSourcePortfolioManager || authObj.isSourceProjectManager ||
        authObj.isTargetPortfolioManager || authObj.isTargetProjectManager ||
        authObj.isSuperhero)
    ){
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }

    next();
};

