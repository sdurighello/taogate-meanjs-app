'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');

/* PROCESS */

exports.create = function(req, res) {
    var GateProcessTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcessTemplate');

    var gateProcessTemplate = new GateProcessTemplate({
        name: 'New gate process',
        gates: [],
        approval : {
            currentRecord : {user: {_id: req.user._id, displayName: req.user.displayName}},
            history : []
        },
        created: Date.now(),
        user: req.user._id
    });

    var startGate = gateProcessTemplate.gates.create({
        name: 'Start',
        description: { type: String, default: '', trim: true },
        position:1,
        outcomes : []
    });

    var endGate = gateProcessTemplate.gates.create({
        name: 'End',
        description: { type: String, default: '', trim: true },
        position:2,
        outcomes : []
    });

    gateProcessTemplate.startGate = startGate._id;
    gateProcessTemplate.endGate = endGate._id;

    gateProcessTemplate.gates.push(endGate);
    gateProcessTemplate.gates.push(startGate);

    gateProcessTemplate.gates = _.sortBy(gateProcessTemplate.gates, 'position');

    gateProcessTemplate.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateProcessTemplate);
        }
    });
};

exports.read = function(req, res) {
	res.jsonp(req.gateProcessTemplate);
};

exports.update = function(req, res) {
    
	var gateProcessTemplate = req.gateProcessTemplate ;

	gateProcessTemplate.name = req.body.name;
    gateProcessTemplate.description = req.body.description;
    gateProcessTemplate.user = req.user._id;
    gateProcessTemplate.created = Date.now();

	gateProcessTemplate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateProcessTemplate);
		}
	});
};

exports.delete = function(req, res) {
    
	var gateProcessTemplate = req.gateProcessTemplate ;

	gateProcessTemplate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateProcessTemplate);
		}
	});
};

exports.list = function(req, res) {
    var GateProcessTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcessTemplate');
	GateProcessTemplate.find().populate('user', 'displayName').exec(function(err, gateProcessTemplates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateProcessTemplates);
		}
	});
};

/* GATE */

exports.createGate = function(req, res) {
    
    var gateProcessTemplate = req.gateProcessTemplate;

    var endGate = _.find(gateProcessTemplate.gates, function(gate){
        return gate._id.equals(gateProcessTemplate.endGate);
    });

    var newGate = gateProcessTemplate.gates.create({
        name: 'New gate',
        description: '',
        position: endGate.position,
        outcomes : []
    });

    endGate.position = endGate.position + 1;
    gateProcessTemplate.gates.push(newGate);
    
    gateProcessTemplate.gates = _.sortBy(gateProcessTemplate.gates, 'position');
    
    gateProcessTemplate.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateProcessTemplate);
        }
    });
};

exports.updateGateHeader = function(req, res) {
    
    var gateProcessTemplate = req.gateProcessTemplate ;

    var editedGate = _.find(gateProcessTemplate.gates, function(gate){
        return gate._id.equals(req.params.gateTemplateId);
    });

    editedGate.name = req.body.name;
    editedGate.description = req.body.description;

    gateProcessTemplate.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateProcessTemplate);
        }
    });

};

exports.updateGatePosition = function(req, res) {

    var gateProcessTemplate = req.gateProcessTemplate ;

    var editedGate = _.find(gateProcessTemplate.gates, function(gate){
        return gate._id.equals(req.params.gateTemplateId);
    });

    var oldPosition = editedGate.position;
    var newPosition = req.body.position;

    if(newPosition === 1){
        return res.status(400).send(
            new Error('Gate new position cannot be 1')
        );
    }
    if(newPosition === gateProcessTemplate.gates.length){
        return res.status(400).send(
            new Error('Gate new position cannot be' + gateProcessTemplate.gates.length)
        );
    }
    if(editedGate._id.equals(gateProcessTemplate.endGate) || editedGate._id.equals(gateProcessTemplate.startGate)){
        return res.status(400).send(
            new Error('Start and End gates cannot change position')
        );
    }

    if(oldPosition < newPosition){
        _.each(gateProcessTemplate.gates, function(gate){
            if((oldPosition < gate.position) && (gate.position <= newPosition) && (!gate._id.equals(editedGate._id))){
                gate.position = gate.position - 1;
            }
        });
    }

    if(oldPosition > newPosition){
        _.each(gateProcessTemplate.gates, function(gate){
            if((newPosition <= gate.position) && (gate.position < oldPosition) && (!gate._id.equals(editedGate._id))){
                gate.position = gate.position + 1;
            }
        });
    }

    editedGate.position = newPosition;

    gateProcessTemplate.gates = _.sortBy(gateProcessTemplate.gates, 'position');
    gateProcessTemplate.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateProcessTemplate);
        }
    });

};

exports.deleteGate = function(req, res) {

    var gateProcessTemplate = req.gateProcessTemplate ;

    var deletedGate = gateProcessTemplate.gates.id(req.params.gateTemplateId).remove();

    if(deletedGate._id.equals(gateProcessTemplate.endGate) || deletedGate._id.equals(gateProcessTemplate.startGate)){
        return res.status(400).send(
            new Error('Start and End gates cannot be deleted')
        );
    }

    var oldPosition = deletedGate.position;

    _.each(gateProcessTemplate.gates, function(gate){
        if(gate.position > oldPosition){
            gate.position = gate.position - 1;
        }
    });

    gateProcessTemplate.gates = _.sortBy(gateProcessTemplate.gates, 'position');

    gateProcessTemplate.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateProcessTemplate);
        }
    });
    
};

