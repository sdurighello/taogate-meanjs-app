'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    _ = require('lodash'),
deepPopulate = require('mongoose-deep-populate')(mongoose);
require('mongoose-multitenant');

/**
 * Project Schema
 */


// ------------------------------------------------ DEFINITION --------------------------------------------------


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


// ------------------------------------------------ DELIVERY --------------------------------------------------


    // --- Approval Record ---

var approvalRecord = {
    approvalState: {type: String, enum: ['draft', 'submitted', 'approved','rejected'], default:'draft'},
    created: { type: Date, default: Date.now },
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

    // --- Status  Record ---

var changeStatusRecord = {

    baselineDeliveryDate : {type: Date, default: null},
    estimateDeliveryDate : {type: Date, default: null},
    actualDeliveryDate : {type: Date, default: null},

    completed : {type: Boolean, default: false, required:'Completed flag is required'},
    status: {
        _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
        name : {type: String, default:null},
        color : {type: String, default: null}
    },
    comment : {type: String, default:'', trim: true},

    created: { type: Date, default: Date.now },
    user: { _id: {type: Schema.ObjectId, ref: 'User'}, displayName:{type:String} }
};

var onlyStatusRecord = {
    status: {
        _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
        name : {type: String, default:null},
        color : {type: String, default: null}
    },
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.projectStatusUpdates', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

    // --- Duration ---

var actualDurationRecord = {
    gateDate: {type: Date, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.projectChangeRequests', default:null, $tenant:true},
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
    currentRecord: actualDurationRecord,
    history:[actualDurationRecord]
});

var ActualDurationReviewSchema = new Schema({
    actualDuration: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.duration.actualDurations', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        },
        currentRecord: {
            gateDate: {type: Date, default: null}
        }
    },
    newDate : {type: Date, default: null},
    dateChange: {type: Number, default: null}
});


var estimateDurationRecord = {
    gateDate: {type: Date, default: null},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews.projectStatusUpdates', default:null, $tenant:true},
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
    currentRecord: estimateDurationRecord,
    history:[estimateDurationRecord]
});

var EstimateDurationReviewSchema = new Schema({
    estimateDuration: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.duration.estimateDurations', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        },
        currentRecord: {
            gateDate: {type: Date, default: null}
        }
    },
    newDate : {type: Date, default: null},
    dateChange: {type: Number, default: null}
});


var baselineDurationRecord = {
    gateDate: {type: Date, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.projectChangeRequests', default:null, $tenant:true},
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
    currentRecord: baselineDurationRecord,
    history:[baselineDurationRecord]
});

var BaselineDurationReviewSchema = new Schema({
    baselineDuration: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.duration.baselineDurations', $tenant:true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        },
        currentRecord: {
            gateDate: {type: Date, default: null}
        }
    },
    newDate : {type: Date, default: null},
    dateChange: {type: Number, default: null}
});

    // --- Cost ---

var actualCostRecord = {
    cost: {type: Number, min:0, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.projectChangeRequests', default:null, $tenant:true},
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
    currentRecord: actualCostRecord,
    history:[actualCostRecord]
});

var ActualCostReviewSchema = new Schema({
    actualCost: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.cost.actualCosts', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        },
        currentRecord: {
            cost: {type: Number, default: null}
        }
    },
    newCost : {type: Number, default: null},
    costChange: {type: Number, default: null}
});


var estimateCostRecord = {
    cost: {type: Number, min:0, default: null},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.projectStatusUpdates', default:null, $tenant:true},
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
    currentRecord: estimateCostRecord,
    history:[estimateCostRecord]
});

var EstimateCostReviewSchema = new Schema({
    estimateCost: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.cost.estimateCosts', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        },
        currentRecord: {
            cost: {type: Number, default: null}
        }
    },
    newCost : {type: Number},
    costChange: {type: Number, default: null}
});


var baselineCostRecord = {
    cost: {type: Number, min:0, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.projectChangeRequests', default:null, $tenant:true},
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
    currentRecord: baselineCostRecord,
    history:[baselineCostRecord]
});

