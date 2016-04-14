'use strict';

/**
 * SEED - STAKEHOLDER ANALYSIS SETUP
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');


// Internal/External
var id1 = mongoose.Types.ObjectId();

var id11 = mongoose.Types.ObjectId(); // External
var id12 = mongoose.Types.ObjectId(); // Internal

// Soft systems taxonomy
var id2 = mongoose.Types.ObjectId();

var id21 = mongoose.Types.ObjectId(); // Primary
var id22 = mongoose.Types.ObjectId(); // Secondary
var id23 = mongoose.Types.ObjectId(); // Tertiary
var id24 = mongoose.Types.ObjectId(); // Facilitating

// Salience level
var id3 = mongoose.Types.ObjectId();

var id31 = mongoose.Types.ObjectId(); // Dormant
var id32 = mongoose.Types.ObjectId(); // Discretionary
var id33 = mongoose.Types.ObjectId(); // Demanding
var id34 = mongoose.Types.ObjectId(); // Dominant
var id35 = mongoose.Types.ObjectId(); // Dangerous
var id36 = mongoose.Types.ObjectId(); // Dependent
var id37 = mongoose.Types.ObjectId(); // Definitive
var id38 = mongoose.Types.ObjectId(); // NonStakeholder

// Power/Interest grid
var id4 = mongoose.Types.ObjectId();

var id41 = mongoose.Types.ObjectId(); // Keep satisfied
var id42 = mongoose.Types.ObjectId(); // Manage closely
var id43 = mongoose.Types.ObjectId(); // Monitor
var id44 = mongoose.Types.ObjectId(); // Keep informed


// PMI engagement level
var id5 = mongoose.Types.ObjectId();

var id51 = mongoose.Types.ObjectId(); // Unaware
var id52 = mongoose.Types.ObjectId(); // Resistant
var id53 = mongoose.Types.ObjectId(); // Neutral
var id54 = mongoose.Types.ObjectId(); // Supportive
var id55 = mongoose.Types.ObjectId(); // Leading

// OGC taxonomy
var id6 = mongoose.Types.ObjectId();

var id61 = mongoose.Types.ObjectId(); // Users/Beneficiaries
var id62 = mongoose.Types.ObjectId(); // Providers
var id63 = mongoose.Types.ObjectId(); // Governance
var id64 = mongoose.Types.ObjectId(); // Influencers

// Engagement approach
var id7 = mongoose.Types.ObjectId();

var id71 = mongoose.Types.ObjectId(); // Partnership
var id72 = mongoose.Types.ObjectId(); // Participation
var id73 = mongoose.Types.ObjectId(); // Consultation
var id74 = mongoose.Types.ObjectId(); // Push communication
var id75 = mongoose.Types.ObjectId(); // Pull communication


exports.getPeopleCategories = function(req){
    return [
        {
            _id: id1,
            name: 'Internal/External',
            description:'Internal/External',
            categoryValues: [id11, id12],
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id2,
            name: 'Soft systems taxonomy',
            description:'Soft systems taxonomy',
            categoryValues: [id21, id22, id23, id24],
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id3,
            name: 'Salience level',
            description:'Salience level',
            categoryValues: [id31, id32, id33, id34, id35, id36, id37, id38],
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id4,
            name: 'Power/Interest grid',
            description:'Power/Interest grid',
            categoryValues: [id41, id42, id43, id44],
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id5,
            name: 'PMI engagement level',
            description:'PMI engagement level',
            categoryValues: [id51, id52, id53, id54, id55],
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id6,
            name: 'OGC taxonomy',
            description:'OGC taxonomy',
            categoryValues: [id61, id62, id63, id64],
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id7,
            name: 'Engagement approach',
            description:'Engagement approach',
            categoryValues: [id71, id72, id73, id74, id75],
            user:req.user._id,
            created: Date.now()
        }
    ];
};



exports.getPeopleCategoryValues = function(req){
    return [
        {
            _id: id11,
            name: 'Internal',
            description:'Internal',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id12,
            name: 'External',
            description:'External',
            user:req.user._id,
            created: Date.now()
        },
        // ---
        {
            _id: id21,
            name: 'Primary',
            description:'People who actually use the system, the end-users',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id22,
            name: 'Secondary',
            description:'People who do not directly use the system, ' +
            'but receive output from it or provide input to it',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id23,
            name: 'Tertiary',
            description:'People who do not fall in either of the first two categories ' +
            'but who are directly affected by the success or failure of the system',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id24,
            name: 'Facilitating',
            description:'People involved with the design, development and maintenance of the system',
            user:req.user._id,
            created: Date.now()
        },
        // ---
        {
            _id: id31,
            name: 'Dormant',
            description:'They have power but not urgency or legitimacy. ' +
            'Thus the manager should be aware of them but there is no need to plan for their communication needs',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id32,
            name: 'Discretionary',
            description:'They are legitimate but have no power or urgency. ' +
            'Their communications needs maybe in the form of actually asking for some details. ' +
            'They may not need much attention',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id33,
            name: 'Demanding',
            description:'They are with urgency and their needs have to be met when asked for',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id34,
            name: 'Dominant',
            description:'Power and legitimacy overlap in this case. ' +
            'Dominant stakeholders have legitimacy and authority. Their communication needs must be taken into account',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id35,
            name: 'Dangerous',
            description:'These stakeholders have the dangerous mix of power and urgency. ' +
            'This combination of power and urgency, makes them very useful for the welfare of the project ' +
            'therefore their needs must be met',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id36,
            name: 'Dependent',
            description:'They are legitimate and have the urgency but do not have commensurate power. ' +
            'Keep them informed as they could be of help when you need to leverage their strengths ' +
            'in navigating the organization complexities',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id37,
            name: 'Definitive',
            description:'Power and legitimacy converge and gets combined with ability to get urgency from the organization; ' +
            'the most critical category of stakeholders which is always to be kept informed, satisfied and involved',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id38,
            name: 'Non Stakeholders',
            description:'Non stakeholders, ignore',
            user:req.user._id,
            created: Date.now()
        },
        // ---
        {
            _id: id41,
            name: 'Keep satisfied',
            description:'High power, less interested people: put enough work in with these people to keep them satisfied, ' +
            'but not so much that they become bored with your message',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id42,
            name: 'Manage closely',
            description:'High power, interested people: these are the people you must fully engage and make the greatest efforts to satisfy',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id43,
            name: 'Monitor',
            description:'Low power, less interested people: monitor these people, but do not bore them with excessive communication',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id44,
            name: 'Keep informed',
            description:'Low power, interested people: keep these people adequately informed, and talk to them to ensure that no major issues are arising. ' +
            'These people can often be very helpful with the detail of your project',
            user:req.user._id,
            created: Date.now()
        },
        // ---
        {
            _id: id51,
            name: 'Unaware',
            description:'Stakeholders who are unaware of the project or its potential benefits and impacts',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id52,
            name: 'Resistant',
            description:'Stakeholders that can seriously jeopardize the project. ' +
            'Appropriate reward and recognition systems should be devised',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id53,
            name: 'Neutral',
            description:'Stakeholders that are aware of the project but are neither supportive nor resistant',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id54,
            name: 'Supportive',
            description:'Stakeholders that are aware of the Project and are supportive to changes. ' +
            'This should be the desired engagement level of most stakeholders',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id55,
            name: 'Leading',
            description:'Stakeholders that are aware of the Project and its potential impacts ' +
            'and are actively engaged in ensuring the success of the project',
            user:req.user._id,
            created: Date.now()
        },
        // ---
        {
            _id: id61,
            name: 'Users/beneficiaries',
            description:'Users/beneficiaries',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id62,
            name: 'Providers',
            description:'Providers',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id63,
            name: 'Governance',
            description:'Governance',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id64,
            name: 'Influencers',
            description:'Influencers',
            user:req.user._id,
            created: Date.now()
        },
        // ---
        {
            _id: id71,
            name: 'Partnership',
            description:'Partnership',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id72,
            name: 'Participation',
            description:'Participation',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id73,
            name: 'Consultation',
            description:'Consultation',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id74,
            name: 'Push communication',
            description:'Push communication',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: id75,
            name: 'Pull communication',
            description:'Pull communication',
            user:req.user._id,
            created: Date.now()
        }
    ];
};
