'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');



/**
 * Create a Project
 */
exports.create = function(req, res) {
	var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
	var project = new Project(req.body);
	project.user = req.user;

    var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
    var PriorityGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityGroup');
    var Priority = mongoose.mtModel(req.user.tenantId + '.' + 'Priority');
    var QualitativeImpactGroup = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');
    var QualitativeImpact = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpact');
    var RiskCategory = mongoose.mtModel(req.user.tenantId + '.' + 'RiskCategory');
    var Risk = mongoose.mtModel(req.user.tenantId + '.' + 'Risk');

    async.series([
        // PROJECT: Save project in its collection
        function(callback){
            project.save(function(err, res){
                callback(err);
            });
        },
        // PROJECT.CATEGORIZATION: Add all existing groups (and their categories) to new project
        function(callback){
            CategoryGroup.find().exec(function(err, groups){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    async.each(groups, function(group, callback){
                        var obj = {group: group._id, categories: []};
                        async.each(group.categories, function(category, callback){
                            obj.categories.push({
                                category: category,
                                categoryValue: null
                            });
                            callback();
                        });
                        project.categorization.push(obj);
                        project.save();
                        callback();
                    });
                }
            });
            callback(null, 'two');
        },
        // PROJECT.PRIORITIZATION: Add all existing groups (and their priorities) to new project
        function(callback){
            PriorityGroup.find().exec(function(err, groups){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    async.each(groups, function(group, callback){
                        var obj = {group: group._id, priorities: []};
                        async.each(group.priorities, function(priority, callback){
                            obj.priorities.push({
                                priority: priority,
                                priorityValue: null
                            });
                            callback();
                        });
                        project.prioritization.push(obj);
                        project.save();
                        callback();
                    });
                }
            });
            callback(null, 'three');
        },
        // PROJECT.QUALITATIVE-ANALYSIS: Add all existing qualitative-groups (and their impacts) to new project
        function(callback){
            QualitativeImpactGroup.find().exec(function(err, groups){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    async.each(groups, function(group, callback){
                        var obj = {group: group._id, impacts: []};
                        async.each(group.impacts, function(impact, callback){
                            obj.impacts.push({
                                impact: impact,
                                score: null
                            });
                            callback();
                        });
                        project.qualitativeAnalysis.push(obj);
                        project.save();
                        callback();
                    });
                }
            });
            callback(null, 'four');
        },
        // PROJECT.RISK-ANALYSIS: Add all existing risks to new project
        function(callback){
            RiskCategory.find().exec(function(err, categories){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    async.each(categories, function(category, callback){
                        var obj = {category: category._id, risks: []};
                        async.each(category.risks, function(risk, callback){
                            obj.risks.push({
                                risk: risk,
                                impact: null,
                                probability: null,
                                severityAssignment: null
                            });
                            callback();
                        });
                        project.riskAnalysis.push(obj);
                        project.save();
                        callback();
                    });
                }
            });
            callback(null, 'five');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });
};

/**
 * Show the current Project
 */
exports.read = function(req, res) {
	res.jsonp(req.project);
};

/**
 * Update a Project
 */
exports.update = function(req, res) {
	var project = req.project ;
    project.user = req.user;
    project.created = Date.now();
	project = _.extend(project , req.body);

	project.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(project);
		}
	});
};

/**
 *  Update a Category Assignment
 */
