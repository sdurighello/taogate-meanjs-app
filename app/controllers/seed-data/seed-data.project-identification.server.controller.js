'use strict';

/**
 * SEED - PROJECT IDENTIFICATION
 */

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    seedIDs = require('./seed-data.ids.server.controller').getIDs(),
    projectsCreateController = require('../projects/projects.create.server.controller'),
    async = require('async'),
    User = mongoose.model('User');


var createObjects = function(schema, stringMsg, seedArray, callback){
    async.each(seedArray, function(item, callbackEach) {
        schema.findById(item._id).exec(function(err, itemReturned){
            if(!itemReturned){
                schema.create(item, function(err){
                    callbackEach(err);
                });
            } else {
                callbackEach();
            }
        });
    }, function(err){
        if( err ) {
            callback(err);
        } else {
            callback(null, stringMsg);
        }
    });
};

exports.seedProjects = function(user, callback){

    var Project = mongoose.mtModel(user.tenantId + '.' + 'Project');

    // Parents
    var sn111 = seedIDs.StrategyNode.sn111;

    // Portfolios
    var pn111 = seedIDs.Portfolio.pn111;

    // Projects
    var project1 = seedIDs.Project.project1;
    var project2 = seedIDs.Project.project2;
    var project3 = seedIDs.Project.project3;
    var project4 = seedIDs.Project.project4;
    var project5 = seedIDs.Project.project5;
    var project6 = seedIDs.Project.project6;
    var project7 = seedIDs.Project.project7;
    var project8 = seedIDs.Project.project8;
    var project9 = seedIDs.Project.project9;
    var project10 = seedIDs.Project.project10;
    
    // Costs
    var project1Cost1 = seedIDs.FinancialCost.project1Cost1;
    var project1Cost2 = seedIDs.FinancialCost.project1Cost2;
    var project1Cost3 = seedIDs.FinancialCost.project1Cost3;
    var project1Cost4 = seedIDs.FinancialCost.project1Cost4;
    var project1Cost5 = seedIDs.FinancialCost.project1Cost5;
    var project1Cost6 = seedIDs.FinancialCost.project1Cost6;
    var project1Cost7 = seedIDs.FinancialCost.project1Cost7;
    var project1Cost8 = seedIDs.FinancialCost.project1Cost8;
    var project1Cost9 = seedIDs.FinancialCost.project1Cost9;
    var project1Cost10 = seedIDs.FinancialCost.project1Cost10;
    var project1Cost11 = seedIDs.FinancialCost.project1Cost11;
    var project1Cost12 = seedIDs.FinancialCost.project1Cost12;
    var project1Cost13 = seedIDs.FinancialCost.project1Cost13;
    var project1Cost14 = seedIDs.FinancialCost.project1Cost14;
    var project1Cost15 = seedIDs.FinancialCost.project1Cost15;
    var project1Cost16 = seedIDs.FinancialCost.project1Cost16;

    // Benefits
    var project1Benefit1 = seedIDs.FinancialBenefit.project1Benefit1;
    var project1Benefit2 = seedIDs.FinancialBenefit.project1Benefit2;
    var project1Benefit3 = seedIDs.FinancialBenefit.project1Benefit3;
    var project1Benefit4 = seedIDs.FinancialBenefit.project1Benefit4;
    var project1Benefit5 = seedIDs.FinancialBenefit.project1Benefit5;
    var project1Benefit6 = seedIDs.FinancialBenefit.project1Benefit6;
    var project1Benefit7 = seedIDs.FinancialBenefit.project1Benefit7;
    var project1Benefit8 = seedIDs.FinancialBenefit.project1Benefit8;
    var project1Benefit9 = seedIDs.FinancialBenefit.project1Benefit9;
    var project1Benefit10 = seedIDs.FinancialBenefit.project1Benefit10;
    var project1Benefit11 = seedIDs.FinancialBenefit.project1Benefit11;
    var project1Benefit12 = seedIDs.FinancialBenefit.project1Benefit12;

    // ------ Organizational area ------

    var cat1 = seedIDs.CategoryGroup.cat1;

// Strategic Business Unit
    var cat11 = seedIDs.Category.cat11;

    var cat111 = seedIDs.CategoryValue.cat111; // SBU1
    var cat112 = seedIDs.CategoryValue.cat112; // SBU 2
    var cat113 = seedIDs.CategoryValue.cat113; // SBU 3

// Product
    var cat12 = seedIDs.Category.cat12;

    var cat121 = seedIDs.CategoryValue.cat121; // Product A
    var cat122 = seedIDs.CategoryValue.cat122; // Product B
    var cat123 = seedIDs.CategoryValue.cat123; // Product C

// Market
    var cat13 = seedIDs.Category.cat13;

    var cat131 = seedIDs.CategoryValue.cat131; // Market A
    var cat132 = seedIDs.CategoryValue.cat132; // Market B
    var cat133 = seedIDs.CategoryValue.cat133; // Market C

// Geography
    var cat14 = seedIDs.Category.cat14;

    var cat141 = seedIDs.CategoryValue.cat141; // Americas
    var cat142 = seedIDs.CategoryValue.cat142; // EMEA
    var cat143 = seedIDs.CategoryValue.cat143; // APAC


// ------ Implementation experience ------

    var cat2 = seedIDs.CategoryGroup.cat2;

// Business novelty
    var cat21 = seedIDs.Category.cat21;

    var cat211 = seedIDs.CategoryValue.cat211; // Low
    var cat212 = seedIDs.CategoryValue.cat212; // Medium
    var cat213 = seedIDs.CategoryValue.cat213; // High

// Technology novelty
    var cat22 = seedIDs.Category.cat22;

    var cat221 = seedIDs.CategoryValue.cat221; // Low
    var cat222 = seedIDs.CategoryValue.cat222; // Medium
    var cat223 = seedIDs.CategoryValue.cat223; // High

// Ease of implementation
    var cat23 = seedIDs.Category.cat23;

    var cat231 = seedIDs.CategoryValue.cat231; // Low
    var cat232 = seedIDs.CategoryValue.cat232; // Medium
    var cat233 = seedIDs.CategoryValue.cat233; // High

    // Categorization

// ------ Type of change ------

    var cat3 = seedIDs.CategoryGroup.cat3;

// Technology change
    var cat31 = seedIDs.Category.cat31;

    var cat311 = seedIDs.CategoryValue.cat311; // Upgrade
    var cat312 = seedIDs.CategoryValue.cat312; // Change existing system
    var cat313 = seedIDs.CategoryValue.cat313; // New system implementation

// Business change
    var cat32 = seedIDs.Category.cat32;

    var cat321 = seedIDs.CategoryValue.cat321; // Continuous improvement
    var cat322 = seedIDs.CategoryValue.cat322; // Business innovation
    var cat323 = seedIDs.CategoryValue.cat323; // Automation
    var cat324 = seedIDs.CategoryValue.cat324; // Regulatory


// ------ Type of implementation ------

    var cat4 = seedIDs.CategoryGroup.cat4;

// Delivery process
    var cat41 = seedIDs.Category.cat41;

    var cat411 = seedIDs.CategoryValue.cat411; // Waterfall
    var cat412 = seedIDs.CategoryValue.cat412; // Agile
    var cat413 = seedIDs.CategoryValue.cat413; // Mix

// Effort size
    var cat42 = seedIDs.Category.cat42;

    var cat421 = seedIDs.CategoryValue.cat421; // Small
    var cat422 = seedIDs.CategoryValue.cat422; // Medium
    var cat423 = seedIDs.CategoryValue.cat423; // Large

// Technology type
    var cat43 = seedIDs.Category.cat43;

    var cat431 = seedIDs.CategoryValue.cat431; // Infrastructure
    var cat432 = seedIDs.CategoryValue.cat432; // Bespoke software
    var cat433 = seedIDs.CategoryValue.cat433; // Packaged systems
    var cat434 = seedIDs.CategoryValue.cat434; // Cloud based
    
    
    // Prioritization

    // ------ Priority values ------

    var prioValue1 = seedIDs.PriorityValue.prioValue1;
    var prioValue2 = seedIDs.PriorityValue.prioValue2;
    var prioValue3 = seedIDs.PriorityValue.prioValue3;

    // ------ Project stakeholders ------

    var prio1 = seedIDs.PriorityGroup.prio1;

    var prio11 = seedIDs.Priority.prio11; // Supplier
    var prio12 = seedIDs.Priority.prio12; // User
    var prio13 = seedIDs.Priority.prio13; // Sponsor

    // ------ Executive management ------

    var prio2 = seedIDs.PriorityGroup.prio2;

    var prio21 = seedIDs.Priority.prio21; // Executive board
    var prio22 = seedIDs.Priority.prio22; // Investment management committee

    // ------ Technology leadership ------

    var prio3 = seedIDs.PriorityGroup.prio3;

    var prio31 = seedIDs.Priority.prio31; // Project Management Office
    var prio32 = seedIDs.Priority.prio32; // Enterprise Architecture Board
    
    
    // QUALITATIVE ANALYSIS

    // Alignment
    var q1 = seedIDs.QualitativeImpactGroup.q1;

    var q11 = seedIDs.QualitativeImpact.q11; // Business alignment
    var q12 = seedIDs.QualitativeImpact.q12; // Technology alignment

    // Economic contribution
    var q2 = seedIDs.QualitativeImpactGroup.q2;

    var q21 = seedIDs.QualitativeImpact.q21; // Revenue generation
    var q22 = seedIDs.QualitativeImpact.q22; // Cost reduction
    var q23 = seedIDs.QualitativeImpact.q23; // Differentiation
    var q24 = seedIDs.QualitativeImpact.q24; // Competitive advantage

    // Balanced scorecard
    var q3 = seedIDs.QualitativeImpactGroup.q3;

    var q31 = seedIDs.QualitativeImpact.q31; // Financial
    var q32 = seedIDs.QualitativeImpact.q32; // Internal
    var q33 = seedIDs.QualitativeImpact.q33; // Growth
    var q34 = seedIDs.QualitativeImpact.q34; // Customer

    // Marketing contribution
    var q4 = seedIDs.QualitativeImpactGroup.q4;

    var q41 = seedIDs.QualitativeImpact.q41; // Customer acquisition
    var q42 = seedIDs.QualitativeImpact.q42; // Customer retention
    var q43 = seedIDs.QualitativeImpact.q43; // Reputation
    var q44 = seedIDs.QualitativeImpact.q44; // Brand awareness

    // Impact scores

    var impactScore1 = seedIDs.QualitativeImpactScore.impactScore1; // none
    var impactScore2 = seedIDs.QualitativeImpactScore.impactScore2; // veryLow
    var impactScore3 = seedIDs.QualitativeImpactScore.impactScore3; // low
    var impactScore4 = seedIDs.QualitativeImpactScore.impactScore4; // medium
    var impactScore5 = seedIDs.QualitativeImpactScore.impactScore5; // high
    var impactScore6 = seedIDs.QualitativeImpactScore.impactScore6; // veryHigh
    
    
    // RISK ANALYSIS

    // Delivery
    var r1 = seedIDs.RiskCategory.r1;

    var r11 = seedIDs.Risk.r11; // Poor product quality
    var r12 = seedIDs.Risk.r12; // Supplier failure
    var r13 = seedIDs.Risk.r13; // Lack of staff or skills

    // Financial
    var r2 = seedIDs.RiskCategory.r2;

    var r21 = seedIDs.Risk.r21; // Cost overrun
    var r22 = seedIDs.Risk.r22; // Increased cost variability
    var r23 = seedIDs.Risk.r23; // Increased capex/opex ratio

    // Technology
    var r3 = seedIDs.RiskCategory.r3;

    var r31 = seedIDs.Risk.r31; // Technology aging
    var r32 = seedIDs.Risk.r32; // Platform instability
    var r33 = seedIDs.Risk.r33; // Impacts on other systems

    // Operational
    var r4 = seedIDs.RiskCategory.r4;

    var r41 = seedIDs.Risk.r41; // Impaired support and maintenance
    var r42 = seedIDs.Risk.r42; // Difficult business adoption
    var r43 = seedIDs.Risk.r43; // Business process failure

    // Market
    var r5 = seedIDs.RiskCategory.r5;

    var r51 = seedIDs.Risk.r51; // Poor market reception
    var r52 = seedIDs.Risk.r52; // Impact on Partner relationships
    var r53 = seedIDs.Risk.r53; // Reaction from competition

    // Legal
    var r6 = seedIDs.RiskCategory.r6;

    var r61 = seedIDs.Risk.r61; // Regulatory breach
    var r62 = seedIDs.Risk.r62; // Exposure to lawsuit loss

    // Impacts

    var riskImpact1 = seedIDs.RiskImpact.riskImpact1; // incidental
    var riskImpact2 = seedIDs.RiskImpact.riskImpact2; // minor
    var riskImpact3 = seedIDs.RiskImpact.riskImpact3; // moderate
    var riskImpact4 = seedIDs.RiskImpact.riskImpact4; // major
    var riskImpact5 = seedIDs.RiskImpact.riskImpact5; // extreme

    // Probabilities

    var riskProb1 = seedIDs.RiskProbability.riskProb1; // rare
    var riskProb2 = seedIDs.RiskProbability.riskProb2; // unlikely
    var riskProb3 = seedIDs.RiskProbability.riskProb3; // possible
    var riskProb4 = seedIDs.RiskProbability.riskProb4; // likely
    var riskProb5 = seedIDs.RiskProbability.riskProb5; // frequent

    // Severities Assignments

    var ri1Rp5 = seedIDs.RiskSeverityAssignment.ri1Rp5;
    var ri1Rp4 = seedIDs.RiskSeverityAssignment.ri1Rp4;
    var ri1Rp3 = seedIDs.RiskSeverityAssignment.ri1Rp3;
    var ri1Rp2 = seedIDs.RiskSeverityAssignment.ri1Rp2;
    var ri1Rp1 = seedIDs.RiskSeverityAssignment.ri1Rp1;

    var ri2Rp5 = seedIDs.RiskSeverityAssignment.ri2Rp5;
    var ri2Rp4 = seedIDs.RiskSeverityAssignment.ri2Rp4;
    var ri2Rp3 = seedIDs.RiskSeverityAssignment.ri2Rp3;
    var ri2Rp2 = seedIDs.RiskSeverityAssignment.ri2Rp2;
    var ri2Rp1 = seedIDs.RiskSeverityAssignment.ri2Rp1;

    var ri3Rp5 = seedIDs.RiskSeverityAssignment.ri3Rp5;
    var ri3Rp4 = seedIDs.RiskSeverityAssignment.ri3Rp4;
    var ri3Rp3 = seedIDs.RiskSeverityAssignment.ri3Rp3;
    var ri3Rp2 = seedIDs.RiskSeverityAssignment.ri3Rp2;
    var ri3Rp1 = seedIDs.RiskSeverityAssignment.ri3Rp1;

    var ri4Rp5 = seedIDs.RiskSeverityAssignment.ri4Rp5;
    var ri4Rp4 = seedIDs.RiskSeverityAssignment.ri4Rp4;
    var ri4Rp3 = seedIDs.RiskSeverityAssignment.ri4Rp3;
    var ri4Rp2 = seedIDs.RiskSeverityAssignment.ri4Rp2;
    var ri4Rp1 = seedIDs.RiskSeverityAssignment.ri4Rp1;

    var ri5Rp5 = seedIDs.RiskSeverityAssignment.ri5Rp5;
    var ri5Rp4 = seedIDs.RiskSeverityAssignment.ri5Rp4;
    var ri5Rp3 = seedIDs.RiskSeverityAssignment.ri5Rp3;
    var ri5Rp2 = seedIDs.RiskSeverityAssignment.ri5Rp2;
    var ri5Rp1 = seedIDs.RiskSeverityAssignment.ri5Rp1;


    // STAKEHOLDER ANALYSIS

    // Project Steering Committee
    var group1 = seedIDs.PeopleProjectGroup.group1;

    var role11 = seedIDs.PeopleProjectRole.role11;
    var role12 = seedIDs.PeopleProjectRole.role12;
    var role13 = seedIDs.PeopleProjectRole.role13;
    var role14 = seedIDs.PeopleProjectRole.role14;

    // Architecture Review Board
    var group2 = seedIDs.PeopleProjectGroup.group2;

    var role21 = seedIDs.PeopleProjectRole.role21;
    var role22 = seedIDs.PeopleProjectRole.role22;
    var role23 = seedIDs.PeopleProjectRole.role23;
    var role24 = seedIDs.PeopleProjectRole.role24;

    // Internal/External
    var id1 = seedIDs.PeopleCategory.id1;

    var id11 = seedIDs.PeopleCategoryValue.id11; // External
    var id12 = seedIDs.PeopleCategoryValue.id12; // Internal

// Soft systems taxonomy
    var id2 = seedIDs.PeopleCategory.id2;

    var id21 = seedIDs.PeopleCategoryValue.id21; // Primary
    var id22 = seedIDs.PeopleCategoryValue.id22; // Secondary
    var id23 = seedIDs.PeopleCategoryValue.id23; // Tertiary
    var id24 = seedIDs.PeopleCategoryValue.id24; // Facilitating

// Salience level
    var id3 = seedIDs.PeopleCategory.id3;

    var id31 = seedIDs.PeopleCategoryValue.id31; // Dormant
    var id32 = seedIDs.PeopleCategoryValue.id32; // Discretionary
    var id33 = seedIDs.PeopleCategoryValue.id33; // Demanding
    var id34 = seedIDs.PeopleCategoryValue.id34; // Dominant
    var id35 = seedIDs.PeopleCategoryValue.id35; // Dangerous
    var id36 = seedIDs.PeopleCategoryValue.id36; // Dependent
    var id37 = seedIDs.PeopleCategoryValue.id37; // Definitive
    var id38 = seedIDs.PeopleCategoryValue.id38; // NonStakeholder

// Power/Interest grid
    var id4 = seedIDs.PeopleCategory.id4;

    var id41 = seedIDs.PeopleCategoryValue.id41; // Keep satisfied
    var id42 = seedIDs.PeopleCategoryValue.id42; // Manage closely
    var id43 = seedIDs.PeopleCategoryValue.id43; // Monitor
    var id44 = seedIDs.PeopleCategoryValue.id44; // Keep informed


// PMI engagement level
    var id5 = seedIDs.PeopleCategory.id5;

    var id51 = seedIDs.PeopleCategoryValue.id51; // Unaware
    var id52 = seedIDs.PeopleCategoryValue.id52; // Resistant
    var id53 = seedIDs.PeopleCategoryValue.id53; // Neutral
    var id54 = seedIDs.PeopleCategoryValue.id54; // Supportive
    var id55 = seedIDs.PeopleCategoryValue.id55; // Leading

// OGC taxonomy
    var id6 = seedIDs.PeopleCategory.id6;

    var id61 = seedIDs.PeopleCategoryValue.id61; // Users/Beneficiaries
    var id62 = seedIDs.PeopleCategoryValue.id62; // Providers
    var id63 = seedIDs.PeopleCategoryValue.id63; // Governance
    var id64 = seedIDs.PeopleCategoryValue.id64; // Influencers

// Engagement approach
    var id7 = seedIDs.PeopleCategory.id7;

    var id71 = seedIDs.PeopleCategoryValue.id71; // Partnership
    var id72 = seedIDs.PeopleCategoryValue.id72; // Participation
    var id73 = seedIDs.PeopleCategoryValue.id73; // Consultation
    var id74 = seedIDs.PeopleCategoryValue.id74; // Push communication
    var id75 = seedIDs.PeopleCategoryValue.id75; // Pull communication


    var seedArrayProject1 = [
        {
            _id: project1,
            parent: sn111,
            portfolio: pn111,
            identification: {
                idNumber: 'PID1',
                name: 'Radius implementation',
                description: 'Radius implementation',
                earmarkedFunds: 300000,
                reqStartDate: new Date('2015-12-31T23:00:00Z'),
                reqEndDate: new Date('2016-12-30T23:00:00Z'),
                projectManager : null,
                backupProjectManager : null
            },
            categorization: [
                {
                    group: cat1,
                    categories : [
                        {category: cat11, categoryValue: cat111},
                        {category: cat12, categoryValue: cat121},
                        {category: cat13, categoryValue: cat131},
                        {category: cat14, categoryValue: cat141}
                    ]
                },
                {
                    group: cat2,
                    categories : [
                        {category: cat21, categoryValue: cat211},
                        {category: cat22, categoryValue: cat221},
                        {category: cat23, categoryValue: cat231}
                    ]
                },
                {
                    group: cat3,
                    categories : [
                        {category: cat31, categoryValue: cat311},
                        {category: cat32, categoryValue: cat321}
                    ]
                }
            ],
            prioritization: [
                {
                    group: prio1,
                    priorities : [
                        {priority: prio11, priorityValue: prioValue1},
                        {priority: prio12, priorityValue: prioValue2},
                        {priority: prio13, priorityValue: prioValue3}
                    ]
                },
                {
                    group: prio2,
                    priorities : [
                        {priority: prio21, priorityValue: prioValue1},
                        {priority: prio22, priorityValue: prioValue2}
                    ]
                },
                {
                    group: prio3,
                    priorities : [
                        {priority: prio31, priorityValue: prioValue1},
                        {priority: prio32, priorityValue: prioValue2}
                    ]
                }
            ],
            
            selection: {
                active: true,
                selectedForPrioritization: true,
                selectedForEvaluation: true,
                selectedForDelivery: true
            },
            
            discountRate: 10,
            baseYear: 2015,
            costs: [project1Cost1, project1Cost2, project1Cost3, project1Cost4, project1Cost5, project1Cost6, project1Cost7, project1Cost8, project1Cost9, project1Cost10, project1Cost11, project1Cost12, project1Cost13, project1Cost14, project1Cost15, project1Cost16],
            benefits: [project1Benefit1, project1Benefit2, project1Benefit3, project1Benefit4, project1Benefit5, project1Benefit6, project1Benefit7, project1Benefit8, project1Benefit9, project1Benefit10, project1Benefit11, project1Benefit12],

            qualitativeAnalysis: [
                {
                    group: q1,
                    impacts: [
                        {impact: q11, score: impactScore1},
                        {impact: q12, score: impactScore2}
                    ]
                },
                {
                    group: q2,
                    impacts: [
                        {impact: q21, score: impactScore1},
                        {impact: q22, score: impactScore2},
                        {impact: q23, score: impactScore3},
                        {impact: q24, score: impactScore4}
                    ]
                },
                {
                    group: q3,
                    impacts: [
                        {impact: q31, score: impactScore1},
                        {impact: q32, score: impactScore2},
                        {impact: q33, score: impactScore3},
                        {impact: q34, score: impactScore4}
                    ]
                },
                {
                    group: q4,
                    impacts: [
                        {impact: q41, score: impactScore3},
                        {impact: q42, score: impactScore4},
                        {impact: q43, score: impactScore5},
                        {impact: q44, score: impactScore6}
                    ]
                }
            ],
            
            riskAnalysis: [
                {
                    category: r1,
                    risks: [
                        {risk: r11, impact: riskImpact1, probability: riskProb5, severityAssignment: ri1Rp5},
                        {risk: r12, impact: riskImpact2, probability: riskProb4, severityAssignment: ri2Rp4},
                        {risk: r13, impact: riskImpact3, probability: riskProb3, severityAssignment: ri3Rp3}
                    ]
                },
                {
                    category: r2,
                    risks: [
                        {risk: r21, impact: riskImpact1, probability: riskProb4, severityAssignment: ri1Rp4},
                        {risk: r22, impact: riskImpact5, probability: riskProb4, severityAssignment: ri5Rp4},
                        {risk: r23, impact: riskImpact3, probability: riskProb1, severityAssignment: ri3Rp1}
                    ]
                },
                {
                    category: r3,
                    risks: [
                        {risk: r31, impact: riskImpact1, probability: riskProb4, severityAssignment: ri1Rp4},
                        {risk: r32, impact: riskImpact2, probability: riskProb3, severityAssignment: ri2Rp3},
                        {risk: r33, impact: riskImpact3, probability: riskProb1, severityAssignment: ri3Rp1}
                    ]
                },
                {
                    category: r4,
                    risks: [
                        {risk: r41, impact: riskImpact1, probability: riskProb4, severityAssignment: ri1Rp4},
                        {risk: r42, impact: riskImpact2, probability: riskProb4, severityAssignment: ri2Rp4},
                        {risk: r43, impact: riskImpact4, probability: riskProb1, severityAssignment: ri4Rp1}
                    ]
                },
                {
                    category: r5,
                    risks: [
                        {risk: r51, impact: riskImpact1, probability: riskProb4, severityAssignment: ri1Rp4},
                        {risk: r52, impact: riskImpact2, probability: riskProb4, severityAssignment: ri2Rp4},
                        {risk: r53, impact: riskImpact3, probability: riskProb1, severityAssignment: ri3Rp1}
                    ]
                },
                {
                    category: r6,
                    risks: [
                        {risk: r61, impact: riskImpact1, probability: riskProb2, severityAssignment: ri1Rp2},
                        {risk: r62, impact: riskImpact2, probability: riskProb4, severityAssignment: ri2Rp4}
                    ]
                }
            ],
            
            stakeholders: [
                {
                    group: group1,
                    roles: [
                        {
                            role: role11,
                            person: null,
                            categorization: [
                                {category: id1, categoryValue: id11},
                                {category: id2, categoryValue: id21},
                                {category: id3, categoryValue: id31},
                                {category: id4, categoryValue: id41},
                                {category: id5, categoryValue: id51},
                                {category: id6, categoryValue: id61},
                                {category: id7, categoryValue: id71}
                            ]
                        },
                        {
                            role: role12,
                            person: null,
                            categorization: [
                                {category: id1, categoryValue: id11},
                                {category: id2, categoryValue: id21},
                                {category: id3, categoryValue: id31},
                                {category: id4, categoryValue: id41},
                                {category: id5, categoryValue: id51},
                                {category: id6, categoryValue: id61},
                                {category: id7, categoryValue: id71}
                            ]
                        },
                        {
                            role: role13,
                            person: null,
                            categorization: [
                                {category: id1, categoryValue: id11},
                                {category: id2, categoryValue: id21},
                                {category: id3, categoryValue: id31},
                                {category: id4, categoryValue: id41},
                                {category: id5, categoryValue: id51},
                                {category: id6, categoryValue: id61},
                                {category: id7, categoryValue: id71}
                            ]
                        },
                        {
                            role: role14,
                            person: null,
                            categorization: [
                                {category: id1, categoryValue: id11},
                                {category: id2, categoryValue: id21},
                                {category: id3, categoryValue: id31},
                                {category: id4, categoryValue: id41},
                                {category: id5, categoryValue: id51},
                                {category: id6, categoryValue: id61},
                                {category: id7, categoryValue: id71}
                            ]
                        }
                    ]
                },
                {
                    group: group2,
                    roles: [
                        {
                            role: role21,
                            person: null,
                            categorization: [
                                {category: id1, categoryValue: id12},
                                {category: id2, categoryValue: id22},
                                {category: id3, categoryValue: id32},
                                {category: id4, categoryValue: id42},
                                {category: id5, categoryValue: id52},
                                {category: id6, categoryValue: id62},
                                {category: id7, categoryValue: id72}
                            ]
                        },
                        {
                            role: role22,
                            person: null,
                            categorization: [
                                {category: id1, categoryValue: id12},
                                {category: id2, categoryValue: id22},
                                {category: id3, categoryValue: id32},
                                {category: id4, categoryValue: id42},
                                {category: id5, categoryValue: id52},
                                {category: id6, categoryValue: id62},
                                {category: id7, categoryValue: id72}
                            ]
                        },
                        {
                            role: role23,
                            person: null,
                            categorization: [
                                {category: id1, categoryValue: id12},
                                {category: id2, categoryValue: id22},
                                {category: id3, categoryValue: id32},
                                {category: id4, categoryValue: id42},
                                {category: id5, categoryValue: id52},
                                {category: id6, categoryValue: id62},
                                {category: id7, categoryValue: id72}
                            ]
                        },
                        {
                            role: role24,
                            person: null,
                            categorization: [
                                {category: id1, categoryValue: id12},
                                {category: id2, categoryValue: id22},
                                {category: id3, categoryValue: id32},
                                {category: id4, categoryValue: id42},
                                {category: id5, categoryValue: id52},
                                {category: id6, categoryValue: id62},
                                {category: id7, categoryValue: id72}
                            ]
                        }
                    ]
                }
            ],

            process: null
        }
    ];
    

    // ---------------------------------


    async.parallel([
        // Project1
        function(callback) {
            createObjects(Project, 'Project 1', seedArrayProject1, callback);
        },
        // Project2
        function(callback) {

            callback(null);
        }
    ], function (err, result) {
        if( err ) {
            console.log(err);
            callback(err);
        } else {
            callback(null, result);
        }
    });

};
