'use strict';

/**
 * SEED - PORTFOLIO SETUP
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    portfolioController = require('../portfolios.server.controller'),
    seedIDs = require('./seed-data.ids.server.controller').getIDs(),
    User = mongoose.model('User');

var createObjects = function(schema, stringMsg, seedArray, callback){
    async.each(seedArray, function(item, callbackEach) {
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

exports.seedPortfolios = function(user, callback){
    // Portfolio types
    var pnt1 = seedIDs.PortfolioType.pnt1;
    var pnt2 = seedIDs.PortfolioType.pnt2;
    var pnt3 = seedIDs.PortfolioType.pnt3;
    // Portfolio nodes
    var pn1=seedIDs.Portfolio.pn1,
        pn11=seedIDs.Portfolio.pn11, pn111=seedIDs.Portfolio.pn111, pn112=seedIDs.Portfolio.pn112,
        pn12=seedIDs.Portfolio.pn12, pn121=seedIDs.Portfolio.pn121, pn122=seedIDs.Portfolio.pn122;
    var pn2=seedIDs.Portfolio.pn2,
        pn21=seedIDs.Portfolio.pn21, pn211=seedIDs.Portfolio.pn211, pn212=seedIDs.Portfolio.pn212,
        pn22=seedIDs.Portfolio.pn22, pn221=seedIDs.Portfolio.pn221, pn222=seedIDs.Portfolio.pn222;
    var pn3=seedIDs.Portfolio.pn3,
        pn31=seedIDs.Portfolio.pn31, pn311=seedIDs.Portfolio.pn311, pn312=seedIDs.Portfolio.pn312,
        pn32=seedIDs.Portfolio.pn32, pn321=seedIDs.Portfolio.pn321, pn322=seedIDs.Portfolio.pn322;

    async.series([
        function(callback) {
            var schema = mongoose.mtModel(user.tenantId + '.' + 'PortfolioType');
            var seedArray =  [
                {
                    _id: pnt1,
                    name: 'Regional office',
                    description:'Regional office',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: pnt2,
                    name: 'Business line',
                    description:'Business line',
                    user:user._id,
                    created: Date.now()
                },
                {
                    _id: pnt3,
                    name: 'Division',
                    description:'Division',
                    user:user._id,
                    created: Date.now()
                }
            ];
            createObjects(schema, 'PortfolioType', seedArray, callback);
        },
        function(callback){
            var schema = mongoose.mtModel(user.tenantId + '.' + 'Portfolio');
            var seedArray = [
                {_id:pn1, type:pnt1, parent:null, ancestors:[], name:'Europe', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn11, type:pnt2, parent:pn1, ancestors:[pn1], name:'Business Line EU1', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn111, type:pnt3, parent:pn11, ancestors:[pn1,pn11], name:'Division EU1.1', funds:2000000,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn112, type:pnt3, parent:pn11, ancestors:[pn1,pn11], name:'Division EU1.2', funds:3500000,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn12, type:pnt2, parent:pn1, ancestors:[pn1], name:'Business Line EU2', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn121, type:pnt3, parent:pn12, ancestors:[pn1,pn12], name:'Division EU2.1', funds:1200000,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn122, type:pnt3, parent:pn12, ancestors:[pn1,pn12], name:'Division EU2.2', funds:1800000,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },

                {_id:pn2, type:pnt1, parent:null, ancestors:[], name:'Americas', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn21, type:pnt2, parent:pn2, ancestors:[pn2], name:'Business Line AME1', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn211, type:pnt3, parent:pn21, ancestors:[pn2,pn21], name:'Division AME1.1', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn212, type:pnt3, parent:pn21, ancestors:[pn2,pn21], name:'Division AME1.2', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn22, type:pnt2, parent:pn2, ancestors:[pn2], name:'Business Line AME2', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn221, type:pnt3, parent:pn22, ancestors:[pn2,pn22], name:'Division AME2.1', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn222, type:pnt3, parent:pn22, ancestors:[pn2,pn22], name:'Division AME2.2', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },

                {_id:pn3, type:pnt1, parent:null, ancestors:[], name:'Asiapac', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn31, type:pnt2, parent:pn3, ancestors:[pn3], name:'Business Line AS1', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn311, type:pnt3, parent:pn31, ancestors:[pn3,pn31], name:'Division AS1.1', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn312, type:pnt3, parent:pn31, ancestors:[pn3,pn31], name:'Division AS1.2', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn32, type:pnt2, parent:pn3, ancestors:[pn3], name:'Business Line AS2', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn321, type:pnt3, parent:pn32, ancestors:[pn3,pn32], name:'Division AS2.1', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                },
                {_id:pn322, type:pnt3, parent:pn32, ancestors:[pn3,pn32], name:'Division AS2.2', funds:null,
                    portfolioManager: null,
                    backupPortfolioManager: null,
                    stakeholders: [],
                    user: user._id,
                    created: Date.now()
                }
            ];
            async.each(seedArray, function(item, callbackEach) {
                schema.findById(item._id).exec(function(err, itemReturned){
                    if(!itemReturned){
                        portfolioController.createPortfolio(user, item, function(err){
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
                    callback(null, 'Portfolio Structure');
                }
            });
        }
    ], function (err, result) {
        if( err ) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
