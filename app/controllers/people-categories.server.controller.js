'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a People category
 */
exports.create = function(req, res) {
	var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');
	var peopleCategory = new PeopleCategory(req.body);
	peopleCategory.user = req.user;

	peopleCategory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleCategory);
		}
	});
};

/**
 * Show the current People category
 */
exports.read = function(req, res) {
	res.jsonp(req.peopleCategory);
};

/**
 * Update a People category
 */
exports.update = function(req, res) {
	var peopleCategory = req.peopleCategory ;
    peopleCategory.user = req.user;
    peopleCategory.created = Date.now();
	peopleCategory = _.extend(peopleCategory , req.body);

	peopleCategory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleCategory);
		}
	});
};

/**
 * Delete an People category
 */
exports.delete = function(req, res) {
	var peopleCategory = req.peopleCategory ;
    var PeopleCategoryValue = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategoryValue');

    async.series([
        function(callback){
            // Delete category from its collection
            peopleCategory.remove();
            callback(null, 'one');
        },
        function(callback){
            // Delete its values from the values collection
            async.each(peopleCategory.categoryValues, function(item, callback){
                PeopleCategoryValue.findByIdAndRemove(item._id, callback);
            });
            callback(null, 'two');
        }
    ],function(err, results){
        // results is now equal to ['one', 'two']
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(peopleCategory);
        }
    });
};

/**
 * List of People categories
 */
exports.list = function(req, res) {
    var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');
	PeopleCategory.find().sort('-created').deepPopulate(['categoryValues']).populate('user', 'displayName').exec(function(err, peopleCategories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(peopleCategories);
		}
	});
};

/**
 * People category middleware
 */
exports.peopleCategoryByID = function(req, res, next, id) {
    var PeopleCategory = mongoose.mtModel(req.user.tenantId + '.' + 'PeopleCategory');
	PeopleCategory.findById(id).deepPopulate(['categoryValues']).populate('user', 'displayName').exec(function(err, peopleCategory) {
		if (err) return next(err);
		if (! peopleCategory) return next(new Error('Failed to load People category ' + id));
		req.peopleCategory = peopleCategory ;
		next();
	});
};

/**
 * People category authorization middleware
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
