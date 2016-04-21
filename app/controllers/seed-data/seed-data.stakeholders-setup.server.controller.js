'use strict';

/**
 * SEED - STAKEHOLDER ANALYSIS SETUP
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

exports.seedStakeholders = function(user, callback){

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

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PeopleCategory');
            var seedArray =  [
                {
                    _id: id1,
                    name: 'Internal/External',
                    description:'Internal/External',
                    categoryValues: [id11, id12],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id2,
                    name: 'Soft systems taxonomy',
                    description:'Soft systems taxonomy',
                    categoryValues: [id21, id22, id23, id24],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id3,
                    name: 'Salience level',
                    description:'Salience level',
                    categoryValues: [id31, id32, id33, id34, id35, id36, id37, id38],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id4,
                    name: 'Power/Interest grid',
                    description:'Power/Interest grid',
                    categoryValues: [id41, id42, id43, id44],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id5,
                    name: 'PMI engagement level',
                    description:'PMI engagement level',
                    categoryValues: [id51, id52, id53, id54, id55],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id6,
                    name: 'OGC taxonomy',
                    description:'OGC taxonomy',
                    categoryValues: [id61, id62, id63, id64],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id7,
                    name: 'Engagement approach',
                    description:'Engagement approach',
                    categoryValues: [id71, id72, id73, id74, id75],
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PeopleCategory', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PeopleCategoryValue');
            var seedArray =  [
                {
                    _id: id11,
                    name: 'Internal',
                    description:'Internal',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id12,
                    name: 'External',
                    description:'External',
                    user:user._id,
                    created: Date.now()
                },
                // ---
                {
                    _id: id21,
                    name: 'Primary',
                    description:'People who actually use the system, the end-users',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id22,
                    name: 'Secondary',
                    description:'People who do not directly use the system, ' +
                    'but receive output from it or provide input to it',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id23,
                    name: 'Tertiary',
                    description:'People who do not fall in either of the first two categories ' +
                    'but who are directly affected by the success or failure of the system',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id24,
                    name: 'Facilitating',
                    description:'People involved with the design, development and maintenance of the system',
                    user:user._id,
                    created: Date.now()
                },
                // ---
                {
                    _id: id31,
                    name: 'Dormant',
                    description:'They have power but not urgency or legitimacy. ' +
                    'Thus the manager should be aware of them but there is no need to plan for their communication needs',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id32,
                    name: 'Discretionary',
                    description:'They are legitimate but have no power or urgency. ' +
                    'Their communications needs maybe in the form of actually asking for some details. ' +
                    'They may not need much attention',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id33,
                    name: 'Demanding',
                    description:'They are with urgency and their needs have to be met when asked for',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id34,
                    name: 'Dominant',
                    description:'Power and legitimacy overlap in this case. ' +
                    'Dominant stakeholders have legitimacy and authority. Their communication needs must be taken into account',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id35,
                    name: 'Dangerous',
                    description:'These stakeholders have the dangerous mix of power and urgency. ' +
                    'This combination of power and urgency, makes them very useful for the welfare of the project ' +
                    'therefore their needs must be met',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id36,
                    name: 'Dependent',
                    description:'They are legitimate and have the urgency but do not have commensurate power. ' +
                    'Keep them informed as they could be of help when you need to leverage their strengths ' +
                    'in navigating the organization complexities',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id37,
                    name: 'Definitive',
                    description:'Power and legitimacy converge and gets combined with ability to get urgency from the organization; ' +
                    'the most critical category of stakeholders which is always to be kept informed, satisfied and involved',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id38,
                    name: 'Non Stakeholders',
                    description:'Non stakeholders, ignore',
                    user:user._id,
                    created: Date.now()
                },
                // ---
                {
                    _id: id41,
                    name: 'Keep satisfied',
                    description:'High power, less interested people: put enough work in with these people to keep them satisfied, ' +
                    'but not so much that they become bored with your message',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id42,
                    name: 'Manage closely',
                    description:'High power, interested people: these are the people you must fully engage and make the greatest efforts to satisfy',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id43,
                    name: 'Monitor',
                    description:'Low power, less interested people: monitor these people, but do not bore them with excessive communication',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id44,
                    name: 'Keep informed',
                    description:'Low power, interested people: keep these people adequately informed, and talk to them to ensure that no major issues are arising. ' +
                    'These people can often be very helpful with the detail of your project',
                    user:user._id,
                    created: Date.now()
                },
                // ---
                {
                    _id: id51,
                    name: 'Unaware',
                    description:'Stakeholders who are unaware of the project or its potential benefits and impacts',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id52,
                    name: 'Resistant',
                    description:'Stakeholders that can seriously jeopardize the project. ' +
                    'Appropriate reward and recognition systems should be devised',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id53,
                    name: 'Neutral',
                    description:'Stakeholders that are aware of the project but are neither supportive nor resistant',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id54,
                    name: 'Supportive',
                    description:'Stakeholders that are aware of the Project and are supportive to changes. ' +
                    'This should be the desired engagement level of most stakeholders',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id55,
                    name: 'Leading',
                    description:'Stakeholders that are aware of the Project and its potential impacts ' +
                    'and are actively engaged in ensuring the success of the project',
                    user:user._id,
                    created: Date.now()
                },
                // ---
                {
                    _id: id61,
                    name: 'Users/beneficiaries',
                    description:'Users/beneficiaries',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id62,
                    name: 'Providers',
                    description:'Providers',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id63,
                    name: 'Governance',
                    description:'Governance',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id64,
                    name: 'Influencers',
                    description:'Influencers',
                    user:user._id,
                    created: Date.now()
                },
                // ---
                {
                    _id: id71,
                    name: 'Partnership',
                    description:'Partnership',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id72,
                    name: 'Participation',
                    description:'Participation',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id73,
                    name: 'Consultation',
                    description:'Consultation',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id74,
                    name: 'Push communication',
                    description:'Push communication',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: id75,
                    name: 'Pull communication',
                    description:'Pull communication',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PeopleCategoryValue', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
