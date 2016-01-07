'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');



/**
 *  Update Gate process
 */

exports.updatePortfolioAssignment = function(req, res) {
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();
    project.portfolio = req.body.portfolio;

    project.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });


};
