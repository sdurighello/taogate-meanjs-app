'use strict';

/**
 * SEED - CATEGORY SETUP
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

exports.seedCategories = function(user, callback){

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


    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'CategoryGroup');
            var seedArray =  [
                {
                    _id: cat1,
                    name: 'Organizational area',
                    description:'Organizational areas',
                    categories: [cat11, cat12, cat13, cat14],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat2,
                    name: 'Implementation experience',
                    description:'Implementation experience',
                    categories: [cat21, cat22, cat23],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat3,
                    name: 'Type of change',
                    description:'Type of change',
                    categories: [cat31, cat32],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat4,
                    name: 'Type of implementation',
                    description:'Type of implementation',
                    categories: [cat41, cat42, cat43],
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'CategoryGroup', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'Category');
            var seedArray =  [
                {
                    _id: cat11,
                    name: 'Strategic Business Unit',
                    description:'Strategic Business Unit',
                    categoryValues: [cat111, cat112, cat113],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat12,
                    name: 'Product',
                    description:'Product',
                    categoryValues: [cat121, cat122, cat123],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat13,
                    name: 'Market',
                    description:'Market',
                    categoryValues: [cat131, cat132, cat133],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat14,
                    name: 'Geography',
                    description:'Geography',
                    categoryValues: [cat141, cat142, cat143],
                    user:user._id,
                    created: Date.now()
                },
                // Implementation experience
                {
                    _id: cat21,
                    name: 'Business novelty',
                    description:'Business novelty',
                    categoryValues: [cat211, cat212, cat213],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat22,
                    name: 'Technology novelty',
                    description:'Technology novelty',
                    categoryValues: [cat221, cat222, cat223],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat23,
                    name: 'Ease of implementation',
                    description:'Ease of implementation',
                    categoryValues: [cat231, cat232, cat233],
                    user:user._id,
                    created: Date.now()
                },
                // Type of change
                {
                    _id: cat31,
                    name: 'Technology change',
                    description:'Technology change',
                    categoryValues: [cat311, cat312, cat313],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat32,
                    name: 'Business change',
                    description:'Business change',
                    categoryValues: [cat321, cat322, cat323, cat324],
                    user:user._id,
                    created: Date.now()
                },
                // Type of implementation
                {
                    _id: cat41,
                    name: 'Delivery process',
                    description:'Delivery process',
                    categoryValues: [cat411, cat412, cat413],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat42,
                    name: 'Effort size',
                    description:'Effort size',
                    categoryValues: [cat421, cat422, cat423],
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat43,
                    name: 'Technology type',
                    description:'Technology type',
                    categoryValues: [cat431, cat432, cat433, cat434],
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'Category', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'CategoryValue');
            var seedArray =  [
                // Strategic Business Unit
                {
                    _id: cat111,
                    name: 'SBU 1',
                    description:'SBU 1',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat112,
                    name: 'SBU 2',
                    description:'SBU 2',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat113,
                    name: 'SBU 3',
                    description:'SBU 3',
                    user:user._id,
                    created: Date.now()
                },
                // Product
                {
                    _id: cat121,
                    name: 'Product A',
                    description:'Product A',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat122,
                    name: 'Product B',
                    description:'Product B',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat123,
                    name: 'Product C',
                    description:'Product C',
                    user:user._id,
                    created: Date.now()
                },
                // Market
                {
                    _id: cat131,
                    name: 'Market A',
                    description:'Market A',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat132,
                    name: 'Market B',
                    description:'Market B',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat133,
                    name: 'Market C',
                    description:'Market C',
                    user:user._id,
                    created: Date.now()
                },
                // Geography
                {
                    _id: cat141,
                    name: 'Americas',
                    description:'Americas',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat142,
                    name: 'EMEA',
                    description:'EMEA',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat143,
                    name: 'APAC',
                    description:'APAC',
                    user:user._id,
                    created: Date.now()
                },
                // Business novelty
                {
                    _id: cat211,
                    name: 'Low',
                    description:'Low',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat212,
                    name: 'Medium',
                    description:'Medium',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat213,
                    name: 'High',
                    description:'High',
                    user:user._id,
                    created: Date.now()
                },
                // Technology novelty
                {
                    _id: cat221,
                    name: 'Low',
                    description:'Low',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat222,
                    name: 'Medium',
                    description:'Medium',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat223,
                    name: 'High',
                    description:'High',
                    user:user._id,
                    created: Date.now()
                },
                // Ease of implementation
                {
                    _id: cat231,
                    name: 'Low',
                    description:'Low',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat232,
                    name: 'Medium',
                    description:'Medium',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat233,
                    name: 'High',
                    description:'High',
                    user:user._id,
                    created: Date.now()
                },
                // Technology change
                {
                    _id: cat311,
                    name: 'Upgrade',
                    description:'Upgrade',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat312,
                    name: 'Change existing system',
                    description:'Change existing system',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat313,
                    name: 'New system implementation',
                    description:'New system implementation',
                    user:user._id,
                    created: Date.now()
                },
                // Business change
                {
                    _id: cat321,
                    name: 'Continuous improvement',
                    description:'Continuous improvement',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat322,
                    name: 'Business innovation',
                    description:'Business innovation',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat323,
                    name: 'Automation',
                    description:'Automation',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat324,
                    name: 'Regulatory',
                    description:'Regulatory',
                    user:user._id,
                    created: Date.now()
                },
                // Delivery process
                {
                    _id: cat411,
                    name: 'Waterfall',
                    description:'Waterfall',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat412,
                    name: 'Agile',
                    description:'Agile',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat413,
                    name: 'Mix',
                    description:'Mix',
                    user:user._id,
                    created: Date.now()
                },
                // Effort size
                {
                    _id: cat421,
                    name: 'Small',
                    description:'Small',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat422,
                    name: 'Medium',
                    description:'Medium',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat423,
                    name: 'Large',
                    description:'Large',
                    user:user._id,
                    created: Date.now()
                },
                // Technology type
                {
                    _id: cat431,
                    name: 'Infrastructure',
                    description:'Infrastructure',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat432,
                    name: 'Bespoke system',
                    description:'Bespoke system',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat433,
                    name: 'Packaged systems',
                    description:'Packaged systems',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: cat434,
                    name: 'Cloud based',
                    description:'Cloud based',
                    user:user._id,
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
