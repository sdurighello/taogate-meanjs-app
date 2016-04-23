'use strict';

/**
 * SEED - REVIEW SCORES SETUP
 */

var _ = require('lodash'),
    errorHandler = require('../../errors.server.controller.js'),
    mongoose = require('mongoose'),
    async = require('async'),
    seedIDs = require('./../seed-data.ids.server.controller.js').getIDs(),
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

exports.seedReviewScores = function(user, callback){
    
    // Review scores

    var score1 = seedIDs.ProjectReviewScore.reviewScore1;
    var score2 = seedIDs.ProjectReviewScore.reviewScore2;
    var score3 = seedIDs.ProjectReviewScore.reviewScore3;
    var score4 = seedIDs.ProjectReviewScore.reviewScore4;
    var score5 = seedIDs.ProjectReviewScore.reviewScore5;
    
    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'ProjectReviewScore');
            var seedArray =  [
                {
                    _id: score1,
                    name: 'Not at all satisfied',
                    description:'Not at all satisfied',
                    numericalValue: 0,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: score2,
                    name: 'Slightly satisfied',
                    description:'Slightly satisfied',
                    numericalValue: 25,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: score3,
                    name: 'Moderately satisfied',
                    description:'Moderately satisfied',
                    numericalValue: 50,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: score4,
                    name: 'Very satisfied',
                    description:'Very satisfied',
                    numericalValue: 75,
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: score5,
                    name: 'Extremely satisfied',
                    description:'Extremely satisfied',
                    numericalValue: 100,
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'ProjectReviewScore', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
