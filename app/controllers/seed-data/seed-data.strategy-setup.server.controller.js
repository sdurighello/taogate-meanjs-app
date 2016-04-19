'use strict';

/**
 * SEED - STRATEGY SETUP
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');

var createObjects = function(schema, stringMsg, seedArray, callback){
    async.each(seedArray, function(item, callbackEach) {
        schema.findById(item._id).exec(function(err, itemReturned){
            if(!itemReturned){
                schema.create(item, function(err){
                    callbackEach(err);
                });
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

exports.seedStrategyNodes = function(req, callback){
    
    // Node types
    var nt1 = mongoose.Types.ObjectId();
    var nt2 = mongoose.Types.ObjectId();
    var nt3 = mongoose.Types.ObjectId();
    
    // Strategic Nodes
    var sn1=mongoose.Types.ObjectId(), sn11=mongoose.Types.ObjectId(), sn111=mongoose.Types.ObjectId(), sn112=mongoose.Types.ObjectId(), sn12=mongoose.Types.ObjectId(), sn121=mongoose.Types.ObjectId(), sn122=mongoose.Types.ObjectId();
    var sn2=mongoose.Types.ObjectId(), sn21=mongoose.Types.ObjectId(), sn211=mongoose.Types.ObjectId(), sn212=mongoose.Types.ObjectId(), sn22=mongoose.Types.ObjectId(), sn221=mongoose.Types.ObjectId(), sn222=mongoose.Types.ObjectId();
    var sn3=mongoose.Types.ObjectId(), sn31=mongoose.Types.ObjectId(), sn311=mongoose.Types.ObjectId(), sn312=mongoose.Types.ObjectId(), sn32=mongoose.Types.ObjectId(), sn321=mongoose.Types.ObjectId(), sn322=mongoose.Types.ObjectId();
    
    async.series([
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'StrategyNodeType');
            var seedArray =  [
                {
                    _id: nt1,
                    name: 'Strategic theme',
                    description:'Strategic theme',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: nt2,
                    name: 'Business capability',
                    description:'Business capability',
                    user:req.user._id,
                    created: Date.now()
                },
                {
                    _id: nt3,
                    name: 'Tactic',
                    description:'Tactic',
                    user:req.user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'StrategyNodeType', seedArray, callback);
        },
        function(callback) {
            var schema = mongoose.mtModel(req.user.tenantId + '.' + 'StrategyNode');
            var seedArray =  [
                {_id:sn1, type:nt1, parent:null, ancestors:[], name:'Operational excellence', user: req.user._id, created: Date.now()},
                {_id:sn11, type:nt2, parent:sn1, ancestors:[sn1], name:'Efficient processes', user: req.user._id, created: Date.now()},
                {_id:sn111, type:nt3, parent:sn11, ancestors:[sn1,sn11], name:'Internal automation', user: req.user._id, created: Date.now()},
                {_id:sn112, type:nt3, parent:sn11, ancestors:[sn1,sn11], name:'Integration with partners', user: req.user._id, created: Date.now()},
                {_id:sn12, type:nt2, parent:sn1, ancestors:[sn1], name:'Excellent people', user: req.user._id, created: Date.now()},
                {_id:sn121, type:nt3, parent:sn12, ancestors:[sn1,sn12], name:'Talent acquisition', user: req.user._id, created: Date.now()},
                {_id:sn122, type:nt3, parent:sn12, ancestors:[sn1,sn12], name:'Skills management', user: req.user._id, created: Date.now()},

                {_id:sn2, type:nt1, parent:null, ancestors:[], name:'Customer intimacy', user: req.user._id, created: Date.now()},
                {_id:sn21, type:nt2, parent:sn2, ancestors:[sn2], name:'Acquire customers', user: req.user._id, created: Date.now()},
                {_id:sn211, type:nt3, parent:sn21, ancestors:[sn2,sn21], name:'Marketing internationalization', user: req.user._id, created: Date.now()},
                {_id:sn212, type:nt3, parent:sn21, ancestors:[sn2,sn21], name:'Packaging experiences', user: req.user._id, created: Date.now()},
                {_id:sn22, type:nt2, parent:sn2, ancestors:[sn2], name:'Retain customers', user: req.user._id, created: Date.now()},
                {_id:sn221, type:nt3, parent:sn22, ancestors:[sn2,sn22], name:'Personalized touch-points', user: req.user._id, created: Date.now()},
                {_id:sn222, type:nt3, parent:sn22, ancestors:[sn2,sn22], name:'Multi-country customer integration', user: req.user._id, created: Date.now()},

                {_id:sn3, type:nt1, parent:null, ancestors:[], name:'Product innovation', user: req.user._id, created: Date.now()},
                {_id:sn31, type:nt2, parent:sn3, ancestors:[sn3], name:'Advanced research', user: req.user._id, created: Date.now()},
                {_id:sn311, type:nt3, parent:sn31, ancestors:[sn3,sn31], name:'Network research', user: req.user._id, created: Date.now()},
                {_id:sn312, type:nt3, parent:sn31, ancestors:[sn3,sn31], name:'Artificial intelligence', user: req.user._id, created: Date.now()},
                {_id:sn32, type:nt2, parent:sn3, ancestors:[sn3], name:'Technology first mover', user: req.user._id, created: Date.now()},
                {_id:sn321, type:nt3, parent:sn32, ancestors:[sn3,sn32], name:'Mobility based products', user: req.user._id, created: Date.now()},
                {_id:sn322, type:nt3, parent:sn32, ancestors:[sn3,sn32], name:'High resilient materials', user: req.user._id, created: Date.now()}
            ];
            createObjects(schema, 'StrategyNode', seedArray, callback);
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
