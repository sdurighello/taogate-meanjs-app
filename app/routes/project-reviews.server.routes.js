'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectReviews = require('../../app/controllers/project-reviews.server.controller');

	// Project reviews Routes
	app.route('/project-reviews')
		.get(users.requiresLogin, projectReviews.list)
		.post(users.requiresLogin, projectReviews.hasAuthorization, projectReviews.create);

	app.route('/project-reviews/:projectReviewId')
		.get(users.requiresLogin, projectReviews.read)
		.put(users.requiresLogin, projectReviews.hasAuthorization, projectReviews.update)
		.delete(users.requiresLogin, projectReviews.hasAuthorization, projectReviews.delete);


	// Approval

	app.route('/project-reviews/:projectReviewId/submit')
		.put(users.requiresLogin, projectReviews.hasAuthorization, projectReviews.submit);

	app.route('/project-reviews/:projectReviewId/complete')
		.put(users.requiresLogin, projectReviews.hasAuthorization, projectReviews.complete);

	app.route('/project-reviews/:projectReviewId/draft')
		.put(users.requiresLogin, projectReviews.hasAuthorization, projectReviews.draft);

	// Header

	app.route('/project-reviews/:projectReviewId/header')
		.put(users.requiresLogin, projectReviews.hasAuthorization, projectReviews.updateHeader);

    // Update people review

    app.route('/project-reviews/:projectReviewId/groups/:groupId/items/:itemId/peopleReviews/:peopleReviewId/update')
        .put(users.requiresLogin, projectReviews.hasAuthorization, projectReviews.updatePeopleReview);

    // Submit people review

    app.route('/project-reviews/:projectReviewId/groups/:groupId/items/:itemId/peopleReviews/:peopleReviewId/submit')
        .put(users.requiresLogin, projectReviews.hasAuthorization, projectReviews.submitPeopleReview);

	// Finish by binding the Project review middleware
	app.param('projectReviewId', projectReviews.projectReviewByID);
};
