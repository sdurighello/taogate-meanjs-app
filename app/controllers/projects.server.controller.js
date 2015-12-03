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
    var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');
    var PeopleProjectGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectGroup');
    var PeopleProjectRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectRole');


    async.series([
        // PROJECT: Save project in its collection
        function(callback){
            project.save(function(err){
                callback(err);
            });
        },
        // PROJECT.CATEGORIZATION: Add all existing groups (and their categories) to new project
        function(callback){
            CategoryGroup.find().exec(function(err, groups){
                if (err) {
                    callback(err);
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
                        project.save(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    });
                    callback(null);
                }
            });
        },
        // PROJECT.PRIORITIZATION: Add all existing groups (and their priorities) to new project
        function(callback){
            PriorityGroup.find().exec(function(err, groups){
                if (err) {
                    callback(err);
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
                        project.save(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    });
                    callback(null);
                }
            });
        },
        // PROJECT.QUALITATIVE-ANALYSIS: Add all existing qualitative-groups (and their impacts) to new project
        function(callback){
            QualitativeImpactGroup.find().exec(function(err, groups){
                if (err) {
                    callback(err);
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
                        project.save(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    });
                    callback(null);
                }
            });
        },
        // PROJECT.RISK-ANALYSIS: Add all existing risks to new project
        function(callback){
            RiskCategory.find().exec(function(err, categories){
                if (err) {
                    callback(err);
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
                        project.save(function(err){
                            if(err){callback(err);} else {callback();}
                        });
                    });
                    callback(null);
                }
            });
        },
        // PROJECT.STAKEHOLDERS: Add all existing groups/roles + categories/values to new project
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
                // Add to projects all the people-groups/roles with the "categorization" array
                function(retArray, callback){
                    PeopleProjectGroup.find().exec(function(err, groups){
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
                                project.stakeholders.push(obj);
                                project.save(function(err){
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
    console.log(req);
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

    async.each(project.categorization, function(assignedGroup, callback) {
        if(assignedGroup._id.equals(req.params.assignedGroupId)){
            async.each(assignedGroup.categories, function(assignedCategory, callback){
                if(assignedCategory._id.equals(req.params.assignedCategoryId)){
                    assignedCategory.categoryValue = req.body.valueId;
                    project.save(function(err){
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
                    assignedPriority.priorityValue = req.body.valueId;
                    project.save(function(err){
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
            res.jsonp(project);
        }
    });
};


// ------------------------------ DEFINITION ------------------------------


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
                    assignedImpact.score = req.body.scoreId;
                    project.save(function(err){
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
            RiskSeverityAssignment.findOne({probability: req.body.probabilityId, impact:req.body.impactId},
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
                            assignedRisk.impact = req.body.impactId;
                            assignedRisk.probability = req.body.probabilityId;
                            if(severityAssignment){
                                assignedRisk.severityAssignment = severityAssignment._id;
                            } else {
                                assignedRisk.severityAssignment = null;
                            }
                            project.save(function(err){
                                if(err){callback(err);}
                            });
                        }
                        callback();
                    });
                }
                callback();
            });
            callback(null);
        }
    ],function(err){
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
 *  Update Stakeholders
 */

exports.updatePeopleAssignment = function(req, res) {
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

    async.each(project.stakeholders, function(assignedGroup, callback) {
        if(assignedGroup._id.equals(req.params.assignedGroupId)){
            async.each(assignedGroup.roles, function(assignedRole, callback){
                if(assignedRole._id.equals(req.params.assignedRoleId)){
                    assignedRole = _.extend(assignedRole, req.body);
                    project.save(function(err){
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
            res.jsonp(project);
        }
    });

};


// ------------------------------ DELIVERY ------------------------------


/**
 *  Update Gate process
 */

exports.updateProcessAssignment = function(req, res) {
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();

    var BaselineDuration = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineDuration');
    var BaselineCost = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCost');
    var BaselineCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCompletion');
    var EstimateDuration = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateDuration');
    var EstimateCost = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCost');
    var EstimateCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCompletion');
    var ActualDuration = mongoose.mtModel(req.user.tenantId + '.' + 'ActualDuration');
    var ActualCost = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCost');
    var ActualCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCompletion');

    var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');


    async.series([
        // OLD PERFORMANCE RECORDS: Delete all existing performance records associated with the project's process
        function(callback){
            async.series([
                // Duration
                function(callback){
                    BaselineDuration.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    EstimateDuration.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    ActualDuration.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                // Cost
                function(callback){
                    BaselineCost.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    EstimateCost.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    ActualCost.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                // Completion
                function(callback){
                    BaselineCompletion.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    EstimateCompletion.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    ActualCompletion.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                }
            ], function(err){
                callback(err);
            });
        },
        // PROJECT.PROCESS: Assign the new process to the project
        function(callback){
            project.process = req.body.processId;
            project.save(function(err){
                callback(err);
            });
        },
        // NEW PERFORMANCES: Create an expected performance record for each gate
        function(callback){
            if(req.body.processId){ // Check project.process is set to a new process or just to "null", then find one
                GateProcess.findOne({_id: req.body.processId}).exec(function(err, process){
                    if(err){
                        callback(err);
                    } else {
                        async.eachSeries(process.gates, function(sourceGate, callback){
                            async.series([
                                function(callback){
                                    var actualDuration = new ActualDuration({project: project._id, sourceGate: sourceGate, targetGate: sourceGate, currentRecord: {user: req.user}, history: []});
                                    actualDuration.save(function(err){ callback(err); });
                                },
                                function(callback){
                                    var actualCost = new ActualCost({project: project._id, sourceGate: sourceGate, targetGate: sourceGate, currentRecord: {user: req.user}, history: []});
                                    actualCost.save(function(err){ callback(err); });
                                },
                                function(callback){
                                    var actualCompletion = new ActualCompletion({project: project._id, sourceGate: sourceGate, targetGate: sourceGate, currentRecord: {user: req.user}, history: []});
                                    actualCompletion.save(function(err){ callback(err); });
                                },
                                function(callback){
                                    async.waterfall([
                                        function(callback){
                                            var sourceGatePosition;
                                            Gate.findById(sourceGate).exec(function(err, sourceGateObj){
                                                if(err){return callback(err);} else{
                                                    sourceGatePosition = sourceGateObj.position;
                                                    callback(null, sourceGatePosition);
                                                }
                                            });
                                        },
                                        function(sourceGatePosition, callback){
                                            async.eachSeries(process.gates, function(targetGate, callback){
                                                async.waterfall([
                                                    function(callback){
                                                        var targetGatePosition;
                                                        Gate.findById(targetGate).exec(function(err, targetGateObj){
                                                            if(err){return callback(err);} else{
                                                                targetGatePosition = targetGateObj.position;
                                                                callback(null, targetGatePosition);
                                                            }
                                                        });
                                                    },
                                                    function(targetGatePosition, callback){
                                                        if(sourceGatePosition <= targetGatePosition){
                                                            async.series([
                                                                function(callback){
                                                                    var baselineDuration = new BaselineDuration({project: project._id, sourceGate: sourceGate, targetGate: targetGate, currentRecord: {user: req.user}, history: []});
                                                                    baselineDuration.save(function(err){ callback(err); });
                                                                },
                                                                function(callback){
                                                                    var baselineCost = new BaselineCost({project: project._id, sourceGate: sourceGate, targetGate: targetGate, currentRecord: {user: req.user}, history: []});
                                                                    baselineCost.save(function(err){ callback(err); });
                                                                },
                                                                function(callback){
                                                                    var baselineCompletion = new BaselineCompletion({project: project._id, sourceGate: sourceGate, targetGate: targetGate, currentRecord: {user: req.user}, history: []});
                                                                    baselineCompletion.save(function(err){ callback(err); });
                                                                },
                                                                function(callback){
                                                                    var estimateDuration = new EstimateDuration({project: project._id, sourceGate: sourceGate, targetGate: targetGate, currentRecord: {user: req.user}, history: []});
                                                                    estimateDuration.save(function(err){ callback(err); });
                                                                },
                                                                function(callback){
                                                                    var estimateCost = new EstimateCost({project: project._id, sourceGate: sourceGate, targetGate: targetGate, currentRecord: {user: req.user}, history: []});
                                                                    estimateCost.save(function(err){ callback(err); });
                                                                },
                                                                function(callback){
                                                                    var estimateCompletion = new EstimateCompletion({project: project._id, sourceGate: sourceGate, targetGate: targetGate, currentRecord: {user: req.user}, history: []});
                                                                    estimateCompletion.save(function(err){ callback(err); });
                                                                }
                                                            ], function(err){
                                                                if(err){ return callback(err); }
                                                            });
                                                        }
                                                        callback(null);
                                                    }
                                                ], function(err){
                                                    if(err){return callback(err);} else {return callback();}
                                                });
                                            }, function(err){
                                                if(err){ callback(err); }
                                            });
                                            callback(null);
                                        }
                                    ], function(err){
                                        return callback(err);
                                    });
                                }
                            ], function(err){
                                if(err){ return callback(err); } else {
                                    return callback();
                                }
                            });
                        }, function(err){
                            if(err) { callback(err); }
                        });
                    }
                });
            }
            callback(null);
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });

};


// -----------------------------------------------------------------------

/**
 * Delete an Project
 */
exports.delete = function(req, res) {
	var project = req.project ;
    var PortfolioRanking = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioRanking');
    var FinancialCost = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCost');
    var FinancialBenefit = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefit');
    var BaselineDuration = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineDuration');
    var BaselineCost = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCost');
    var BaselineCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'BaselineCompletion');
    var EstimateDuration = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateDuration');
    var EstimateCost = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCost');
    var EstimateCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'EstimateCompletion');
    var ActualDuration = mongoose.mtModel(req.user.tenantId + '.' + 'ActualDuration');
    var ActualCost = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCost');
    var ActualCompletion = mongoose.mtModel(req.user.tenantId + '.' + 'ActualCompletion');

    async.series([
        // PROJECT: Delete project in its collection
        function(callback){
            project.remove(function(err){
                callback(err);
            });
        },
        // PORTFOLIO RANKINGS: Delete project from the "projects" array if project assigned to a portfolio
        function(callback){
            if(project.portfolio){ // IF to check that it is assigned to a portfolio otherwise this field id null
                PortfolioRanking.findOne({portfolio: project.portfolio}).exec(function(err, portfolioRanking){
                    if(err){
                        callback(err);
                    } else {
                        portfolioRanking.projects.splice(portfolioRanking.projects.indexOf(project._id), 1);
                        portfolioRanking.save(function(err){
                            if(err){callback(err);}
                        });
                    }
                });
            }
            callback(null);
        },
        // FINANCIAL COSTS: Delete all costs belonging to the project
        function(callback){
            async.each(project.costs, function(item, callback){
                FinancialCost.findByIdAndRemove(item, function(err){
                    if(err){callback(err);} else {callback();}
                });
            });
            callback(null);
        },
        // FINANCIAL BENEFITS: Delete all benefits belonging to the project
        function(callback){
            async.each(project.benefits, function(item, callback){
                FinancialBenefit.findByIdAndRemove(item, function(err){
                    if(err){callback(err);} else {callback();}
                });
            });
            callback(null);
        },
        // PERFORMANCE RECORDS: Delete all existing performance records associated with the project
        function(callback){
            async.series([
                // Duration
                function(callback){
                    BaselineDuration.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    EstimateDuration.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    ActualDuration.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                // Cost
                function(callback){
                    BaselineCost.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    EstimateCost.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    ActualCost.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                // Completion
                function(callback){
                    BaselineCompletion.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    EstimateCompletion.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                },
                function(callback){
                    ActualCompletion.find({project: project._id}, function(err, performances){
                        if(err) { callback(err); } else {
                            async.each(performances, function(performance, callback){
                                performance.remove(function(err){
                                    callback(err);
                                });
                            }, function(err){
                                if(err){ callback(err); }
                            });
                        }
                        callback(null);
                    });
                }
            ], function(err){
                callback(err);
            });
        }
    ],function(err){
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

	Project.find(req.query).populate('user', 'displayName').exec(function(err, projects) {
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
