'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
require('mongoose-multitenant');
var	Schema = mongoose.Schema;

/**
 * PortfolioType Schema
 */
var PortfolioTypeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill type name',
		trim: true
	},
	description:{
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

mongoose.mtModel('PortfolioType', PortfolioTypeSchema);
