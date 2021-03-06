'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate')(mongoose),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Portfolio review Schema
 */


var PeopleReviewCopySchema = new Schema({
    peopleGroup : {type: Schema.Types.ObjectId, ref: 'PeoplePortfolioGroup', default:null, $tenant:true},
    peopleRole : {
        _id: {type: Schema.Types.ObjectId, ref: 'Portfolio.stakeholders.roles', default:null, $tenant:true},
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

var PortfolioReviewItemCopySchema = new Schema({
    name: {type: String, default: '', required: 'Please fill Portfolio review item name', trim: true},
    description: {type: String, default: '', trim: true},
    weight: {type: Number, min: 0, max: 100, default: 0, required: 'Please fill review item weight'},

    peopleReviews : [PeopleReviewCopySchema]
});

var PortfolioReviewGroupCopySchema = new Schema({
    name: {type: String, default: '', required: 'Please fill Portfolio review group name', trim: true},
    description: {type: String, default: '', trim: true},
    weight: {type: Number, min: 0, max: 100, default: 0, required: 'Please fill review group weight'},

    peopleGroups : [{type: Schema.Types.ObjectId, ref: 'PeoplePortfolioGroup', $tenant:true}],
    items : [PortfolioReviewItemCopySchema]
});

var approvalRecord = {
    approvalState: {type: String, enum: ['draft', 'submitted', 'completed'], default:'draft', required:'Approval flag is required'},
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
};

/**
 * Portfolio review Schema
 */

var PortfolioReviewSchema = new Schema({
    portfolio : {type: Schema.Types.ObjectId, ref: 'Portfolio', required:'Portfolio for portfolio review is required', $tenant:true},
    name: {type: String, default: '', required: 'Please fill Portfolio review name', trim: true},

    startDate : {type: Date, default: null},
    endDate : {type: Date, default: null},

    approval : {
        currentRecord : approvalRecord,
        history : [approvalRecord]
    },


    template : {type: Schema.Types.ObjectId, ref: 'PortfolioReviewTemplate', required:'Template for portfolio review is required', $tenant:true},
    type : {type: Schema.Types.ObjectId, ref: 'PortfolioReviewType', default:null, required: 'Type for portfolio review is required', $tenant:true},
    // copy of 'portfolio-review-template' model
    groups : [PortfolioReviewGroupCopySchema],

    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
});

PortfolioReviewSchema.plugin(deepPopulate);
mongoose.model('PortfolioReview', PortfolioReviewSchema);
