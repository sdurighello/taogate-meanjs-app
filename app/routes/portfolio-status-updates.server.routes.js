'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioStatusUpdates = require('../../app/controllers/portfolio-status-updates.server.controller');

	// Portfolio status updates Routes
	app.route('/portfolio-status-updates')
		.get(users.requiresLogin, portfolioStatusUpdates.list)
		.post(users.requiresLogin, portfolioStatusUpdates.hasCreateAuthorization, portfolioStatusUpdates.create);

	app.route('/portfolio-status-updates/:portfolioStatusUpdateId')
		.get(users.requiresLogin, portfolioStatusUpdates.read)
		.delete(users.requiresLogin, portfolioStatusUpdates.hasEditAuthorization, portfolioStatusUpdates.isObjectEditable, portfolioStatusUpdates.delete);
    
    
    // Status Updates - Header

    app.route('/portfolio-status-updates/:portfolioStatusUpdateId/header')
        .put(users.requiresLogin, portfolioStatusUpdates.hasEditAuthorization, portfolioStatusUpdates.isObjectEditable, portfolioStatusUpdates.updateHeader);

    // Status Updates - Delivery Status

    app.route('/portfolio-status-updates/:portfolioStatusUpdateId/overallDeliveryStatus')
        .put(users.requiresLogin, portfolioStatusUpdates.hasEditAuthorization, portfolioStatusUpdates.isObjectEditable, portfolioStatusUpdates.updateOverallDeliveryStatus);

    app.route('/portfolio-status-updates/:portfolioStatusUpdateId/status-area-reviews/:statusAreaReviewId')
        .put(users.requiresLogin, portfolioStatusUpdates.hasEditAuthorization, portfolioStatusUpdates.isObjectEditable, portfolioStatusUpdates.updateStatusAreaReview);


    // Status Updates - Approval

    app.route('/portfolio-status-updates/:portfolioStatusUpdateId/submit')
        .put(users.requiresLogin, portfolioStatusUpdates.hasEditAuthorization, portfolioStatusUpdates.submit);

    app.route('/portfolio-status-updates/:portfolioStatusUpdateId/approve')
        .put(users.requiresLogin, portfolioStatusUpdates.hasApproveAuthorization, portfolioStatusUpdates.approve);

    app.route('/portfolio-status-updates/:portfolioStatusUpdateId/reject')
        .put(users.requiresLogin, portfolioStatusUpdates.hasApproveAuthorization, portfolioStatusUpdates.reject);

    app.route('/portfolio-status-updates/:portfolioStatusUpdateId/draft')
        .put(users.requiresLogin, portfolioStatusUpdates.hasEditAuthorization, portfolioStatusUpdates.draft);

	// Finish by binding the Portfolio status update middleware
	app.param('portfolioStatusUpdateId', portfolioStatusUpdates.portfolioStatusUpdateByID);
};
