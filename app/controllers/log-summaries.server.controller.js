'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    async = require('async'),
	_ = require('lodash');



var getPortfolioLogsSummary = function(user, portfolioId, callback){

    var Project = mongoose.mtModel(user.tenantId + '.' + 'Project');
    var Portfolio = mongoose.mtModel(user.tenantId + '.' + 'Portfolio');
    var PortfolioMilestone = mongoose.mtModel(user.tenantId + '.' + 'PortfolioMilestone');
    var ProjectMilestone = mongoose.mtModel(user.tenantId + '.' + 'ProjectMilestone');

    async.waterfall([
        function(callback) {
            PortfolioMilestone.aggregate([
                {'$match' : {'portfolio' : mongoose.Types.ObjectId(portfolioId)}},
                {'$group' : {
                    _id : '$type',
                    countType : {'$sum': 1}
                }}
            ], function(err, milestones){
                if(err){
                    return callback(err);
                }
                var result = {
                    milestones: milestones
                };
                callback(null, result);
            });
        }
    ], function (err, result) {
        if(err){
            return callback(err);
        }
        callback(null, result);
    });

};

exports.portfolioLogsSummary = function(req, res){

    var portfolioId = req.query.portfolioId;

    // Checks
    if(!portfolioId){
        console.log('Portfolio is missing');
        return res.status(400).send({
            message: 'Portfolio is missing'
        });
    }

    getPortfolioLogsSummary(req.user, portfolioId, function(err, result){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.jsonp(result);
    });

};

/**
 * Log summary authorization middleware
 */

exports.hasAuthorization = function(req, res, next) {
	
	next();
};
