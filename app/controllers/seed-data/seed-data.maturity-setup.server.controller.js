'use strict';

/**
 * SEED - MATURITY SETUP
 */

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
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

exports.seedMaturityModels = function(user, callback){

    // Maturity model

    var model1 = mongoose.Types.ObjectId();

// Levels

    var level1 = mongoose.Types.ObjectId();
    var level2 = mongoose.Types.ObjectId();
    var level3 = mongoose.Types.ObjectId();
    var level4 = mongoose.Types.ObjectId();
    var level5 = mongoose.Types.ObjectId();

// Areas
    var area1 = mongoose.Types.ObjectId();
    var area2 = mongoose.Types.ObjectId();
    var area3 = mongoose.Types.ObjectId();
    var area4 = mongoose.Types.ObjectId();
    var area5 = mongoose.Types.ObjectId();
    var area6 = mongoose.Types.ObjectId();
    var area7 = mongoose.Types.ObjectId();
    var area8 = mongoose.Types.ObjectId();
    var area9 = mongoose.Types.ObjectId();
    var area10 = mongoose.Types.ObjectId();
    var area11 = mongoose.Types.ObjectId();
    var area12 = mongoose.Types.ObjectId();
    var area13 = mongoose.Types.ObjectId();
    var area14 = mongoose.Types.ObjectId();
    var area15 = mongoose.Types.ObjectId();
    var area16 = mongoose.Types.ObjectId();
    var area17 = mongoose.Types.ObjectId();
    var area18 = mongoose.Types.ObjectId();
    var area19 = mongoose.Types.ObjectId();
    var area20 = mongoose.Types.ObjectId();
    var area21 = mongoose.Types.ObjectId();
    var area22 = mongoose.Types.ObjectId();

// Dimensions

    // Level 1
    var l1a1_1 = mongoose.Types.ObjectId();
    var l1a2_1 = mongoose.Types.ObjectId();
    var l1a3_1 = mongoose.Types.ObjectId();
    var l1a4_1 = mongoose.Types.ObjectId();
    var l1a5_1 = mongoose.Types.ObjectId();

    // Level 2

    var l2a1_1 = mongoose.Types.ObjectId();

    var l2a2_1 = mongoose.Types.ObjectId();
    var l2a2_2 = mongoose.Types.ObjectId();
    var l2a2_3 = mongoose.Types.ObjectId();

    var l2a3_1 = mongoose.Types.ObjectId();
    var l2a3_2 = mongoose.Types.ObjectId();

    var l2a4_1 = mongoose.Types.ObjectId();
    var l2a4_2 = mongoose.Types.ObjectId();

    var l2a5_1 = mongoose.Types.ObjectId();
    var l2a5_2 = mongoose.Types.ObjectId();

    var l2a6_1 = mongoose.Types.ObjectId();
    var l2a6_2 = mongoose.Types.ObjectId();

    var l2a7_1 = mongoose.Types.ObjectId();
    var l2a7_2 = mongoose.Types.ObjectId();
    var l2a7_3 = mongoose.Types.ObjectId();

    // Level 3

    var l3a8_1 = mongoose.Types.ObjectId();
    var l3a8_2 = mongoose.Types.ObjectId();
    var l3a8_3 = mongoose.Types.ObjectId();

    var l3a9_1 = mongoose.Types.ObjectId();
    var l3a9_2 = mongoose.Types.ObjectId();
    var l3a9_3 = mongoose.Types.ObjectId();

    var l3a10_1 = mongoose.Types.ObjectId();
    var l3a10_2 = mongoose.Types.ObjectId();
    var l3a10_3 = mongoose.Types.ObjectId();

    var l3a11_1 = mongoose.Types.ObjectId();
    var l3a11_2 = mongoose.Types.ObjectId();
    var l3a11_3 = mongoose.Types.ObjectId();

    var l3a12_1 = mongoose.Types.ObjectId();
    var l3a12_2 = mongoose.Types.ObjectId();

    var l3a13_1 = mongoose.Types.ObjectId();
    var l3a13_2 = mongoose.Types.ObjectId();
    var l3a13_3 = mongoose.Types.ObjectId();

    var l3a14_1 = mongoose.Types.ObjectId();
    var l3a14_2 = mongoose.Types.ObjectId();

    var l3a15_1 = mongoose.Types.ObjectId();
    var l3a15_2 = mongoose.Types.ObjectId();

    var l3a16_1 = mongoose.Types.ObjectId();
    var l3a16_2 = mongoose.Types.ObjectId();
    var l3a16_3 = mongoose.Types.ObjectId();

    var l3a17_1 = mongoose.Types.ObjectId();
    var l3a17_2 = mongoose.Types.ObjectId();
    var l3a17_3 = mongoose.Types.ObjectId();

    var l3a18_1 = mongoose.Types.ObjectId();

    // Level 4

    var l4a19_1 = mongoose.Types.ObjectId();

    var l4a20_1 = mongoose.Types.ObjectId();
    var l4a20_2 = mongoose.Types.ObjectId();

    // Level 5

    var l5a21_1 = mongoose.Types.ObjectId();
    var l5a21_2 = mongoose.Types.ObjectId();

    var l5a22_1 = mongoose.Types.ObjectId();
    var l5a22_2 = mongoose.Types.ObjectId();

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'MaturityModel');
            var seedArray =  [
                {
                    _id: model1,
                    name: 'CMMI Maturity Model',
                    description:'Maturity model based on the CMMI standard',
                    user:user._id,
                    created: Date.now(),
                    levels: [
                        {
                            _id: level1,
                            name: 'Initial',
                            description:'At maturity level 1, processes are usually ad hoc and chaotic. ' +
                            'The organization usually does not provide a stable environment. ' +
                            'Success in these organizations depends on the competence and heroics ' +
                            'of the people in the organization and not on the use of proven processes',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: level2,
                            name: 'Managed',
                            description:'The projects of the organization have ensured that requirements ' +
                            'are managed and that processes are planned, performed, measured, and controlled',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: level3,
                            name: 'Defined',
                            description:'processes are well characterized and understood, and are described in ' +
                            'standards, procedures, tools, and methods',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: level4,
                            name: 'Quantitatively Managed',
                            description:'Quantitative objectives for quality and process performance are established and used ' +
                            'as criteria in managing processes. Processes are controlled using statistical and other quantitative techniques',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: level5,
                            name: 'Optimizing',
                            description:'Processes are continually improved based on a quantitative understanding of the common causes' +
                            ' of variation inherent in processes. Maturity level 5 focuses on continually improving process performance ' +
                            'through both incremental and innovative technological improvements',
                            user:user._id,
                            created: Date.now()
                        }
                    ],
                    areas: [
                        {
                            _id: area1,
                            name: 'Requirements Management',
                            description:'Manage the requirements of the project\'s products and product components and to identify ' +
                            'inconsistencies between those requirements and the project\'s plans and work products.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area2,
                            name: 'Project Planning',
                            description:'Establish and maintain plans that define project activities',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area3,
                            name: 'Project Monitoring and Control',
                            description:'The purpose of Project Monitoring and Control (PMC) is to provide an understanding of the project\'s progress' +
                            ' so that appropriate corrective actions can be taken when the project\'s performance deviates significantly from the plan.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area4,
                            name: 'Supplier Agreement Management',
                            description:'The purpose of Supplier Agreement Management (SAM) is to manage the acquisition of products from suppliers ' +
                            'for which there exists a formal agreement.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area5,
                            name: 'Measurement and Analysis',
                            description:'The purpose of Measurement and Analysis (MA) is to develop and sustain a measurement capability ' +
                            'that is used to support management information needs.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area6,
                            name: 'Process and Product Quality Assurance',
                            description:'The purpose of Process and Product Quality Assurance (PPQA) is to provide staff and management ' +
                            'with objective insight into processes and associated work products.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area7,
                            name: 'Configuration Management',
                            description:'The purpose of Configuration Management (CM) is to establish and maintain the integrity of work products ' +
                            'using configuration identification, configuration control, configuration status accounting, and configuration audits.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area8,
                            name: 'Requirements Development',
                            description:'The purpose of Requirements Development (RD) is to produce and analyze customer, product, and product-component requirements.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area9,
                            name: 'Technical Solution',
                            description:'The purpose of Technical Solution (TS) is to design, develop, and implement solutions to requirements. ' +
                            'Solutions, designs, and implementations encompass products, product components, and product-related life-cycle processes ' +
                            'either singly or in combination as appropriate.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area10,
                            name: 'Product Integration',
                            description:'The purpose of Product Integration (PI) is to assemble the product from the product components, ' +
                            'ensure that the product, as integrated, functions properly, and deliver the product.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area11,
                            name: 'Verification',
                            description:'The purpose of Verification (VER) is to ensure that selected work products meet their specified requirements.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area12,
                            name: 'Validation',
                            description:'The purpose of Validation (VAL) is to demonstrate that a product or product component fulfills its intended use ' +
                            'when placed in its intended environment.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area13,
                            name: 'Organizational Process Focus',
                            description:'The purpose of Organizational Process Focus (OPF) is to plan and implement organizational process improvement ' +
                            'based on a thorough understanding of the current strengths and weaknesses of the organization\'s processes and process assets.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area14,
                            name: 'Organizational Process Definition',
                            description:'TThe purpose of Organizational Process Definition +IPPD (OPD) is to establish and maintain a usable set of ' +
                            'organizational process assets.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area15,
                            name: 'Organizational Training',
                            description:'The purpose of Organizational Training (OT) is to develop the skills and ' +
                            'knowledge of people so they can perform their roles effectively and efficiently',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area16,
                            name: 'Integrated Project Management',
                            description:'The purpose of Integrated Project Management is to establish and manage the project and the involvement of the relevant ' +
                            'stakeholders according to an integrated and defined process that is tailored from the organization\'s set of standard processes.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area17,
                            name: 'Risk Management',
                            description:'The purpose of Risk Management (RSKM) is to identify potential problems before they occur so that risk-handling activities ' +
                            'can be planned and invoked as needed across the life of the product or project to mitigate adverse impacts on achieving objectives.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area18,
                            name: 'Decision Analysis and Resolution',
                            description:'The purpose of Decision Analysis and Resolution (DAR) is to analyze possible decisions using a formal evaluation process ' +
                            'that evaluates identified alternatives against established criteria.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area19,
                            name: 'Organizational Process Performance',
                            description:'The purpose of Organizational Process Performance (OPP) is to establish and maintain a quantitative understanding of the performance ' +
                            'of the organization\'s set of standard processes in support of quality and process-performance objectives, and to provide the process performance data, ' +
                            'baselines, and models to quantitatively manage the organization\'s projects.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area20,
                            name: 'Quantitative Project Management',
                            description:'The purpose of the Quantitative Project Management (QPM) process area is to quantitatively manage the project\'s defined process to achieve ' +
                            'the project\'s established quality and process-performance objectives.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area21,
                            name: 'Organizational Innovation and Deployment',
                            description:'The purpose of Organizational Innovation and Deployment (OID) is to select and deploy incremental and innovative improvements that measurably ' +
                            'improve the organization\'s processes and technologies. The improvements support the organization\'s quality and process-performance objectives as derived ' +
                            'from the organization\'s business objectives.',
                            user:user._id,
                            created: Date.now()
                        },
                        {
                            _id: area22,
                            name: 'Causal Analysis and Resolution',
                            description:'The purpose of Causal Analysis and Resolution (CAR) is to identify causes of defects and other problems ' +
                            'and take action to prevent them from occurring in the future.',
                            user:user._id,
                            created: Date.now()
                        }
                    ],
                    dimensions: [
                        {
                            _id: l2a1_1,
                            level: level2,
                            area: area1,
                            name: 'Manage Requirements',
                            description: 'SP 1.1 Obtain an Understanding of Requirements, SP 1.2 Obtain Commitment to Requirements, SP 1.3 Manage Requirements Changes, ' +
                            'SP 1.4 Maintain Bidirectional Traceability of Requirements, SP 1.5 Identify Inconsistencies between Project Work and Requirements',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l2a2_1,
                            level: level2,
                            area: area2,
                            name: 'Establish Estimates',
                            description: 'SP 1.1 Estimate the Scope of the Project, SP 1.2 Establish Estimates of Work Product and Task Attributes, ' +
                            'SP 1.3 Define Project Life Cycle, SP 1.4 Determine Estimates of Effort and Cost',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l2a2_2,
                            level: level2,
                            area: area2,
                            name: 'Develop a Project Plan',
                            description: 'SP 2.1 Establish the Budget and Schedule, SP 2.2 Identify Project Risks, SP 2.3 Plan for Data Management, ' +
                            'SP 2.4 Plan for Project Resources, SP 2.5 Plan for Needed Knowledge and Skills, SP 2.6 Plan Stakeholder Involvement, ' +
                            'SP 2.7 Establish the Project Plan',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l2a2_3,
                            level: level2,
                            area: area2,
                            name: 'Obtain Commitment to the Plan',
                            description: 'SP 3.1 Review Plans that Affect the Project, SP 3.2 Reconcile Work and Resource Levels, SP 3.3 Obtain Plan Commitment',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l2a3_1,
                            level: level2,
                            area: area3,
                            name: 'Monitor Project Against Plan',
                            description: 'SP 1.1 Monitor Project Planning Parameters, SP 1.2 Monitor Commitments, SP 1.3 Monitor Project Risks, ' +
                            'SP 1.4 Monitor Data Management, SP 1.5 Monitor Stakeholder Involvement, SP 1.6 Conduct Progress Reviews, SP 1.7 Conduct Milestone Reviews',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l2a3_2,
                            level: level2,
                            area: area3,
                            name: 'Manage Corrective Action to Closure',
                            description: 'SP 2.1 Analyze Issues, SP 2.2 Take Corrective Action, SP 2.3 Manage Corrective Action',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l2a4_1,
                            level: level2,
                            area: area4,
                            name: 'Establish Supplier Agreements',
                            description: 'SP 1.1 Determine Acquisition Type, SP 1.2 Select Suppliers, SP 1.3 Establish Supplier Agreements',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l2a4_2,
                            level: level2,
                            area: area4,
                            name: 'Satisfy Supplier Agreements',
                            description: 'SP 2.1 Execute the Supplier Agreement, SP 2.2 Monitor Selected Supplier Processes, ' +
                            'SP 2.3 Evaluate Selected Supplier Work Products, SP 2.4 Accept the Acquired Product, SP 2.5 Transition Products',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l2a5_1,
                            level: level2,
                            area: area5,
                            name: 'Align Measurement and Analysis Activities',
                            description: 'SP 1.1 Establish Measurement Objectives, SP 1.2 Specify Measures, ' +
                            'SP 1.3 Specify Data Collection and Storage Procedures, SP 1.4 Specify Analysis Procedures',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l2a5_2,
                            level: level2,
                            area: area5,
                            name: 'Provide Measurement Results',
                            description: 'SP 2.1 Collect Measurement Data, SP 2.2 Analyze Measurement Data, SP 2.3 Store Data and Results, SP 2.4 Communicate Results',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l2a6_1,
                            level: level2,
                            area: area6,
                            name: 'Objectively Evaluate Processes and Work Products',
                            description: 'SP 1.1 Objectively Evaluate Processes, SP 1.2 Objectively Evaluate Work Products and Services',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l2a6_2,
                            level: level2,
                            area: area6,
                            name: 'Provide Objective Insight',
                            description: 'SP 2.1 Communicate and Ensure Resolution of Noncompliance Issues, SP 2.2 Establish Records',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l2a7_1,
                            level: level2,
                            area: area7,
                            name: 'Establish Baselines',
                            description: 'SP 1.1 Identify Configuration Items, SP 1.2 Establish a Configuration Management System, SP 1.3 Create or Release Baselines',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l2a7_2,
                            level: level2,
                            area: area7,
                            name: 'Track and Control Changes',
                            description: 'SP 2.1 Track Change Requests, SP 2.2 Control Configuration Items',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l2a7_3,
                            level: level2,
                            area: area7,
                            name: 'Establish Integrity',
                            description: 'SP 3.1 Establish Configuration Management Records, SP 3.2 Perform Configuration Audits',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a8_1,
                            level: level3,
                            area: area8,
                            name: 'Develop Customer Requirements',
                            description: 'SP 1.1 Elicit Needs, SP 1.2 Develop the Customer Requirements',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a8_2,
                            level: level3,
                            area: area8,
                            name: 'Develop Product Requirements',
                            description: 'SP 2.1 Establish Product and Product-Component Requirements, SP 2.2 Allocate Product-Component Requirements, SP 2.3 Identify Interface Requirements',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a8_3,
                            level: level3,
                            area: area8,
                            name: 'Analyze and Validate Requirements',
                            description: 'SP 3.1 Establish Operational Concepts and Scenarios, SP 3.2 Establish a Definition of Required Functionality, ' +
                            'SP 3.3 Analyze Requirements, SP 3.4 Analyze Requirements to Achieve Balance, SP 3.5 Validate Requirements',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a9_1,
                            level: level3,
                            area: area9,
                            name: 'Select Product-Component Solutions',
                            description: 'SP 1.1 Develop Alternative Solutions and Selection Criteria, SP 1.2 Select Product Component Solutions',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a9_2,
                            level: level3,
                            area: area9,
                            name: 'Develop the Design',
                            description: 'SP 2.1 Design the Product or Product Component, SP 2.2 Establish a Technical Data Package, ' +
                            'SP 2.3 Design Interfaces Using Criteria, SP 2.4 Perform Make, Buy, or Reuse Analysis',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a9_3,
                            level: level3,
                            area: area9,
                            name: 'Implement the Product Design',
                            description: 'SP 3.1 Implement the Design, SP 3.2 Develop Product Support Documentation',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a10_1,
                            level: level3,
                            area: area10,
                            name: 'Prepare for Product Integration',
                            description: 'SP 1.1 Determine Integration Sequence, SP 1.2 Establish the Product Integration Environment, ' +
                            'SP 1.3 Establish Product Integration Procedures and Criteria',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a10_2,
                            level: level3,
                            area: area10,
                            name: 'Ensure Interface Compatibility',
                            description: 'SP 2.1 Review Interface Descriptions for Completeness, SP 2.2 Manage Interfaces',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a10_3,
                            level: level3,
                            area: area10,
                            name: 'Assemble Product Components and Deliver the Product',
                            description: 'SP 3.1 Confirm Readiness of Product Components for Integration, SP 3.2 Assemble Product Components, SP 3.3 Evaluate Assembled Product Components, SP 3.4 Package and Deliver the Product or Product Component',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a11_1,
                            level: level3,
                            area: area11,
                            name: 'Prepare for Verification',
                            description: 'SP 1.1 Select Work Products for Verification, SP 1.2 Establish the Verification Environment, ' +
                            'SP 1.3 Establish Verification Procedures and Criteria',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a11_2,
                            level: level3,
                            area: area11,
                            name: 'Perform Peer Reviews',
                            description: 'SP 2.1 Prepare for Peer Reviews, SP 2.2 Conduct Peer Reviews, SP 2.3 Analyze Peer Review Data',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a11_3,
                            level: level3,
                            area: area11,
                            name: 'Verify Selected Work Products',
                            description: 'SP 3.1 Perform Verification, SP 3.2 Analyze Verification Results',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a12_1,
                            level: level3,
                            area: area12,
                            name: 'Prepare for Validation',
                            description: 'SP 1.1 Select Products for Validation, SP 1.2 Establish the Validation Environment, SP 1.3 Establish Validation Procedures and Criteria',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a12_2,
                            level: level3,
                            area: area12,
                            name: 'Validate Product or Product Components',
                            description: 'SP 2.1 Perform Validation, SP 2.2 Analyze Validation Results.',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a13_1,
                            level: level3,
                            area: area13,
                            name: 'Determine Process Improvement Opportunities',
                            description: 'SP 1.1 Establish Organizational Process Needs, SP 1.2 Appraise the Organization\'s Processes, ' +
                            'SP 1.3 Identify the Organization\'s Process Improvements',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a13_2,
                            level: level3,
                            area: area13,
                            name: 'Plan and Implement Process Improvement Activities',
                            description: 'SP 2.1 Establish Process Action Plans, SP 2.2 Implement Process Action Plans',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a13_3,
                            level: level3,
                            area: area13,
                            name: 'Deploy Organizational Process Assets and Incorporate Lessons Learned',
                            description: 'SP 3.1 Deploy Organizational Process Assets, SP 3.2 Deploy Standard Processes, ' +
                            'SP 3.3 Monitor Implementation, SP 3.4 Incorporate Process-Related Experiences into the Organizational Process Assets',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a14_1,
                            level: level3,
                            area: area14,
                            name: 'Establish Organizational Process Assets',
                            description: 'SP 1.1 Establish Standard Processes, SP 1.2 Establish Life-Cycle Model Descriptions, ' +
                            'SP 1.3 Establish Tailoring Criteria and Guidelines, SP 1.4 Establish the Organization\'s Measurement Repository, ' +
                            'SP 1.5 Establish the Organization\'s Process Asset Library',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a14_2,
                            level: level3,
                            area: area14,
                            name: 'Enable Integrated Product and Process Development',
                            description: 'SP 2.1 Establish Empowerment Mechanisms, SP 2.2 Establish Rules and Guidelines for Integrated Teams, ' +
                            'SP 2.3 Balance Team and Home Organization Responsibilities',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a15_1,
                            level: level3,
                            area: area15,
                            name: 'Establish an Organizational Training Capability',
                            description: 'SP 1.1 Establish the Strategic Training Needs, SP 1.2 Determine Which Training Needs Are the Responsibility of the Organization, ' +
                            'SP 1.3 Establish an Organizational Training Tactical Plan, SP 1.4 Establish Training Capability',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a15_2,
                            level: level3,
                            area: area15,
                            name: 'Provide Necessary Training',
                            description: 'SP 2.1 Deliver Training, SP 2.2 Establish Training Records, SP 2.3 Assess Training Effectiveness',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a16_1,
                            level: level3,
                            area: area16,
                            name: 'Use the Project\'s Defined Process',
                            description: 'SP 1.1 Establish the Project\'s Defined Process, SP 1.2 Use Organizational Process Assets for Planning Project Activities, ' +
                            'SP 1.3 Establish the Project\'s Work Environment, SP 1.4 Integrate Plans, SP 1.5 Manage the Project Using the Integrated Plans, ' +
                            'SP 1.6 Contribute to the Organizational Process Assets',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a16_2,
                            level: level3,
                            area: area16,
                            name: 'Coordinate and Collaborate with Relevant Stakeholders',
                            description: 'SP 2.1 Manage Stakeholder Involvement, SP 2.2 Manage Dependencies, SP 2.3 Resolve Coordination Issues',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a16_3,
                            level: level3,
                            area: area16,
                            name: 'Apply Integrated Product and Process Development',
                            description: 'SP 3.1 Establish the Project\'s Shared Vision, SP 3.2 Establish the Integrated Team Structure, ' +
                            'SP 3.3 Allocate Requirements to Integrated Teams, SP 3.4 Establish Integrated Teams, ' +
                            'SP 3.5 Ensure Collaboration among Interfacing Teams',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a17_1,
                            level: level3,
                            area: area17,
                            name: 'Prepare for Risk Management',
                            description: 'SP 1.1 Determine Risk Sources and Categories, SP 1.2 Define Risk Parameters, SP 1.3 Establish a Risk Management Strategy',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a17_2,
                            level: level3,
                            area: area17,
                            name: 'Identify and Analyze Risks',
                            description: 'SP 2.1 Identify Risks, SP 2.2 Evaluate, Categorize, and Prioritize Risks',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a17_3,
                            level: level3,
                            area: area17,
                            name: 'Mitigate Risks',
                            description: 'SP 3.1 Develop Risk Mitigation Plans, SP 3.2 Implement Risk Mitigation Plans',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l3a18_1,
                            level: level3,
                            area: area18,
                            name: 'Evaluate Alternatives',
                            description: 'SP 1.1 Establish Guidelines for Decision Analysis, SP 1.2 Establish Evaluation Criteria, ' +
                            'SP 1.3 Identify Alternative Solutions, SP 1.4 Select Evaluation Methods, SP 1.5 Evaluate Alternatives, SP 1.6 Select Solutions',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l4a19_1,
                            level: level4,
                            area: area19,
                            name: 'Establish Performance Baselines and Models',
                            description: 'SP 1.1 Select Processes, SP 1.2 Establish Process Performance Measures, ' +
                            'SP 1.3 Establish Quality and Process Performance Objectives, ' +
                            'SP 1.4 Establish Process Performance Baselines, SP 1.5 Establish Process Performance Models',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l4a20_1,
                            level: level4,
                            area: area20,
                            name: 'Quantitatively Manage the Project',
                            description: 'SP 1.1 Establish the Project\'s Objectives, SP 1.2 Compose the Defined Processes, ' +
                            'SP 1.3 Select the Subprocesses that Will Be Statistically Managed, SP 1.4 Manage Project Performance',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l4a20_2,
                            level: level4,
                            area: area20,
                            name: 'Statistically Manage Subprocess Performance',
                            description: 'SP 2.1 Select Measures and Analytic Techniques, SP 2.2 Apply Statistical Methods to Understand Variation, ' +
                            'SP 2.3 Monitor Performance of the Selected Subprocesses, SP 2.4 Record Statistical Management Data',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l5a21_1,
                            level: level5,
                            area: area21,
                            name: 'Select Improvements',
                            description: 'SP 1.1 Collect and Analyze Improvement Proposals, SP 1.2 Identify and Analyze Innovations, ' +
                            'SP 1.3 Pilot Improvements, SP 1.4 Select Improvements for Deployment',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l5a21_2,
                            level: level5,
                            area: area21,
                            name: 'Deploy Improvements',
                            description: 'SP 2.1 Plan the Deployment areas, SP 2.2 Manage the Deployment, SP 2.3 Measure Improvement Effects',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l5a22_1,
                            level: level5,
                            area: area22,
                            name: 'Determine Causes of Defects',
                            description: 'SP 1.1 Select Defect Data for Analysis, SP 1.2 Analyze Causes',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        },
                        {
                            _id: l5a22_2,
                            level: level5,
                            area: area22,
                            name: 'Address Causes of Defects',
                            description: 'SP 2.1 Implement the Action Proposals, SP 2.2 Evaluate the Effect of Changes, SP 2.3 Record Data',
                            maturityReview: {
                                currentRecord:{
                                    score: null,
                                    comment: '',
                                    created: Date.now(),
                                    user: user._id
                                },
                                history: []
                            }
                        }
                    ]
                }
            ];
            createObjects(schema, 'MaturityModel', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
