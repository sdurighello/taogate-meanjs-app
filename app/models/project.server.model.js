'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate')(mongoose);
require('mongoose-multitenant');

/**
 * Project Schema
 */


// ------------------------------------------------ SUB-SCHEMAS --------------------------------------------------


    // --- Categorization ---


var AssignedCategorySchema = new Schema({
    category : {type: Schema.Types.ObjectId, ref: 'Category', $tenant:true},
    categoryValue : {type: Schema.Types.ObjectId, ref: 'CategoryValue', $tenant:true}
});

var AssignedCategoryGroupSchema = new Schema({
    group : {type: Schema.Types.ObjectId, ref: 'CategoryGroup', $tenant:true},
    categories : [AssignedCategorySchema]
});

    // --- Prioritization ---

var AssignedPrioritySchema = new Schema({
    priority : {type: Schema.Types.ObjectId, ref: 'Priority', $tenant:true},
    priorityValue : {type: Schema.Types.ObjectId, ref: 'PriorityValue', $tenant:true}
});

var AssignedPriorityGroupSchema = new Schema({
    group : {type: Schema.Types.ObjectId, ref: 'PriorityGroup', $tenant:true},
    priorities : [AssignedPrioritySchema]
});


    // --- Qualitative Analysis ---


var AssignedImpactSchema = new Schema({
    impact : {type: Schema.Types.ObjectId, ref: 'QualitativeImpact', $tenant:true},
    score : {type: Schema.Types.ObjectId, ref: 'QualitativeImpactScore', $tenant:true}
});

var AssignedImpactGroupSchema = new Schema({
    group : {type: Schema.Types.ObjectId, ref: 'QualitativeImpactGroup', $tenant:true},
    impacts : [AssignedImpactSchema]
});



    // --- Risk Analysis ---


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


    // --- Project Stakeholders ---

var AssignedPeopleCategorySchema = new Schema({
    category : {type: Schema.Types.ObjectId, ref: 'PeopleCategory', $tenant:true},
    categoryValue : {type: Schema.Types.ObjectId, ref: 'PeopleCategoryValue', $tenant:true}
});

var AssignedPeopleProjectRoleSchema = new Schema({
    role : {type: Schema.Types.ObjectId, ref: 'PeopleProjectRole', $tenant:true},
    person: {type: Schema.Types.ObjectId, ref: 'Person', $tenant:true},
    categorization : [AssignedPeopleCategorySchema]
});

var AssignedPeopleProjectGroupSchema = new Schema({
    group : {type: Schema.Types.ObjectId, ref: 'PeopleProjectGroup', $tenant:true},
    roles : [AssignedPeopleProjectRoleSchema]
});


    // -------------- Delivery --------------


// APPROVAL

