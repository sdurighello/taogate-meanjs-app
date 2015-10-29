'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate');
require('mongoose-multitenant');

/**
 * People group Schema
 */
var PeopleGroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	type: {
		type: String,
		enum: ['project','portfolio','organization'],
		required:'Please fill in group type',
		default: 'project'
	},
	roles : [{type: Schema.Types.ObjectId, ref: 'PeopleRole', $tenant:true}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

PeopleGroupSchema.plugin(deepPopulate);
mongoose.mtModel('PeopleGroup', PeopleGroupSchema);