/* OUTCOME */

exports.createOutcome = function(req, res) {

    var gateProcessTemplate = req.gateProcessTemplate ;

    var editedGate = _.find(gateProcessTemplate.gates, function(gate){
        return gate._id.equals(req.params.gateTemplateId);
    });

    var newOutcome = editedGate.outcomes.create({ name: 'New Outcome' });

    editedGate.outcomes.push(newOutcome);

    gateProcessTemplate.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(newOutcome);
        }
    });
};

exports.updateOutcome = function(req, res) {

    var gateProcessTemplate = req.gateProcessTemplate ;

    var editedGate = _.find(gateProcessTemplate.gates, function(gate){
        return gate._id.equals(req.params.gateTemplateId);
    });

    var editedOutcome = _.find(editedGate.outcomes, function(outcome){
        return outcome._id.equals(req.params.outcomeTemplateId);
    });

    editedOutcome.name = req.body.name;
    editedOutcome.description = req.body.description;

    gateProcessTemplate.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedOutcome);
        }
    });
};

exports.deleteOutcome = function(req, res) {

    var gateProcessTemplate = req.gateProcessTemplate ;

    var editedGate = gateProcessTemplate.gates.id(req.params.gateTemplateId);

    var deletedOutcome = editedGate.outcomes.id(req.params.outcomeTemplateId).remove();

    gateProcessTemplate.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedGate);
        }
    });
};

/* APPROVAL */

exports.submit = function(req, res) {

    var GateProcessTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcessTemplate');

    var gateProcessTemplate = req.gateProcessTemplate;

    gateProcessTemplate.user = req.user;
    gateProcessTemplate.created = Date.now();

    gateProcessTemplate.approval.history.push({
        approvalState : gateProcessTemplate.approval.currentRecord.approvalState,
        user : {
            _id: gateProcessTemplate.approval.currentRecord.user._id,
            displayName: gateProcessTemplate.approval.currentRecord.user.displayName
        },
        created : gateProcessTemplate.approval.currentRecord.created
    });

    gateProcessTemplate.approval.currentRecord.approvalState = 'submitted';
    gateProcessTemplate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    gateProcessTemplate.approval.currentRecord.created = Date.now();

    gateProcessTemplate.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateProcessTemplate);
        }
    });

};

exports.approve = function(req, res) {

    var GateProcessTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcessTemplate');

    var gateProcessTemplate = req.gateProcessTemplate;

    gateProcessTemplate.user = req.user;
    gateProcessTemplate.created = Date.now();

    gateProcessTemplate.approval.history.push({
        approvalState : gateProcessTemplate.approval.currentRecord.approvalState,
        user : {
            _id: gateProcessTemplate.approval.currentRecord.user._id,
            displayName: gateProcessTemplate.approval.currentRecord.user.displayName
        },
        created : gateProcessTemplate.approval.currentRecord.created
    });

    gateProcessTemplate.approval.currentRecord.approvalState = 'approved';
    gateProcessTemplate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    gateProcessTemplate.approval.currentRecord.created = Date.now();

    gateProcessTemplate.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateProcessTemplate);
        }
    });
};

exports.reject = function(req, res) {

    var GateProcessTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcessTemplate');

    var gateProcessTemplate = req.gateProcessTemplate;

    gateProcessTemplate.user = req.user;
    gateProcessTemplate.created = Date.now();

    gateProcessTemplate.approval.history.push({
        approvalState : gateProcessTemplate.approval.currentRecord.approvalState,
        user : {
            _id: gateProcessTemplate.approval.currentRecord.user._id,
            displayName: gateProcessTemplate.approval.currentRecord.user.displayName
        },
        created : gateProcessTemplate.approval.currentRecord.created
    });

    gateProcessTemplate.approval.currentRecord.approvalState = 'rejected';
    gateProcessTemplate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    gateProcessTemplate.approval.currentRecord.created = Date.now();

    gateProcessTemplate.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateProcessTemplate);
        }
    });

};

exports.draft = function(req, res) {

    var GateProcessTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcessTemplate');

    var gateProcessTemplate = req.gateProcessTemplate;

    gateProcessTemplate.user = req.user;
    gateProcessTemplate.created = Date.now();

    gateProcessTemplate.approval.history.push({
        approvalState : gateProcessTemplate.approval.currentRecord.approvalState,
        user : {
            _id: gateProcessTemplate.approval.currentRecord.user._id,
            displayName: gateProcessTemplate.approval.currentRecord.user.displayName
        },
        created : gateProcessTemplate.approval.currentRecord.created
    });

    gateProcessTemplate.approval.currentRecord.approvalState = 'draft';
    gateProcessTemplate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    gateProcessTemplate.approval.currentRecord.created = Date.now();

    gateProcessTemplate.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gateProcessTemplate);
        }
    });

};

/* MIDDLEWARE */

exports.gateProcessTemplateByID = function(req, res, next, id) {
    var GateProcessTemplate = mongoose.mtModel(req.user.tenantId + '.' + 'GateProcessTemplate');
	GateProcessTemplate.findById(id).populate('user', 'displayName').exec(function(err, gateProcessTemplate) {
		if (err) return next(err);
		if (! gateProcessTemplate) return next(new Error('Failed to load Gate process template ' + id));
		req.gateProcessTemplate = gateProcessTemplate ;
		next();
	});
};

/* AUTHORIZATION */

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
