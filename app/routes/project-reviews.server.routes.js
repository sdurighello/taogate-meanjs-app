'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectReviews = require('../../app/controllers/project-reviews.server.controller');

	// Project reviews Routes
	app.route('/project-reviews')
		.get(users.requiresLogin, projectReviews.list)
		.post(users.requiresLogin, projectReviews.hasCreateAuthorization, projectReviews.create);

	app.route('/project-reviews/:projectReviewId')
		.get(users.requiresLogin, projectReviews.read)
		.put(users.requiresLogin, projectReviews.hasManagementAuthorization, projectReviews.update)
		.delete(users.requiresLogin, projectReviews.hasManagementAuthorization, projectReviews.delete);


	// Approval

	app.route('/project-reviews/:projectReviewId/submit')
		.put(users.requiresLogin, projectReviews.hasManagementAuthorization, projectReviews.submit);

	app.route('/project-reviews/:projectReviewId/complete')
		.put(users.requiresLogin, projectReviews.hasManagementAuthorization, projectReviews.complete);

	app.route('/project-reviews/:projectReviewId/draft')
		.put(users.requiresLogin, projectReviews.hasManagementAuthorization, projectReviews.draft);

	// Header

	app.route('/project-reviews/:projectReviewId/header')
		.put(users.requiresLogin, projectReviews.hasManagementAuthorization, projectReviews.updateHeader);

    // Update people review

    app.route('/project-reviews/:projectReviewId/groups/:groupId/items/:itemId/peopleReviews/:peopleReviewId/update')
        .put(users.requiresLogin, projectReviews.hasReviewAuthorization, projectReviews.updatePeopleReview);

    // Submit people review

    app.route('/project-reviews/:projectReviewId/groups/:groupId/items/:itemId/peopleReviews/:peopleReviewId/submit')
        .put(users.requiresLogin, projectReviews.hasReviewAuthorization, projectReviews.submitPeopleReview);

	// Finish by binding the Project review middleware
	app.param('projectReviewId', projectReviews.projectReviewByID);
};
