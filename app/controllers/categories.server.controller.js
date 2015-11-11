'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Category
 */
exports.create = function(req, res) {
    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
	var category = new Category(req.body);
	category.user = req.user;

	category.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * Show the current Category
 */
exports.read = function(req, res) {
	res.jsonp(req.category);
};

/**
 * Update a Category
 */
exports.update = function(req, res) {
	var category = req.category ;
    category.user = req.user;
    category.created = Date.now();
	category = _.extend(category , req.body);

	category.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * Delete a Category
 */
exports.delete = function(req, res) {
    var category = req.category ;
    var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');
    var CategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryValue');

    async.series([
        function(callback){
            // Delete category from its collection
            category.remove();
            callback(null, 'one');
        },
        function(callback){
            // Delete its values from the values collection
            async.each(category.categoryValues, function(item, callback){
                CategoryValue.findByIdAndRemove(item._id, callback);
            });
            callback(null, 'two');
        },
        function(callback){
            // Delete category from groups where assigned
            CategoryGroup.find({categories: {$in: [category._id]}}).exec(function(err, groups){
                async.each(groups, function(item, callback){
                    item.categories.splice(item.categories.indexOf(category._id), 1);
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
            res.jsonp(category);
        }
    });
};

/**
 * List of Categories
 */
exports.list = function(req, res) {
    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
	Category.find().sort('-created').populate('user', 'displayName').exec(function(err, categories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categories);
		}
	});
};

/**
 * Category middleware
 */
exports.categoryByID = function(req, res, next, id) {
    var Category = mongoose.mtModel(req.user.tenantId + '.' + 'Category');
	Category.findById(id).populate('user', 'displayName').exec(function(err, category) {
		if (err) return next(err);
		if (! category) return next(new Error('Failed to load Category ' + id));
		req.category = category ;
		next();
	});
};

/**
 * Category authorization middleware
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
