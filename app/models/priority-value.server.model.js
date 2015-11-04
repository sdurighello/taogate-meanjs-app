'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Priority value Schema
 */
var PriorityValueSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill priority value name',
		trim: true
	},
    numericalValue: {
        type: Number,
        default: 0,
        required: 'Please fill priority numerical value'
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
	position:{
		type: Number,
		required: 'Property "position" of PriorityValueSchema not filled'
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

mongoose.mtModel('PriorityValue', PriorityValueSchema);
