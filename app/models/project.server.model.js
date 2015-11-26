'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate');
require('mongoose-multitenant');

/**
 * Project Schema
 */


// ----

var AssignedCategorySchema = new Schema({
    category : {type: Schema.Types.ObjectId, ref: 'Category', $tenant:true},
    categoryValue : {type: Schema.Types.ObjectId, ref: 'CategoryValue', $tenant:true}
});

var AssignedCategoryGroupSchema = new Schema({
    group : {type: Schema.Types.ObjectId, ref: 'CategoryGroup', $tenant:true},
    categories : [AssignedCategorySchema]
});

// ----

var AssignedPrioritySchema = new Schema({
    priority : {type: Schema.Types.ObjectId, ref: 'Priority', $tenant:true},
    priorityValue : {type: Schema.Types.ObjectId, ref: 'PriorityValue', $tenant:true}
});

var AssignedPriorityGroupSchema = new Schema({
    group : {type: Schema.Types.ObjectId, ref: 'PriorityGroup', $tenant:true},
    priorities : [AssignedPrioritySchema]
});


// ----


var AssignedImpactSchema = new Schema({
    impact : {type: Schema.Types.ObjectId, ref: 'QualitativeImpact', $tenant:true},
    score : {type: Schema.Types.ObjectId, ref: 'QualitativeImpactScore', $tenant:true}
});

var AssignedImpactGroupSchema = new Schema({
    group : {type: Schema.Types.ObjectId, ref: 'QualitativeImpactGroup', $tenant:true},
    impacts : [AssignedImpactSchema]
});



// ----


var AssignedRiskSchema = new Schema({
    risk : {type: Schema.Types.ObjectId, ref: 'Risk', $tenant:true},
    impact : {type: Schema.Types.ObjectId, ref: 'RiskImpact', $tenant:true},
    probability : {type: Schema.Types.ObjectId, ref: 'RiskProbability', $tenant:true},
    severityAssignment : {type: Schema.Types.ObjectId, ref: 'RiskSeverityAssignment', $tenant:true}
});

var AssignedRiskCategorySchema = new Schema({
    category : {type: Schema.Types.ObjectId, ref: 'RiskCategory', $tenant:true},
    risks : [AssignedRiskSchema]
});




// ------------------------ BIG FAT SCHEMA ------------------------

var ProjectSchema = new Schema({
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'},

// -------------------------------------------------- DEFINITION -----------------------------------------------------

    parent: {type: Schema.ObjectId, ref: 'StrategyNode', default:null, $tenant:true},
    portfolio: {type: Schema.ObjectId, ref: 'Portfolio', default:null, $tenant:true},
    identification: {
        idNumber: {type: String, trim: true, default:null},
        name: {type: String, default: '', trim: true, required:'Project name is required'},
        description: {type: String, default: '', trim: true},
        earmarkedFunds: {type: Number, default:null},
        reqStartDate:{type: Date, default:null},
        reqEndDate:{type: Date, default:null},
        projectManager : {type: Schema.Types.ObjectId, ref: 'User', default:null},
        backupProjectManager : {type: Schema.Types.ObjectId, ref: 'User', default:null}
    },
    categorization: [AssignedCategoryGroupSchema],
    prioritization: [AssignedPriorityGroupSchema],
    selection: {
        active: {type: Boolean, default: true, required: 'Field active of project is required'}, // Still there but "view only"
        selectedForPrioritization: {type: Boolean, default: false},
        selectedForEvaluation: {type: Boolean, default: false},
        selectedForDelivery: {type: Boolean, default: false}
    },

// -------------------------------------------------- EVALUATION -----------------------------------------------------

    // Financial analysis

    discountRate:{type: Number, default:null, min:0},
    baseYear: {type: Number, default:null, min:0},
    costs: [{type: Schema.ObjectId, ref: 'FinancialCost', $tenant:true}],
    benefits: [{type: Schema.ObjectId, ref: 'FinancialBenefit', $tenant:true}],

    // Qualitative analysis

    qualitativeAnalysis: [AssignedImpactGroupSchema],

    // Risk analysis

    riskAnalysis: [AssignedRiskCategorySchema],

    // Stakeholders

    stakeholders: [],

// -------------------------------------------------- DELIVERY -----------------------------------------------------

    process: {type: Schema.ObjectId, ref: 'GateProcess', default:null, $tenant:true}

});



ProjectSchema.plugin(deepPopulate);
mongoose.mtModel('Project', ProjectSchema);
