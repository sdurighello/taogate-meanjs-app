'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Process assignment
 */
exports.create = function(req, res) {
	var ProcessAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'ProcessAssignment');
	var processAssignment = new ProcessAssignment(req.body);
	processAssignment.user = req.user;

	processAssignment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(processAssignment);
		}
	});
};

/**
 * Show the current Process assignment
 */
exports.read = function(req, res) {
	res.jsonp(req.processAssignment);
};


/**
 * Change a Process assignment for a project
 */
exports.updateProcess = require('./processAssignments/processAssignment.updateProcess.server.controller').updateProcess;

/**
 * Update a Process assignment
 */
exports.update = function(req, res) {
	var processAssignment = req.processAssignment ;
    processAssignment.user = req.user;
    processAssignment.created = Date.now();
    processAssignment = _.extend(processAssignment , req.body);

	processAssignment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(processAssignment);
		}
	});
};

/**
 * Delete an Process assignment
 */
exports.delete = function(req, res) {
	var processAssignment = req.processAssignment ;

	processAssignment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(processAssignment);
		}
	});
};


/**
 * List of Process assignments
 */
exports.list = function(req, res) {
    var ProcessAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'ProcessAssignment');
	ProcessAssignment.find(req.query).populate('user', 'displayName').exec(function(err, processAssignments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(processAssignments);
		}
	});
};



/**
 * Find one process assignment by Project ID
 */
exports.findOneByProjectId = function(req, res) {
    var ProcessAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'ProcessAssignment');

    ProcessAssignment.findOne({project: req.params.projectId}).populate('user', 'displayName').exec(function(err, processAssignment) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if (! processAssignment) {
            return res.status(400).send({
                message: 'Failed to load Process assignment for projectId ' + req.params.projectId
            });
        }
        res.jsonp(processAssignment);
    });
};

/**
 * Process assignment middleware
 */
exports.processAssignmentByID = function(req, res, next, id) {
    var ProcessAssignment = mongoose.mtModel(req.user.tenantId + '.' + 'ProcessAssignment');
	ProcessAssignment.findById(id).populate('user', 'displayName').exec(function(err, processAssignment) {
		if (err) return next(err);
		if (! processAssignment) return next(new Error('Failed to load Process assignment ' + id));
		req.processAssignment = processAssignment ;
		next();
	});
};

/**
 * Process assignment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    // User role check
    if(!_.find(req.user.roles, function(role){
            return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
        })
    ){
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};
