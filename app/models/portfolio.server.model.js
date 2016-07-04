'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    _ = require('lodash'),
	deepPopulate = require('mongoose-deep-populate')(mongoose);
require('mongoose-multitenant');


// --- Portfolio Stakeholders ---

var AssignedPeopleCategorySchema = new Schema({
    category : {type: Schema.Types.ObjectId, ref: 'PeopleCategory', $tenant:true},
    categoryValue : {type: Schema.Types.ObjectId, ref: 'PeopleCategoryValue', $tenant:true}
});

var AssignedPeoplePortfolioRoleSchema = new Schema({
    role : {
        name: {
            type: String,
            default: '',
            required: 'Please fill role name',
            trim: true
        },
        description: {
            type: String,
            default: '',
            trim: true
        }
    },
    person: {type: Schema.Types.ObjectId, ref: 'Person', $tenant:true},
    categorization : [AssignedPeopleCategorySchema]
});

var AssignedPeoplePortfolioGroupSchema = new Schema({
    group : {type: Schema.Types.ObjectId, ref: 'PeoplePortfolioGroup', $tenant:true},
    roles : [AssignedPeoplePortfolioRoleSchema]
});



// --- Status only ---

var onlyStatusRecord = {
    status: {
        _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
        name : {type: String, default:null},
        color : {type: String, default: null}
    },
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'PortfolioStatusUpdate', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

// --- Budget ---

var portfolioBudgetRecord = {
    amount: {type: Number, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'PortfolioChangeRequest', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

// --- Portfolio Status Area ---

var areaRecord = {
    status: {
        _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
        name : {type: String, default:null},
        color : {type: String, default: null}
    },
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'PortfolioStatusUpdate', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: { _id: {type: Schema.ObjectId, ref: 'User', default:null}, displayName: {type: String} }
};

var PortfolioStatusAreaSchema = new Schema({
    statusArea:{
        _id: {type: Schema.Types.ObjectId, ref: 'LogStatusArea', $tenant:true},
        name: {type: String}
    },
    currentRecord: areaRecord,
    history:[areaRecord]
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
    
    earmarkedFunds : {type: Number, default: null},
    
	budget : {
        currentRecord : portfolioBudgetRecord,
        history : [portfolioBudgetRecord]
    },
    
    portfolioStatus : {
        overallStatus : {
            currentRecord: onlyStatusRecord,
            history:[onlyStatusRecord]
        },
        portfolioStatusAreas : [PortfolioStatusAreaSchema]
    },
    
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
