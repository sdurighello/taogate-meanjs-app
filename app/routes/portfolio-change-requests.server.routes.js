'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioChangeRequests = require('../../app/controllers/portfolio-change-requests.server.controller');

	// Portfolio change requests Routes
	app.route('/portfolio-change-requests')
		.get(users.requiresLogin, portfolioChangeRequests.list)
		.post(users.requiresLogin, portfolioChangeRequests.hasCreateAuthorization, portfolioChangeRequests.create);

	app.route('/portfolio-change-requests/:portfolioChangeRequestId')
		.get(users.requiresLogin, portfolioChangeRequests.read)
		.put(users.requiresLogin, portfolioChangeRequests.hasEditAuthorization, portfolioChangeRequests.update)
		.delete(users.requiresLogin, portfolioChangeRequests.hasEditAuthorization, portfolioChangeRequests.delete);

	// Header
	app.route('/portfolio-change-requests/:portfolioChangeRequestId/header')
		.put(users.requiresLogin, portfolioChangeRequests.hasEditAuthorization, portfolioChangeRequests.objectIsEditable, portfolioChangeRequests.updateHeader);


// **************************  APPROVAL  ************************

	app.route('/portfolio-change-requests/:portfolioChangeRequestId/submit')
		.put(users.requiresLogin, portfolioChangeRequests.hasEditAuthorization, portfolioChangeRequests.submit);

	app.route('/portfolio-change-requests/:portfolioChangeRequestId/approve')
		.put(users.requiresLogin, portfolioChangeRequests.hasApproveAuthorization, portfolioChangeRequests.approve);

	app.route('/portfolio-change-requests/:portfolioChangeRequestId/reject')
		.put(users.requiresLogin, portfolioChangeRequests.hasApproveAuthorization, portfolioChangeRequests.reject);

	app.route('/portfolio-change-requests/:portfolioChangeRequestId/draft')
		.put(users.requiresLogin, portfolioChangeRequests.hasEditAuthorization, portfolioChangeRequests.draft);

// **************** ASSOCIATED PROJECT CHANGES ******************

	// Available project changes
	app.route('/portfolio-change-requests/:portfolioChangeRequestId/portfolios/:portfolioId')
		.get(users.requiresLogin, portfolioChangeRequests.availableProjectChangeRequests);

	// Add associated project change
	app.route('/portfolio-change-requests/:portfolioChangeRequestId/project-change-requests/:projectChangeRequestId/addProjectChange')
		.put(users.requiresLogin, portfolioChangeRequests.hasEditAuthorization, portfolioChangeRequests.objectIsEditable, portfolioChangeRequests.addProjectChangeRequest);

	// Remove associated project change
	app.route('/portfolio-change-requests/:portfolioChangeRequestId/project-change-requests/:projectChangeRequestId/removeProjectChange')
		.put(users.requiresLogin, portfolioChangeRequests.hasEditAuthorization, portfolioChangeRequests.objectIsEditable, portfolioChangeRequests.removeProjectChangeRequest);


// **************** FUNDING REQUESTS ******************

    // Create funding request
    app.route('/portfolio-change-requests/:portfolioChangeRequestId/createFundingRequest')
        .put(users.requiresLogin, portfolioChangeRequests.hasEditAuthorization, portfolioChangeRequests.objectIsEditable, portfolioChangeRequests.createFundingRequest);

    // Delete funding request
    app.route('/portfolio-change-requests/:portfolioChangeRequestId/funding-requests/:fundingRequestId/deleteFundingRequest')
        .put(users.requiresLogin, portfolioChangeRequests.hasEditAuthorization, portfolioChangeRequests.objectIsEditable, portfolioChangeRequests.deleteFundingRequest);

    // Update funding request
    app.route('/portfolio-change-requests/:portfolioChangeRequestId/funding-requests/:fundingRequestId/updateFundingRequest')
        .put(users.requiresLogin, portfolioChangeRequests.hasEditAuthorization, portfolioChangeRequests.objectIsEditable, portfolioChangeRequests.updateFundingRequest);

    
// **************** MIDDLEWARE ******************

	// Finish by binding the Portfolio change request middleware
	app.param('portfolioChangeRequestId', portfolioChangeRequests.portfolioChangeRequestByID);
};
