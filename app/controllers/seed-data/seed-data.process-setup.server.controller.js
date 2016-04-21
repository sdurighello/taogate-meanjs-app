'use strict';

/**
 * SEED - PROCESS SETUP
 */

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    seedIDs = require('./seed-data.ids.server.controller').getIDs(),
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

exports.seedProcesses = function(user, callback){
    // Outcome scores
    var goScore1 = seedIDs.GateOutcomeScore.goScore1;
    var goScore2 = seedIDs.GateOutcomeScore.goScore2;
    var goScore3 = seedIDs.GateOutcomeScore.goScore3;

    // Gate Statuses
    var gStatus1 = seedIDs.GateStatus.gStatus1;
    var gStatus2 = seedIDs.GateStatus.gStatus2;
    var gStatus3 = seedIDs.GateStatus.gStatus3;
    var gStatus4 = seedIDs.GateStatus.gStatus4;
    var gStatus5 = seedIDs.GateStatus.gStatus5;
    var gStatus6 = seedIDs.GateStatus.gStatus6;

    // Waterfall
    var w1 = seedIDs.GateProcess.w1;

    var w11 = seedIDs.Gate.w11; // Startup
    var w12 = seedIDs.Gate.w12; // Initiation
    var w13 = seedIDs.Gate.w13; // Planning
    var w14 = seedIDs.Gate.w14; // Execution
    var w15 = seedIDs.Gate.w15; // Warranty
    var w16 = seedIDs.Gate.w16; // Closure

    var w111 = seedIDs.GateOutcome.w111; // Initiative aligned to approved strategic theme
    var w112 = seedIDs.GateOutcome.w112; // Formal support by a named Sponsor identified
    var w113 = seedIDs.GateOutcome.w113; // Expected delivery identified in approved roadmap
    var w114 = seedIDs.GateOutcome.w114; // A Project Manager has been assigned

    var w121 = seedIDs.GateOutcome.w121; // Business justification agreed between stakeholders
    var w122 = seedIDs.GateOutcome.w122; // Funding available and committed
    var w123 = seedIDs.GateOutcome.w123; // Strategic intent clear and aligned with other initiatives

    var w131 = seedIDs.GateOutcome.w131; // Cost/Benefits ownership agreed
    var w132 = seedIDs.GateOutcome.w132; // Clear requirements
    var w133 = seedIDs.GateOutcome.w133; // Impacts on other systems and interfaces identified
    var w134 = seedIDs.GateOutcome.w134; // Impacts on business processes, organization and people identified
    var w135 = seedIDs.GateOutcome.w135; // Delivery and operations risks mitigated

    var w141 = seedIDs.GateOutcome.w141; // Business change validated
    var w142 = seedIDs.GateOutcome.w142; // Functional behaviour detailed
    var w143 = seedIDs.GateOutcome.w143; // Business case approved
    var w144 = seedIDs.GateOutcome.w144; // Testing strategy agreed

    var w151 = seedIDs.GateOutcome.w151; // Solution built as per design with variance to design documented and agreed
    var w152 = seedIDs.GateOutcome.w152; // Changes have been placed into production based on formal approval
    var w153 = seedIDs.GateOutcome.w153; // Users understand how changes to systems and processes will impact them, and where to go for support
    var w154 = seedIDs.GateOutcome.w154; // Maintenance of new systems, processes or required updates in place

    var w161 = seedIDs.GateOutcome.w161; // Post implementation review completed
    var w162 = seedIDs.GateOutcome.w162; // Lessons learned captured and embedded
    var w163 = seedIDs.GateOutcome.w163; // Business benefits realization tracking initiated
    var w164 = seedIDs.GateOutcome.w164; // Project formally closed in management systems

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'GateOutcomeScore');
            var seedArray =  [
                {
                    _id: goScore1,
                    name: 'Not achieved',
                    description:'Gate outcome has not been achieved',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: goScore2,
                    name: 'Partially achieved',
                    description:'Gate outcome has been partially achieved',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: goScore3,
                    name: 'Achieved',
                    description:'Gate outcome has been achieved',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'GateOutcomeScore', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'GateStatus');
            var seedArray =  [
                {
                    _id: gStatus1,
                    name: 'Review not started',
                    description:'Gate review not started',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: gStatus2,
                    name: 'Review in progress',
                    description:'Gate review in progress',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: gStatus3,
                    name: 'Review on-hold',
                    description:'Gate review on-hold',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: gStatus4,
                    name: 'Conditionally approved',
                    description:'Gate conditionally approved',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: gStatus5,
                    name: 'Approved',
                    description:'Gate approved',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: gStatus6,
                    name: 'Not approved',
                    description:'Gate not approved',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'GateStatus', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'GateProcess');
            var seedArray =  [
                {
                    _id: w1,
                    name: 'Standard waterfall',
                    description:'Standard waterfall auditing process',
                    startupGate : w11,
                    closureGate : w16,
                    gates: [w11, w12, w13, w14, w15, w16],
                    isAssigned: false,
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'GateProcess', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'Gate');
            var seedArray =  [
                {
                    _id: w11,
                    name: 'Startup',
                    description:'Project start',
                    position: 1,
                    gateOutcomes: [w111, w112, w113, w114],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w12,
                    name: 'Initiation',
                    description:'Project initiation',
                    position: 2,
                    gateOutcomes: [w121, w122, w123],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w13,
                    name: 'Planning',
                    description:'Project planning',
                    position: 3,
                    gateOutcomes: [w131, w132, w133, w134, w135],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w14,
                    name: 'Execution',
                    description:'Project execution',
                    position: 4,
                    gateOutcomes: [w141, w142, w143, w144],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w15,
                    name: 'Warranty',
                    description:'Project in warranty support',
                    position: 5,
                    gateOutcomes: [w151, w152, w153, w154],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w16,
                    name: 'Closure',
                    description:'Project end and final closure',
                    position: 6,
                    gateOutcomes: [w161, w162, w163, w164],
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'Gate', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'GateOutcome');
            var seedArray =  [
                {
                    _id: w111,
                    name: 'Project aligned to strategy',
                    description:'The initiative has been aligned to an approved strategic theme',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w112,
                    name: 'Sponsorship in place',
                    description:'A sponsor for the initiative has been formally appointed',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w113,
                    name: 'Project in roadmap',
                    description:'The initiative has been added to the delivery roadmap',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w114,
                    name: 'Project Manager assigned',
                    description:'A project manager with suitable skills and availability to complete the project has been formally assigned',
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: w121,
                    name: 'Business justification agreed',
                    description:'The business justification has been agreed between stakeholders',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w122,
                    name: 'Funding committed',
                    description:'Departmental budget has been made available and committed for the whole of the project',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w123,
                    name: 'Strategic importance clear',
                    description:'The level of strategic importance of the project is clear in respect to other initiatives ' +
                    'so that resource prioritization decision can be easily made in case of bottlenecks',
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: w131,
                    name: 'Cost/Benefits ownership agreed',
                    description:'The business costs and benefits value, timing, ownership and tracking have been agreed between stakeholders',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w132,
                    name: 'Clear requirements',
                    description:'There is a formal and approved set of clearly stated requirements',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w133,
                    name: 'Impacts on systems identified',
                    description:'Impacts on other systems and interfaces identified',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w134,
                    name: 'Impacts on processes and people identified',
                    description:'Impacts on business processes, organization and people has been identified',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w135,
                    name: 'Risk mitigation in place',
                    description:'Project, market and operational risks have been identified, evaluated, accepted and sufficiently mitigated',
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: w141,
                    name: 'Business change validated',
                    description:'Changes to business processes, staff numbers/structure and training needs ' +
                    'are in formalized and validated by stakeholders',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w142,
                    name: 'Functional behaviour detailed',
                    description:'System functional behaviour is clear enough to commence technical and process designs',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w143,
                    name: 'Business case approved',
                    description:'Investment model, financial ratios and intangible benefits have been detailed and agreed',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w144,
                    name: 'Testing strategy agreed',
                    description:'Testing strategy has been formalized and agreed',
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: w151,
                    name: 'Solution as built validated',
                    description:'Solution has been built as per design with variance to design documented and agreed',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w152,
                    name: 'Production changes approved',
                    description:'Changes have been placed into production based on formal approval',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w153,
                    name: 'User engagement in place',
                    description:'Users understand how changes to systems and processes will impact them, and where to go for support',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w154,
                    name: 'Maintenance and support implemented',
                    description:'Maintenance of new systems, processes or required updates in place',
                    user:user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: w161,
                    name: 'Post implementation review completed',
                    description:'Post implementation review completed',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w162,
                    name: 'Lessons learned captured',
                    description:'Lessons learned captured and embedded',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w163,
                    name: 'Benefits realization initiated',
                    description:'Business benefits realization and tracking initiated',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: w164,
                    name: 'Project formally closed',
                    description:'Project formally closed in management systems',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'GateOutcome', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
