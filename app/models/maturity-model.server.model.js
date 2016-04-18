'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');


// -------------------- MATURITY LEVEL SCHEMA-------------------

var MaturityLevelSchema = new Schema({

    name: {type: String, default: '', required: 'Maturity level name is required', trim: true},
    description: {type: String, default: '', trim: true},

    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
});

// -------------------- MATURITY AREA SCHEMA -------------------

var MaturityAreaSchema = new Schema({

    name: {type: String, default: '', required: 'Maturity area name is required', trim: true},
    description: {type: String, default: '', trim: true},

    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
});

// -------------------- MATURITY REVIEW SCHEMA -------------------

var maturityReviewRecord = {
    score : {type: Schema.Types.ObjectId, ref: 'ProjectReviewScore', default:null, $tenant:true},
    comment : {type: String, default:'', trim: true},
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
};

// -------------------- MATURITY DIMENSION SCHEMA -------------------

var MaturityDimensionSchema = new Schema({

    level : {type: Schema.Types.ObjectId, ref: 'MaturityModel.levels', default:null, required: 'Maturity level ref is required'},
    area : {type: Schema.Types.ObjectId, ref: 'MaturityModel.areas', default:null, required: 'Maturity area ref is required'},

    name: {type: String, default: '', required: 'Maturity dimension name is required', trim: true},
    description: {type: String, default: '', trim: true},

    maturityReview : {
        currentRecord : maturityReviewRecord,
        history : [maturityReviewRecord]
    },

    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
});


/********************* MATURITY MODEL SCHEMA *******************
 **************************************************************/

var MaturityModelSchema = new Schema({
    name: {type: String, default: '', required: 'Maturity model name is required', trim: true},
    description:{type: String, default: '', trim: true},

    levels : [MaturityLevelSchema],
    areas : [MaturityAreaSchema],
    dimensions : [MaturityDimensionSchema],

    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
});

MaturityModelSchema.plugin(deepPopulate);
mongoose.mtModel('MaturityModel', MaturityModelSchema);
