'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate')(mongoose);
require('mongoose-multitenant');

/**
 * People portfolio group Schema
 */
var PeoplePortfolioGroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill People portfolio group name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	roles : [{type: Schema.Types.ObjectId, ref: 'PeoplePortfolioRole', $tenant:true}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

PeoplePortfolioGroupSchema.plugin(deepPopulate);
mongoose.mtModel('PeoplePortfolioGroup', PeoplePortfolioGroupSchema);
