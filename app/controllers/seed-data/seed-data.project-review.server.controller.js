'use strict';

/**
 * SEED - PROJECT REVIEW SETUP
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

exports.seedProjectReviews = function(user, callback){

    // Project Review Types

    var pReviewType1 = mongoose.Types.ObjectId();
    var pReviewType2 = mongoose.Types.ObjectId();

    // Project Review templates

    var pReviewTemp1 = mongoose.Types.ObjectId();
    var pReviewTemp2 = mongoose.Types.ObjectId();

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'ProjectReviewType');
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
            createObjects(schema, 'ProjectReviewType', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'ProjectReviewTemplate');
            var seedArray =  [
                {
                    _id: pReviewTemp1,
                    user:user._id,
                    created: Date.now(),
                    name: 'Post Implementation Review',
                    description:'Post Implementation Review',
                    type: pReviewType1,
                    groups:[
                        {
                            name:'Scope management',
                            user:user._id,
                            created: Date.now(),
                            description:'How well was the scope identified',
                            weight: 20,
                            peopleGroups: [],
                            items :[
                                {
                                    name:'How well were main requirements and edge cases identified early on?',
                                    user:user._id,
                                    created: Date.now(),
                                    description:'Requirements should have been collected in a structured manner by allowing stakeholders to productively brainstorm',
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
                    name: 'Project healthcheck',
                    description:'Assessment of project health in regards to application of best practices and fit for purpose governance setup',
                    type: pReviewType2,
                    groups:[
                        {
                            name:'Benefit management',
                            user:user._id,
                            created: Date.now(),
                            description:'Evaluation of benefit management adoption by the project',
                            weight: 20,
                            peopleGroups: [],
                            items :[
                                {
                                    name:'How well is benefit management implemented?',
                                    user:user._id,
                                    created: Date.now(),
                                    description:'A value tree should be present and a tracking process should be agreed with business management',
                                    weight: 20,
                                    peopleReviews: []
                                }
                            ]
                        }
                    ]
                }
            ];
            createObjects(schema, 'ProjectReviewTemplate', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
