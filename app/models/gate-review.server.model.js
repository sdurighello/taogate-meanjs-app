'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Gate review Schema
 */
var GateReviewSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Gate review name',
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

mongoose.model('GateReview', GateReviewSchema);