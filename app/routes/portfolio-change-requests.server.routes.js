'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioChangeRequests = require('../../app/controllers/portfolio-change-requests.server.controller');

	// Portfolio change requests Routes
	app.route('/portfolio-change-requests')
		.get(users.requiresLogin, portfolioChangeRequests.list)
		.post(users.requiresLogin, portfolioChangeRequests.hasAuthorization, portfolioChangeRequests.create);

	app.route('/portfolio-change-requests/:portfolioChangeRequestId')
		.get(users.requiresLogin, portfolioChangeRequests.read)
		.put(users.requiresLogin, portfolioChangeRequests.hasAuthorization, portfolioChangeRequests.update)
		.delete(users.requiresLogin, portfolioChangeRequests.hasAuthorization, portfolioChangeRequests.delete);

	// Header
	app.route('/portfolio-change-requests/:portfolioChangeRequestId/header')
		.put(users.requiresLogin, portfolioChangeRequests.hasAuthorization, portfolioChangeRequests.updateHeader);


// **************** ASSOCIATED PROJECT CHANGES ******************

	// Available project changes
	app.route('/portfolio-change-requests/:portfolioChangeRequestId/portfolios/:portfolioId')
		.get(users.requiresLogin, portfolioChangeRequests.availableProjectChangeRequests);

	// Add associated project change
	app.route('/portfolio-change-requests/:portfolioChangeRequestId/project-change-requests/:projectChangeRequestId/addProjectChange')
		.put(users.requiresLogin, portfolioChangeRequests.hasAuthorization, portfolioChangeRequests.addProjectChangeRequest);

	// Remove associated project change
	app.route('/portfolio-change-requests/:portfolioChangeRequestId/project-change-requests/:projectChangeRequestId/removeProjectChange')
		.put(users.requiresLogin, portfolioChangeRequests.hasAuthorization, portfolioChangeRequests.removeProjectChangeRequest);


// **************** FUNDING REQUESTS ******************

    // Create funding request
    app.route('/portfolio-change-requests/:portfolioChangeRequestId/createFundingRequest')
        .put(users.requiresLogin, portfolioChangeRequests.hasAuthorization, portfolioChangeRequests.createFundingRequest);

    // Delete funding request
    app.route('/portfolio-change-requests/:portfolioChangeRequestId/funding-requests/:fundingRequestId/deleteFundingRequest')
        .put(users.requiresLogin, portfolioChangeRequests.hasAuthorization, portfolioChangeRequests.deleteFundingRequest);

    // Update funding request
    app.route('/portfolio-change-requests/:portfolioChangeRequestId/funding-requests/:fundingRequestId/updateFundingRequest')
        .put(users.requiresLogin, portfolioChangeRequests.hasAuthorization, portfolioChangeRequests.updateFundingRequest);

// **************** MIDDLEWARE ******************

	// Finish by binding the Portfolio change request middleware
	app.param('portfolioChangeRequestId', portfolioChangeRequests.portfolioChangeRequestByID);
};
