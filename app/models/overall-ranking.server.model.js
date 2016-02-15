'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate');
require('mongoose-multitenant');


/**
 * Overall ranking Schema
 */
var OverallRankingSchema = new Schema({
	projects: [{type: Schema.Types.ObjectId, ref: 'Project', default:null, $tenant:true}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.mtModel('OverallRanking', OverallRankingSchema);
