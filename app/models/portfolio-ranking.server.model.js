'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate');
require('mongoose-multitenant');


/**
 * Portfolio ranking Schema
 */
var PortfolioRankingSchema = new Schema({
	portfolio: {type: Schema.Types.ObjectId, ref: 'Portfolio', default:null, $tenant:true},
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

mongoose.mtModel('PortfolioRanking', PortfolioRankingSchema);
