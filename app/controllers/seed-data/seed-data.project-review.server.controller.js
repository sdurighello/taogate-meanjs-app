'use strict';

/**
 * SEED - PROJECT REVIEW SETUP
 */

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');


// Project Review Types

var pReviewType1 = mongoose.Types.ObjectId();
var pReviewType2 = mongoose.Types.ObjectId();

exports.getProjectReviewTypes = function(req){
    return [
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
};

// Project Review templates

var pReviewTemp1 = mongoose.Types.ObjectId();
var pReviewTemp2 = mongoose.Types.ObjectId();

exports.getProjectReviewTemplates = function(req){
    return [
        {
            _id: pReviewTemp1,
            user:req.user._id,
            created: Date.now(),
            name: 'Post Implementation Review',
            description:'Post Implementation Review',
            type: pReviewType1,
            groups:[
                {
                    name:'Scope management',
                    user:req.user._id,
                    created: Date.now(),
                    description:'How well was the scope identified',
                    weight: 20,
                    peopleGroups: [],
                    items :[
                        {
                            name:'How well were main requirements and edge cases identified early on?',
                            user:req.user._id,
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
            user:req.user._id,
            created: Date.now(),
            name: 'Project healthcheck',
            description:'Assessment of project health in regards to application of best practices and fit for purpose governance setup',
            type: pReviewType2,
            groups:[
                {
                    name:'Benefit management',
                    user:req.user._id,
                    created: Date.now(),
                    description:'Evaluation of benefit management adoption by the project',
                    weight: 20,
                    peopleGroups: [],
                    items :[
                        {
                            name:'How well is benefit management implemented?',
                            user:req.user._id,
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
};
