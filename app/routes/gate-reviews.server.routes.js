'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gateReviews = require('../../app/controllers/gate-reviews.server.controller');

	// Gate reviews Routes
	app.route('/gate-reviews')
		.get(users.requiresLogin, gateReviews.list)
		.post(users.requiresLogin, gateReviews.hasAuthorization, gateReviews.create);

	app.route('/gate-reviews/:gateReviewId')
		.get(users.requiresLogin, gateReviews.read)
		.put(users.requiresLogin, gateReviews.hasAuthorization, gateReviews.update)
		.delete(users.requiresLogin, gateReviews.hasAuthorization, gateReviews.delete);

	app.route('/gate-reviews/:gateReviewId/header')
		.put(users.requiresLogin, gateReviews.hasAuthorization, gateReviews.updateHeader);

	app.route('/gate-reviews/:gateReviewId/gate-status-assignments/:gateStatusAssignmentId')
		.put(users.requiresLogin, gateReviews.hasAuthorization, gateReviews.updateStatus);

    app.route('/gate-reviews/:gateReviewId/baseline-duration-reviews/:baselineDurationReviewId/baseline-durations/:baselineDurationId')
        .put(users.requiresLogin, gateReviews.hasAuthorization, gateReviews.updateBaselineDuration);


	// Finish by binding the Gate review middleware
	app.param('gateReviewId', gateReviews.gateReviewByID);
};
