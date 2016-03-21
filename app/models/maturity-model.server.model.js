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


// -------------------- IMPROVEMENT ACTIVITY SCHEMA-------------------

var statusReviewRecord = {
    baselineDeliveryDate : {type: Date, default: null},
    estimateDeliveryDate : {type: Date, default: null},
    actualDeliveryDate : {type: Date, default: null},
    completed : {type: Boolean, default: false, required:'Completed flag is required'},
    status: {type: Schema.Types.ObjectId, default: null, ref: 'LogStatusIndicator', $tenant:true},
    statusComment : {type: String, default:'', trim: true},
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
};

var ImprovementActivitySchema = new Schema({

    assignedTo: {type: Schema.Types.ObjectId, ref: 'Person', $tenant:true},
    raisedOnDate : {type: Date, default: Date.now, required:'Raised on date required'},

    idNumber: {type: Number, required:'Sequential idNumber for improvementActivity is required'},
    title: {type: String, default: '', trim: true, required: 'Please fill improvement activity title'},
    description: {type: String, default: '', trim: true},

    type : {type: Schema.Types.ObjectId, default: null, ref: 'ImprovementType', $tenant:true},
    reason : {type: Schema.Types.ObjectId, default: null, ref: 'ImprovementReason', $tenant:true},
    state : {type: Schema.Types.ObjectId, default: null, ref: 'ImprovementState', $tenant:true},
    priority : {type: Schema.Types.ObjectId, default: null, ref: 'LogPriority', $tenant:true},

    statusReview : {
        currentRecord : statusReviewRecord,
        history : [statusReviewRecord]
    },

    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User', default:null}
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

    improvementActivities : [ImprovementActivitySchema],

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
