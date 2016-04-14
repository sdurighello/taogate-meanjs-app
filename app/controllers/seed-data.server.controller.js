'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

// -------------------------


exports.seed = function(req, res) {
// Seeding strategy: 
// 1) first create all setup data directly in the database, 
// 2) then crate projects, portfolios and similar by calling the 'route' so the create routines are also run
    async.series([
        // 1) Create all seed setup data in straight into the database
        function(callback){
            async.parallel([
                // --- Portfolio types setup ---
                function(callback){
                    var PortfolioType = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioType');
                    var seedArray = require('./seed-data/seed-data.portfolio-setup.server.controller.js').getPortfolioTypes(req);
                    async.each(seedArray, function(item, callbackEach) {
                        PortfolioType.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed portfolio types created'});
                        }
                    });
                },
                // --- Strategy nodes setup ---
                function(callback){
                    var StrategyNodeType = mongoose.mtModel(req.user.tenantId + '.' + 'StrategyNodeType');
                    var seedArray = require('./seed-data/seed-data.strategy-setup.server.controller.js').getStrategyNodeTypes(req);
                    async.each(seedArray, function(item, callbackEach) {
                        StrategyNodeType.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed strategy node types created'});
                        }
                    });
                },
                function(callback){
                    var StrategyNode = mongoose.mtModel(req.user.tenantId + '.' + 'StrategyNode');
                    var seedArray = require('./seed-data/seed-data.strategy-setup.server.controller.js').getStrategyNodes(req);
                    async.each(seedArray, function(item, callbackEach) {
                        StrategyNode.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed strategy nodes created'});
                        }
                    });
                },
                // --- Category setup ---
                function(callback){
                    var CategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryValue');
                    var seedArray = require('./seed-data/seed-data.category-setup.server.controller.js').getCategoryValues(req);
                    async.each(seedArray, function(item, callbackEach) {
                        CategoryValue.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed category values created'});
                        }
                    });
                },
                function(callback){
                    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
                    var seedArray = require('./seed-data/seed-data.category-setup.server.controller.js').getCategories(req);
                    async.each(seedArray, function(item, callbackEach) {
                        Category.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed categories created'});
                        }
                    });
                },
                function(callback){
                    var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
                    var seedArray = require('./seed-data/seed-data.category-setup.server.controller.js').getCategoryGroups(req);
                    async.each(seedArray, function(item, callbackEach) {
                        CategoryGroup.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed category groups created'});
                        }
                    });
                },
                // --- Priority setup ---
                function(callback){
                    var PriorityValue = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityValue');
                    var seedArray = require('./seed-data/seed-data.priority-setup.server.controller.js').getPriorityValues(req);
                    async.each(seedArray, function(item, callbackEach) {
                        PriorityValue.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed priority values created'});
                        }
                    });
                },
                function(callback){
                    var Priority = mongoose.mtModel(req.user.tenantId + '.' + 'Priority');
                    var seedArray = require('./seed-data/seed-data.priority-setup.server.controller.js').getPriorities(req);
                    async.each(seedArray, function(item, callbackEach) {
                        Priority.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed priorities created'});
                        }
                    });
                },
                function(callback){
                    var PriorityGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PriorityGroup');
                    var seedArray = require('./seed-data/seed-data.priority-setup.server.controller.js').getPriorityGroups(req);
                    async.each(seedArray, function(item, callbackEach) {
                        PriorityGroup.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed priority groups created'});
                        }
                    });
                },
                // --- Financial setup ---
                function(callback){
                    var FinancialCostGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCostGroup');
                    var seedArray = require('./seed-data/seed-data.financial-setup.server.controller.js').getFinancialCostGroups(req);
                    async.each(seedArray, function(item, callbackEach) {
                        FinancialCostGroup.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed cost groups created'});
                        }
                    });
                },
                function(callback){
                    var FinancialCostType = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialCostType');
                    var seedArray = require('./seed-data/seed-data.financial-setup.server.controller.js').getFinancialCostTypes(req);
                    async.each(seedArray, function(item, callbackEach) {
                        FinancialCostType.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed cost types created'});
                        }
                    });
                },
                function(callback){
                    var FinancialBenefitGroup = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefitGroup');
                    var seedArray = require('./seed-data/seed-data.financial-setup.server.controller.js').getFinancialBenefitGroups(req);
                    async.each(seedArray, function(item, callbackEach) {
                        FinancialBenefitGroup.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed benefit groups created'});
                        }
                    });
                },
                function(callback){
                    var FinancialBenefitType = mongoose.mtModel(req.user.tenantId + '.' + 'FinancialBenefitType');
                    var seedArray = require('./seed-data/seed-data.financial-setup.server.controller.js').getFinancialBenefitTypes(req);
                    async.each(seedArray, function(item, callbackEach) {
                        FinancialBenefitType.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed benefit types created'});
                        }
                    });
                },
                // --- Risk setup ---
                function(callback){
                    var RiskCategory = mongoose.mtModel(req.user.tenantId + '.' + 'RiskCategory');
                    var seedArray = require('./seed-data/seed-data.risk-setup.server.controller.js').getRiskCategories(req);
                    async.each(seedArray, function(item, callbackEach) {
                        RiskCategory.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed risk categories created'});
                        }
                    });
                },
                function(callback){
                    var Risk = mongoose.mtModel(req.user.tenantId + '.' + 'Risk');
                    var seedArray = require('./seed-data/seed-data.risk-setup.server.controller.js').getRisks(req);
                    async.each(seedArray, function(item, callbackEach) {
                        Risk.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed risks created'});
                        }
                    });
                },
                function(callback){
                    var RiskImpact = mongoose.mtModel(req.user.tenantId + '.' + 'RiskImpact');
                    var seedArray = require('./seed-data/seed-data.risk-setup.server.controller.js').getRiskImpacts(req);
                    async.each(seedArray, function(item, callbackEach) {
                        RiskImpact.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed risk impacts created'});
                        }
                    });
                },
                function(callback){
                    var RiskProbability = mongoose.mtModel(req.user.tenantId + '.' + 'RiskProbability');
                    var seedArray = require('./seed-data/seed-data.risk-setup.server.controller.js').getRiskProbabilities(req);
                    async.each(seedArray, function(item, callbackEach) {
                        RiskProbability.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed risk probabilities created'});
                        }
                    });
                },
                function(callback){
                    var RiskSeverity = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverity');
                    var seedArray = require('./seed-data/seed-data.risk-setup.server.controller.js').getRiskSeverities(req);
                    async.each(seedArray, function(item, callbackEach) {
                        RiskSeverity.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed risk severities created'});
                        }
                    });
                },
                function(callback){
                    var RiskSeverityAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'RiskSeverityAssignment');
                    var seedArray = require('./seed-data/seed-data.risk-setup.server.controller.js').getRiskSeverityAssignments(req);
                    async.each(seedArray, function(item, callbackEach) {
                        RiskSeverityAssignment.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed risk severity assignments created'});
                        }
                    });
                },
                // --- Qualitative setup ---
                function(callback){
                    var QualitativeImpactGroup = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactGroup');
                    var seedArray = require('./seed-data/seed-data.qualitative-setup.server.controller.js').getQualitativeImpactGroups(req);
                    async.each(seedArray, function(item, callbackEach) {
                        QualitativeImpactGroup.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed qualitative impact groups created'});
                        }
                    });
                },
                function(callback){
                    var QualitativeImpact = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpact');
                    var seedArray = require('./seed-data/seed-data.qualitative-setup.server.controller.js').getQualitativeImpacts(req);
                    async.each(seedArray, function(item, callbackEach) {
                        QualitativeImpact.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed qualitative impacts created'});
                        }
                    });
                },
                function(callback){
                    var QualitativeImpactScore = mongoose.mtModel(req.user.tenantId + '.' + 'QualitativeImpactScore');
                    var seedArray = require('./seed-data/seed-data.qualitative-setup.server.controller.js').getQualitativeImpactScores(req);
                    async.each(seedArray, function(item, callbackEach) {
                        QualitativeImpactScore.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed qualitative impact scores created'});
                        }
                    });
                },
                // --- Dependency setup ---
                function(callback){
                    var DependencyType = mongoose.mtModel(req.user.tenantId + '.' + 'DependencyType');
                    var seedArray = require('./seed-data/seed-data.dependency-setup.server.controller.js').getDependencyTypes(req);
                    async.each(seedArray, function(item, callbackEach) {
                        DependencyType.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed dependency types created'});
                        }
                    });
                },
                function(callback){
                    var DependencyImpact = mongoose.mtModel(req.user.tenantId + '.' + 'DependencyImpact');
                    var seedArray = require('./seed-data/seed-data.dependency-setup.server.controller.js').getDependencyImpacts(req);
                    async.each(seedArray, function(item, callbackEach) {
                        DependencyImpact.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed dependency impacts created'});
                        }
                    });
                },
                function(callback){
                    var DependencyState = mongoose.mtModel(req.user.tenantId + '.' + 'DependencyState');
                    var seedArray = require('./seed-data/seed-data.dependency-setup.server.controller.js').getDependencyStates(req);
                    async.each(seedArray, function(item, callbackEach) {
                        DependencyState.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed dependency states created'});
                        }
                    });
                },
                // --- Stakeholder categories setup ---
                function(callback){
                    var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');
                    var seedArray = require('./seed-data/seed-data.stakeholders-setup.server.controller.js').getPeopleCategories(req);
                    async.each(seedArray, function(item, callbackEach) {
                        PeopleCategory.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed people categories created'});
                        }
                    });
                },
                function(callback){
                    var PeopleCategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategoryValue');
                    var seedArray = require('./seed-data/seed-data.stakeholders-setup.server.controller.js').getPeopleCategoryValues(req);
                    async.each(seedArray, function(item, callbackEach) {
                        PeopleCategoryValue.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed people categories created'});
                        }
                    });
                },
                // --- Portfolio people setup ---
                function(callback){
                    var PeoplePortfolioGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioGroup');
                    var seedArray = require('./seed-data/seed-data.portfolio-people.server.controller').getPeoplePortfolioGroups(req);
                    async.each(seedArray, function(item, callbackEach) {
                        PeoplePortfolioGroup.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed people portfolio groups created'});
                        }
                    });
                },
                function(callback){
                    var PeoplePortfolioRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeoplePortfolioRole');
                    var seedArray = require('./seed-data/seed-data.portfolio-people.server.controller').getPeoplePortfolioRoles(req);
                    async.each(seedArray, function(item, callbackEach) {
                        PeoplePortfolioRole.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed people portfolio roles created'});
                        }
                    });
                },
                // --- Project people setup ---
                function(callback){
                    var PeopleProjectGroup = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectGroup');
                    var seedArray = require('./seed-data/seed-data.project-people.server.controller').getPeopleProjectGroups(req);
                    async.each(seedArray, function(item, callbackEach) {
                        PeopleProjectGroup.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed people project groups created'});
                        }
                    });
                },
                function(callback){
                    var PeopleProjectRole = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleProjectRole');
                    var seedArray = require('./seed-data/seed-data.project-people.server.controller').getPeopleProjectRoles(req);
                    async.each(seedArray, function(item, callbackEach) {
                        PeopleProjectRole.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed people project roles created'});
                        }
                    });
                },
                // --- Process setup ---
                function(callback){
                    var GateProcess = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
                    var seedArray = require('./seed-data/seed-data.process-setup.server.controller.js').getGateProcesses(req);
                    async.each(seedArray, function(item, callbackEach) {
                        GateProcess.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed gate processes created'});
                        }
                    });
                },
                function(callback){
                    var Gate = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');
                    var seedArray = require('./seed-data/seed-data.process-setup.server.controller.js').getGates(req);
                    async.each(seedArray, function(item, callbackEach) {
                        Gate.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed gates created'});
                        }
                    });
                },
                function(callback){
                    var GateOutcome = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcome');
                    var seedArray = require('./seed-data/seed-data.process-setup.server.controller.js').getGateOutcomes(req);
                    async.each(seedArray, function(item, callbackEach) {
                        GateOutcome.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed gate outcomes created'});
                        }
                    });
                },
                function(callback){
                    var GateOutcomeScore = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeScore');
                    var seedArray = require('./seed-data/seed-data.process-setup.server.controller.js').getGateOutcomeScores(req);
                    async.each(seedArray, function(item, callbackEach) {
                        GateOutcomeScore.create(item, function(err){
                            callbackEach(err);
                        });
                    }, function(err){
                        if( err ) {
                            callback(err);
                        } else {
                            callback(null, {message: 'Seed gate outcome scores created'});
                        }
                    });
                }

            ], function(err, results) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, results);
                }
            });
        },
        // 2) Create projects, portfolio and similar by calling the 'route'
        function(callback){

            callback(null, 'two');
        }
    ], function(err, results){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(results);
        }
    });

};
