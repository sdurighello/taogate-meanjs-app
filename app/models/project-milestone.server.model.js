'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate')(mongoose),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Project milestone Schema
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

var ProjectMilestoneSchema = new Schema({
    project: {type: Schema.Types.ObjectId, ref: 'Project', $tenant:true, required:'Project for milestone is required'},
    gate: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true, required:'Gate for milestone is required'},
        name: {type: String},
        standardGate: {type: Schema.ObjectId, ref: 'GateProcessTemplate.gates', default:null, $tenant:true}
    },
    type : {type: Schema.Types.ObjectId, ref: 'ProjectMilestoneType', $tenant:true, required:'Type for milestone is required'},

    name : {type: String, default:'', trim: true, required:'Milestone name required'},
    description : {type: String, default:'', trim: true},

    state : {type: Schema.Types.ObjectId, default: null, ref: 'MilestoneState', $tenant:true},

    statusReview : {
        currentRecord : statusReviewRecord,
        history : [statusReviewRecord]
    },

    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});

ProjectMilestoneSchema.plugin(deepPopulate);
mongoose.mtModel('ProjectMilestone', ProjectMilestoneSchema);
