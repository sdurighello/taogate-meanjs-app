'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/**
 * Create a Maturity model
 */
exports.create = function(req, res) {
    var MaturityModel = mongoose.mtModel(req.user.tenantId + '.' + 'MaturityModel');
    var maturityModel = new MaturityModel(req.body);
	maturityModel.user = req.user;

	maturityModel.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(maturityModel);
		}
	});
};

/**
 * Show the current Maturity model
 */
exports.read = function(req, res) {
	res.jsonp(req.maturityModel);
};

/**
 * Update a Maturity model
 */
exports.update = function(req, res) {
	var maturityModel = req.maturityModel ;
    maturityModel.user = req.user;
    maturityModel.created = Date.now();
	maturityModel = _.extend(maturityModel , req.body);

	maturityModel.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(maturityModel);
		}
	});
};

/**
 * Delete an Maturity model
 */
exports.delete = function(req, res) {
	var maturityModel = req.maturityModel ;

	maturityModel.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(maturityModel);
		}
	});
};

/**
 * List of Maturity models
 */
exports.list = function(req, res) {
    var MaturityModel = mongoose.mtModel(req.user.tenantId + '.' + 'MaturityModel');
    MaturityModel.find(req.query).populate('user', 'displayName').exec(function(err, maturityModels) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(maturityModels);
		}
	});
};


// --------------------------------------- LEVELS -----------------------------------

exports.createLevel = function(req, res){
    var MaturityModel = mongoose.mtModel(req.user.tenantId + '.' + 'MaturityModel');

    var newLevel = req.body;
    newLevel.user = req.user;

    MaturityModel.findById(req.params.maturityModelId).exec(function(err, maturityModel){
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if(!maturityModel){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(new Error('Failed to load maturity model ' + req.params.maturityModelId))
            });
        }
        newLevel = maturityModel.levels.create(newLevel);
        maturityModel.levels.push(newLevel);
        maturityModel.save(function(err){
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(newLevel);
            }
        });
    });

};

exports.updateLevel = function(req, res){

    var maturityModel = req.maturityModel;
    var level = maturityModel.levels.id(req.params.levelId);

    level.user = req.user;
    level.created = Date.now();

    level.name = req.body.name;
    level.description = req.body.description;

    maturityModel.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(level);
        }
    });

};

exports.deleteLevel = function(req, res){

    var maturityModel = req.maturityModel;
    maturityModel.user = req.user;
    maturityModel.created = Date.now();

    var removedLevel = maturityModel.levels.id(req.params.levelId).remove();

    maturityModel.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(removedLevel);
        }
    });

};


exports.sortLevels = function(req, res){

    var maturityModel = req.maturityModel;
    maturityModel.user = req.user;
    maturityModel.created = Date.now();

    maturityModel.levels = req.body.levels;

    maturityModel.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(maturityModel);
        }
    });

};



// --------------------------------------- DOMAINS -----------------------------------


exports.createDomain = function(req, res){
    var MaturityModel = mongoose.mtModel(req.user.tenantId + '.' + 'MaturityModel');

    var newDomain = req.body;
    newDomain.user = req.user;

    MaturityModel.findById(req.params.maturityModelId).exec(function(err, maturityModel){
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if(!maturityModel){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(new Error('Failed to load maturity model ' + req.params.maturityModelId))
            });
        }
        newDomain = maturityModel.domains.create(newDomain);
        maturityModel.domains.push(newDomain);
        maturityModel.save(function(err){
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(newDomain);
            }
        });
    });

};

exports.updateDomain = function(req, res){

    var maturityModel = req.maturityModel;
    var domain = maturityModel.domains.id(req.params.domainId);

    domain.user = req.user;
    domain.created = Date.now();

    domain.name = req.body.name;
    domain.description = req.body.description;

    maturityModel.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(domain);
        }
    });

};

exports.deleteDomain = function(req, res){

    var maturityModel = req.maturityModel;
    maturityModel.user = req.user;
    maturityModel.created = Date.now();

    var removedDomain = maturityModel.domains.id(req.params.domainId).remove();

    maturityModel.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(removedDomain);
        }
    });

};






/**
 * Maturity model middleware
 */
exports.maturityModelByID = function(req, res, next, id) {
    var MaturityModel = mongoose.mtModel(req.user.tenantId + '.' + 'MaturityModel');
    MaturityModel.findById(id).populate('user', 'displayName').exec(function(err, maturityModel) {
		if (err) return next(err);
		if (! maturityModel) return next(new Error('Failed to load Maturity model ' + id));
		req.maturityModel = maturityModel ;
		next();
	});
};

/**
 * Maturity model authorization middleware
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
