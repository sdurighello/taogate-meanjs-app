'use strict';

/**
 * SEED - REVIEW SETUP
 */

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');


// Review scores

var score1 = mongoose.Types.ObjectId();
var score2 = mongoose.Types.ObjectId();
var score3 = mongoose.Types.ObjectId();
var score4 = mongoose.Types.ObjectId();
var score5 = mongoose.Types.ObjectId();

exports.getReviewScores = function(req){
    return [
        {
            _id: score1,
            name: 'Not at all satisfied',
            description:'Not at all satisfied',
            numericalValue: 0,
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: score2,
            name: 'Slightly satisfied',
            description:'Slightly satisfied',
            numericalValue: 25,
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: score3,
            name: 'Moderately satisfied',
            description:'Moderately satisfied',
            numericalValue: 50,
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: score4,
            name: 'Very satisfied',
            description:'Very satisfied',
            numericalValue: 75,
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: score5,
            name: 'Extremely satisfied',
            description:'Extremely satisfied',
            numericalValue: 100,
            user:req.user._id,
            created: Date.now()
        }
    ];
};


// Project Review Types

var pReviewType1 = mongoose.Types.ObjectId();
var pReviewType2 = mongoose.Types.ObjectId();

exports.getReviewScores = function(req){
    return [
        {
            _id: pReviewType1,
            name: 'Post Implementation Review',
            description:'Stakeholder satisfaction survey to be run at end of project',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: pReviewType2,
            name: 'End of Stage Review',
            description:'Stakeholder satisfaction survey to be run at end of a stage',
            user:req.user._id,
            created: Date.now()
        }
    ];
};

// Project Review templates

