'use strict';

/**
 * SEED - PORTFOLIO SETUP
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');


// Portfolio types

var pnt1 = mongoose.Types.ObjectId();
var pnt2 = mongoose.Types.ObjectId();
var pnt3 = mongoose.Types.ObjectId();


exports.getPortfolioTypes = function(req){
    return [
        {
            _id: pnt1,
            name: 'Regional office',
            description:'Regional office',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: pnt2,
            name: 'Business line',
            description:'Business line',
            user:req.user._id,
            created: Date.now()
        },
        {
            _id: pnt3,
            name: 'Division',
            description:'Division',
            user:req.user._id,
            created: Date.now()
        }
    ];
};
