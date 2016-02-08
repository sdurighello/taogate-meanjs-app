'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioReviews = require('../../app/controllers/portfolio-reviews.server.controller');

	// Portfolio reviews Routes
	app.route('/portfolio-reviews')
		.get(portfolioReviews.list)
		.post(users.requiresLogin, portfolioReviews.hasAuthorization, users.requiresLogin, portfolioReviews.create);

	app.route('/portfolio-reviews/:portfolioReviewId')
		.get(users.requiresLogin, portfolioReviews.read)
		.put(users.requiresLogin, portfolioReviews.hasAuthorization, portfolioReviews.update)
		.delete(users.requiresLogin, portfolioReviews.hasAuthorization, portfolioReviews.delete);

	// Finish by binding the Portfolio review middleware
	app.param('portfolioReviewId', portfolioReviews.portfolioReviewByID);
};
