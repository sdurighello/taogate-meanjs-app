'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash'),
    deepPopulate = require('mongoose-deep-populate')(mongoose);
require('mongoose-multitenant');


// --- Approval Record ---

var approvalRecord = {
    approvalState: {type: String, enum: ['draft', 'submitted', 'approved','rejected'], default:'draft'},
    created: { type: Date, default: Date.now },
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

// --- Area Review ---

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


/**
 * Portfolio status update Schema
 */


var PortfolioStatusUpdateSchema = new Schema({
    
    portfolio: {type: Schema.Types.ObjectId, ref: 'Portfolio', $tenant:true, required:'Portfolio is required'},
    
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

    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});

PortfolioStatusUpdateSchema.plugin(deepPopulate);
mongoose.mtModel('PortfolioStatusUpdate', PortfolioStatusUpdateSchema);
