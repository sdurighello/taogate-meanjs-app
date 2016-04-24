'use strict';

/**
 * SEED - STRATEGY SETUP
 */
var _ = require('lodash'),
    errorHandler = require('../../errors.server.controller.js'),
    mongoose = require('mongoose'),
    async = require('async'),
    seedIDs = require('./../seed-data.ids.server.controller.js').getIDs(),
    User = mongoose.model('User');

var createObjects = function(schema, stringMsg, seedArray, callback){
    async.eachSeries(seedArray, function(item, callbackEach) {
        schema.findById(item._id).exec(function(err, itemReturned){
            if(!itemReturned){
                schema.create(item, function(err){
                    callbackEach(err);
                });
            } else {
                callbackEach();
            }
        });
    }, function(err){
        if( err ) {
            callback(err);
        } else {
            callback(null, stringMsg);
        }
    });
};

exports.seedStrategyTree = function(user, callback){
    
    // Node types
    var nt1 = seedIDs.StrategyNodeType.nt1;
    var nt2 = seedIDs.StrategyNodeType.nt2;
    var nt3 = seedIDs.StrategyNodeType.nt3;
    
    // Strategic Nodes
    var sn1=seedIDs.StrategyNode.sn1,
        sn11=seedIDs.StrategyNode.sn11, sn111=seedIDs.StrategyNode.sn111, sn112=seedIDs.StrategyNode.sn112,
        sn12=seedIDs.StrategyNode.sn12, sn121=seedIDs.StrategyNode.sn121, sn122=seedIDs.StrategyNode.sn122;
    var sn2=seedIDs.StrategyNode.sn2,
        sn21=seedIDs.StrategyNode.sn21, sn211=seedIDs.StrategyNode.sn211, sn212=seedIDs.StrategyNode.sn212,
        sn22=seedIDs.StrategyNode.sn22, sn221=seedIDs.StrategyNode.sn221, sn222=seedIDs.StrategyNode.sn222;
    var sn3=seedIDs.StrategyNode.sn3,
        sn31=seedIDs.StrategyNode.sn31, sn311=seedIDs.StrategyNode.sn311, sn312=seedIDs.StrategyNode.sn312,
        sn32=seedIDs.StrategyNode.sn32, sn321=seedIDs.StrategyNode.sn321, sn322=seedIDs.StrategyNode.sn322;

    var schema = mongoose.mtModel(user.tenantId + '.' + 'StrategyNode');

    var seedArray =  [
        {_id:sn1, type:nt1, parent:null, ancestors:[], name:'Operational excellence', user: user._id, created: Date.now()},
        {_id:sn11, type:nt2, parent:sn1, ancestors:[sn1], name:'Efficient processes', user: user._id, created: Date.now()},
        {_id:sn111, type:nt3, parent:sn11, ancestors:[sn1,sn11], name:'Internal automation', user: user._id, created: Date.now()},
        {_id:sn112, type:nt3, parent:sn11, ancestors:[sn1,sn11], name:'Integration with partners', user: user._id, created: Date.now()},
        {_id:sn12, type:nt2, parent:sn1, ancestors:[sn1], name:'Excellent people', user: user._id, created: Date.now()},
        {_id:sn121, type:nt3, parent:sn12, ancestors:[sn1,sn12], name:'Talent acquisition', user: user._id, created: Date.now()},
        {_id:sn122, type:nt3, parent:sn12, ancestors:[sn1,sn12], name:'Skills management', user: user._id, created: Date.now()},

        {_id:sn2, type:nt1, parent:null, ancestors:[], name:'Customer intimacy', user: user._id, created: Date.now()},
        {_id:sn21, type:nt2, parent:sn2, ancestors:[sn2], name:'Acquire customers', user: user._id, created: Date.now()},
        {_id:sn211, type:nt3, parent:sn21, ancestors:[sn2,sn21], name:'Marketing internationalization', user: user._id, created: Date.now()},
        {_id:sn212, type:nt3, parent:sn21, ancestors:[sn2,sn21], name:'Packaging experiences', user: user._id, created: Date.now()},
        {_id:sn22, type:nt2, parent:sn2, ancestors:[sn2], name:'Retain customers', user: user._id, created: Date.now()},
        {_id:sn221, type:nt3, parent:sn22, ancestors:[sn2,sn22], name:'Personalized touch-points', user: user._id, created: Date.now()},
        {_id:sn222, type:nt3, parent:sn22, ancestors:[sn2,sn22], name:'Multi-country customer integration', user: user._id, created: Date.now()},

        {_id:sn3, type:nt1, parent:null, ancestors:[], name:'Product innovation', user: user._id, created: Date.now()},
        {_id:sn31, type:nt2, parent:sn3, ancestors:[sn3], name:'Advanced research', user: user._id, created: Date.now()},
        {_id:sn311, type:nt3, parent:sn31, ancestors:[sn3,sn31], name:'Network research', user: user._id, created: Date.now()},
        {_id:sn312, type:nt3, parent:sn31, ancestors:[sn3,sn31], name:'Artificial intelligence', user: user._id, created: Date.now()},
        {_id:sn32, type:nt2, parent:sn3, ancestors:[sn3], name:'Technology first mover', user: user._id, created: Date.now()},
        {_id:sn321, type:nt3, parent:sn32, ancestors:[sn3,sn32], name:'Mobility based products', user: user._id, created: Date.now()},
        {_id:sn322, type:nt3, parent:sn32, ancestors:[sn3,sn32], name:'High resilient materials', user: user._id, created: Date.now()}
    ];

    createObjects(schema, 'StrategyNode', seedArray, callback);
};
