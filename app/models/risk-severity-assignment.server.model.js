'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    deepPopulate = require('mongoose-deep-populate')(mongoose);
require('mongoose-multitenant');


/**
 * Risk severity assignment Schema
 */


var RiskSeverityAssignmentSchema = new Schema({
    impact : {type: Schema.Types.ObjectId, ref: 'RiskImpact', $tenant:true},
	probability : {type: Schema.Types.ObjectId, ref: 'RiskProbability', $tenant:true},
	severity : {type: Schema.Types.ObjectId, ref: 'RiskSeverity', $tenant:true},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

RiskSeverityAssignmentSchema.plugin(deepPopulate);
mongoose.mtModel('RiskSeverityAssignment', RiskSeverityAssignmentSchema);
