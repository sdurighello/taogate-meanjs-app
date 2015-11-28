'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a People category value
 */
exports.create = function(req, res) {
	var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');
	var PeopleCategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategoryValue');
	var peopleCategoryValue = new PeopleCategoryValue(req.body);
	peopleCategoryValue.user = req.user;

    async.series([
        // CATEGORY-VALUES: Save the new value to its collection
        function(callback){
            peopleCategoryValue.save(function(err){
                callback(err);
            });
        },
        // CATEGORY.CATEGORY-VALUES: Add the value to the category's "categoryValues" array
        function(callback){
            PeopleCategory.findById(req.query.categoryId).exec(function(err, category){
                if(err){
                    callback(err);
                } else {
                    category.categoryValues.push(peopleCategoryValue._id);
                    category.save(function(err){
                        callback(err);
                    });
                }
            });
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(peopleCategoryValue);
        }
    });
};

/**
 * Show the current People category value
 */
exports.read = function(req, res) {
	res.jsonp(req.peopleCategoryValue);
};

/**
 * Update a People category value
 */
exports.update = function(req, res) {
	var peopleCategoryValue = req.peopleCategoryValue ;
    peopleCategoryValue.user = req.user;
    peopleCategoryValue.created = Date.now();
	peopleCategoryValue = _.extend(peopleCategoryValue , req.body);

	peopleCategoryValue.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleCategoryValue);
		}
	});
};

/**
 * Delete an People category value
 */

exports.delete = function(req, res) {
	var peopleCategoryValue = req.peopleCategoryValue ;
    var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');

    async.series([
        // CATEGORY-VALUES: Delete value from its collection
        function(callback){
            peopleCategoryValue.remove(function(err){
                callback(err);
            });
        },
        // CATEGORY.CATEGORY-VALUES: Delete value from category where assigned
        function(callback){
            PeopleCategory.findById(req.query.categoryId).exec(function(err, category){
                if(err){
                    callback(err);
                } else {
                    category.categoryValues.splice(category.categoryValues.indexOf(peopleCategoryValue._id), 1);
                    category.save(function(err){
                        callback(err);
                    });
                }
            });
        }
    ],function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(peopleCategoryValue);
        }
    });

};

/**
 * List of People category values
 */
exports.list = function(req, res) {
    var PeopleCategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategoryValue');
	PeopleCategoryValue.find().populate('user', 'displayName').exec(function(err, peopleCategoryValues) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleCategoryValues);
		}
	});
};

/**
 * People category value middleware
 */
exports.peopleCategoryValueByID = function(req, res, next, id) {
    var PeopleCategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategoryValue');
	PeopleCategoryValue.findById(id).populate('user', 'displayName').exec(function(err, peopleCategoryValue) {
		if (err) return next(err);
		if (! peopleCategoryValue) return next(new Error('Failed to load People category value ' + id));
		req.peopleCategoryValue = peopleCategoryValue ;
		next();
	});
};

/**
 * People category value authorization middleware
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
