'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Category group Schema
 */
var CategoryGroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Category group name',
		trim: true
	},
    description: {
        type: String,
        default: '',
        trim: true
    },
    categories : [{type: Schema.Types.ObjectId, ref: 'Category', $tenant:true}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

CategoryGroupSchema.plugin(deepPopulate);
mongoose.mtModel('CategoryGroup', CategoryGroupSchema);
