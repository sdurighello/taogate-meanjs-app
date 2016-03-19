'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectStatusUpdates = require('../../app/controllers/project-status-updates.server.controller');

	// Project status updates Routes
	app.route('/project-status-updates')
		.get(users.requiresLogin, projectStatusUpdates.list)
		.post(users.requiresLogin, projectStatusUpdates.hasCreateAuthorization, projectStatusUpdates.create);

	app.route('/project-status-updates/:projectStatusUpdateId')
		.get(users.requiresLogin, projectStatusUpdates.read)
		.put(users.requiresLogin, projectStatusUpdates.hasEditAuthorization, projectStatusUpdates.objectIsEditable, projectStatusUpdates.update)
		.delete(users.requiresLogin, projectStatusUpdates.hasEditAuthorization, projectStatusUpdates.objectIsEditable, projectStatusUpdates.delete);

	// Approval
	app.route('/project-status-updates/:projectStatusUpdateId/submit')
		.put(users.requiresLogin, projectStatusUpdates.hasEditAuthorization, projectStatusUpdates.submit);

	app.route('/project-status-updates/:projectStatusUpdateId/approve')
		.put(users.requiresLogin, projectStatusUpdates.hasApproveAuthorization, projectStatusUpdates.approve);

	app.route('/project-status-updates/:projectStatusUpdateId/reject')
		.put(users.requiresLogin, projectStatusUpdates.hasApproveAuthorization, projectStatusUpdates.reject);

	app.route('/project-status-updates/:projectStatusUpdateId/draft')
		.put(users.requiresLogin, projectStatusUpdates.hasEditAuthorization, projectStatusUpdates.draft);

	// Header
	app.route('/project-status-updates/:projectStatusUpdateId/header')
		.put(users.requiresLogin, projectStatusUpdates.hasEditAuthorization, projectStatusUpdates.objectIsEditable, projectStatusUpdates.updateHeader);

	// Overall status
	app.route('/project-status-updates/:projectStatusUpdateId/overallStatus')
		.put(users.requiresLogin, projectStatusUpdates.hasEditAuthorization, projectStatusUpdates.objectIsEditable, projectStatusUpdates.updateOverallStatus);

	// Duration status
	app.route('/project-status-updates/:projectStatusUpdateId/durationStatus')
		.put(users.requiresLogin, projectStatusUpdates.hasEditAuthorization, projectStatusUpdates.objectIsEditable, projectStatusUpdates.updateDurationStatus);

	// Cost status
	app.route('/project-status-updates/:projectStatusUpdateId/costStatus')
		.put(users.requiresLogin, projectStatusUpdates.hasEditAuthorization, projectStatusUpdates.objectIsEditable, projectStatusUpdates.updateCostStatus);

	// Completion status
	app.route('/project-status-updates/:projectStatusUpdateId/completionStatus')
		.put(users.requiresLogin, projectStatusUpdates.hasEditAuthorization, projectStatusUpdates.objectIsEditable, projectStatusUpdates.updateCompletionStatus);

	// Outcomes
	app.route('/project-status-updates/:projectStatusUpdateId/outcome-status-updates/:outcomeStatusUpdateId')
		.put(users.requiresLogin, projectStatusUpdates.hasEditAuthorization, projectStatusUpdates.objectIsEditable, projectStatusUpdates.updateOutcome);

    // Areas
    app.route('/project-status-updates/:projectStatusUpdateId/status-area-updates/:statusAreaUpdateId')
        .put(users.requiresLogin, projectStatusUpdates.hasEditAuthorization, projectStatusUpdates.objectIsEditable, projectStatusUpdates.updateStatusArea);


	// Estimate
	app.route('/project-status-updates/:projectStatusUpdateId/estimate-duration-reviews/:estimateDurationReviewId')
		.put(users.requiresLogin, projectStatusUpdates.hasEditAuthorization, projectStatusUpdates.objectIsEditable, projectStatusUpdates.updateEstimateDuration);

	app.route('/project-status-updates/:projectStatusUpdateId/estimate-cost-reviews/:estimateCostReviewId')
		.put(users.requiresLogin, projectStatusUpdates.hasEditAuthorization, projectStatusUpdates.objectIsEditable, projectStatusUpdates.updateEstimateCost);

	app.route('/project-status-updates/:projectStatusUpdateId/estimate-completion-reviews/:estimateCompletionReviewId')
		.put(users.requiresLogin, projectStatusUpdates.hasEditAuthorization, projectStatusUpdates.objectIsEditable, projectStatusUpdates.updateEstimateCompletion);


	// Finish by binding the Project status update middleware
	app.param('projectStatusUpdateId', projectStatusUpdates.projectStatusUpdateByID);
};
