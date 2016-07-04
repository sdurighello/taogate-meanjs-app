'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Log status area Schema
 */
var LogStatusAreaSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill status area name',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },

    applicableTo: {type: String, enum: ['project', 'portfolio', 'both'], default:'both', required:'Applicability is required'},

    created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.mtModel('LogStatusArea', LogStatusAreaSchema);
