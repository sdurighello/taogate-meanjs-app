'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');


/**
 * Financial Analysis calculation
 */

var calculateFinancialAnalysis = function(project){
    if(project.financialAnalysis.discountRate &&
        project.financialAnalysis.baseYear &&
        !_.isEmpty(project.financialAnalysis.costs) &&
        !_.isEmpty(project.financialAnalysis.benefits)){

        var yearlySummary = [];

        // Create "yearlyBenefitValue"
        _.each(project.financialAnalysis.benefits, function(baseBenefit){
            // Check if the year summary object with that year already exist, otherwise create
            if(!_.find(yearlySummary, 'year', baseBenefit.year)){
                yearlySummary.push({year: baseBenefit.year});
            }
            // Sum all the benefits with the same year of the baseBenefit
            var sumBenefitForYear = _.reduce(project.financialAnalysis.benefits, function(mem, benefit){
                if(baseBenefit._id !== benefit._id){
                    if(baseBenefit.year === benefit.year){
                        return mem + benefit.amount;
                    }
                }
            }, baseBenefit.amount);
            // Put the accumulated value in the yearlySummary record
            _.map(yearlySummary, function(summaryRecord){
                if(summaryRecord.year === baseBenefit.year){
                    summaryRecord.yearlyBenefits = sumBenefitForYear;
                }
            });
        });

        // Create "yearlyCostValue"
        _.each(project.financialAnalysis.costs, function(baseCost){
            // Check if the year summary object with that year already exist, otherwise create
            if(!_.find(yearlySummary, 'year', baseCost.year)){
                yearlySummary.push({year: baseCost.year});
            }
            // Sum all the costs with the same year of the baseCost
            var sumCostForYear = _.reduce(project.financialAnalysis.costs, function(mem, cost){
                if(baseCost._id !== cost._id){
                    if(baseCost.year === cost.year){
                        return mem + cost.amount;
                    }
                }
            }, baseCost.amount);
            // Put the accumulated value in the yearlySummary record
            _.map(yearlySummary, function(summaryRecord){
                if(summaryRecord.year === baseCost.year){
                    summaryRecord.yearlyCosts = sumCostForYear;
                }
            });
        });

        // Set the "project" property ready for saving
        project.financialAnalysis.yearlySummary = yearlySummary;

    } else {
        // If project doesn't have rate, base year or costs and benefits, set everything to null ready for saving the project
        project.financialAnalysis.yearlySummary = [];
        project.financialAnalysis.ratios.current.totalCosts = null;
        project.financialAnalysis.ratios.current.totalBenefits = null;
        project.financialAnalysis.ratios.current.NPV = null;
        project.financialAnalysis.ratios.current.BCR = null;
        project.financialAnalysis.ratios.current.payback = null;
    }
};


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

    async.series([
        // PROJECT: Save project in its collection
        function(callback){
            project.save();
            callback(null, 'one');
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
 *  Create a Cost Assignment
 */
exports.createCostAssignment = function(req, res) {
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

    project.financialAnalysis.costs.unshift(req.body);

    calculateFinancialAnalysis(project);

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
 *  Update a Cost Assignment
 */
exports.updateCostAssignment = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

    if(req.query.deleteAssignedCost === 'true'){
        project.financialAnalysis.costs.splice(project.financialAnalysis.costs.indexOf(req.body), 1);
        calculateFinancialAnalysis(project);
        project.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(project);
            }
        });
    } else {
        Project.findOneAndUpdate(
            { _id: req.project._id, 'financialAnalysis.costs._id': req.body._id},
            {
                $set: {
                    'financialAnalysis.costs.$': req.body
                }
            },
            function(err, updatedAssignedCost) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(updatedAssignedCost);
                }
            }
        );

    }

};


/**
 *  Create a Benefit Assignment
 */
exports.createBenefitAssignment = function(req, res) {
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

    project.financialAnalysis.benefits.unshift(req.body);

    calculateFinancialAnalysis(project);

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
 *  Update a Benefit Assignment
 */
exports.updateBenefitAssignment = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

    if(req.query.deleteAssignedBenefit === 'true'){
        project.financialAnalysis.benefits.splice(project.financialAnalysis.benefits.indexOf(req.body), 1);
        calculateFinancialAnalysis(project);
        project.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(project);
            }
        });
    } else {
        Project.findOneAndUpdate(
            { _id: req.project._id, 'financialAnalysis.benefits._id': req.body._id},
            {
                $set: {
                    'financialAnalysis.benefits.$': req.body
                }
            },
            function(err, updatedAssignedBenefit) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(updatedAssignedBenefit);
                }
            }
        );

    }
};

exports.updateDiscountData = function(req, res) {
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

    project.financialAnalysis.baseYear = req.body.baseYear;
    project.financialAnalysis.discountRate = req.body.discountRate;

    calculateFinancialAnalysis(project);

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
 * Delete an Project
 */
exports.delete = function(req, res) {
	var project = req.project ;
    var PortfolioRanking = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioRanking');

    async.series([
        // PROJECT: Delete project in its collection
        function(callback){
            project.remove();
            callback(null, 'one');
        },
        // PORTFOLIO RANKINGS: Delete project from the "projects" array if project assigned to a portfolio
        function(callback){
            if(project.portfolio){
                PortfolioRanking.findOne({portfolio: project.portfolio._id}).exec(function(err, portfolioRanking){
                    portfolioRanking.projects.splice(portfolioRanking.projects.indexOf(project._id), 1);
                    portfolioRanking.save();
                });
            }
            callback(null, 'two');
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
