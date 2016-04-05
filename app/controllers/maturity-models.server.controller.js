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
	maturityModel.user = req.user._id;

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
    maturityModel.user = req.user._id;
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
    newLevel.user = req.user._id;

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

    level.user = req.user._id;
    level.created = Date.now();

    level = _.extend(level , req.body);

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
    maturityModel.user = req.user._id;
    maturityModel.created = Date.now();

    // Delete all dimensions associated to this level
    if(maturityModel.dimensions && maturityModel.dimensions.length > 0){
        var dimensionsToBeRemoved = _.filter(maturityModel.dimensions, function(dimension){
            return dimension.level.equals(req.params.levelId);
        });
        if(dimensionsToBeRemoved){
            _.each(dimensionsToBeRemoved, function(dimension){
                maturityModel.dimensions.id(dimension._id).remove();
            });
        }
    }

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
    maturityModel.user = req.user._id;
    maturityModel.created = Date.now();

    maturityModel.levels = req.body;

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



// --------------------------------------- AREAS -----------------------------------


exports.createArea = function(req, res){
    var MaturityModel = mongoose.mtModel(req.user.tenantId + '.' + 'MaturityModel');

    var newArea = req.body;
    newArea.user = req.user._id;

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
        newArea = maturityModel.areas.create(newArea);
        maturityModel.areas.push(newArea);
        maturityModel.save(function(err){
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(newArea);
            }
        });
    });

};

exports.updateArea = function(req, res){

    var maturityModel = req.maturityModel;
    var area = maturityModel.areas.id(req.params.areaId);

    area.user = req.user._id;
    area.created = Date.now();

    area = _.extend(area , req.body);

    maturityModel.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(area);
        }
    });

};

exports.deleteArea = function(req, res){

    var maturityModel = req.maturityModel;
    maturityModel.user = req.user._id;
    maturityModel.created = Date.now();

    // Delete all dimensions associated to this area
    if(maturityModel.dimensions && maturityModel.dimensions.length > 0){
        var dimensionsToBeRemoved = _.filter(maturityModel.dimensions, function(dimension){
            return dimension.area.equals(req.params.areaId);
        });
        if(dimensionsToBeRemoved){
            _.each(dimensionsToBeRemoved, function(dimension){
                maturityModel.dimensions.id(dimension._id).remove();
            });
        }
    }

    // Delete area
    var removedArea = maturityModel.areas.id(req.params.areaId).remove();

    // Save parent object
    maturityModel.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(removedArea);
        }
    });

};



// --------------------------------------- DIMENSIONS -----------------------------------


exports.createDimension = function(req, res){
    var MaturityModel = mongoose.mtModel(req.user.tenantId + '.' + 'MaturityModel');

    var newDimension = req.body;
    newDimension.user = req.user._id;

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
        newDimension = maturityModel.dimensions.create(newDimension);
        maturityModel.dimensions.push(newDimension);
        maturityModel.save(function(err){
            if (err) {
                console.log(err);
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(newDimension);
            }
        });
    });

};

exports.updateDimension = function(req, res){

    var maturityModel = req.maturityModel;
    var dimension = maturityModel.dimensions.id(req.params.dimensionId);

    dimension.user = req.user._id;
    dimension.created = Date.now();

    dimension = _.extend(dimension , req.body);

    maturityModel.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(dimension);
        }
    });

};

exports.deleteDimension = function(req, res){

    var maturityModel = req.maturityModel;
    maturityModel.user = req.user._id;
    maturityModel.created = Date.now();

    var removedDimension = maturityModel.dimensions.id(req.params.dimensionId).remove();

    maturityModel.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(removedDimension);
        }
    });

};


// ***************************************************************************************


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
