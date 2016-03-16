'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gateReviews = require('../../app/controllers/gate-reviews.server.controller');

	// Gate reviews Routes
	app.route('/gate-reviews')
		.get(users.requiresLogin, gateReviews.list)
		.post(users.requiresLogin, gateReviews.hasCreateAuthorization, gateReviews.create);

	app.route('/gate-reviews/:gateReviewId')
		.get(users.requiresLogin, gateReviews.read)
		.put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.update)
		.delete(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.delete);

    // Reviews for a project
    app.route('/gate-reviews-reviewsForProject')
        .get(users.requiresLogin, gateReviews.reviewsForProject);

    // Approval

    app.route('/gate-reviews/:gateReviewId/submit')
        .put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.submit);

    app.route('/gate-reviews/:gateReviewId/approve')
        .put(users.requiresLogin, gateReviews.hasApproveAuthorization, gateReviews.approve);

    app.route('/gate-reviews/:gateReviewId/reject')
        .put(users.requiresLogin, gateReviews.hasApproveAuthorization, gateReviews.reject);

    app.route('/gate-reviews/:gateReviewId/draft')
        .put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.draft);

    // Header & Status

	app.route('/gate-reviews/:gateReviewId/header')
		.put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.updateHeader);

	app.route('/gate-reviews/:gateReviewId/status')
		.put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.updateStatus);

    app.route('/gate-reviews/:gateReviewId/budget')
        .put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.updateBudget);

    // Outcomes

    app.route('/gate-reviews/:gateReviewId/outcome-reviews/:outcomeReviewId')
        .put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.updateOutcome);

    // Baseline

    app.route('/gate-reviews/:gateReviewId/baseline-duration-reviews/:baselineDurationReviewId')
        .put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.updateBaselineDuration);

    app.route('/gate-reviews/:gateReviewId/baseline-cost-reviews/:baselineCostReviewId')
        .put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.updateBaselineCost);

    app.route('/gate-reviews/:gateReviewId/baseline-completion-reviews/:baselineCompletionReviewId')
        .put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.updateBaselineCompletion);

    // Estimate

    app.route('/gate-reviews/:gateReviewId/estimate-duration-reviews/:estimateDurationReviewId')
        .put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.updateEstimateDuration);

    app.route('/gate-reviews/:gateReviewId/estimate-cost-reviews/:estimateCostReviewId')
        .put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.updateEstimateCost);

    app.route('/gate-reviews/:gateReviewId/estimate-completion-reviews/:estimateCompletionReviewId')
        .put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.updateEstimateCompletion);

    // Actual

    app.route('/gate-reviews/:gateReviewId/actual-duration-reviews/:actualDurationReviewId')
        .put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.updateActualDuration);

    app.route('/gate-reviews/:gateReviewId/actual-cost-reviews/:actualCostReviewId')
        .put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.updateActualCost);

    app.route('/gate-reviews/:gateReviewId/actual-completion-reviews/:actualCompletionReviewId')
        .put(users.requiresLogin, gateReviews.hasEditAuthorization, gateReviews.updateActualCompletion);


    // Finish by binding the Gate review middleware
	app.param('gateReviewId', gateReviews.gateReviewByID);
};
