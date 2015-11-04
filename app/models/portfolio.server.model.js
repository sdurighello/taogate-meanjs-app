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
	//milestones : [{type: Schema.Types.ObjectId, ref: 'Portfoliomilestone', $tenant:true}],
	//portfolioIssues : [{type: Schema.Types.ObjectId, ref: 'Portfolioissue', $tenant:true}],
	//portfolioChangeRequests : [{type: Schema.Types.ObjectId, ref: 'Portfoliochangerequest', $tenant:true}],
	//portfolioStatuses : [{type: Schema.Types.ObjectId, ref: 'Portfoliostatus', $tenant:true}],
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
