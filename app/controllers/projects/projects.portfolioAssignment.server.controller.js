'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');



/**
 *  Update portfolio assignment
 */

exports.updatePortfolioAssignment = function(req, res) {
    var project = req.project ;
    project.user = req.user;
    project.created = Date.now();
    var allowNull = function(obj){
        if(obj){
            return obj._id;
        } else {
            return null;
        }
    };
    project.portfolio = allowNull(req.body.portfolio);

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