exports.updateCategoryAssignment = function(req, res) {
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

    async.each(project.categorization, function(assignedGroup, callback) {
        if(assignedGroup._id.equals(req.params.assignedGroupId)){
            async.each(assignedGroup.categories, function(assignedCategory, callback){
                if(assignedCategory._id.equals(req.params.assignedCategoryId)){
                    assignedCategory.categoryValue = req.params.valueId;
                    project.save();
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
            res.jsonp(project);
        }
    });

};

/**
 *  Update a Priority Assignment
 */
exports.updatePriorityAssignment = function(req, res) {
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

    async.each(project.prioritization, function(assignedGroup, callback) {
        if(assignedGroup._id.equals(req.params.assignedGroupId)){
            async.each(assignedGroup.priorities, function(assignedPriority, callback){
                if(assignedPriority._id.equals(req.params.assignedPriorityId)){
                    assignedPriority.priorityValue = req.params.valueId;
                    project.save();
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
            res.jsonp(project);
        }
    });
};


/**
 *  Update a Qualitative Impact Assignment
 */
exports.updateImpactAssignment = function(req, res) {
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

    async.each(project.qualitativeAnalysis, function(assignedGroup, callback) {
        if(assignedGroup._id.equals(req.params.assignedGroupId)){
            async.each(assignedGroup.impacts, function(assignedImpact, callback){
                if(assignedImpact._id.equals(req.params.assignedImpactId)){
                    assignedImpact.score = req.params.scoreId;
                    project.save();
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
            res.jsonp(project);
        }
    });

};


/**
 *  Update a Risk Assignment
 */
exports.updateRiskAssignment = function(req, res) {
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

    var RiskSeverityAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverityAssignment');

    async.waterfall([
        // Find the SEVERITY ASSIGNMENT based on impact and probability
        function(callback){
            RiskSeverityAssignment.findOne({probability: req.params.probabilityId, impact:req.params.impactId},
                function(err, severityAssignment) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, severityAssignment);
                }
            });
        },
        // Update IMPACT and PROBABILITY and SEVERITY
        function(severityAssignment, callback){
            async.each(project.riskAnalysis, function(assignedCategory, callback){
                if(assignedCategory._id.equals(req.params.assignedCategoryId)){
                    async.each(assignedCategory.risks, function(assignedRisk, callback){
                        if(assignedRisk._id.equals(req.params.assignedRiskId)){
                            assignedRisk.impact = req.params.impactId;
                            assignedRisk.probability = req.params.probabilityId;
                            if(severityAssignment){
                                assignedRisk.severityAssignment = severityAssignment._id;
                            } else {
                                assignedRisk.severityAssignment = null;
                            }
                            project.save();
                        }
                        callback();
                    });
                }
                callback();
            });
            callback(null, 'done');
        }
    ],function(err, severityAssignment, done){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });



};



/**
 * Delete an Project
 */
exports.delete = function(req, res) {
	var project = req.project ;
    var PortfolioRanking = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioRanking');
    var FinancialCost = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCost');
    var FinancialBenefit = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefit');

    async.series([
        // PROJECT: Delete project in its collection
        function(callback){
            project.remove(function(err, res){
                callback(err);
            });
        },
        // PORTFOLIO RANKINGS: Delete project from the "projects" array if project assigned to a portfolio
        function(callback){
            if(project.portfolio){
                PortfolioRanking.findOne({portfolio: project.portfolio}).exec(function(err, portfolioRanking){
                    if(portfolioRanking){
                        portfolioRanking.projects.splice(portfolioRanking.projects.indexOf(project._id), 1);
                        portfolioRanking.save();
                    }
                });
            }
            callback(null, 'two');
        },
        // FINANCIAL COSTS: Delete all costs belonging to the project
        function(callback){
            async.each(project.costs, function(item, callback){
                FinancialCost.findByIdAndRemove(item, callback);
            });
            callback(null, 'three');
        },
        // FINANCIAL BENEFITS: Delete all benefits belonging to the project
        function(callback){
            async.each(project.benefits, function(item, callback){
                FinancialBenefit.findByIdAndRemove(item, callback);
            });
            callback(null, 'four');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });
};

/**
 * List of Projects
 */
exports.list = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var queryObj = {};
    if(!_.isEmpty(req.query)){
        for (var property in req.query) {
            if (req.query.hasOwnProperty(property)) {
                queryObj[property] = req.query[property];
            }
        }
    }
	Project.find(queryObj).populate('user', 'displayName').exec(function(err, projects) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projects);
		}
	});
};

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    var retPropertiesString = '';
    var deepPopulateArray = [];

    if(req.query.retPropertiesString){
        retPropertiesString = req.query.retPropertiesString;
    }
    if(req.query.deepPopulateArray){
        deepPopulateArray = req.query.deepPopulateArray;
    }

    Project.findById(id, retPropertiesString).populate('user', 'displayName').deepPopulate(deepPopulateArray)
        .exec(function(err, project) {
            if (err) return next(err);
            if (! project) return next(new Error('Failed to load Project ' + id));
            req.project = project ;
            next();
        });

};

/**
 * Project authorization middleware
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
