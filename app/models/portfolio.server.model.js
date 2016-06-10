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
    role : {type: Schema.Types.ObjectId, ref: 'PeoplePortfolioRole', $tenant:true},
    person: {type: Schema.Types.ObjectId, ref: 'Person', $tenant:true},
    categorization : [AssignedPeopleCategorySchema]
});

var AssignedPeoplePortfolioGroupSchema = new Schema({
    group : {type: Schema.Types.ObjectId, ref: 'PeoplePortfolioGroup', $tenant:true},
    roles : [AssignedPeoplePortfolioRoleSchema]
});

// --- Approval Record ---

var approvalRecord = {
    approvalState: {type: String, enum: ['draft', 'submitted', 'approved','rejected'], default:'draft'},
    created: { type: Date, default: Date.now },
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

// --- Status only ---

var onlyStatusRecord = {
    status: {
        _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
        name : {type: String, default:null},
        color : {type: String, default: null}
    },
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'Portfolio.portfolioStatusUpdates', default:null, $tenant:true},
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
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'Portfolio.portfolioStatusUpdates', default:null, $tenant:true},
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
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'Portfolio.portfolioStatusUpdates', default:null, $tenant:true},
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

var PortfolioAreaReviewSchema = new Schema({
    portfolioStatusArea : {
        _id: {type: Schema.Types.ObjectId, ref: 'Portfolio.portfolioStatus.portfolioStatusAreas', $tenant:true},
        statusArea: {
            _id: {type: Schema.Types.ObjectId, ref: 'LogStatusArea', $tenant:true},
            name: {type: String}
        },
        currentRecord: {
            status: {
                _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
                name : {type: String, default:null},
                color : {type: String, default: null}
            },
            comment :{type: String, trim:true, default:''}
        }
    },
    newStatus: {
        _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
        name : {type: String, default:null},
        color : {type: String, default: null}
    },
    newComment : {type: String, trim: true}
});

var PortfolioStatusUpdateSchema = new Schema({

    updateDate : {type: Date, default: Date.now, required:'Date required'},
    title : {type: String, default:'', required:'Title required'},
    description : {type: String, default:''},

    approval : {
        currentRecord : approvalRecord,
        history : [approvalRecord]
    },

    portfolioStatus : {
        overallStatusReview : {
            currentRecord: {
                status: {
                    _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
                    name : {type: String, default:null},
                    color : {type: String, default: null}
                },
                comment :{type: String, trim:true, default:''}
            },
            newStatus: {
                _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
                name : {type: String, default:null},
                color : {type: String, default: null}
            },
            newComment :{type: String, trim:true, default:''}
        },
        portfolioStatusAreaReviews : [PortfolioAreaReviewSchema]
    },
    
    budgetReview : {
        currentAmount : {type: Number, default: null},
        newAmount : {type: Number, default: null},
        amountChange: {type: Number, default: null}
    },

    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
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
    
    portfolioStatusUpdates : [PortfolioStatusUpdateSchema],

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

// PRE-SAVE

PortfolioSchema.pre('save', function (next) {

    // portfolio.portfolioStatusUpdates
    _.each(this.portfolioStatusUpdates, function(document){
        if(document.budgetReview.currentAmount && document.budgetReview.newAmount){
            document.budgetReview.budgetChange = document.budgetReview.newAmount - document.budgetReview.currentAmount;
        }
    });

    next();
});

PortfolioSchema.plugin(deepPopulate);
mongoose.mtModel('Portfolio', PortfolioSchema);
