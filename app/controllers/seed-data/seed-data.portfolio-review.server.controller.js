'use strict';

/**
 * SEED - PORTFOLIO REVIEW SETUP
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

exports.seedPortfolioReviews = function(user, callback){

    // Portfolio Review Types

    var pReviewType1 = seedIDs.PortfolioReviewType.pReviewType1;
    var pReviewType2 = seedIDs.PortfolioReviewType.pReviewType2;

    // Portfolio Review templates

    var pReviewTemp1 = seedIDs.PortfolioReviewTemplate.pReviewTemp1;
    var pReviewTemp2 = seedIDs.PortfolioReviewTemplate.pReviewTemp2;

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PortfolioReviewType');
            var seedArray =  [
                {
                    _id: pReviewType1,
                    name: 'Stakeholders survey',
                    description:'Stakeholder satisfaction surveys',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: pReviewType2,
                    name: 'Governance review',
                    description:'Process effectiveness evaluations',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PortfolioReviewType', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PortfolioReviewTemplate');
            var seedArray =  [
                {
                    _id: pReviewTemp1,
                    user:user._id,
                    created: Date.now(),
                    name: 'Quarterly portfolio assessment',
                    description:'Quarterly portfolio assessment',
                    type: pReviewType1,
                    groups:[
                        {
                            name:'Strategic alignment',
                            user:user._id,
                            created: Date.now(),
                            description:'Projects should be all aligned to the business strategy',
                            weight: 20,
                            peopleGroups: [],
                            items :[
                                {
                                    name:'How well is the portfolio activity aligned to the business strategy?',
                                    user:user._id,
                                    created: Date.now(),
                                    description:'Each project should be clearly assigned to a strategic theme',
                                    weight: 20,
                                    peopleReviews: []
                                }
                            ]
                        }
                    ]
                },
                {
                    _id: pReviewTemp2,
                    user:user._id,
                    created: Date.now(),
                    name: 'Annual IT Audit',
                    description:'Audit portfolio assessment',
                    type: pReviewType2,
                    groups:[
                        {
                            name:'IT controls',
                            user:user._id,
                            created: Date.now(),
                            description:'Cobit controls implementation',
                            weight: 20,
                            peopleGroups: [],
                            items :[
                                {
                                    name:'How well is change managed?',
                                    user:user._id,
                                    created: Date.now(),
                                    description:'An authorization process for changes should be in place',
                                    weight: 20,
                                    peopleReviews: []
                                }
                            ]
                        }
                    ]
                }
            ];
            createObjects(schema, 'PortfolioReviewTemplate', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
