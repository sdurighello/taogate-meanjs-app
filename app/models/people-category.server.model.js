'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * People category Schema
 */
var PeopleCategorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill People category name',
		trim: true
	},
    description: {
        type: String,
        default: '',
        trim: true
    },
    categoryValues : [{type: Schema.Types.ObjectId, ref: 'PeopleCategoryValue', $tenant:true}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

PeopleCategorySchema.plugin(deepPopulate);
mongoose.mtModel('PeopleCategory', PeopleCategorySchema);
