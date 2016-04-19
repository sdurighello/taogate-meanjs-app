'use strict';

/**
 * SEED - CATEGORY SETUP
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

exports.seedCategories = function(req, callback){

    // ------ Organizational area ------

    var cat1 = mongoose.Types.ObjectId();

// Strategic Business Unit
    var cat11 = mongoose.Types.ObjectId();

    var cat111 = mongoose.Types.ObjectId(); // SBU1
    var cat112 = mongoose.Types.ObjectId(); // SBU 2
    var cat113 = mongoose.Types.ObjectId(); // SBU 3

// Product
    var cat12 = mongoose.Types.ObjectId();

    var cat121 = mongoose.Types.ObjectId(); // Product A
    var cat122 = mongoose.Types.ObjectId(); // Product B
    var cat123 = mongoose.Types.ObjectId(); // Product C

// Market
    var cat13 = mongoose.Types.ObjectId();

    var cat131 = mongoose.Types.ObjectId(); // Market A
    var cat132 = mongoose.Types.ObjectId(); // Market B
    var cat133 = mongoose.Types.ObjectId(); // Market C

// Geography
    var cat14 = mongoose.Types.ObjectId();

    var cat141 = mongoose.Types.ObjectId(); // Americas
    var cat142 = mongoose.Types.ObjectId(); // EMEA
    var cat143 = mongoose.Types.ObjectId(); // APAC


// ------ Implementation experience ------

    var cat2 = mongoose.Types.ObjectId();

// Business novelty
    var cat21 = mongoose.Types.ObjectId();

    var cat211 = mongoose.Types.ObjectId(); // Low
    var cat212 = mongoose.Types.ObjectId(); // Medium
    var cat213 = mongoose.Types.ObjectId(); // High

// Technology novelty
    var cat22 = mongoose.Types.ObjectId();

    var cat221 = mongoose.Types.ObjectId(); // Low
    var cat222 = mongoose.Types.ObjectId(); // Medium
    var cat223 = mongoose.Types.ObjectId(); // High

// Ease of implementation
    var cat23 = mongoose.Types.ObjectId();

    var cat231 = mongoose.Types.ObjectId(); // Low
    var cat232 = mongoose.Types.ObjectId(); // Medium
    var cat233 = mongoose.Types.ObjectId(); // High


// ------ Type of change ------

    var cat3 = mongoose.Types.ObjectId();

// Technology change
    var cat31 = mongoose.Types.ObjectId();

    var cat311 = mongoose.Types.ObjectId(); // Upgrade
    var cat312 = mongoose.Types.ObjectId(); // Change existing system
    var cat313 = mongoose.Types.ObjectId(); // New system implementation

// Business change
    var cat32 = mongoose.Types.ObjectId();

    var cat321 = mongoose.Types.ObjectId(); // Continuous improvement
    var cat322 = mongoose.Types.ObjectId(); // Business innovation
    var cat323 = mongoose.Types.ObjectId(); // Automation
    var cat324 = mongoose.Types.ObjectId(); // Regulatory


// ------ Type of implementation ------

    var cat4 = mongoose.Types.ObjectId();

// Delivery process
    var cat41 = mongoose.Types.ObjectId();

    var cat411 = mongoose.Types.ObjectId(); // Waterfall
    var cat412 = mongoose.Types.ObjectId(); // Agile
    var cat413 = mongoose.Types.ObjectId(); // Mix

// Effort size
    var cat42 = mongoose.Types.ObjectId();

    var cat421 = mongoose.Types.ObjectId(); // Small
    var cat422 = mongoose.Types.ObjectId(); // Medium
    var cat423 = mongoose.Types.ObjectId(); // Large

// Technology type
    var cat43 = mongoose.Types.ObjectId();

    var cat431 = mongoose.Types.ObjectId(); // Infrastructure
    var cat432 = mongoose.Types.ObjectId(); // Bespoke software
    var cat433 = mongoose.Types.ObjectId(); // Packaged systems
    var cat434 = mongoose.Types.ObjectId(); // Cloud based


    async.series([
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
            var seedArray =  [
                {
                    _id: cat1,
                    name: 'Organizational area',
                    description:'Organizational areas',
                    categories: [cat11, cat12, cat13, cat14],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat2,
                    name: 'Implementation experience',
                    description:'Implementation experience',
                    categories: [cat21, cat22, cat23],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat3,
                    name: 'Type of change',
                    description:'Type of change',
                    categories: [cat31, cat32],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat4,
                    name: 'Type of implementation',
                    description:'Type of implementation',
                    categories: [cat41, cat42, cat43],
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'CategoryGroup', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
            var seedArray =  [
                {
                    _id: cat11,
                    name: 'Strategic Business Unit',
                    description:'Strategic Business Unit',
                    categoryValues: [cat111, cat112, cat113],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat12,
                    name: 'Product',
                    description:'Product',
                    categoryValues: [cat121, cat122, cat123],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat13,
                    name: 'Market',
                    description:'Market',
                    categoryValues: [cat131, cat132, cat133],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat14,
                    name: 'Geography',
                    description:'Geography',
                    categoryValues: [cat141, cat142, cat143],
                    user:req.user._id,
                    created: Date.now()
                },
                // Implementation experience
                {
                    _id: cat21,
                    name: 'Business novelty',
                    description:'Business novelty',
                    categoryValues: [cat211, cat212, cat213],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat22,
                    name: 'Technology novelty',
                    description:'Technology novelty',
                    categoryValues: [cat221, cat222, cat223],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat23,
                    name: 'Ease of implementation',
                    description:'Ease of implementation',
                    categoryValues: [cat231, cat232, cat233],
                    user:req.user._id,
                    created: Date.now()
                },
                // Type of change
                {
                    _id: cat31,
                    name: 'Technology change',
                    description:'Technology change',
                    categoryValues: [cat311, cat312, cat313],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat32,
                    name: 'Business change',
                    description:'Business change',
                    categoryValues: [cat321, cat322, cat323, cat324],
                    user:req.user._id,
                    created: Date.now()
                },
                // Type of implementation
                {
                    _id: cat41,
                    name: 'Delivery process',
                    description:'Delivery process',
                    categoryValues: [cat411, cat412, cat413],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat42,
                    name: 'Effort size',
                    description:'Effort size',
                    categoryValues: [cat421, cat422, cat423],
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat43,
                    name: 'Technology type',
                    description:'Technology type',
                    categoryValues: [cat431, cat432, cat433, cat434],
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'Category', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryValue');
            var seedArray =  [
                // Strategic Business Unit
                {
                    _id: cat111,
                    name: 'SBU 1',
                    description:'SBU 1',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat112,
                    name: 'SBU 2',
                    description:'SBU 2',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat113,
                    name: 'SBU 3',
                    description:'SBU 3',
                    user:req.user._id,
                    created: Date.now()
                },
                // Product
                {
                    _id: cat121,
                    name: 'Product A',
                    description:'Product A',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat122,
                    name: 'Product B',
                    description:'Product B',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat123,
                    name: 'Product C',
                    description:'Product C',
                    user:req.user._id,
                    created: Date.now()
                },
                // Market
                {
                    _id: cat131,
                    name: 'Market A',
                    description:'Market A',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat132,
                    name: 'Market B',
                    description:'Market B',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat133,
                    name: 'Market C',
                    description:'Market C',
                    user:req.user._id,
                    created: Date.now()
                },
                // Geography
                {
                    _id: cat141,
                    name: 'Americas',
                    description:'Americas',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat142,
                    name: 'EMEA',
                    description:'EMEA',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat143,
                    name: 'APAC',
                    description:'APAC',
                    user:req.user._id,
                    created: Date.now()
                },
                // Business novelty
                {
                    _id: cat211,
                    name: 'Low',
                    description:'Low',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat212,
                    name: 'Medium',
                    description:'Medium',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat213,
                    name: 'High',
                    description:'High',
                    user:req.user._id,
                    created: Date.now()
                },
                // Technology novelty
                {
                    _id: cat221,
                    name: 'Low',
                    description:'Low',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat222,
                    name: 'Medium',
                    description:'Medium',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat223,
                    name: 'High',
                    description:'High',
                    user:req.user._id,
                    created: Date.now()
                },
                // Ease of implementation
                {
                    _id: cat231,
                    name: 'Low',
                    description:'Low',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat232,
                    name: 'Medium',
                    description:'Medium',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat233,
                    name: 'High',
                    description:'High',
                    user:req.user._id,
                    created: Date.now()
                },
                // Technology change
                {
                    _id: cat311,
                    name: 'Upgrade',
                    description:'Upgrade',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat312,
                    name: 'Change existing system',
                    description:'Change existing system',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat313,
                    name: 'New system implementation',
                    description:'New system implementation',
                    user:req.user._id,
                    created: Date.now()
                },
                // Business change
                {
                    _id: cat321,
                    name: 'Continuous improvement',
                    description:'Continuous improvement',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat322,
                    name: 'Business innovation',
                    description:'Business innovation',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat323,
                    name: 'Automation',
                    description:'Automation',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat324,
                    name: 'Regulatory',
                    description:'Regulatory',
                    user:req.user._id,
                    created: Date.now()
                },
                // Delivery process
                {
                    _id: cat411,
                    name: 'Waterfall',
                    description:'Waterfall',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat412,
                    name: 'Agile',
                    description:'Agile',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat413,
                    name: 'Mix',
                    description:'Mix',
                    user:req.user._id,
                    created: Date.now()
                },
                // Effort size
                {
                    _id: cat421,
                    name: 'Small',
                    description:'Small',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat422,
                    name: 'Medium',
                    description:'Medium',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat423,
                    name: 'Large',
                    description:'Large',
                    user:req.user._id,
                    created: Date.now()
                },
                // Technology type
                {
                    _id: cat431,
                    name: 'Infrastructure',
                    description:'Infrastructure',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat432,
                    name: 'Bespoke system',
                    description:'Bespoke system',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat433,
                    name: 'Packaged systems',
                    description:'Packaged systems',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: cat434,
                    name: 'Cloud based',
                    description:'Cloud based',
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'CategoryValue', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
