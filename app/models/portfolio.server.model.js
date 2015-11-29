'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate');
require('mongoose-multitenant');



/**
 * Portfolio Schema
 */



// ------------------------------------------------ SUB-SCHEMAS --------------------------------------------------


// --- Portfolio Stakeholders ---

var AssignedPeopleCategorySchema = new Schema({
    category : {type: Schema.Types.ObjectId, ref: 'PeopleCategory', $tenant:true},
    categoryValue : {type: Schema.Types.ObjectId, ref: 'PeopleCategoryValue', $tenant:true}
});

var AssignedPeoplePortfolioRoleSchema = new Schema({
    role : {type: Schema.Types.ObjectId, ref: 'PeoplePortfolioRole', $tenant:true},
    person: {type: Schema.Types.ObjectId, ref: 'Person', $tenant:true},
    categorization : [AssignedPeopleCategorySchema]
});

var AssignedPeoplePortfolioGroupSchema = new Schema({
    group : {type: Schema.Types.ObjectId, ref: 'PeoplePortfolioGroup', $tenant:true},
    roles : [AssignedPeoplePortfolioRoleSchema]
});



// ------------------------------------------------ BIG FAT PORTFOLIO SCHEMA --------------------------------------------------



var PortfolioSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Portfolio name',
		trim: true
	},
	portfolioManager : {type: Schema.Types.ObjectId, ref: 'User', default:null},
	backupPortfolioManager : {type: Schema.Types.ObjectId, ref: 'User', default:null},
	type : {type: Schema.Types.ObjectId, ref: 'PortfolioType', default:null, $tenant:true},
	parent : {type: Schema.Types.ObjectId, ref: 'Portfolio', default:null, $tenant:true},
	ancestors : [{type: Schema.Types.ObjectId, ref: 'Portfolio', default:null, $tenant:true}],
	funds : {type: Number, default:null},

	stakeholders: [AssignedPeoplePortfolioGroupSchema],

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

PortfolioSchema.plugin(deepPopulate);
mongoose.mtModel('Portfolio', PortfolioSchema);
