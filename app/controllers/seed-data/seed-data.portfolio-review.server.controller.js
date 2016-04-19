'use strict';

/**
 * SEED - PORTFOLIO REVIEW SETUP
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

exports.seedPortfolioReviews = function(req, callback){

    // Project Review Types

    var pReviewType1 = mongoose.Types.ObjectId();
    var pReviewType2 = mongoose.Types.ObjectId();

    // Project Review templates

    var pReviewTemp1 = mongoose.Types.ObjectId();
    var pReviewTemp2 = mongoose.Types.ObjectId();

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReviewType');
            var seedArray =  [
                {
                    _id: pReviewType1,
                    name: 'Stakeholders survey',
                    description:'Stakeholder satisfaction surveys',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: pReviewType2,
                    name: 'Governance review',
                    description:'Process effectiveness evaluations',
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PortfolioReviewType', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReviewTemplate');
            var seedArray =  [
                {
                    _id: pReviewTemp1,
                    user:req.user._id,
                    created: Date.now(),
                    name: 'Quarterly portfolio assessment',
                    description:'Quarterly portfolio assessment',
                    type: pReviewType1,
                    groups:[
                        {
                            name:'Strategic alignment',
                            user:req.user._id,
                            created: Date.now(),
                            description:'Projects should be all aligned to the business strategy',
                            weight: 20,
                            peopleGroups: [],
                            items :[
                                {
                                    name:'How well is the portfolio activity aligned to the business strategy?',
                                    user:req.user._id,
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
                    user:req.user._id,
                    created: Date.now(),
                    name: 'Annual IT Audit',
                    description:'Audit portfolio assessment',
                    type: pReviewType2,
                    groups:[
                        {
                            name:'IT controls',
                            user:req.user._id,
                            created: Date.now(),
                            description:'Cobit controls implementation',
                            weight: 20,
                            peopleGroups: [],
                            items :[
                                {
                                    name:'How well is change managed?',
                                    user:req.user._id,
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
