'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');



// ------------------------ PROJECT REVIEW TEMPLATE --------------------------------

/**
 * Create a Project review template
 */
exports.create = function(req, res) {
	var ProjectReviewTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReviewTemplate');
	var projectReviewTemplate = new ProjectReviewTemplate(req.body);
	projectReviewTemplate.user = req.user;

	projectReviewTemplate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReviewTemplate);
		}
	});
};

/**
 * Show the current Project review template
 */
exports.read = function(req, res) {
	res.jsonp(req.projectReviewTemplate);
};

/**
 * Update a Project review template
 */
exports.update = function(req, res) {
	var projectReviewTemplate = req.projectReviewTemplate ;
	projectReviewTemplate.user = req.user;
	projectReviewTemplate.created = Date.now();
	projectReviewTemplate = _.extend(projectReviewTemplate , req.body);

	projectReviewTemplate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReviewTemplate);
		}
	});
};

/**
 * Delete an Project review template
 */
exports.delete = function(req, res) {
	var projectReviewTemplate = req.projectReviewTemplate ;

	projectReviewTemplate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReviewTemplate);
		}
	});
};

/**
 * List of Project review templates
 */
exports.list = function(req, res) {
	var ProjectReviewTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReviewTemplate');
	ProjectReviewTemplate.find().populate('user', 'displayName').populate('groups.peopleGroups').exec(function(err, projectReviewTemplates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectReviewTemplates);
		}
	});
};

/**
 * Project review template middleware
 */
exports.projectReviewTemplateByID = function(req, res, next, id) {
	var ProjectReviewTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'ProjectReviewTemplate');
	ProjectReviewTemplate.findById(id).populate('user', 'displayName').exec(function(err, projectReviewTemplate) {
		if (err) return next(err);
		if (! projectReviewTemplate) return next(new Error('Failed to load Project review template ' + id));
		req.projectReviewTemplate = projectReviewTemplate ;
		next();
	});
};



// ------------------------ PROJECT REVIEW GROUP --------------------------------

exports.createGroup = function(req, res) {


    var newGroup = req.body;
    newGroup.user = req.user;

    var template = req.projectReviewTemplate;
    newGroup = template.groups.create(newGroup);
    template.groups.push(newGroup);
    template.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(newGroup);
        }
    });
};

exports.updateGroup = function(req, res) {

    var template = req.projectReviewTemplate;

    var group = template.groups.id(req.params.groupId);
    group.name = req.body.name;
    group.description = req.body.description;
    group.weight = req.body.weight;

    template.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(group);
        }
    });
};

exports.deleteGroup = function(req, res) {
    var template = req.projectReviewTemplate;
    var removedGroup = template.groups.id(req.params.groupId).remove();
    template.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(removedGroup);
        }
    });

};


// ------------------------ ADD/REMOVE STAKEHOLDER GROUPS --------------------------------


exports.addPeopleGroup = function(req, res) {

    var template = req.projectReviewTemplate;
    var group = template.groups.id(req.params.groupId);

    if(_.find(group.peopleGroups, function(pGroup){
            return pGroup.equals(req.params.peopleGroupId);
        })){
        return res.status(400).send({
            message: 'People group already added to review group'
        });
    }

    group.peopleGroups.push(req.params.peopleGroupId);

    template.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(req.body);
        }
    });
};

exports.removePeopleGroup = function(req, res) {
    var template = req.projectReviewTemplate;
    var group = template.groups.id(req.params.groupId);

    for(var i = group.peopleGroups.length - 1; i >= 0; i--) {
        if(group.peopleGroups[i].equals(req.params.peopleGroupId)) {
            group.peopleGroups.splice(i, 1);
        }
    }

    template.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(req.body);
        }
    });

};




// ------------------------ PROJECT REVIEW ITEM --------------------------------



exports.createItem = function(req, res) {

    var newItem = req.body;
    newItem.user = req.user;

    var template = req.projectReviewTemplate;
    var group = template.groups.id(req.params.groupId);

    newItem = group.items.create(newItem);
    group.items.push(newItem);

    template.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(newItem);
        }
    });
};

exports.updateItem = function(req, res) {

    var template = req.projectReviewTemplate;
    var group = template.groups.id(req.params.groupId);

    var item = group.items.id(req.params.itemId);
    item.name = req.body.name;
    item.description = req.body.description;
    item.weight = req.body.weight;

    template.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(item);
        }
    });


};

exports.deleteItem = function(req, res) {

    var template = req.projectReviewTemplate;
    var group = template.groups.id(req.params.groupId);

    var removedItem = group.items.id(req.params.itemId).remove();

    template.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(removedItem);
        }
    });

};



// ------------------------ MIDDLEWARE --------------------------------


/**
 * Project review template authorization middleware
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
