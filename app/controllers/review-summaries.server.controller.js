'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

exports.projectReviews = function(req, res){

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    var ProjectReview = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReview');


    async.waterfall([
        // Get all 'completed' reviews of projects 'selected for evaluation'
        function(callback) {
            ProjectReview.find({'approval.currentRecord.approvalState':'completed'})
                .populate('project', 'identification selection parent portfolio')
                .populate('type')
                .deepPopulate([
                    'groups.items.peopleReviews.score', 'groups.items.peopleReviews.person',
                    'groups.items.peopleReviews.peopleGroup', 'groups.items.peopleReviews.peopleRole'
                ])
                .exec(function(err, reviews){
                    if(err){
                        return callback(err);
                    }
                    var filteredReviews = _.filter(reviews, function(review){
                        return review.project.selection.selectedForEvaluation === true;
                    });
                    callback(null, filteredReviews);
            });
        },
        // Create review profiles
        function(reviews, callback){
            var reviewProfiles = [];
            _.each(reviews, function(review){
                var profile = {
                    reviewId : review._id,
                    reviewName : review.name,
                    startDate : review.startDate,
                    endDate : review.endDate,
                    type : review.type,
                    template : review.template,
                    project : review.project,
                    groups : [],
                    weightedScore : 0
                };
                // Add qualitative analysis
                _.each(review.groups, function(groupObj){
                    var profileGroupObj = {
                        groupId : groupObj._id,
                        groupName : groupObj.name,
                        groupDescription : groupObj.description,
                        groupWeight : groupObj.weight,
                        sumItemScores : 0,
                        weightedScore : 0,
                        items : []
                    };
                    _.each(groupObj.items, function(itemObj){
                        var profileItemObj = {
                            itemId : itemObj._id,
                            itemName : itemObj.name,
                            itemDescription : itemObj.description,
                            itemWeight : itemObj.weight,
                            sumPeopleReviewScores : 0,
                            weightedScore : 0,
                            peopleReviews : []
                        };
                        _.each(itemObj.peopleReviews, function(peopleReviewObj){
                            var profilePeopleReviewObj = {
                                peopleReviewId : peopleReviewObj._id,
                                personName : peopleReviewObj.person.name,
                                personGroupName : peopleReviewObj.peopleGroup.name,
                                personRoleName : peopleReviewObj.peopleRole.name,
                                score : peopleReviewObj.score,
                                comment : peopleReviewObj.comment,
                                submitted : peopleReviewObj.submitted
                            };
                            profileItemObj.peopleReviews.push(profilePeopleReviewObj);
                        });

                        // Eliminate 'null' scores from the array
                        profileItemObj.peopleReviews = _.filter(profileItemObj.peopleReviews, function(review){
                            return review.score && review.score.numericalValue;
                        });

                        var tallyObject = _.chain(profileItemObj.peopleReviews)
                            .groupBy(function(review){
                                return review.score._id;
                            })
                            .map(function(v, k){
                                var sumNumericalValues = _.reduce(v, function(sum, item){
                                    return sum + item.score.numericalValue;
                                }, 0);
                                var count = _.reduce(v, function(sum, item){
                                    return sum + 1;
                                }, 0);
                                return {
                                    scoreId : k,
                                    sumNumericalValues : sumNumericalValues,
                                    count : count
                                };
                            })
                            .reduce(function(retObj, item){
                                retObj.totalValues = retObj.totalValues + item.sumNumericalValues;
                                retObj.totalCount = retObj.totalCount + item.count;
                                return retObj;
                            }, {totalValues : 0, totalCount : 0})
                            .value();

                        var calculateSumPeopleReviewScores = function(tallyObj){
                            if(tallyObj.totalCount !== 0){
                                return tallyObj.totalValues / tallyObj.totalCount;
                            } else {
                                return 0;
                            }
                        };
                        profileItemObj.sumPeopleReviewScores = calculateSumPeopleReviewScores(tallyObject);
                        profileItemObj.weightedScore = profileItemObj.sumPeopleReviewScores * (profileItemObj.itemWeight / 100);
                        profileGroupObj.items.push(profileItemObj);
                        profileGroupObj.sumItemScores = profileGroupObj.sumItemScores + profileItemObj.weightedScore;
                    });
                    profileGroupObj.weightedScore = profileGroupObj.sumItemScores * (profileGroupObj.groupWeight/100);
                    profile.groups.push(profileGroupObj);
                    profile.weightedScore = profile.weightedScore + profileGroupObj.weightedScore;
                });
                // Push the profile with all the data in the array to be returned
                reviewProfiles.push(profile);
            });

            callback(null, reviewProfiles);
        },
        // Reduce by project and by portfolio
        function(reviewProfiles, callback){
            var portfolioProfiles = _.chain(reviewProfiles)
                // create project profiles
                .groupBy(function(reviewProfile){
                    return reviewProfile.project._id;
                })
                .map(function(v, k){
                    var sumWeightedScore = _.reduce(v, function(sum, item){
                        return sum + item.weightedScore;
                    }, 0);
                    return {
                        project : v[0].project,
                        avgWeightedScore : sumWeightedScore / v.length,
                        // create type profiles
                        typeProfiles : _.chain(v)
                            .groupBy(function(profile){
                            return profile.type._id;
                        })
                        .map(function(v, k){
                            var sumWeightedScore = _.reduce(v, function(sum, item){
                                return sum + item.weightedScore;
                            }, 0);
                            return {
                                type : v[0].type,
                                avgWeightedScore : sumWeightedScore / v.length,
                                reviewProfiles : v
                            };
                        }).value()
                    };
                })
                // create portfolio profiles
                .groupBy(function(projectProfile){
                    if(projectProfile.project.portfolio){
                        return projectProfile.project.portfolio;
                    } else {
                        return 'null';
                    }
                })
                .map(function(v, k){
                    var sumWeightedScore = _.reduce(v, function(sum, item){
                        return sum + item.avgWeightedScore;
                    }, 0);
                    return {
                        portfolioId : k,
                        avgWeightedScore : sumWeightedScore / v.length,
                        projectProfiles : v
                    };
                })
                .value();

            callback(null, portfolioProfiles);
        }
    ], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(result);
            /* result = [ ]
             *  resultObj = { reviewId, reviewName, project, weightedScore, groups : [] }
             *      groupObj = { groupId, groupName, groupWeight, sumItemScores, weightedScore, items : [] }
             *          itemObj = {itemId, itemName, itemWeight, sumPeopleReviewScores, weightedScore, peopleReviews : [] }
             *              peopleReviewObj = {peopleReviewId, personName, score }
             */
        }
    });

};


