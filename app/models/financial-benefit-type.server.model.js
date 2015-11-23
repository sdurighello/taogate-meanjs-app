'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Financial benefit type Schema
 */
var FinancialBenefitTypeSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Financial benefit type name',
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

mongoose.mtModel('FinancialBenefitType', FinancialBenefitTypeSchema);
