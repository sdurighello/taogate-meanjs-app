'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Risk severity assignment Schema
 */


var riskCombinationSchema = new Schema({
    probability : {type: Schema.Types.ObjectId, ref: 'RiskProbability'},
    severity : {type: Schema.Types.ObjectId, ref: 'RiskSeverity'}
});
mongoose.model('RiskCombination', riskCombinationSchema);


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

mongoose.mtModel('RiskSeverityAssignment', RiskSeverityAssignmentSchema);
