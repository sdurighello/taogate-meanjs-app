'use strict';

/**
 * SEED - PROCESS SETUP
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

exports.seedProcesses = function(req, callback){
    // Outcome scores
    var notAchieved = mongoose.Types.ObjectId();
    var partiallyAchieved = mongoose.Types.ObjectId();
    var achieved = mongoose.Types.ObjectId();

    // Gate Statuses
    var gStatus1 = mongoose.Types.ObjectId();
    var gStatus2 = mongoose.Types.ObjectId();
    var gStatus3 = mongoose.Types.ObjectId();
    var gStatus4 = mongoose.Types.ObjectId();
    var gStatus5 = mongoose.Types.ObjectId();
    var gStatus6 = mongoose.Types.ObjectId();

    // Waterfall
    var w1 = mongoose.Types.ObjectId();

    var w11 = mongoose.Types.ObjectId(); // Startup
    var w12 = mongoose.Types.ObjectId(); // Initiation
    var w13 = mongoose.Types.ObjectId(); // Planning
    var w14 = mongoose.Types.ObjectId(); // Execution
    var w15 = mongoose.Types.ObjectId(); // Warranty
    var w16 = mongoose.Types.ObjectId(); // Closure

    var w111 = mongoose.Types.ObjectId(); // Initiative aligned to approved strategic theme
    var w112 = mongoose.Types.ObjectId(); // Formal support by a named Sponsor identified
    var w113 = mongoose.Types.ObjectId(); // Expected delivery identified in approved roadmap
    var w114 = mongoose.Types.ObjectId(); // A Project Manager has been assigned

    var w121 = mongoose.Types.ObjectId(); // Business justification agreed between stakeholders
    var w122 = mongoose.Types.ObjectId(); // Funding available and committed
    var w123 = mongoose.Types.ObjectId(); // Strategic intent clear and aligned with other initiatives

    var w131 = mongoose.Types.ObjectId(); // Cost/Benefits ownership agreed
    var w132 = mongoose.Types.ObjectId(); // Clear requirements
    var w133 = mongoose.Types.ObjectId(); // Impacts on other systems and interfaces identified
    var w134 = mongoose.Types.ObjectId(); // Impacts on business processes, organization and people identified
    var w135 = mongoose.Types.ObjectId(); // Delivery and operations risks mitigated

    var w141 = mongoose.Types.ObjectId(); // Business change validated
    var w142 = mongoose.Types.ObjectId(); // Functional behaviour detailed
    var w143 = mongoose.Types.ObjectId(); // Business case approved
    var w144 = mongoose.Types.ObjectId(); // Testing strategy agreed

    var w151 = mongoose.Types.ObjectId(); // Solution built as per design with variance to design documented and agreed
    var w152 = mongoose.Types.ObjectId(); // Changes have been placed into production based on formal approval
    var w153 = mongoose.Types.ObjectId(); // Users understand how changes to systems and processes will impact them, and where to go for support
    var w154 = mongoose.Types.ObjectId(); // Maintenance of new systems, processes or required updates in place

    var w161 = mongoose.Types.ObjectId(); // Post implementation review completed
    var w162 = mongoose.Types.ObjectId(); // Lessons learned captured and embedded
    var w163 = mongoose.Types.ObjectId(); // Business benefits realization tracking initiated
    var w164 = mongoose.Types.ObjectId(); // Project formally closed in management systems

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcomeScore');
            var seedArray =  [
                {
                    _id: notAchieved,
                    name: 'Not achieved',
                    description:'Gate outcome has not been achieved',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: partiallyAchieved,
                    name: 'Partially achieved',
                    description:'Gate outcome has been partially achieved',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: achieved,
                    name: 'Achieved',
                    description:'Gate outcome has been achieved',
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'GateOutcomeScore', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'GateStatus');
            var seedArray =  [
                {
                    _id: gStatus1,
                    name: 'Review not started',
                    description:'Gate review not started',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: gStatus2,
                    name: 'Review in progress',
                    description:'Gate review in progress',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: gStatus3,
                    name: 'Review on-hold',
                    description:'Gate review on-hold',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: gStatus4,
                    name: 'Conditionally approved',
                    description:'Gate conditionally approved',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: gStatus5,
                    name: 'Approved',
                    description:'Gate approved',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: gStatus6,
                    name: 'Not approved',
                    description:'Gate not approved',
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'GateStatus', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcess');
            var seedArray =  [
                {
                    _id: w1,
                    name: 'Standard waterfall',
                    description:'Standard waterfall auditing process',
                    startupGate : w11,
                    closureGate : w16,
                    gates: [w11, w12, w13, w14, w15, w16],
                    isAssigned: false,
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'GateProcess', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'Gate');
            var seedArray =  [
                {
                    _id: w11,
                    name: 'Startup',
                    description:'Project start',
                    position: 1,
                    gateOutcomes: [w111, w112, w113, w114],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w12,
                    name: 'Initiation',
                    description:'Project initiation',
                    position: 2,
                    gateOutcomes: [w121, w122, w123],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w13,
                    name: 'Planning',
                    description:'Project planning',
                    position: 3,
                    gateOutcomes: [w131, w132, w133, w134, w135],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w14,
                    name: 'Execution',
                    description:'Project execution',
                    position: 4,
                    gateOutcomes: [w141, w142, w143, w144],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w15,
                    name: 'Warranty',
                    description:'Project in warranty support',
                    position: 5,
                    gateOutcomes: [w151, w152, w153, w154],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w16,
                    name: 'Closure',
                    description:'Project end and final closure',
                    position: 6,
                    gateOutcomes: [w161, w162, w163, w164],
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'Gate', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'GateOutcome');
            var seedArray =  [
                {
                    _id: w111,
                    name: 'Project aligned to strategy',
                    description:'The initiative has been aligned to an approved strategic theme',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w112,
                    name: 'Sponsorship in place',
                    description:'A sponsor for the initiative has been formally appointed',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w113,
                    name: 'Project in roadmap',
                    description:'The initiative has been added to the delivery roadmap',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w114,
                    name: 'Project Manager assigned',
                    description:'A project manager with suitable skills and availability to complete the project has been formally assigned',
                    user:req.user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: w121,
                    name: 'Business justification agreed',
                    description:'The business justification has been agreed between stakeholders',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w122,
                    name: 'Funding committed',
                    description:'Departmental budget has been made available and committed for the whole of the project',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w123,
                    name: 'Strategic importance clear',
                    description:'The level of strategic importance of the project is clear in respect to other initiatives ' +
                    'so that resource prioritization decision can be easily made in case of bottlenecks',
                    user:req.user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: w131,
                    name: 'Cost/Benefits ownership agreed',
                    description:'The business costs and benefits value, timing, ownership and tracking have been agreed between stakeholders',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w132,
                    name: 'Clear requirements',
                    description:'There is a formal and approved set of clearly stated requirements',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w133,
                    name: 'Impacts on systems identified',
                    description:'Impacts on other systems and interfaces identified',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w134,
                    name: 'Impacts on processes and people identified',
                    description:'Impacts on business processes, organization and people has been identified',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w135,
                    name: 'Risk mitigation in place',
                    description:'Project, market and operational risks have been identified, evaluated, accepted and sufficiently mitigated',
                    user:req.user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: w141,
                    name: 'Business change validated',
                    description:'Changes to business processes, staff numbers/structure and training needs ' +
                    'are in formalized and validated by stakeholders',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w142,
                    name: 'Functional behaviour detailed',
                    description:'System functional behaviour is clear enough to commence technical and process designs',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w143,
                    name: 'Business case approved',
                    description:'Investment model, financial ratios and intangible benefits have been detailed and agreed',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w144,
                    name: 'Testing strategy agreed',
                    description:'Testing strategy has been formalized and agreed',
                    user:req.user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: w151,
                    name: 'Solution as built validated',
                    description:'Solution has been built as per design with variance to design documented and agreed',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w152,
                    name: 'Production changes approved',
                    description:'Changes have been placed into production based on formal approval',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w153,
                    name: 'User engagement in place',
                    description:'Users understand how changes to systems and processes will impact them, and where to go for support',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w154,
                    name: 'Maintenance and support implemented',
                    description:'Maintenance of new systems, processes or required updates in place',
                    user:req.user._id,
                    created: Date.now()
                },
                // ----
                {
                    _id: w161,
                    name: 'Post implementation review completed',
                    description:'Post implementation review completed',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w162,
                    name: 'Lessons learned captured',
                    description:'Lessons learned captured and embedded',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w163,
                    name: 'Benefits realization initiated',
                    description:'Business benefits realization and tracking initiated',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: w164,
                    name: 'Project formally closed',
                    description:'Project formally closed in management systems',
                    user:req.user._id,
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
