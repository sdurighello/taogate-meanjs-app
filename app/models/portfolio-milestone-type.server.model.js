'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Portfolio milestone type Schema
 */
var PortfolioMilestoneTypeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Portfolio milestone type name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.mtModel('PortfolioMilestoneType', PortfolioMilestoneTypeSchema);