var approvalRecord = {
    approvalState: {type: String, enum: ['draft', 'submitted', 'approved','rejected'], default:'draft'},
    created: { type: Date, default: Date.now },
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

/* DURATION */

var actualDurationReviewRecord = {
    gateDate: {type: Date, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var ActualDurationSchema = new Schema({
    targetGate:{
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
        name: { type: String, default: '', required: 'Please fill Gate name', trim: true },
        position:{ type: Number, required: 'Position for gate is required', min:1}
    },    
    currentRecord: actualDurationReviewRecord,
    history:[actualDurationReviewRecord]
});

var estimateDurationReviewRecord = {
    gateDate: {type: Date, default: null},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var EstimateDurationSchema = new Schema({
    targetGate:{
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
        name: { type: String, default: '', required: 'Please fill Gate name', trim: true },
        position:{ type: Number, required: 'Position for gate is required', min:1}
    },    
    currentRecord: estimateDurationReviewRecord,
    history:[estimateDurationReviewRecord]
});

var baselineDurationReviewRecord = {
    gateDate: {type: Date, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var BaselineDurationSchema = new Schema({
    targetGate:{
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
        name: { type: String, default: '', required: 'Please fill Gate name', trim: true },
        position:{ type: Number, required: 'Position for gate is required', min:1}
    },    
    currentRecord: baselineDurationReviewRecord,
    history:[baselineDurationReviewRecord]
});

/* COST */

var actualCostReviewRecord = {
    cost: {type: Number, min:0, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var ActualCostSchema = new Schema({
    targetGate:{
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
        name: { type: String, default: '', required: 'Please fill Gate name', trim: true },
        position:{ type: Number, required: 'Position for gate is required', min:1}
    },    
    currentRecord: actualCostReviewRecord,
    history:[actualCostReviewRecord]
});

var estimateCostReviewRecord = {
    cost: {type: Number, min:0, default: null},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var EstimateCostSchema = new Schema({
    targetGate:{
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
        name: { type: String, default: '', required: 'Please fill Gate name', trim: true },
        position:{ type: Number, required: 'Position for gate is required', min:1}
    },    
    currentRecord: estimateCostReviewRecord,
    history:[estimateCostReviewRecord]
});

var baselineCostReviewRecord = {
    cost: {type: Number, min:0, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var BaselineCostSchema = new Schema({
    targetGate:{
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
        name: { type: String, default: '', required: 'Please fill Gate name', trim: true },
        position:{ type: Number, required: 'Position for gate is required', min:1}
    },    
    currentRecord: baselineCostReviewRecord,
    history:[baselineCostReviewRecord]
});

/* COMPLETION */

var actualCompletionReviewRecord = {
    completion: {type: Number, min:0, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var ActualCompletionSchema = new Schema({
    targetGate:{
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
        name: { type: String, default: '', required: 'Please fill Gate name', trim: true },
        position:{ type: Number, required: 'Position for gate is required', min:1}
    },    
    currentRecord: actualCompletionReviewRecord,
    history:[actualCompletionReviewRecord]
});

var estimateCompletionReviewRecord = {
    completion: {type: Number, min:0, default: null},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var EstimateCompletionSchema = new Schema({
    targetGate:{
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
        name: { type: String, default: '', required: 'Please fill Gate name', trim: true },
        position:{ type: Number, required: 'Position for gate is required', min:1}
    },    
    currentRecord: estimateCompletionReviewRecord,
    history:[estimateCompletionReviewRecord]
});

var baselineCompletionReviewRecord = {
    completion: {type: Number, min:0, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var BaselineCompletionSchema = new Schema({
    targetGate:{
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
        name: { type: String, default: '', required: 'Please fill Gate name', trim: true },
        position:{ type: Number, required: 'Position for gate is required', min:1}
    },
    currentRecord: baselineCompletionReviewRecord,
    history:[baselineCompletionReviewRecord]
});

/* OUTCOME */

var scoreReviewRecord = {
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    score: {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var outcomeStatusReviewRecord = {
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var ProjectOutcomeSchema = new Schema({
    _id: {type: Schema.Types.ObjectId, ref: 'GateProcessTemplate.gates.outcomes', $tenant:true},
    name: { type: String, default: '', required: 'Gate outcome name is required', trim: true },
    description: { type: String, default: '', trim: true },
    score: {
        currentRecord: scoreReviewRecord,
        history:[scoreReviewRecord]
    },
    status: {
        currentStatus: outcomeStatusReviewRecord,
        historyStatus:[outcomeStatusReviewRecord]
    }
});

/* GATE STATUS */

var gateStatusRecord = {
    completed: {type: Boolean, default: false},
    currentGate : {type: Boolean, default: false},
    status : {type: Schema.Types.ObjectId, ref: 'GateStatus', default:null, $tenant:true},
    overallScore : {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

/* BUDGET */

var budgetRecord = {
    amount: {type: Number, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'ProjectChangeRequest', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

/* DELIVERY STATUS */

var overallStatusRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var durationStatusRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var costStatusRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var completionStatusRecord = {
    status: {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'ProjectStatusUpdate', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

// ----------------- GATE REVIEW ---------------

// Outcome review

var OutcomeReviewSchema = new Schema({
    outcome : {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.outcomes', $tenant:true},
        name: {type: String},
        score: {
            currentRecord: {
                score: {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', default:null, $tenant:true},
                comment :{type: String, trim:true, default:''}
            }
        }
    },
    newScore : {type: Schema.Types.ObjectId, default: null, ref: 'GateOutcomeScore', $tenant:true},
    newComment : {type: String, default: ''}
});

// Performances review

var BaselineDurationReviewSchema = new Schema({
    baselineDuration: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.duration.baselineDurations', $tenant:true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        }
    },
    newDate : {type: Date, default: null}
});

var EstimateDurationReviewSchema = new Schema({
    estimateDuration: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.duration.estimateDurations', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        }
    },
    newDate : {type: Date, default: null}
});

var ActualDurationReviewSchema = new Schema({
    actualDuration: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.duration.actualDurations', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        }
    },
    newDate : {type: Date, default: null}
});

var BaselineCostReviewSchema = new Schema({
    baselineCost: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.cost.baselineCosts', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        }
    },
    newCost : {type: Number, default: null}
});

var EstimateCostReviewSchema = new Schema({
    estimateCost: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.cost.estimateCosts', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        }
    },
    newCost : {type: Number}
});

var ActualCostReviewSchema = new Schema({
    actualCost: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.cost.actualCosts', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        }
    },
    newCost : {type: Number, default: null}
});

var BaselineCompletionReviewSchema = new Schema({
    baselineCompletion: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.completion.baselineCompletions', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        }
    },
    newCompletion : {type: Number, default: null}
});

var EstimateCompletionReviewSchema = new Schema({
    estimateCompletion: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.completion.estimateCompletions', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        }
    },
    newCompletion : {type: Number, default: null}
});

var ActualCompletionReviewSchema = new Schema({
    actualCompletion: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.completion.actualCompletions', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        }
    },
    newCompletion : {type: Number, default: null}
});

// Gate review

var GateReviewSchema = new Schema({

    reviewDate : {type: Date, default: Date.now, required:'Review date required'},
    title : {type: String, default:'', required:'Review title required'},
    overallComment : {type: String, default:''},

    approval : {
        currentRecord : approvalRecord,
        history : [approvalRecord]
    },

    outcomeReviews : [OutcomeReviewSchema],

    gateStatusReview: {
        gateStatus :{
            currentRecord:{
                completed: {type: Boolean, default: false},
                status : {type: Schema.Types.ObjectId, ref: 'GateStatus', default:null, $tenant:true},
                overallScore : {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', default:null, $tenant:true}
            }
        },
        newStatus : {type: Schema.Types.ObjectId, ref: 'GateStatus', default: null, $tenant:true},
        newOverallScore : {type: Schema.Types.ObjectId, default: null, ref: 'GateOutcomeScore', $tenant:true},
        newCompleted : {type: Boolean, default: false}
    },

    budgetReview : {
        currentAmount: {type: Number, default: null},
        newAmount: {type: Number, default: null}
    },

    performances: {
        duration: {
            baselineDurationReviews: [BaselineDurationReviewSchema],
            estimateDurationReviews: [EstimateDurationReviewSchema],
            actualDurationReviews: [ActualDurationReviewSchema]
        },
        cost: {
            baselineCostReviews: [BaselineCostReviewSchema],
            estimateCostReviews: [EstimateCostReviewSchema],
            actualCostReviews: [ActualCostReviewSchema]
        },
        completion: {
            baselineCompletionReviews: [BaselineCompletionReviewSchema],
            estimateCompletionReviews: [EstimateCompletionReviewSchema],
            actualCompletionReviews: [ActualCompletionReviewSchema]
        }
    },

    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});

/* GATE */

var ProjectGateSchema = new Schema({
    _id: {type: Schema.ObjectId, ref: 'GateProcessTemplate.gates', $tenant:true},
    name: { type: String, default: '', required: 'Please fill Gate name', trim: true },
    description: { type: String, default: '', trim: true },
    position:{ type: Number, required: 'Position for gate is required', min:1},
    outcomes : [ProjectOutcomeSchema],
    gateStatus: {
        currentRecord: gateStatusRecord,
        history:[gateStatusRecord]
    },
    budget : {
        currentRecord: budgetRecord,
        history:[budgetRecord]
    },
    performances: {
        duration: {
            baselineDurations: [BaselineDurationSchema],
            estimateDurations: [EstimateDurationSchema],
            actualDurations: [ActualDurationSchema]
        },
        cost: {
            baselineCosts: [BaselineCostSchema],
            estimateCosts: [EstimateCostSchema],
            actualCosts: [ActualCostSchema]
        },
        completion: {
            baselineCompletions: [BaselineCompletionSchema],
            estimateCompletions: [EstimateCompletionSchema],
            actualCompletions: [ActualCompletionSchema]
        }
    },
    deliveryStatus: {
        overallStatus : {
            currentRecord: overallStatusRecord,
            history:[overallStatusRecord]
        },
        durationStatus : {
            currentRecord: durationStatusRecord,
            history:[durationStatusRecord]
        },
        costStatus : {
            currentRecord: costStatusRecord,
            history:[costStatusRecord]
        },
        completionStatus : {
            currentRecord: completionStatusRecord,
            history:[completionStatusRecord]
        }
    },
    gateReviews : [GateReviewSchema]
});

// ------------------------------------------------ BIG FAT SCHEMA --------------------------------------------------


var ProjectSchema = new Schema({

    idNumber: {type: Number, required:'Sequential counter for project is required'},

    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'},


    // ----------------- DEFINITION ---------------------


    parent: {type: Schema.ObjectId, ref: 'StrategyNode', default:null, $tenant:true},
    portfolio: {type: Schema.ObjectId, ref: 'Portfolio', default:null, $tenant:true},
    identification: {
        idReference: {type: String, trim: true, default:null},
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

    // ----------------- EVALUATION ---------------------

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

    stakeholders: [AssignedPeopleProjectGroupSchema],



    // ----------------- DELIVERY ---------------------

    process: {
        
        _id: {type: Schema.ObjectId, ref: 'GateProcessTemplate', $tenant:true},
        
        assignmentType: {type: String, enum: ['custom', 'standard', 'unassigned'], default:'unassigned'},
        assignmentConfirmed: {type: Boolean, default: false},
        
        name: { type: String, default: '', trim: true },
        description: { type: String, default: '', trim: true },

        startGate: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
        endGate: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},

        gates: [ProjectGateSchema],

        approval : {
            currentRecord : approvalRecord,
            history : [approvalRecord]
        }
    }


});

ProjectSchema.plugin(deepPopulate);
mongoose.mtModel('Project', ProjectSchema);
