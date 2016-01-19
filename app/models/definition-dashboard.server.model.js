'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Definition dashboard Schema
 */
var DefinitionDashboardSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Definition dashboard name',
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

mongoose.model('DefinitionDashboard', DefinitionDashboardSchema);