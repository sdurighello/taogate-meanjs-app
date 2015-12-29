'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


exports.updateHeader = function(req, res) {

    var projectStatusUpdate = req.projectStatusUpdate ;

    projectStatusUpdate.user = req.user;
    projectStatusUpdate.created = Date.now();
    projectStatusUpdate.title = req.body.title;
    projectStatusUpdate.description = req.body.description;

    projectStatusUpdate.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projectStatusUpdate);
        }
    });

};
