'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    async = require('async'),
    _ = require('lodash');


exports.create = function(req, res) {

    var PortfolioStatusUpdate = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioStatusUpdate');
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');
    var LogStatusArea = mongoose.mtModel(req.user.tenantId + '.' + 'LogStatusArea');

    async.waterfall([
        // Get PORTFOLIO
        function(callback) {
            Portfolio.findById(req.body.portfolio).exec(function(err, portfolio){
                if(err){
                    return callback(err);
                }
                if(!portfolio){
                    return callback({message: 'Cannot find portfolio with id: '+ req.body.portfolio });
                }
                callback(null, portfolio);
            });
        },
        function(portfolio, callback) {
            
            // Create new portfolioStatusUpdate object
            var portfolioStatusUpdate = new PortfolioStatusUpdate({
                portfolio: portfolio._id,
                updateDate : req.body.updateDate,
                title : req.body.title,
                approval : {
                    currentRecord : {
                        approvalState: 'draft',
                        user: { _id: req.user._id, displayName: req.user.displayName }
                    },
                    history : []
                },
                portfolioStatus : {
                    overallStatusReview : {
                        currentRecord: {
                            status: {
                                _id : portfolio.portfolioStatus.overallStatus.currentRecord.status._id,
                                name : portfolio.portfolioStatus.overallStatus.currentRecord.status.name,
                                color : portfolio.portfolioStatus.overallStatus.currentRecord.status.color
                            },
                            comment : portfolio.portfolioStatus.overallStatus.currentRecord.comment
                        },
                        newStatus: {
                            _id : portfolio.portfolioStatus.overallStatus.currentRecord.status._id,
                            name : portfolio.portfolioStatus.overallStatus.currentRecord.status.name,
                            color : portfolio.portfolioStatus.overallStatus.currentRecord.status.color
                        },
                        newComment : portfolio.portfolioStatus.overallStatus.currentRecord.comment
                    },
                    portfolioStatusAreaReviews : []
                },
                budgetReview : {
                    currentAmount : portfolio.budget.currentRecord.amount,
                    newAmount : portfolio.budget.currentRecord.amount
                },
                user: req.user._id
            });
            
            // Create status areas reviews
            _.each(portfolio.portfolioStatus.portfolioStatusAreas, function(area){
                portfolioStatusUpdate.portfolioStatus.portfolioStatusAreaReviews.push({
                    portfolioStatusArea : {
                        _id: area._id,
                        statusArea: {
                            _id: area.statusArea._id,
                            name: area.statusArea.name
                        },
                        currentRecord: {
                            status: {
                                _id : area.currentRecord.status._id,
                                name : area.currentRecord.status.name,
                                color : area.currentRecord.status.color
                            },
                            comment : area.currentRecord.comment
                        }
                    },
                    newStatus:  {
                        _id : area.currentRecord.status._id,
                        name : area.currentRecord.status.name,
                        color : area.currentRecord.status.color
                    },
                    newComment:  area.currentRecord.comment
                });
            });

            // Save new status update
            portfolioStatusUpdate.save(function(err){
                if (err) {
                    callback(err);
                } else {
                    callback(null, portfolioStatusUpdate);
                }
            });
            
        }
    ], function (err, portfolioStatusUpdate) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(portfolioStatusUpdate);
        }
    });
};

exports.read = function(req, res) {
	res.jsonp(req.portfolioStatusUpdate);
};

exports.delete = function(req, res) {
	var portfolioStatusUpdate = req.portfolioStatusUpdate ;

	portfolioStatusUpdate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioStatusUpdate);
		}
	});
};

exports.list = function(req, res) {

    var PortfolioStatusUpdate = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioStatusUpdate');

    PortfolioStatusUpdate.find(req.query).populate('user', 'displayName').exec(function(err, portfolioStatusUpdates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portfolioStatusUpdates);
		}
	});
};

// Header

exports.updateHeader = function(req, res){

    var editedStatusUpdate = req.portfolioStatusUpdate;

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    editedStatusUpdate.updateDate = req.body.updateDate;
    editedStatusUpdate.title = req.body.title;
    editedStatusUpdate.description = req.body.description;

    editedStatusUpdate.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });
};

