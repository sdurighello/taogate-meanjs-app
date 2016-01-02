'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Counter Schema
 */


var CounterSchema = new Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 1 }
});

mongoose.mtModel('Counter', CounterSchema);