var BaselineCostReviewSchema = new Schema({
    baselineCost: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.cost.baselineCosts', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        },
        currentRecord: {
            cost: {type: Number, default: null}
        }
    },
    newCost : {type: Number, default: null},
    costChange: {type: Number, default: null}
});

    // --- Completion ---

var actualCompletionRecord = {
    completion: {type: Number, min:0, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.projectChangeRequests', default:null, $tenant:true},
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
    currentRecord: actualCompletionRecord,
    history:[actualCompletionRecord]
});

var ActualCompletionReviewSchema = new Schema({
    actualCompletion: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.completion.actualCompletions', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        },
        currentRecord: {
            completion: {type: Number, default: null}
        }
    },
    newCompletion : {type: Number, default: null},
    completionChange: {type: Number, default: null}
});


var estimateCompletionRecord = {
    completion: {type: Number, min:0, default: null},
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.projectStatusUpdates', default:null, $tenant:true},
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
    currentRecord: estimateCompletionRecord,
    history:[estimateCompletionRecord]
});

var EstimateCompletionReviewSchema = new Schema({
    estimateCompletion: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.completion.estimateCompletions', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        },
        currentRecord: {
            completion: {type: Number, default: null}
        }
    },
    newCompletion : {type: Number, default: null},
    completionChange: {type: Number, default: null}
});


var baselineCompletionRecord = {
    completion: {type: Number, min:0, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.projectChangeRequests', default:null, $tenant:true},
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
    currentRecord: baselineCompletionRecord,
    history:[baselineCompletionRecord]
});

var BaselineCompletionReviewSchema = new Schema({
    baselineCompletion: {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.performances.completion.baselineCompletions', $tenant: true},
        targetGate: {
            _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates', $tenant:true},
            name: {type: String},
            position: {type: Number}
        },
        currentRecord: {
            completion: {type: Number, default: null}
        }
    },
    newCompletion : {type: Number, default: null},
    completionChange: {type: Number, default: null}
});

    // --- Outcomes ---