exports.portfolioReviews = function(req, res){

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    var PortfolioReview = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReview');


    async.waterfall([
        // Get all 'completed' reviews of projects 'selected for evaluation'
        function(callback) {
            PortfolioReview.find({'approval.currentRecord.approvalState':'completed'})
                .populate('portfolio')
                .populate('type')
                .deepPopulate([
                    'groups.items.peopleReviews.score', 'groups.items.peopleReviews.person',
                    'groups.items.peopleReviews.peopleGroup', 'groups.items.peopleReviews.peopleRole'
                ])
                .exec(function(err, reviews){
                    if(err){
                        return callback(err);
                    }
                    callback(null, reviews);
                });
        },
        // Create review profiles
        function(reviews, callback){
            var reviewProfiles = [];
            _.each(reviews, function(review){
                var profile = {
                    reviewId : review._id,
                    reviewName : review.name,
                    startDate : review.startDate,
                    endDate : review.endDate,
                    type : review.type,
                    template : review.template,
                    portfolio : review.portfolio,
                    groups : [],
                    weightedScore : 0
                };
                // Add qualitative analysis
                _.each(review.groups, function(groupObj){
                    var profileGroupObj = {
                        groupId : groupObj._id,
                        groupName : groupObj.name,
                        groupDescription : groupObj.description,
                        groupWeight : groupObj.weight,
                        sumItemScores : 0,
                        weightedScore : 0,
                        items : []
                    };
                    _.each(groupObj.items, function(itemObj){
                        var profileItemObj = {
                            itemId : itemObj._id,
                            itemName : itemObj.name,
                            itemDescription : itemObj.description,
                            itemWeight : itemObj.weight,
                            sumPeopleReviewScores : 0,
                            weightedScore : 0,
                            peopleReviews : []
                        };
                        _.each(itemObj.peopleReviews, function(peopleReviewObj){
                            var profilePeopleReviewObj = {
                                peopleReviewId : peopleReviewObj._id,
                                personName : peopleReviewObj.person.name,
                                personGroupName : peopleReviewObj.peopleGroup.name,
                                personRoleName : peopleReviewObj.peopleRole.name,
                                score : peopleReviewObj.score,
                                comment : peopleReviewObj.comment,
                                submitted : peopleReviewObj.submitted
                            };
                            profileItemObj.peopleReviews.push(profilePeopleReviewObj);
                        });

                        // Eliminate 'null' scores from the array
                        profileItemObj.peopleReviews = _.filter(profileItemObj.peopleReviews, function(review){
                            return review.score && review.score.numericalValue;
                        });

                        var tallyObject = _.chain(profileItemObj.peopleReviews)
                            .groupBy(function(review){
                                return review.score._id;
                            })
                            .map(function(v, k){
                                var sumNumericalValues = _.reduce(v, function(sum, item){
                                    return sum + item.score.numericalValue;
                                }, 0);
                                var count = _.reduce(v, function(sum, item){
                                    return sum + 1;
                                }, 0);
                                return {
                                    scoreId : k,
                                    sumNumericalValues : sumNumericalValues,
                                    count : count
                                };
                            })
                            .reduce(function(retObj, item){
                                retObj.totalValues = retObj.totalValues + item.sumNumericalValues;
                                retObj.totalCount = retObj.totalCount + item.count;
                                return retObj;
                            }, {totalValues : 0, totalCount : 0})
                            .value();

                        var calculateSumPeopleReviewScores = function(tallyObj){
                            if(tallyObj.totalCount !== 0){
                                return tallyObj.totalValues / tallyObj.totalCount;
                            } else {
                                return 0;
                            }
                        };
                        profileItemObj.sumPeopleReviewScores = calculateSumPeopleReviewScores(tallyObject);
                        profileItemObj.weightedScore = profileItemObj.sumPeopleReviewScores * (profileItemObj.itemWeight / 100);
                        profileGroupObj.items.push(profileItemObj);
                        profileGroupObj.sumItemScores = profileGroupObj.sumItemScores + profileItemObj.weightedScore;
                    });
                    profileGroupObj.weightedScore = profileGroupObj.sumItemScores * (profileGroupObj.groupWeight/100);
                    profile.groups.push(profileGroupObj);
                    profile.weightedScore = profile.weightedScore + profileGroupObj.weightedScore;
                });
                // Push the profile with all the data in the array to be returned
                reviewProfiles.push(profile);
            });

            callback(null, reviewProfiles);
        },
        // Reduce by project and by portfolio
        function(reviewProfiles, callback){
            var portfolioProfiles = _.chain(reviewProfiles)
                // create project profiles
                .groupBy(function(reviewProfile){
                    return reviewProfile.portfolio._id;
                })
                .map(function(v, k){
                    var sumWeightedScore = _.reduce(v, function(sum, item){
                        return sum + item.weightedScore;
                    }, 0);
                    return {
                        portfolio : v[0].portfolio,
                        avgWeightedScore : sumWeightedScore / v.length,
                        // create type profiles
                        typeProfiles : _.chain(v)
                            .groupBy(function(profile){
                                return profile.type._id;
                            })
                            .map(function(v, k){
                                var sumWeightedScore = _.reduce(v, function(sum, item){
                                    return sum + item.weightedScore;
                                }, 0);
                                return {
                                    type : v[0].type,
                                    avgWeightedScore : sumWeightedScore / v.length,
                                    reviewProfiles : v
                                };
                            }).value()
                    };
                })
                .value();

            callback(null, portfolioProfiles);
        }
    ], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(result);
            /* result = [ ]
             *  resultObj = { reviewId, reviewName, project, weightedScore, groups : [] }
             *      groupObj = { groupId, groupName, groupWeight, sumItemScores, weightedScore, items : [] }
             *          itemObj = {itemId, itemName, itemWeight, sumPeopleReviewScores, weightedScore, peopleReviews : [] }
             *              peopleReviewObj = {peopleReviewId, personName, score }
             */
        }
    });

};



/**
 * Authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

    next();
};
