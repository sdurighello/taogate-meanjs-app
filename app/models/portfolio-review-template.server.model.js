'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Portfolio review template Schema
 */

var PeopleReviewSchema = new Schema({
	peopleGroup : {type: Schema.Types.ObjectId, ref: 'PeoplePortfolioGroup', default:null, $tenant:true},
	peopleRole : {type: Schema.Types.ObjectId, ref: 'PeoplePortfolioRole', default:null, $tenant:true},
	person : {type: Schema.Types.ObjectId, ref: 'Person', default:null, $tenant:true},

	comment: {type: String, default: '', trim: true},
	score : {type: Schema.Types.ObjectId, ref: 'ProjectReviewScore', default:null, $tenant:true}
});

var PortfolioReviewItemSchema = new Schema({
	name: {type: String, default: '', required: 'Please fill Portfolio review item name', trim: true},
	description: {type: String, default: '', trim: true},
	weight: {type: Number, min: 0, max: 100, default: 0, required: 'Please fill review item weight'},

	peopleReviews : [PeopleReviewSchema],

	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User'}
});

var PortfolioReviewGroupSchema = new Schema({
	name: {type: String, default: '', required: 'Please fill Project review group name', trim: true},
	description: {type: String, default: '', trim: true},
	weight: {type: Number, min: 0, max: 100, default: 0, required: 'Please fill review group weight'},

	peopleGroups : [{type: Schema.Types.ObjectId, ref: 'PeoplePortfolioGroup', $tenant:true}],
	items : [PortfolioReviewItemSchema],

	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User'}
});

/**
 * Portfolio review template Schema
 */

var PortfolioReviewTemplateSchema = new Schema({
	name: {type: String, default: '', required: 'Please fill Portfolio review template name', trim: true},
	description:{type: String, default: '', trim: true},

	type : {type: Schema.Types.ObjectId, ref: 'ProjectReviewType', default:null, $tenant:true},
	groups : [PortfolioReviewGroupSchema],

	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User'}
});

PortfolioReviewTemplateSchema.plugin(deepPopulate);
mongoose.mtModel('PortfolioReviewTemplate', PortfolioReviewTemplateSchema);
