'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Gate outcome score Schema
 */
var GateOutcomeScoreSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Gate outcome score name',
		trim: true
	},
    description: {
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

mongoose.mtModel('GateOutcomeScore', GateOutcomeScoreSchema);
