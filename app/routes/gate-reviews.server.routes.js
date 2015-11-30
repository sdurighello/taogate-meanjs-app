'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gateReviews = require('../../app/controllers/gate-reviews.server.controller');

	// Gate reviews Routes
	app.route('/gate-reviews')
		.get(gateReviews.list)
		.post(users.requiresLogin, gateReviews.create);

	app.route('/gate-reviews/:gateReviewId')
		.get(gateReviews.read)
		.put(users.requiresLogin, gateReviews.hasAuthorization, gateReviews.update)
		.delete(users.requiresLogin, gateReviews.hasAuthorization, gateReviews.delete);

	// Finish by binding the Gate review middleware
	app.param('gateReviewId', gateReviews.gateReviewByID);
};
