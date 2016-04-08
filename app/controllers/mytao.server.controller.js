'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');



// -------------------------

exports.getUserProjects = function(req, res) {

    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');

    Project.find({
        $or: [ { 'identification.projectManager': req.user._id }, { 'identification.backupProjectManager': req.user._id } ]
    }).populate('user', 'displayName').exec(function(err, projects) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projects);
        }
    });

};



exports.getUserPortfolios = function(req, res) {

    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    Portfolio.find({
        $or: [ { portfolioManager: req.user._id }, { backupPortfolioManager: req.user._id } ]
    }).populate('user', 'displayName').exec(function(err, portfolios) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolios);
        }
    });

};
