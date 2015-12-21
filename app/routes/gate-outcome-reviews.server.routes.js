'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gateOutcomeReviews = require('../../app/controllers/gate-outcome-reviews.server.controller');

	// Gate outcome reviews Routes
	app.route('/gate-outcome-reviews')
		.get(users.requiresLogin, gateOutcomeReviews.list)
		.post(users.requiresLogin, gateOutcomeReviews.hasAuthorization, gateOutcomeReviews.create);

	app.route('/gate-outcome-reviews/:gateOutcomeReviewId')
		.get(users.requiresLogin, gateOutcomeReviews.read)
		.put(users.requiresLogin, gateOutcomeReviews.hasAuthorization, gateOutcomeReviews.update)
		.delete(users.requiresLogin, gateOutcomeReviews.hasAuthorization, gateOutcomeReviews.delete);

	// Finish by binding the Gate outcome review middleware
	app.param('gateOutcomeReviewId', gateOutcomeReviews.gateOutcomeReviewByID);
};
