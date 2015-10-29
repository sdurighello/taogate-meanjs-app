'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
require('mongoose-multitenant');

/**
 * Person Schema
 */
var PersonSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill name',
    trim: true
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: '',
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.mtModel('Person', PersonSchema);
