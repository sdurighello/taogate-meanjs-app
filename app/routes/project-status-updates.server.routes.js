'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectStatusUpdates = require('../../app/controllers/project-status-updates.server.controller');

	// Project status updates Routes
	app.route('/project-status-updates')
		.get(users.requiresLogin, projectStatusUpdates.list)
		.post(users.requiresLogin, projectStatusUpdates.hasAuthorization, projectStatusUpdates.create);

	app.route('/project-status-updates/:projectStatusUpdateId')
		.get(users.requiresLogin, projectStatusUpdates.read)
		.put(users.requiresLogin, projectStatusUpdates.hasAuthorization, projectStatusUpdates.update)
		.delete(users.requiresLogin, projectStatusUpdates.hasAuthorization, projectStatusUpdates.delete);

	// Apply update

	app.route('/project-status-updates/:projectStatusUpdateId/applyUpdate')
		.put(users.requiresLogin, projectStatusUpdates.hasAuthorization, projectStatusUpdates.applyUpdate);

	// Header & Status

	app.route('/project-status-updates/:projectStatusUpdateId/header')
		.put(users.requiresLogin, projectStatusUpdates.hasAuthorization, projectStatusUpdates.updateHeader);

	app.route('/project-status-updates/:projectStatusUpdateId/gateStatus')
		.put(users.requiresLogin, projectStatusUpdates.hasAuthorization, projectStatusUpdates.updateGateStatus);

	// Outcomes

	app.route('/project-status-updates/:projectStatusUpdateId/outcome-status-updates/:outcomeStatusUpdateId')
		.put(users.requiresLogin, projectStatusUpdates.hasAuthorization, projectStatusUpdates.updateOutcome);

    // Areas

    app.route('/project-status-updates/:projectStatusUpdateId/status-area-updates/:statusAreaUpdateId')
        .put(users.requiresLogin, projectStatusUpdates.hasAuthorization, projectStatusUpdates.updateStatusArea);


	// Estimate

	app.route('/project-status-updates/:projectStatusUpdateId/estimate-duration-reviews/:estimateDurationReviewId')
		.put(users.requiresLogin, projectStatusUpdates.hasAuthorization, projectStatusUpdates.updateEstimateDuration);

	app.route('/project-status-updates/:projectStatusUpdateId/estimate-cost-reviews/:estimateCostReviewId')
		.put(users.requiresLogin, projectStatusUpdates.hasAuthorization, projectStatusUpdates.updateEstimateCost);

	app.route('/project-status-updates/:projectStatusUpdateId/estimate-completion-reviews/:estimateCompletionReviewId')
		.put(users.requiresLogin, projectStatusUpdates.hasAuthorization, projectStatusUpdates.updateEstimateCompletion);


	// Finish by binding the Project status update middleware
	app.param('projectStatusUpdateId', projectStatusUpdates.projectStatusUpdateByID);
};