// Delivery Status

exports.updateOverallDeliveryStatus = function(req, res){

    var editedStatusUpdate = req.portfolioStatusUpdate;

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    editedStatusUpdate.portfolioStatus.overallStatusReview.newStatus = req.body.portfolioStatus.overallStatusReview.newStatus;
    editedStatusUpdate.portfolioStatus.overallStatusReview.newComment = req.body.portfolioStatus.overallStatusReview.newComment;

    editedStatusUpdate.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });

};

exports.updateStatusAreaReview = function(req, res){

    var editedStatusUpdate = req.portfolioStatusUpdate;
    var editedStatusAreaReview = editedStatusUpdate.portfolioStatus.portfolioStatusAreaReviews.id(req.params.statusAreaReviewId);

    editedStatusUpdate.user = req.user;
    editedStatusUpdate.created = Date.now();

    editedStatusAreaReview.newStatus = req.body.newStatus;
    editedStatusAreaReview.newComment = req.body.newComment;

    editedStatusUpdate.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusAreaReview);
        }
    });

};


// Approval

exports.submit = function(req, res) {

    var editedStatusUpdate = req.portfolioStatusUpdate;

    editedStatusUpdate.approval.history.push({
        approvalState : editedStatusUpdate.approval.currentRecord.approvalState,
        user : {
            _id: editedStatusUpdate.approval.currentRecord.user._id,
            displayName: editedStatusUpdate.approval.currentRecord.user.displayName
        },
        created : editedStatusUpdate.approval.currentRecord.created
    });

    editedStatusUpdate.approval.currentRecord.approvalState = 'submitted';
    editedStatusUpdate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedStatusUpdate.approval.currentRecord.created = Date.now();

    editedStatusUpdate.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });

};

exports.approve = function(req, res) {

    var PortfolioStatusUpdate = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioStatusUpdate');
    var Portfolio = mongoose.mtModel(req.user.tenantId + '.' + 'Portfolio');

    var editedStatusUpdate = req.portfolioStatusUpdate;

    async.waterfall([
        // Get portfolio
        function(callback){
            Portfolio.findById(req.portfolioStatusUpdate.portfolio).exec(function(err, portfolio){
                if (err) {
                    return callback(err);
                }
                if (err) {
                    return callback({message: 'Cannot find portfolio with id: '+ req.portfolioStatusUpdate.portfolio});
                }
                callback(null, portfolio);
            });
        },
        function(portfolio, callback) {
            
            // Apply changes to DELIVERY STATUS - Overall

            portfolio.portfolioStatus.overallStatus.history.push({
                sourceStatusUpdate : portfolio.portfolioStatus.overallStatus.currentRecord.sourceStatusUpdate,
                status: portfolio.portfolioStatus.overallStatus.currentRecord.status,
                comment: portfolio.portfolioStatus.overallStatus.currentRecord.comment,
                created: portfolio.portfolioStatus.overallStatus.currentRecord.created,
                user: portfolio.portfolioStatus.overallStatus.currentRecord.user
            });
            portfolio.portfolioStatus.overallStatus.currentRecord.sourceStatusUpdate = editedStatusUpdate._id;
            portfolio.portfolioStatus.overallStatus.currentRecord.status = editedStatusUpdate.portfolioStatus.overallStatusReview.newStatus;
            portfolio.portfolioStatus.overallStatus.currentRecord.comment = editedStatusUpdate.portfolioStatus.overallStatusReview.newComment;
            portfolio.portfolioStatus.overallStatus.currentRecord.created = Date.now();
            portfolio.portfolioStatus.overallStatus.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};

            // Apply changes to DELIVERY STATUS - Status Areas

            _.each(editedStatusUpdate.portfolioStatus.portfolioStatusAreaReviews, function(statusAreaReview){
                var editedPortfolioStatusArea = portfolio.portfolioStatus.portfolioStatusAreas.id(statusAreaReview.portfolioStatusArea._id);
                if(editedPortfolioStatusArea){ // So if add/delete areas in portfolio, it doesn't crash
                    editedPortfolioStatusArea.history.push({
                        sourceStatusUpdate : editedPortfolioStatusArea.currentRecord.sourceStatusUpdate,
                        status: editedPortfolioStatusArea.currentRecord.status,
                        comment: editedPortfolioStatusArea.currentRecord.comment,
                        created: editedPortfolioStatusArea.currentRecord.created,
                        user: editedPortfolioStatusArea.currentRecord.user
                    });
                    editedPortfolioStatusArea.currentRecord.sourceStatusUpdate = editedStatusUpdate._id;
                    editedPortfolioStatusArea.currentRecord.status = statusAreaReview.newStatus;
                    editedPortfolioStatusArea.currentRecord.comment = statusAreaReview.newComment;
                    editedPortfolioStatusArea.currentRecord.created = Date.now();
                    editedPortfolioStatusArea.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
                }
            });

            // Save portfolio

            portfolio.save(function(err){
                callback(err);
            });
        },
        // Update editedStatusUpdate with req.body information
        function(callback) {
            editedStatusUpdate.approval.history.push({
                approvalState : editedStatusUpdate.approval.currentRecord.approvalState,
                user : {
                    _id: editedStatusUpdate.approval.currentRecord.user._id,
                    displayName: editedStatusUpdate.approval.currentRecord.user.displayName
                },
                created : editedStatusUpdate.approval.currentRecord.created
            });

            editedStatusUpdate.approval.currentRecord.approvalState = 'approved';
            editedStatusUpdate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
            editedStatusUpdate.approval.currentRecord.created = Date.now();

            editedStatusUpdate.save(function (err) {
                callback(err);
            });
        }
    ], function (err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });
    
};

