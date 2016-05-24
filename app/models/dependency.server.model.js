'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose),
    Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Dependency Schema
 */

var statusReviewRecord = {
    baselineDeliveryDate : {type: Date, default: null},
    estimateDeliveryDate : {type: Date, default: null},
    actualDeliveryDate : {type: Date, default: null},
    completed : {type: Boolean, default: false, required:'Milestone completed flag is required'},
    status: {type: Schema.Types.ObjectId, default: null, ref: 'LogStatusIndicator', $tenant:true},
    statusComment : {type: String, default:'', trim: true},
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
};
    

var DependencySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Dependency name',
		trim: true
	},
    description: {type: String, default: '', trim: true},

    type : {type: Schema.Types.ObjectId, default: null, ref: 'DependencyType', $tenant:true},
    impact : {type: Schema.Types.ObjectId, default: null, ref: 'DependencyImpact', $tenant:true},

    state : {type: Schema.Types.ObjectId, default: null, ref: 'DependencyState', $tenant:true},

    statusReview : {
        currentRecord : statusReviewRecord,
        history : [statusReviewRecord]
    },

    source : {type: Schema.Types.ObjectId, ref: 'Project', $tenant:true, required:'Source project missing'},
    target : {type: Schema.Types.ObjectId, ref: 'Project', $tenant:true, required:'Target project missing'},

	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User'}
});

DependencySchema.plugin(deepPopulate);
mongoose.mtModel('Dependency', DependencySchema);
