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

var ProjectSelectionRecord = {
    active: {type: Boolean, default: true, required: 'Field active of project is required'}, // Still there but "view only"
    selectedForPrioritization: {type: Boolean, default: false},
    selectedForEvaluation: {type: Boolean, default: false},
    selectedForDelivery: {type: Boolean, default: false},
    //archived: {type: Boolean, default: false} - Like deleted and only appears in admin "archived" view - Manage with separate table archivedProjects
    comment: {type: String, default: '', trim: true},
    recordDate: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
};

var AssignedCategorySchema = new Schema({
    category : {type: Schema.Types.ObjectId, ref: 'Category', $tenant:true},
    value : {type: Schema.Types.ObjectId, ref: 'CategoryValue', $tenant:true}
});

var AssignedCategoryGroupSchema = new Schema({
    group : {type: Schema.Types.ObjectId, ref: 'CategoryGroup', $tenant:true},
    categories : [AssignedCategorySchema]
});

var ProjectSchema = new Schema({
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'},
	selection: {
		current: ProjectSelectionRecord,
        history: [ProjectSelectionRecord]
	},
    parent: {type: Schema.ObjectId, ref: 'StrategyNode', default:null, $tenant:true},
    portfolio: {type: Schema.ObjectId, ref: 'Portfolio', default:null, $tenant:true},
    process: {type: Schema.ObjectId, ref: 'GateProcess', default:null, $tenant:true},
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
    categorization: [AssignedCategoryGroupSchema]
});



ProjectSchema.plugin(deepPopulate);
mongoose.mtModel('Project', ProjectSchema);
