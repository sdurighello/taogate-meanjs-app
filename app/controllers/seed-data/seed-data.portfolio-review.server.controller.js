'use strict';

/**
 * SEED - PORTFOLIO REVIEW SETUP
 */

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');


// Project Review Types

var pReviewType1 = mongoose.Types.ObjectId();
var pReviewType2 = mongoose.Types.ObjectId();

exports.getPortfolioReviewTypes = function(req){
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

exports.getPortfolioReviewTemplates = function(req){
    return [
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
};
