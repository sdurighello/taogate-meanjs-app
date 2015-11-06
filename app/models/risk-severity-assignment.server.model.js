'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    deepPopulate = require('mongoose-deep-populate');
require('mongoose-multitenant');


/**
 * Risk severity assignment Schema
 */


var riskCombinationSchema = new Schema({
    probability : {type: Schema.Types.ObjectId, ref: 'RiskProbability', $tenant:true},
    severity : {type: Schema.Types.ObjectId, ref: 'RiskSeverity', $tenant:true}
});


var RiskSeverityAssignmentSchema = new Schema({
    impact : {type: Schema.Types.ObjectId, ref: 'RiskImpact', $tenant:true},
    riskCombinations : [riskCombinationSchema],
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
