'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Category value
 */
exports.create = function(req, res) {
	var CategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryValue');
	var categoryValue = new CategoryValue(req.body);
	categoryValue.user = req.user;

	categoryValue.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categoryValue);
		}
	});
};

/**
 * Show the current Category value
 */
exports.read = function(req, res) {
	res.jsonp(req.categoryValue);
};

/**
 * Update a Category value
 */
exports.update = function(req, res) {
	var categoryValue = req.categoryValue ;
    categoryValue.user = req.user;
	categoryValue.created = Date.now();
	categoryValue = _.extend(categoryValue , req.body);

	categoryValue.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categoryValue);
		}
	});
};

/**
 * Delete an Category value
 */
exports.delete = function(req, res) {
    var categoryValue = req.categoryValue ;
    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');

    async.series([
        function(callback){
            // Delete category value from its collection
            categoryValue.remove();
            callback(null, 'one');
        },
        function(callback){
            // Delete value from categories where assigned
            Category.find({categoryValues: {$in: [categoryValue._id]}}).exec(function(err, categories){
                async.each(categories, function(item, callback){
                    item.categoryValues.splice(item.categoryValues.indexOf(categoryValue._id), 1);
                    item.save();
                    callback();
                });
            });
            callback(null, 'three');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(categoryValue);
        }
    });
};

/**
 * List of Category values
 */
exports.list = function(req, res) {
    var CategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryValue');
	CategoryValue.find().sort('-created').populate('user', 'displayName').exec(function(err, categoryValues) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categoryValues);
		}
	});
};

/**
 * Category value middleware
 */
exports.categoryValueByID = function(req, res, next, id) {
    var CategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryValue');
	CategoryValue.findById(id).populate('user', 'displayName').exec(function(err, categoryValue) {
		if (err) return next(err);
		if (! categoryValue) return next(new Error('Failed to load Category value ' + id));
		req.categoryValue = categoryValue ;
		next();
	});
};

/**
 * Category value authorization middleware
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
