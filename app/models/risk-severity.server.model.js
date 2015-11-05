'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Risk severity Schema
 */
var RiskSeveritySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Risk severity name',
		trim: true
	},
    description: {
        type: String,
        default: '',
        trim: true
    },
    value: {
        type: Number,
        default: 0,
        required: 'Please fill severity numerical value'
    },
    position:{
        type: Number,
        required: 'Property "position" of RiskSeveritySchema not filled'
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

mongoose.mtModel('RiskSeverity', RiskSeveritySchema);
