'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose),
    Schema = mongoose.Schema;
require('mongoose-multitenant');

/* Gate process Schema */

var OutcomeTemplateSchema = new Schema({
    name: { type: String, default: '', required: 'Gate outcome name is required', trim: true },
    description: { type: String, default: '', trim: true }
});

var GateTemplateSchema = new Schema({
    name: { type: String, default: '', required: 'Gate name is required', trim: true },
    description: { type: String, default: '', trim: true },
    position:{ type: Number, required: 'Position for gate is required', min:1},
    outcomes : [OutcomeTemplateSchema]
});

var approvalRecord = {
    approvalState: {type: String, enum: ['draft', 'submitted', 'approved','rejected'], default:'draft', required:'Approval flag is required'},
    created: { type: Date, default: Date.now },
    user: {
        _id: {type: Schema.ObjectId, ref: 'User'},
        displayName : {type:String}
    }
};

var GateProcessTemplateSchema = new Schema({

    name: { type: String, default: '', required: 'Process name is required', trim: true },
    description: { type: String, default: '', trim: true },

    startGate: {type: Schema.Types.ObjectId, ref: 'GateProcessTemplate.gates', $tenant:true},
    endGate: {type: Schema.Types.ObjectId, ref: 'GateProcessTemplate.gates', $tenant:true},

    gates: [GateTemplateSchema],

    approval : {
        currentRecord : approvalRecord,
        history : [approvalRecord]
    },

    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});

GateProcessTemplateSchema.plugin(deepPopulate);
mongoose.mtModel('GateProcessTemplate', GateProcessTemplateSchema);