var outcomeScoreRecord = {
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    score: {
        _id: {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', default:null, $tenant:true},
        name: {type: String, default: null}
    },
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var outcomeStatusRecord = {
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.projectStatusUpdates', default:null, $tenant:true},
    status: {
        _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
        name : {type: String, default:null},
        color : {type: String, default: null}
    },
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var ProjectOutcomeSchema = new Schema({
    standardOutcome: {type: Schema.Types.ObjectId, ref: 'GateProcessTemplate.gates.outcomes', default:null, $tenant:true},
    name: { type: String, default: '', required: 'Gate outcome name is required', trim: true },
    description: { type: String, default: '', trim: true },
    score: {
        currentRecord: outcomeScoreRecord,
        history:[outcomeScoreRecord]
    },
    status: {
        currentRecord: outcomeStatusRecord,
        history:[outcomeStatusRecord]
    }
});

var OutcomeScoreReviewSchema = new Schema({
    outcome : {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.outcomes', $tenant:true},
        name: {type: String},
        score: {
            currentRecord: {
                score: {
                    _id: {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', default:null, $tenant:true},
                    name: {type: String, default: null}
                },
                comment :{type: String, trim:true, default:''}
            }
        }
    },
    newScore : {
        _id: {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', default:null, $tenant:true},
        name: {type: String, default: null}
    },
    newComment : {type: String, default: ''}
});

var OutcomeStatusReviewSchema = new Schema({
    outcome : {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.outcomes', $tenant:true},
        name: {type: String},
        status: {
            currentRecord: {
                status: {
                    _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
                    name : {type: String, default:null},
                    color : {type: String, default: null}
                },
                comment :{type: String, trim:true, default:''}
            }
        }
    },
    newStatus : {
        _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
        name : {type: String, default:null},
        color : {type: String, default: null}
    },
    newComment : {type: String, trim:true, default: ''}
});

    // --- Gate State ---

var gateStateRecord = {
    completed: {type: Boolean, default: false},
    currentGate : {type: Boolean, default: false},
    state: {
        _id : {type: Schema.Types.ObjectId, ref: 'GateState', default:null, $tenant:true},
        name : {type: String, default:null}
    },
    overallScore: {
        _id: {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', default:null, $tenant:true},
        name: {type: String, default: null}
    },
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

    // --- Gate Budget

var budgetRecord = {
    amount: {type: Number, default: null},
    sourceChangeRequest: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.projectChangeRequests', default:null, $tenant:true},
    sourceGateReview: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.gateReviews', default:null, $tenant:true},
    created: {type: Date, default: Date.now},
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};


    // --- Project Area ---

var projectAreaRecord = {
    status: {
        _id : {type: Schema.Types.ObjectId, ref: 'LogStatusIndicator', default:null, $tenant:true},
        name : {type: String, default:null},
        color : {type: String, default: null}
    },
    sourceStatusUpdate: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.projectStatusUpdates', default:null, $tenant:true},
    comment :{type: String, trim:true, default:''},
    created: {type: Date, default: Date.now},
    user: { _id: {type: Schema.ObjectId, ref: 'User', default:null}, displayName: {type: String} }
};

var ProjectStatusAreaSchema = new Schema({
    statusArea:{
        _id: {type: Schema.Types.ObjectId, ref: 'LogStatusArea', $tenant:true},
        name: {type: String}
    },
    currentRecord: projectAreaRecord,
    history:[projectAreaRecord]
});

var ProjectAreaReviewSchema = new Schema({
    projectStatusArea : {
        _id: {type: Schema.Types.ObjectId, ref: 'Project.process.gates.deliveryStatus.projectStatusAreas', $tenant:true},
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


    // --- Gate review ---

var GateReviewSchema = new Schema({

    reviewDate : {type: Date, default: Date.now, required:'Review date required'},
    title : {type: String, default:'', required:'Review title required'},
    overallComment : {type: String, default:''},

    approval : {
        currentRecord : approvalRecord,
        history : [approvalRecord]
    },

    outcomeScoreReviews : [OutcomeScoreReviewSchema],

    gateStateReview: {
        gateState :{
            currentRecord:{
                completed: {type: Boolean, default: false},
                state: {
                    _id : {type: Schema.Types.ObjectId, ref: 'GateState', default:null, $tenant:true},
                    name : {type: String, default:null}
                },
                overallScore: {
                    _id: {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', default:null, $tenant:true},
                    name: {type: String, default: null}
                }
            }
        },
        newState: {
            _id : {type: Schema.Types.ObjectId, ref: 'GateState', default:null, $tenant:true},
            name : {type: String, default:null}
        },
        newOverallScore: {
            _id: {type: Schema.Types.ObjectId, ref: 'GateOutcomeScore', default:null, $tenant:true},
            name: {type: String, default: null}
        },
        newCompleted : {type: Boolean, default: false}
    },

    budgetReview : {
        currentAmount: {type: Number, default: null},
        newAmount: {type: Number, default: null},
        budgetChange : {type: Number, default: null}
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

    // --- Project Change Request ---

var ProjectChangeRequestSchema = new Schema({
    
    associatedPortfolioChangeRequest : {type: Schema.Types.ObjectId, ref: 'PortfolioChangeRequest', default:null, $tenant:true},

    raisedOnDate : {type: Date, default: Date.now, required:'Date required'},
    title : {type: String, default:'', required:'Title required'},
    description : {type: String, default:''},

    reason: {
        _id : {type: Schema.Types.ObjectId, ref: 'LogReason', default:null, $tenant:true},
        name : {type: String, default:null}
    },
    state: {
        _id : {type: Schema.Types.ObjectId, ref: 'ChangeRequestState', default:null, $tenant:true},
        name : {type: String, default:null}
    },
    priority: {
        _id : {type: Schema.Types.ObjectId, ref: 'LogPriority', default:null, $tenant:true},
        name : {type: String, default:null}
    },

    changeStatus : {
        currentRecord : changeStatusRecord,
        history : [changeStatusRecord]
    },

    approval : {
        currentRecord : approvalRecord,
        history : [approvalRecord]
    },

    budgetReview : {
        currentAmount: {type: Number, default: null},
        newAmount: {type: Number, default: null},
        budgetChange : {type: Number, default: null}
    },

    performances: {
        duration: {
            baselineDurationReviews: [BaselineDurationReviewSchema],
            actualDurationReviews: [ActualDurationReviewSchema]
        },
        cost: {
            baselineCostReviews: [BaselineCostReviewSchema],
            actualCostReviews: [ActualCostReviewSchema]
        },
        completion: {
            baselineCompletionReviews: [BaselineCompletionReviewSchema],
            actualCompletionReviews: [ActualCompletionReviewSchema]
        }
    },

    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});

    // ---- Project Status Update ---

var ProjectStatusUpdateSchema = new Schema({

    updateDate : {type: Date, default: Date.now, required:'Date required'},
    title : {type: String, default:'', required:'Title required'},
    description : {type: String, default:''},

    approval : {
        currentRecord : approvalRecord,
        history : [approvalRecord]
    },

    outcomeStatusReviews : [OutcomeStatusReviewSchema],

    deliveryStatus: {
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
        projectStatusAreaReviews : [ProjectAreaReviewSchema]
    },

    performances: {
        duration: {
            estimateDurationReviews: [EstimateDurationReviewSchema]
        },
        cost: {
            estimateCostReviews: [EstimateCostReviewSchema]
        },
        completion: {
            estimateCompletionReviews: [EstimateCompletionReviewSchema]
        }
    },

    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});


/* GATE */

var ProjectGateSchema = new Schema({
    standardGate: {type: Schema.ObjectId, ref: 'GateProcessTemplate.gates', default:null, $tenant:true},
    name: { type: String, default: '', required: 'Please fill Gate name', trim: true },
    description: { type: String, default: '', trim: true },
    position:{ type: Number, required: 'Position for gate is required', min:1},
    outcomes : [ProjectOutcomeSchema],
    gateState: {
        currentRecord: gateStateRecord,
        history:[gateStateRecord]
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
            currentRecord: onlyStatusRecord,
            history:[onlyStatusRecord]
        },
        projectStatusAreas : [ProjectStatusAreaSchema]
    },
    gateReviews : [GateReviewSchema],
    projectChangeRequests : [ProjectChangeRequestSchema],
    projectStatusUpdates : [ProjectStatusUpdateSchema]
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

        standardProcess: {type: Schema.ObjectId, ref: 'GateProcessTemplate', default:null, $tenant:true},

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

// Calculate "changes" in performances at every save

ProjectSchema.pre('save', function (next) {
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    if(this.process && this.process.gates){
        _.each(this.process.gates, function(gate){

            // Gate Reviews

            _.each(gate.gateReviews, function(document){

                if(document.budgetReview.currentAmount && document.budgetReview.newAmount){
                    document.budgetReview.budgetChange = document.budgetReview.newAmount - document.budgetReview.currentAmount;
                }

                _.each(document.performances.duration.baselineDurationReviews, function(review){
                    if(review.newDate && review.baselineDuration.currentRecord.gateDate){
                        review.dateChange = (review.newDate - review.baselineDuration.currentRecord.gateDate) / millisecondsPerDay;
                    }
                });
                _.each(document.performances.duration.estimateDurationReviews, function(review){
                    if(review.newDate && review.estimateDuration.currentRecord.gateDate){
                        review.dateChange = (review.newDate - review.estimateDuration.currentRecord.gateDate) / millisecondsPerDay;
                    }
                });
                _.each(document.performances.duration.actualDurationReviews, function(review){
                    if(review.newDate && review.actualDuration.currentRecord.gateDate){
                        review.dateChange = (review.newDate - review.actualDuration.currentRecord.gateDate) / millisecondsPerDay;
                    }
                });

                _.each(document.performances.cost.baselineCostReviews, function(review){
                    if(review.newCost && review.baselineCost.currentRecord.cost){
                        review.costChange = review.newCost - review.baselineCost.currentRecord.cost;
                    }
                });
                _.each(document.performances.cost.estimateCostReviews, function(review){
                    if(review.newCost && review.estimateCost.currentRecord.cost){
                        review.costChange = review.newCost - review.estimateCost.currentRecord.cost;
                    }
                });
                _.each(document.performances.cost.actualCostReviews, function(review){
                    if(review.newCost && review.actualCost.currentRecord.cost){
                        review.costChange = review.newCost - review.actualCost.currentRecord.cost;
                    }
                });

                _.each(document.performances.completion.baselineCompletionReviews, function(review){
                    if(review.newCompletion && review.baselineCompletion.currentRecord.completion){
                        review.completionChange = review.newCompletion - review.baselineCompletion.currentRecord.completion;
                    }
                });
                _.each(document.performances.completion.estimateCompletionReviews, function(review){
                    if(review.newCompletion && review.estimateCompletion.currentRecord.completion){
                        review.completionChange = review.newCompletion - review.estimateCompletion.currentRecord.completion;
                    }
                });
                _.each(document.performances.completion.actualCompletionReviews, function(review){
                    if(review.newCompletion && review.actualCompletion.currentRecord.completion){
                        review.completionChange = review.newCompletion - review.actualCompletion.currentRecord.completion;
                    }
                });

            });

            // Project Change Requests

            _.each(gate.projectChangeRequests, function(document){

                if(document.budgetReview.currentAmount && document.budgetReview.newAmount){
                    document.budgetReview.budgetChange = document.budgetReview.newAmount - document.budgetReview.currentAmount;
                }

                _.each(document.performances.duration.baselineDurationReviews, function(review){
                    if(review.newDate && review.baselineDuration.currentRecord.gateDate){
                        review.dateChange = (review.newDate - review.baselineDuration.currentRecord.gateDate) / millisecondsPerDay;
                    }
                });
                _.each(document.performances.duration.actualDurationReviews, function(review){
                    if(review.newDate && review.actualDuration.currentRecord.gateDate){
                        review.dateChange = (review.newDate - review.actualDuration.currentRecord.gateDate) / millisecondsPerDay;
                    }
                });

                _.each(document.performances.cost.baselineCostReviews, function(review){
                    if(review.newCost && review.baselineCost.currentRecord.cost){
                        review.costChange = review.newCost - review.baselineCost.currentRecord.cost;
                    }
                });
                _.each(document.performances.cost.actualCostReviews, function(review){
                    if(review.newCost && review.actualCost.currentRecord.cost){
                        review.costChange = review.newCost - review.actualCost.currentRecord.cost;
                    }
                });

                _.each(document.performances.completion.baselineCompletionReviews, function(review){
                    if(review.newCompletion && review.baselineCompletion.currentRecord.completion){
                        review.completionChange = review.newCompletion - review.baselineCompletion.currentRecord.completion;
                    }
                });
                _.each(document.performances.completion.actualCompletionReviews, function(review){
                    if(review.newCompletion && review.actualCompletion.currentRecord.completion){
                        review.completionChange = review.newCompletion - review.actualCompletion.currentRecord.completion;
                    }
                });

            });

            // Project Status Updates

            _.each(gate.projectStatusUpdates, function(document){

                _.each(document.performances.duration.estimateDurationReviews, function(review){
                    if(review.newDate && review.estimateDuration.currentRecord.gateDate){
                        review.dateChange = (review.newDate - review.estimateDuration.currentRecord.gateDate) / millisecondsPerDay;
                    }
                });

                _.each(document.performances.cost.estimateCostReviews, function(review){
                    if(review.newCost && review.estimateCost.currentRecord.cost){
                        review.costChange = review.newCost - review.estimateCost.currentRecord.cost;
                    }
                });

                _.each(document.performances.completion.estimateCompletionReviews, function(review){
                    if(review.newCompletion && review.estimateCompletion.currentRecord.completion){
                        review.completionChange = review.newCompletion - review.estimateCompletion.currentRecord.completion;
                    }
                });

            });

        });
    }
    next();
});

ProjectSchema.plugin(deepPopulate);
mongoose.mtModel('Project', ProjectSchema);
