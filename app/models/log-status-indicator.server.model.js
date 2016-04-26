'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Log status Schema
 */
var LogStatusIndicatorSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill status indicator name',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    color: {
        type: String,
        enum: [
            'silver', // #c0c0c0
            'gray', // #808080
            'white', // #ffffff
            'red', // #ff0000
            'purple', // #800080
            'fuchsia', // #ff00ff
            'green', // #008000
            'lime', // #00ff00
            'olive', // #808000
            'yellow', // #ffff00
            'navy', // #000080
            'blue', // #0000ff
            'teal', // #008080
            'aqua', // #00ffff
            'orange' // #ffa500
        ],
        default:'white'
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

mongoose.mtModel('LogStatusIndicator', LogStatusIndicatorSchema);
