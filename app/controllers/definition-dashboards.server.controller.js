'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

exports.projectCategorization = function(req, res){
    var Project = mongoose.mtModel(req.user.tenantId + '.' + 'Project');
    var CategoryGroup = mongoose.mtModel(req.user.tenantId + '.' + 'CategoryGroup');

    Project.aggregate([
        {'$unwind': '$categorization'},
        {'$unwind' : '$categorization.categories'},
        {'$group' : {
            _id : {
                categoryValue : '$categorization.categories.categoryValue',
                category :'$categorization.categories.category',
                group : '$categorization.group'
            },
            countCategoryValue : {'$sum': 1}
        }},
        {'$group' : {
            _id : {
                category :'$_id.category',
                group : '$_id.group'
            },
            categoryValues : {'$push' : {categoryValue : '$_id.categoryValue', countCategoryValue : '$countCategoryValue'}},
            countCategory : {'$sum': 1}
        }},
        {'$group' : {
            _id : {
                group : '$_id.group'
            },
            categories : {'$push' : {category : '$_id.category', countCategory : '$countCategory', categoryValues : '$categoryValues'}},
            countGroup : {'$sum': 1}
        }},
        {'$project' : {
            group : '$_id.group',
            categories : '$categories',
            countGroup : '$countGroup'
        }}
    ], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(result);
        }
    });
};


/**
 * Definition dashboard authorization middleware
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
