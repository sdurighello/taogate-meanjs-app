'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose),
    Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Project review template Schema
 */

var PeopleReviewSchema = new Schema({
    peopleGroup : {type: Schema.Types.ObjectId, ref: 'PeopleProjectGroup', default:null, $tenant:true},
    peopleRole : {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.stakeholders.roles', default:null, $tenant:true},
        name: {type: String, default: null},
        description: {type: String, default: null}
    },
    person : {type: Schema.Types.ObjectId, ref: 'Person', default:null, $tenant:true},

    comment: {type: String, default: '', trim: true},
    score : {type: Schema.Types.ObjectId, ref: 'ProjectReviewScore', default:null, $tenant:true},
    submitted : {type: Boolean, default:false},

    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
});

var ProjectReviewItemSchema = new Schema({
    name: {type: String, default: '', required: 'Please fill Project review item name', trim: true},
    description: {type: String, default: '', trim: true},
    weight: {type: Number, min: 0, max: 100, default: 0, required: 'Please fill review item weight'},

    peopleReviews : [PeopleReviewSchema]
});

var ProjectReviewGroupSchema = new Schema({
    name: {type: String, default: '', required: 'Please fill Project review group name', trim: true},
    description: {type: String, default: '', trim: true},
    weight: {type: Number, min: 0, max: 100, default: 0, required: 'Please fill review group weight'},

    peopleGroups : [{type: Schema.Types.ObjectId, ref: 'PeopleProjectGroup', $tenant:true}],
    items : [ProjectReviewItemSchema]
});

/**
 * Project review template Schema
 */
var ProjectReviewTemplateSchema = new Schema({
	name: {type: String, default: '', required: 'Please fill Project review template name', trim: true},
	description:{type: String, default: '', trim: true},

    type : {type: Schema.Types.ObjectId, ref: 'ProjectReviewType', default:null, required: 'Type for project review template is required', $tenant:true},
    groups : [ProjectReviewGroupSchema],

    created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User'}
});

ProjectReviewTemplateSchema.plugin(deepPopulate);
mongoose.mtModel('ProjectReviewTemplate', ProjectReviewTemplateSchema);