exports.reject = function(req, res) {

    var editedStatusUpdate = req.portfolioStatusUpdate;

    editedStatusUpdate.approval.history.push({
        approvalState : editedStatusUpdate.approval.currentRecord.approvalState,
        user : {
            _id: editedStatusUpdate.approval.currentRecord.user._id,
            displayName: editedStatusUpdate.approval.currentRecord.user.displayName
        },
        created : editedStatusUpdate.approval.currentRecord.created
    });

    editedStatusUpdate.approval.currentRecord.approvalState = 'rejected';
    editedStatusUpdate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedStatusUpdate.approval.currentRecord.created = Date.now();

    // No missing fields check

    editedStatusUpdate.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });

};

exports.draft = function(req, res) {

    var editedStatusUpdate = req.portfolioStatusUpdate;

    editedStatusUpdate.approval.history.push({
        approvalState : editedStatusUpdate.approval.currentRecord.approvalState,
        user : {
            _id: editedStatusUpdate.approval.currentRecord.user._id,
            displayName: editedStatusUpdate.approval.currentRecord.user.displayName
        },
        created : editedStatusUpdate.approval.currentRecord.created
    });

    editedStatusUpdate.approval.currentRecord.approvalState = 'draft';
    editedStatusUpdate.approval.currentRecord.user = {_id: req.user._id, displayName: req.user.displayName};
    editedStatusUpdate.approval.currentRecord.created = Date.now();

    editedStatusUpdate.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(editedStatusUpdate);
        }
    });

};


// ------------ MIDDLEWARE -------------

exports.portfolioStatusUpdateByID = function(req, res, next, id) {
    
    var PortfolioStatusUpdate = mongoose.mtModel(req.user.tenantId + '.' + 'PortfolioStatusUpdate');
    
    PortfolioStatusUpdate.findById(id).populate('user', 'displayName').exec(function(err, portfolioStatusUpdate) {
		if (err) return next(err);
		if (! portfolioStatusUpdate) return next(new Error('Failed to load Portfolio status update ' + id));
		req.portfolioStatusUpdate = portfolioStatusUpdate ;
		next();
	});
};

// ------------ AUTHORIZATION -------------

exports.hasCreateAuthorization = function(req, res, next) {

	next();
};

exports.hasEditAuthorization = function(req, res, next) {

    next();
};

exports.hasApproveAuthorization = function(req, res, next) {

    next();
};

exports.isObjectEditable = function(req, res, next) {

    next();
};
