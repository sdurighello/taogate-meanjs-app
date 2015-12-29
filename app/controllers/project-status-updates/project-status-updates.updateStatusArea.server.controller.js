'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


// --------- Update STATUS-AREA ---------

exports.updateStatusArea = function(req, res) {

    var projectStatusUpdate = req.projectStatusUpdate ;

    projectStatusUpdate.user = req.user;
    projectStatusUpdate.created = Date.now();

    var statusAreaUpdate = projectStatusUpdate.statusAreaUpdates.id(req.params.statusAreaUpdateId);
    statusAreaUpdate.newStatus = req.body.newStatus;
    statusAreaUpdate.comment = req.body.comment;

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
