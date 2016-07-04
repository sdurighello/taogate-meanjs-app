'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	async = require('async'),
	_ = require('lodash');


// ------------------------ PORTFOLIO REVIEW TEMPLATE --------------------------------


/**
 * Create a Portfolio review template
 */
exports.create = function(req, res) {
	var PortfolioReviewTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReviewTemplate');
	var portfolioReviewTemplate = new PortfolioReviewTemplate(req.body);
	portfolioReviewTemplate.user = req.user;

	portfolioReviewTemplate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReviewTemplate);
		}
	});
};

/**
 * Show the current Portfolio review template
 */
exports.read = function(req, res) {
	res.jsonp(req.portfolioReviewTemplate);
};

/**
 * Update a Portfolio review template
 */
exports.update = function(req, res) {
	var portfolioReviewTemplate = req.portfolioReviewTemplate ;
	portfolioReviewTemplate.user = req.user;
	portfolioReviewTemplate.created = Date.now();
	portfolioReviewTemplate = _.extend(portfolioReviewTemplate , req.body);

	portfolioReviewTemplate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReviewTemplate);
		}
	});
};

/**
 * Delete an Portfolio review template
 */
exports.delete = function(req, res) {
	var portfolioReviewTemplate = req.portfolioReviewTemplate ;

	portfolioReviewTemplate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReviewTemplate);
		}
	});
};

/**
 * List of Portfolio review templates
 */
exports.list = function(req, res) {
	var PortfolioReviewTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReviewTemplate');
	PortfolioReviewTemplate.find().populate('user', 'displayName').populate('groups.peopleGroups').exec(function(err, portfolioReviewTemplates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioReviewTemplates);
		}
	});
};



// ------------------------ PORTFOLIO REVIEW GROUP --------------------------------

exports.createGroup = function(req, res) {


    var newGroup = req.body;
    newGroup.user = req.user;

    var template = req.portfolioReviewTemplate;
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

    var template = req.portfolioReviewTemplate;

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
    var template = req.portfolioReviewTemplate;
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

    var template = req.portfolioReviewTemplate;
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
    var template = req.portfolioReviewTemplate;
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




// ------------------------ PORTFOLIO REVIEW ITEM --------------------------------



exports.createItem = function(req, res) {

    var newItem = req.body;
    newItem.user = req.user;

    var template = req.portfolioReviewTemplate;
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

    var template = req.portfolioReviewTemplate;
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

    var template = req.portfolioReviewTemplate;
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
 * Portfolio review template middleware
 */
exports.portfolioReviewTemplateByID = function(req, res, next, id) {
	var PortfolioReviewTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioReviewTemplate');
	PortfolioReviewTemplate.findById(id).populate('user', 'displayName').exec(function(err, portfolioReviewTemplate) {
		if (err) return next(err);
		if (! portfolioReviewTemplate) return next(new Error('Failed to load Portfolio review template ' + id));
		req.portfolioReviewTemplate = portfolioReviewTemplate ;
		next();
	});
};

/**
 * Portfolio review template authorization middleware
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
