'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Overall ranking Schema
 */
var OverallRankingSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Overall ranking name',
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

mongoose.model('OverallRanking', OverallRankingSchema);