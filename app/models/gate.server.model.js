'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Gate Schema
 */
var GateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Gate name',
		trim: true
	},
    description: {
        type: String,
        default: '',
        trim: true
    },
    position:{
        type: Number,
        required: 'Property "position" of GateSchema not filled'
    },
    gateOutcomes : [{type: Schema.Types.ObjectId, ref: 'GateOutcome', $tenant:true}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.mtModel('Gate', GateSchema);
