'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    async = require('async'),
	_ = require('lodash'),

	passport = require('passport'),
	User = mongoose.model('User');


/**
 * Signup new subuser
 */
exports.create = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	//delete req.body.roles;

    // Init Variables
	var user = new User(req.body);
	user.user = req.user;
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	// Set tenant and superAdmin flag
	user.tenantId = req.user.tenantId;
	user.isSuperAdmin = false;

	// Then save the user and create a stakeholder person

    var Person = mongoose.mtModel(req.user.tenantId + '.' + 'Person');

    async.waterfall([
        function(callback) {
            user.save(function(err){
                if(err){
                    return callback(err);
                }
                callback(null, user);
            });
        },
        function(createdUser, callback) {
            var person = new Person({
                name : createdUser.displayName,
                organization : createdUser.organization,
                title : null,
                email : createdUser.email,
                phone : createdUser.phone,
                assignedUser : createdUser._id,
                user : req.user._id,
                created : Date.now()
            });
            person.save(function(err){
                if(err){
                    return callback(err);
                }
                callback(null, createdUser);
            });
        }
    ], function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;
            res.json(user);
        }
    });

};

/**
 * Show the current Subuser
 */
exports.read = function(req, res) {
	res.jsonp(req.subuser);
};

/**
 * Update a Subuser
 */
exports.update = function(req, res) {

	// Init Variables
	var user = req.subuser;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	//delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				console.log(err);
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(user);
				//req.login(user, function(err) {
				//	if (err) {
				//		res.status(400).send(err);
				//	} else {
				//		res.json(user);
				//	}
				//});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}

	//var subuser = req.subuser ;
    //
	//subuser = _.extend(subuser , req.body);
    //
	//subuser.save(function(err) {
	//	if (err) {
	//		return res.status(400).send({
	//			message: errorHandler.getErrorMessage(err)
	//		});
	//	} else {
	//		res.jsonp(subuser);
	//	}
	//});
};

/**
 * Delete a Subuser
 */
exports.delete = function(req, res) {
	var subuser = req.subuser ;

	subuser.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subuser);
		}
	});
};

/**
 * List of Subusers
 */
exports.list = function(req, res) {
	User.find({'tenantId': req.user.tenantId, isSuperAdmin: false}).sort('-lastName').populate('user', 'displayName').exec(function(err, subusers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subusers);
		}
	});
};

/**
 * Subuser middleware
 */
exports.subuserByID = function(req, res, next, id) { 
	User.findById(id).populate('user', 'displayName').exec(function(err, subuser) {
		if (err) return next(err);
		if (! subuser) return next(new Error('Failed to load Subuser ' + id));
		req.subuser = subuser ;
		next();
	});
};

/**
 * Subuser authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (
		req.subuser.tenantId !== req.user.tenantId ||
		!_.find(req.user.roles, function(role){
				return (
				(role === 'superAdmin') ||
				(role === 'admin')
				);
			})
	) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
