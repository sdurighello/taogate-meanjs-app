'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioReviews = require('../../app/controllers/portfolio-reviews.server.controller');

	// Portfolio reviews Routes
	app.route('/portfolio-reviews')
		.get(portfolioReviews.list)
		.post(users.requiresLogin, portfolioReviews.hasCreateAuthorization, users.requiresLogin, portfolioReviews.create);

	app.route('/portfolio-reviews/:portfolioReviewId')
		.get(users.requiresLogin, portfolioReviews.read)
		.put(users.requiresLogin, portfolioReviews.hasManagementAuthorization, portfolioReviews.update)
		.delete(users.requiresLogin, portfolioReviews.hasManagementAuthorization, portfolioReviews.delete);

	// Approval

	app.route('/portfolio-reviews/:portfolioReviewId/submit')
		.put(users.requiresLogin, portfolioReviews.hasManagementAuthorization, portfolioReviews.submit);

	app.route('/portfolio-reviews/:portfolioReviewId/complete')
		.put(users.requiresLogin, portfolioReviews.hasManagementAuthorization, portfolioReviews.complete);

	app.route('/portfolio-reviews/:portfolioReviewId/draft')
		.put(users.requiresLogin, portfolioReviews.hasManagementAuthorization, portfolioReviews.draft);

	// Header

	app.route('/portfolio-reviews/:portfolioReviewId/header')
		.put(users.requiresLogin, portfolioReviews.hasManagementAuthorization, portfolioReviews.updateHeader);

	// Update people review

	app.route('/portfolio-reviews/:portfolioReviewId/groups/:groupId/items/:itemId/peopleReviews/:peopleReviewId/update')
		.put(users.requiresLogin, portfolioReviews.hasReviewAuthorization, portfolioReviews.updatePeopleReview);

	// Submit people review

	app.route('/portfolio-reviews/:portfolioReviewId/groups/:groupId/items/:itemId/peopleReviews/:peopleReviewId/submit')
		.put(users.requiresLogin, portfolioReviews.hasReviewAuthorization, portfolioReviews.submitPeopleReview);


	// Finish by binding the Portfolio review middleware
	app.param('portfolioReviewId', portfolioReviews.portfolioReviewByID);
};
