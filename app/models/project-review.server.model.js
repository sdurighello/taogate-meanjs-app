'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');


var PeopleReviewCopySchema = new Schema({
    peopleGroup : {type: Schema.Types.ObjectId, ref: 'PeopleProjectGroup', default:null, $tenant:true},
    peopleRole : {type: Schema.Types.ObjectId, ref: 'PeopleProjectRole', default:null, $tenant:true},
    person : {type: Schema.Types.ObjectId, ref: 'Person', default:null, $tenant:true},

    comment: {type: String, default: '', trim: true},
    score : {type: Schema.Types.ObjectId, ref: 'ProjectReviewScore', default:null, $tenant:true},
    submitted : {type: Boolean, default:false},

    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
});

var ProjectReviewItemCopySchema = new Schema({
    name: {type: String, default: '', required: 'Please fill Project review item name', trim: true},
    description: {type: String, default: '', trim: true},
    weight: {type: Number, min: 0, max: 100, default: 0, required: 'Please fill review item weight'},

    peopleReviews : [PeopleReviewCopySchema],

    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
});

var ProjectReviewGroupCopySchema = new Schema({
    name: {type: String, default: '', required: 'Please fill Project review group name', trim: true},
    description: {type: String, default: '', trim: true},
    weight: {type: Number, min: 0, max: 100, default: 0, required: 'Please fill review group weight'},

    peopleGroups : [{type: Schema.Types.ObjectId, ref: 'PeopleProjectGroup', $tenant:true}],
    items : [ProjectReviewItemCopySchema],

    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
});

var approvalRecord = {
    approvalState: {type: String, enum: ['draft', 'submitted', 'completed'], default:'draft', required:'Approval flag is required'},
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
};

/**
 * Project review Schema
 */
var ProjectReviewSchema = new Schema({
	project : {type: Schema.Types.ObjectId, ref: 'Project', required:'Project for project review is required', $tenant:true},
    name: {type: String, default: '', required: 'Please fill Project review name', trim: true},

    startDate : {type: Date, default: null},
    endDate : {type: Date, default: null},

    approval : {
        currentRecord : approvalRecord,
        history : [approvalRecord]
    },

    template : {type: Schema.Types.ObjectId, ref: 'ProjectReviewTemplate', required:'Template for project review is required', $tenant:true},
    type : {type: Schema.Types.ObjectId, ref: 'ProjectReviewType', default:null, required: 'Type for project review is required', $tenant:true},
    // copy of 'project-review-template' model
    groups : [ProjectReviewGroupCopySchema],

	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User'}
});

ProjectReviewSchema.plugin(deepPopulate);
mongoose.mtModel('ProjectReview', ProjectReviewSchema);
