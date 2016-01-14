'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectChangeRequests = require('../../app/controllers/project-change-requests.server.controller');

	// Project change requests Routes
	app.route('/project-change-requests')
		.get(users.requiresLogin, projectChangeRequests.list)
		.post(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.create);

	app.route('/project-change-requests/:projectChangeRequestId')
		.get(users.requiresLogin, projectChangeRequests.read)
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.update)
		.delete(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.delete);

	// Changes for a project
	app.route('/project-change-requests-changeRequestsForProject')
		.get(users.requiresLogin, projectChangeRequests.changeRequestsForProject);

	// Approval

    app.route('/project-change-requests/:projectChangeRequestId/submit')
        .put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.submit);

	app.route('/project-change-requests/:projectChangeRequestId/approve')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.approve);

	app.route('/project-change-requests/:projectChangeRequestId/reject')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.reject);

	app.route('/project-change-requests/:projectChangeRequestId/draft')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.draft);

	// Header

	app.route('/project-change-requests/:projectChangeRequestId/header')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.updateHeader);

    // Status

	app.route('/project-change-requests/:projectChangeRequestId/status')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.updateStatus);

	// Budget

	app.route('/project-change-requests/:projectChangeRequestId/budget')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.updateBudget);

	// Baseline

	app.route('/project-change-requests/:projectChangeRequestId/baseline-duration-reviews/:baselineDurationReviewId')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.updateBaselineDuration);

	app.route('/project-change-requests/:projectChangeRequestId/baseline-cost-reviews/:baselineCostReviewId')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.updateBaselineCost);

	app.route('/project-change-requests/:projectChangeRequestId/baseline-completion-reviews/:baselineCompletionReviewId')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.updateBaselineCompletion);

	// Estimate

	app.route('/project-change-requests/:projectChangeRequestId/estimate-duration-reviews/:estimateDurationReviewId')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.updateEstimateDuration);

	app.route('/project-change-requests/:projectChangeRequestId/estimate-cost-reviews/:estimateCostReviewId')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.updateEstimateCost);

	app.route('/project-change-requests/:projectChangeRequestId/estimate-completion-reviews/:estimateCompletionReviewId')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.updateEstimateCompletion);

	// Actual

	app.route('/project-change-requests/:projectChangeRequestId/actual-duration-reviews/:actualDurationReviewId')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.updateActualDuration);

	app.route('/project-change-requests/:projectChangeRequestId/actual-cost-reviews/:actualCostReviewId')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.updateActualCost);

	app.route('/project-change-requests/:projectChangeRequestId/actual-completion-reviews/:actualCompletionReviewId')
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.updateActualCompletion);


	// Finish by binding the Project change request middleware
	app.param('projectChangeRequestId', projectChangeRequests.projectChangeRequestByID);
};
