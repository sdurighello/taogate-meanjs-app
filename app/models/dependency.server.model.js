'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate'),
    Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Dependency Schema
 */
var DependencySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Dependency name',
		trim: true
	},
    description: {type: String, default: '', trim: true},

    type : {type: Schema.Types.ObjectId, ref: 'DependencyType', $tenant:true},
    impact : {type: Schema.Types.ObjectId, ref: 'DependencyImpact', $tenant:true},

    source : {type: Schema.Types.ObjectId, ref: 'Project', $tenant:true, required:'Source project missing'},
    target : {type: Schema.Types.ObjectId, ref: 'Project', $tenant:true, required:'Target project missing'},

    requiredByDate:{type: Date, default:null},

	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User'}
});

DependencySchema.plugin(deepPopulate);
mongoose.mtModel('Dependency', DependencySchema);
